'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { USE_CASES } from './usecases';
import type { UseCase, NodeDef, EdgeDef, StepDef, LayerDef } from './usecases';
import Canvas, { NodeTooltip, NODE_STYLES_DARK, NODE_STYLES_LIGHT, useIsDark } from './canvas';
import type { PositionedNode } from './canvas';
import styles from './lab.module.scss';
import { useLang } from '@/i18n/context';

// ── Types ─────────────────────────────────────────────────────────────

type LayerKey = 'security' | 'reliability' | 'evaluation';

interface LayerState {
  security: boolean;
  reliability: boolean;
  evaluation: boolean;
}

interface MergedFlow {
  nodes: NodeDef[];
  edges: EdgeDef[];
  steps: StepDef[];
}

// ── Merge base + active layers ─────────────────────────────────────────

function mergeFlow(useCase: UseCase, layers: LayerState): MergedFlow {
  const nodeMap = new Map<string, NodeDef>();
  const edgeMap = new Map<string, EdgeDef>();
  const steps: StepDef[] = [];

  // Start with base
  useCase.base.nodes.forEach(n => nodeMap.set(n.id, n));
  useCase.base.edges.forEach(e => edgeMap.set(`${e.from}→${e.to}`, e));
  steps.push(...useCase.base.steps);

  // Remove edges from removeEdges in active layers first
  (['security', 'reliability', 'evaluation'] as LayerKey[]).forEach(key => {
    if (!layers[key]) return;
    const layer: LayerDef = useCase.layers[key];
    layer.removeEdges?.forEach(e => {
      edgeMap.delete(`${e.from}→${e.to}`);
    });
  });

  // Add layer nodes + edges + steps
  (['security', 'reliability', 'evaluation'] as LayerKey[]).forEach(key => {
    if (!layers[key]) return;
    const layer: LayerDef = useCase.layers[key];
    layer.nodes.forEach(n => nodeMap.set(n.id, n));
    layer.edges.forEach(e => edgeMap.set(`${e.from}→${e.to}`, e));
    steps.push(...layer.steps);
  });

  return {
    nodes: Array.from(nodeMap.values()),
    edges: Array.from(edgeMap.values()),
    steps,
  };
}


// ── Page ──────────────────────────────────────────────────────────────

export default function AgentPatternsPage() {
  const isDark = useIsDark();
  const NODE_STYLES = isDark ? NODE_STYLES_DARK : NODE_STYLES_LIGHT;
  const { t } = useLang();
  const LAYER_LABELS = t.lab.layerNames;
  const TYPE_LABELS = t.lab.nodeTypes;
  const [selectedCaseId, setSelectedCaseId] = useState(USE_CASES[0].id);
  const [layers, setLayers] = useState<LayerState>({
    security: false,
    reliability: false,
    evaluation: false,
  });
  const [stepIdx, setStepIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [clickedNode, setClickedNode] = useState<PositionedNode | null>(null);
  const [tooltip, setTooltip] = useState<{ node: PositionedNode; px: number; py: number } | null>(null);
  const playTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const canvasWrapRef = useRef<HTMLDivElement>(null);

  const selectedCase = useMemo(
    () => USE_CASES.find(c => c.id === selectedCaseId) ?? USE_CASES[0],
    [selectedCaseId]
  );

  const flow = useMemo(() => mergeFlow(selectedCase, layers), [selectedCase, layers]);

  // Reset step when case or layers change
  useEffect(() => {
    setStepIdx(0);
    setPlaying(false);
    setClickedNode(null);
  }, [selectedCaseId, layers]);

  // Lock body scroll on this page
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  // Auto-play step advance
  useEffect(() => {
    if (!playing) {
      if (playTimer.current) clearTimeout(playTimer.current);
      return;
    }
    playTimer.current = setTimeout(() => {
      setStepIdx(prev => {
        if (prev < flow.steps.length - 1) return prev + 1;
        setPlaying(false);
        return prev;
      });
    }, 3200);
    return () => { if (playTimer.current) clearTimeout(playTimer.current); };
  }, [playing, stepIdx, flow.steps.length]);

  // Which node is focused
  const currentStep = flow.steps[stepIdx];
  const focusedNodeId = clickedNode ? clickedNode.id : (currentStep?.focus ?? null);

  // Which edges to animate (edges connected to focused node)
  const animatingEdges = useMemo<Set<string>>(() => {
    if (!focusedNodeId) return new Set();
    const set = new Set<string>();
    flow.edges.forEach(e => {
      if (e.from === focusedNodeId || e.to === focusedNodeId) {
        set.add(`${e.from}→${e.to}`);
      }
    });
    return set;
  }, [focusedNodeId, flow.edges]);

  const handleNodeClick = useCallback((node: PositionedNode) => {
    // Find step that focuses this node
    const stepForNode = flow.steps.findIndex(s => s.focus === node.id);
    if (stepForNode >= 0) {
      setStepIdx(stepForNode);
      setClickedNode(null);
    } else {
      setClickedNode(prev => prev?.id === node.id ? null : node);
    }
  }, [flow.steps]);

  const handleCaseSelect = (id: string) => {
    setSelectedCaseId(id);
    setLayers({ security: false, reliability: false, evaluation: false });
  };

  const toggleLayer = (key: LayerKey) => {
    setLayers(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const stepBack = () => {
    setClickedNode(null);
    setStepIdx(prev => Math.max(0, prev - 1));
  };

  const stepForward = () => {
    setClickedNode(null);
    setStepIdx(prev => Math.min(flow.steps.length - 1, prev + 1));
  };

  const togglePlay = () => {
    setClickedNode(null);
    setPlaying(p => {
      if (!p && stepIdx >= flow.steps.length - 1) {
        setStepIdx(0);
      }
      return !p;
    });
  };

  // Unique node types in current flow for legend
  const legendTypes = useMemo(() => {
    const seen = new Set<string>();
    return flow.nodes.filter(n => {
      if (seen.has(n.type)) return false;
      seen.add(n.type);
      return true;
    }).map(n => n.type);
  }, [flow.nodes]);

  return (
    <div className={styles.lab}>
      {/* Top bar */}
      <div className={styles.topBar}>
        <Link href="/" className={styles.backLink}>{t.lab.backLink}</Link>
        <span className={styles.topSep}>/</span>
        <span className={styles.topTitle}>{t.lab.title}</span>
      </div>

      <div className={styles.main}>
        {/* Left sidebar — use case picker */}
        <aside className={styles.sidebar}>
          <div className={styles.sidebarHeader}>{t.lab.useCases}</div>
          <div className={styles.caseList}>
            {USE_CASES.map(uc => (
              <div
                key={uc.id}
                className={`${styles.caseItem}${uc.id === selectedCaseId ? ' ' + styles.caseItemActive : ''}`}
                onClick={() => handleCaseSelect(uc.id)}
                role="button"
                tabIndex={0}
                onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') handleCaseSelect(uc.id); }}
              >
                <div className={styles.caseTitle}>{uc.title}</div>
                <div className={styles.caseIndustry}>{uc.industry}</div>
                <div className={styles.casePattern}>{uc.basePattern}</div>
              </div>
            ))}
          </div>
        </aside>

        {/* Center — canvas + step rail */}
        <div className={styles.center}>
          <div className={styles.canvasWrap} ref={canvasWrapRef}>
            <Canvas
              nodes={flow.nodes}
              edges={flow.edges}
              focusedNodeId={focusedNodeId}
              animatingEdges={animatingEdges}
              onNodeClick={handleNodeClick}
            />
            {tooltip && (
              <NodeTooltip node={tooltip.node} px={tooltip.px} py={tooltip.py} />
            )}
            {/* Clicked node detail */}
            {clickedNode && !flow.steps.some(s => s.focus === clickedNode.id) && (
              <div
                className={styles.nodeTooltip}
                style={{ left: 20, bottom: 20, position: 'absolute' }}
              >
                <div
                  className={styles.tooltipTech}
                  style={{ color: NODE_STYLES[clickedNode.type].accent }}
                >
                  {clickedNode.tech}
                </div>
                <div className={styles.tooltipLabel}>{clickedNode.label}</div>
                <div className={styles.tooltipDetails}>{clickedNode.details}</div>
              </div>
            )}
          </div>

          {/* Step rail */}
          <div className={styles.stepRail}>
            <div className={styles.stepRailInner}>
              <div className={styles.stepNarration} key={`${selectedCaseId}-${stepIdx}`}>
                {currentStep ? (
                  <>
                    <div className={styles.stepTitle}>{currentStep.title}</div>
                    <div className={styles.stepText}>{currentStep.text}</div>
                  </>
                ) : (
                  <div className={styles.stepText} style={{ color: '#636059' }}>
                    {t.lab.emptyStep}
                  </div>
                )}
              </div>
            </div>

            <div className={styles.stepControls}>
              <button
                className={styles.stepBtn}
                onClick={stepBack}
                disabled={stepIdx <= 0}
                aria-label={t.lab.prevStep}
              >
                ‹
              </button>
              <button
                className={`${styles.stepBtn} ${styles.stepBtnPlay}`}
                onClick={togglePlay}
                aria-label={playing ? t.lab.pause : t.lab.play}
              >
                {playing ? '⏸' : '▶'}
              </button>
              <button
                className={styles.stepBtn}
                onClick={stepForward}
                disabled={stepIdx >= flow.steps.length - 1}
                aria-label={t.lab.nextStep}
              >
                ›
              </button>
              <span className={styles.stepCounter}>
                {stepIdx + 1} / {flow.steps.length}
              </span>
              <div className={styles.stepDots}>
                {flow.steps.map((_, i) => (
                  <div
                    key={i}
                    className={`${styles.stepDot}${i === stepIdx ? ' ' + styles.stepDotActive : ''}`}
                    onClick={() => { setClickedNode(null); setStepIdx(i); }}
                    role="button"
                    tabIndex={0}
                    aria-label={`Step ${i + 1}`}
                    onKeyDown={e => { if (e.key === 'Enter') { setClickedNode(null); setStepIdx(i); } }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right sidebar */}
        <aside className={styles.rightSidebar}>
          {/* Sample I/O */}
          <div className={styles.rightSection}>
            <div className={styles.rightSectionHeader}>{t.lab.sampleIO}</div>
            <div className={styles.samplePanel}>
              <div className={styles.sampleRow}>
                <div className={styles.sampleLabel}>{t.lab.sampleIn}</div>
                <div className={styles.sampleText}>{selectedCase.sampleInput}</div>
              </div>
              <div className={styles.sampleRow}>
                <div className={styles.sampleLabel}>{t.lab.sampleOut}</div>
                <div className={styles.sampleText}>{selectedCase.sampleOutput}</div>
              </div>
            </div>
          </div>

          {/* Layer toggles */}
          <div className={styles.rightSection}>
            <div className={styles.rightSectionHeader}>{t.lab.layers}</div>
            <div className={styles.layerCards}>
              {(['security', 'reliability', 'evaluation'] as LayerKey[]).map(key => {
                const layer = selectedCase.layers[key];
                const on = layers[key];
                return (
                  <div
                    key={key}
                    className={`${styles.layerCard}${on ? ' ' + styles.layerCardOn : ''}`}
                  >
                    <div
                      className={styles.layerCardTop}
                      onClick={() => toggleLayer(key)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') toggleLayer(key); }}
                    >
                      <div className={`${styles.layerToggle}${on ? ' ' + styles.layerToggleOn : ''}`} />
                      <span className={styles.layerName}>{LAYER_LABELS[key]}</span>
                    </div>
                    {on && (
                      <div className={styles.layerCardDesc}>
                        {layer.adds}
                        {layer.becomesPattern && (
                          <div>
                            <span className={styles.becomesPattern}>→ {layer.becomesPattern}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Legend */}
          <div className={styles.rightSection} style={{ borderBottom: 'none', flex: 1 }}>
            <div className={styles.rightSectionHeader}>{t.lab.legend}</div>
            <div className={styles.legendWrap}>
              {legendTypes.map(type => {
                const s = NODE_STYLES[type as keyof typeof NODE_STYLES];
                if (!s) return null;
                return (
                  <div key={type} className={styles.legendItem}>
                    <div
                      className={styles.legendDot}
                      style={{
                        background: s.bg,
                        border: `1px solid ${s.border}`,
                        color: s.accent,
                      }}
                    >
                      {s.icon}
                    </div>
                    <span className={styles.legendLabel}>{TYPE_LABELS[type] ?? type}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
