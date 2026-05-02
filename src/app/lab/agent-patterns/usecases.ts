// Agent Patterns — Use Case data
// Ported from /tmp/usecases_full.jsx

export type NodeType =
  | 'input'
  | 'output'
  | 'llm'
  | 'agent'
  | 'orchestrator'
  | 'router'
  | 'aggregator'
  | 'tools'
  | 'env'
  | 'gate'
  | 'retry'
  | 'guard'
  | 'human'
  | 'eval';

export interface NodeDef {
  id: string;
  type: NodeType;
  label: string;
  tech: string;
  sub?: string;
  details: string;
  x: number;
  y: number;
}

export interface EdgeDef {
  from: string;
  to: string;
  dashed?: boolean;
  bidir?: boolean;
  branch?: boolean;
  label?: string;
  curve?: string;
}

export interface StepDef {
  focus: string;
  title: string;
  text: string;
}

export interface FlowDef {
  nodes: NodeDef[];
  edges: EdgeDef[];
  steps: StepDef[];
}

export interface StackOption {
  name: string;
  best?: boolean;
  why: string;
}

export interface LayerDef {
  adds: string;
  becomesPattern?: string;
  nodes: NodeDef[];
  edges: EdgeDef[];
  removeEdges?: EdgeDef[];
  steps: StepDef[];
}

export interface UseCase {
  id: string;
  title: string;
  industry: string;
  blurb: string;
  basePattern: string;
  patternWhy: string;
  sampleInput: string;
  sampleOutput: string;
  stacks: StackOption[];
  base: FlowDef;
  layers: {
    security: LayerDef;
    reliability: LayerDef;
    evaluation: LayerDef;
  };
}

export const USE_CASES: UseCase[] = [
  {
    id: 'support_db',
    title: 'Customer Support',
    industry: 'SaaS / E-commerce',
    blurb: 'Resolve refund, order status, and account questions using live customer data.',
    basePattern: 'Augmented LLM',
    patternWhy:
      'One smart model with access to tools (database, refund API, knowledge base) handles the whole conversation.',
    sampleInput: "Hi, I'd like a refund for order #4521 — it arrived broken yesterday.",
    sampleOutput: 'Refund of $129.00 issued to •••4242. Replacement ships Mon. Ticket #T-9034.',
    stacks: [
      {
        name: 'LLM API direct',
        best: true,
        why: 'Simplest. Tool-use API + your own ticketing logic. No framework lock-in.',
      },
      {
        name: 'LangChain / LlamaIndex',
        why: 'Great if you need RAG over a sprawling knowledge base out of the box.',
      },
      {
        name: 'n8n / Make',
        why: 'Useful for low-code teams wiring CRMs and ticket systems together — but tool-use is awkward.',
      },
      {
        name: 'Vercel AI SDK',
        why: 'Streaming UI for chat surfaces. Pairs well with a hosted vector DB.',
      },
    ],
    base: {
      nodes: [
        {
          id: 'in',
          type: 'input',
          label: 'Customer message',
          tech: 'User input',
          details:
            'Free-text message arriving from chat, email, or voice transcript.',
          x: 60,
          y: 200,
        },
        {
          id: 'tools',
          type: 'tools',
          label: 'Toolbox',
          tech: 'Tool definitions',
          sub: 'orders · refunds · knowledge base',
          details:
            'Functions the LLM can call: orders.get(id), refunds.issue(amount, reason), kb.search(query). Each has a clear schema and description.',
          x: 360,
          y: 60,
        },
        {
          id: 'llm',
          type: 'llm',
          label: 'AI agent',
          tech: 'Augmented LLM',
          sub: 'reads, decides, acts',
          details:
            'Single LLM call equipped with tools + memory. It reads the message, calls the tools it needs, and writes a reply.',
          x: 360,
          y: 200,
        },
        {
          id: 'out',
          type: 'output',
          label: 'Reply to customer',
          tech: 'Resolution',
          details:
            'Final message posted back to the customer plus any side-effects (refund issued, ticket logged).',
          x: 720,
          y: 200,
        },
      ],
      edges: [
        { from: 'in', to: 'llm' },
        { from: 'tools', to: 'llm', dashed: true, bidir: true },
        { from: 'llm', to: 'out' },
      ],
      steps: [
        {
          focus: 'in',
          title: '1. The customer writes in',
          text: "Lina is angry. Her order arrived broken yesterday and she wants her money back. She types it however she likes — no form fields, no menus. The message lands as a free-text blob: \"Hi, I'd like a refund for order #4521 — it arrived broken yesterday.\" The system has to figure out the rest.",
        },
        {
          focus: 'llm',
          title: '2. The AI reads and plans',
          text: "The model reads Lina's message and recognizes two intents: a status check (what was that order?) and an action (issue a refund). Before it can do either, it needs facts — the order total, the payment method, whether the item is even refundable. It decides on a plan: look up the order first, then issue the refund.",
        },
        {
          focus: 'tools',
          title: '3. It calls the tools',
          text: "This is where the augmented LLM earns its name. It has a toolbox: orders.get(id), refunds.issue(amount, reason), kb.search(query) — each with a clear schema. It calls orders.get(4521) and gets back $129 charged to •••4242. It then calls refunds.issue(129, 'damaged'). Real systems change. The model didn't make anything up.",
        },
        {
          focus: 'out',
          title: '4. The reply is sent',
          text: 'With the refund posted and a replacement scheduled, the model writes Lina back in plain English: "Refund of $129.00 issued to •••4242. Replacement ships Mon. Ticket #T-9034." One smart model, three tools, the whole conversation handled.',
        },
      ],
    },
    layers: {
      security: {
        adds: 'Strip personal info before reasoning, and lock tool permissions per agent.',
        nodes: [
          {
            id: 'guard',
            type: 'guard',
            label: 'Safety guard',
            tech: 'Input guardrail',
            sub: 'PII · prompt injection',
            details:
              'Removes credit-card numbers, emails, and detects prompt-injection attempts before the LLM sees anything.',
            x: 200,
            y: 200,
          },
        ],
        edges: [
          { from: 'in', to: 'guard' },
          { from: 'guard', to: 'llm' },
        ],
        removeEdges: [{ from: 'in', to: 'llm' }],
        steps: [
          {
            focus: 'guard',
            title: 'Safety check',
            text: "Before the AI sees a single character, the safety guard sweeps the message. Credit card numbers, emails, phone numbers — masked. Known prompt-injection patterns (\"ignore previous instructions...\") — blocked. The model only ever reads sanitized text. If a customer pastes their full card number by mistake, it never reaches a model log.",
          },
        ],
      },
      reliability: {
        adds: 'Retry on tool failure, hand off to a human for refunds above $500.',
        nodes: [
          {
            id: 'approve',
            type: 'human',
            label: 'Human approval',
            tech: 'Human-in-the-loop',
            sub: 'if amount > $500',
            details:
              "Refunds above the threshold are queued for an agent's one-click approval rather than issued automatically.",
            x: 540,
            y: 60,
          },
        ],
        edges: [
          { from: 'llm', to: 'approve', dashed: true, label: 'high-value' },
          { from: 'approve', to: 'out', dashed: true },
        ],
        steps: [
          {
            focus: 'approve',
            title: 'Human approval gate',
            text: "$10 refund? Auto-approve. $1,200 refund? That's a different conversation. The system holds high-value refunds in a one-click approval queue. A support lead glances, clicks, done — but a confused model can't accidentally issue a four-figure refund on its own.",
          },
        ],
      },
      evaluation: {
        adds: 'After each chat, a critic grades it. Low scores route to a senior agent and feed back into prompts.',
        becomesPattern: 'Evaluator-optimizer',
        nodes: [
          {
            id: 'eval',
            type: 'eval',
            label: 'Quality critic',
            tech: 'Evaluator LLM',
            sub: 'tone · accuracy · completeness',
            details:
              'Second LLM scores the reply against a rubric. Below threshold, the original LLM revises before sending.',
            x: 720,
            y: 60,
          },
        ],
        edges: [
          { from: 'llm', to: 'eval' },
          { from: 'eval', to: 'llm', dashed: true, label: 'revise', curve: 'loop' },
        ],
        steps: [
          {
            focus: 'eval',
            title: 'Critic grades the reply',
            text: "Before the message goes out, a second model reads it like a senior support manager — checking tone, accuracy, and whether it actually resolves the question. Score below threshold? It hands the original model the rubric and the failures, and asks for a rewrite. The customer never sees the bad draft.",
          },
        ],
      },
    },
  },

  {
    id: 'claims_triage',
    title: 'Insurance Claims Triage',
    industry: 'Insurance',
    blurb: 'Sort incoming claims and send each to the right adjuster team.',
    basePattern: 'Routing',
    patternWhy:
      'A small fast model classifies the claim, then forwards it to a specialist queue with its own prompt and tools.',
    sampleInput: 'FNOL: rear-end collision, 2 vehicles, no injuries reported, photos attached.',
    sampleOutput: 'Routed → Auto / Low-complexity queue. Severity: minor. Adjuster: T. Nguyen.',
    stacks: [
      {
        name: 'LLM API + light dispatcher',
        best: true,
        why: 'Routing is just classify + switch. A handful of code lines beats a framework here.',
      },
      {
        name: 'AWS Step Functions',
        why: 'Production-grade if your downstream queues already live in AWS.',
      },
      {
        name: 'Temporal',
        why: 'Worth it once you need durable state and retries across long-running adjuster workflows.',
      },
      {
        name: 'n8n',
        why: 'Reasonable for prototyping the routing rules visually before hardening.',
      },
    ],
    base: {
      nodes: [
        {
          id: 'in',
          type: 'input',
          label: 'New claim',
          tech: 'FNOL submission',
          details: 'First Notice of Loss — text description, photos, optional dashcam video.',
          x: 60,
          y: 220,
        },
        {
          id: 'router',
          type: 'router',
          label: 'Sorter',
          tech: 'Classifier LLM',
          sub: 'fast & cheap',
          details:
            'A small fast model picks a category and confidence. Cheap because it\'s called on every single claim.',
          x: 320,
          y: 220,
        },
        {
          id: 'auto',
          type: 'llm',
          label: 'Auto specialist',
          tech: 'Specialist LLM',
          sub: 'vehicles',
          details: 'Specialist prompt + tools for vehicle damage estimation.',
          x: 600,
          y: 80,
        },
        {
          id: 'property',
          type: 'llm',
          label: 'Property specialist',
          tech: 'Specialist LLM',
          sub: 'homes & contents',
          details: 'Specialist prompt for property and household claims.',
          x: 600,
          y: 220,
        },
        {
          id: 'complex',
          type: 'llm',
          label: 'Complex / fraud',
          tech: 'Heavyweight LLM',
          sub: 'high stakes',
          details:
            'Bigger model, fraud-detection tools, longer context for messy multi-party cases.',
          x: 600,
          y: 360,
        },
        {
          id: 'out',
          type: 'output',
          label: 'Claim queued',
          tech: 'Routed claim',
          details:
            'Claim lands in the right work queue with all metadata and recommended priority.',
          x: 880,
          y: 220,
        },
      ],
      edges: [
        { from: 'in', to: 'router' },
        { from: 'router', to: 'auto', branch: true },
        { from: 'router', to: 'property', branch: true },
        { from: 'router', to: 'complex', branch: true },
        { from: 'auto', to: 'out' },
        { from: 'property', to: 'out' },
        { from: 'complex', to: 'out' },
      ],
      steps: [
        {
          focus: 'in',
          title: '1. A claim arrives',
          text: "At 8:47am, a First Notice of Loss lands in the queue: \"Rear-end collision, two vehicles, no injuries reported, photos attached.\" Today the queue will see thousands of these — some are simple fender-benders, some are total losses with three injured parties, some look suspiciously like fraud. They all arrive in the same shape.",
        },
        {
          focus: 'router',
          title: '2. The sorter picks a lane',
          text: 'This is the routing pattern. A small, fast, cheap model reads the FNOL and picks one of three lanes: auto, property, or complex/fraud. It also returns a confidence score. It costs almost nothing because it only does this one thing — and it runs on every claim, all day long. No expensive model wasted on triage.',
        },
        {
          focus: 'auto',
          title: '3a. Auto specialist takes over',
          text: "For the rear-end collision, the auto specialist's prompt activates — tuned only for vehicle damage, with access to repair-cost databases and parts catalogs. It doesn't know how to value a flooded basement, and it doesn't need to. Specialization beats a generalist every time.",
        },
        {
          focus: 'property',
          title: '3b. Or property specialist',
          text: 'If the claim were instead a burst pipe, the property specialist would have lit up — different prompt, different tools (replacement-cost estimators, mold-remediation pricing). Each specialist gets to be excellent at one thing.',
        },
        {
          focus: 'complex',
          title: '3c. Or complex / fraud lane',
          text: "Multi-party injury claim with $80k in damage and inconsistent photos? That goes to the heavyweight lane: a bigger model, longer context, fraud-detection tools, and the kind of prompt you only want to pay for when stakes are high.",
        },
        {
          focus: 'out',
          title: '4. Queued for the right human',
          text: "The claim lands in the right adjuster's work queue with severity tagged, recommended priority set, and the routing reasoning attached. T. Nguyen sees it pre-classified — and is handling 40% more claims a day because she's no longer triaging.",
        },
      ],
    },
    layers: {
      security: {
        adds: 'Strip SSN and DOB before routing; sign every routing decision for audit.',
        nodes: [
          {
            id: 'guard',
            type: 'guard',
            label: 'PII redaction',
            tech: 'Input guardrail',
            sub: 'SSN · DOB · address',
            details: 'Personal identifiers are masked before any LLM reads the claim.',
            x: 180,
            y: 220,
          },
        ],
        edges: [
          { from: 'in', to: 'guard' },
          { from: 'guard', to: 'router' },
        ],
        removeEdges: [{ from: 'in', to: 'router' }],
        steps: [
          {
            focus: 'guard',
            title: 'PII stripped first',
            text: "Insurance claims are full of sensitive data — SSNs, dates of birth, full addresses. Before any model reads the FNOL, the redaction guard masks these fields. The router only sees what it needs to classify: the type of incident, the rough financial scale, the complexity. The audit trail proves no model ever touched a raw SSN.",
          },
        ],
      },
      reliability: {
        adds: "If the sorter isn't sure, hand off to a human triager.",
        nodes: [
          {
            id: 'human',
            type: 'human',
            label: 'Human triager',
            tech: 'Human-in-the-loop',
            sub: 'confidence < 70%',
            details: 'Low-confidence classifications skip auto-routing and go to a human.',
            x: 600,
            y: 480,
          },
        ],
        edges: [
          { from: 'router', to: 'human', dashed: true, label: 'unsure' },
          { from: 'human', to: 'out', dashed: true },
        ],
        steps: [
          {
            focus: 'human',
            title: 'Low confidence → human',
            text: "The sorter returned 'auto' but only at 58% confidence — something about this claim is ambiguous. Instead of guessing, the system hands it to a human triager. They make the call in 30 seconds. Auto-routing handles the easy 90%; humans get the 10% that actually need judgment.",
          },
        ],
      },
      evaluation: {
        adds: "Each week, compare the sorter's choice against the adjuster's final outcome and tune the prompt.",
        nodes: [
          {
            id: 'eval',
            type: 'eval',
            label: 'Routing audit',
            tech: 'Offline evaluator',
            sub: 'weekly · vs ground truth',
            details:
              'Batch eval comparing routing decisions against final outcomes; surfaces drift and bad classifications.',
            x: 320,
            y: 60,
          },
        ],
        edges: [
          { from: 'router', to: 'eval', dashed: true },
          { from: 'eval', to: 'router', dashed: true, label: 'tune', curve: 'loop' },
        ],
        steps: [
          {
            focus: 'eval',
            title: 'Weekly routing audit',
            text: "Every Monday, last week's routing decisions are compared to where the claims actually ended up after the adjuster worked them. The audit catches drift: maybe the sorter has been quietly mis-sending water-damage claims to 'auto' since a new policy launched. The deltas drive prompt updates.",
          },
        ],
      },
    },
  },

  {
    id: 'doc_automation',
    title: 'Contract Review',
    industry: 'Legal / Procurement',
    blurb: 'Read a vendor contract, pull key terms, summarize risks, draft a redline.',
    basePattern: 'Prompt chaining',
    patternWhy:
      'The task is too big for one prompt — split into clean steps, each easier to do well, with a check between them.',
    sampleInput: 'MSA_AcmeCorp_v3.pdf · 42 pages',
    sampleOutput: 'Summary · 7 flagged clauses · redline draft (Termination §11, Liability §14)',
    stacks: [
      {
        name: 'LLM API + plain Python',
        best: true,
        why: 'A linear chain of calls with a gate is just a function. Frameworks add overhead, not value.',
      },
      {
        name: 'LangChain LCEL',
        why: 'Nice if you already use it; the chain primitives map cleanly onto these steps.',
      },
      {
        name: 'DSPy',
        why: 'Best when you want to optimize prompts in the chain against eval data.',
      },
      {
        name: 'Prefect / Airflow',
        why: 'Use if document-review batches need scheduling, retries, and observability at scale.',
      },
    ],
    base: {
      nodes: [
        {
          id: 'in',
          type: 'input',
          label: 'Contract PDF',
          tech: 'Source document',
          details: 'Vendor MSA upload — could be 10 to 200 pages.',
          x: 60,
          y: 200,
        },
        {
          id: 'extract',
          type: 'llm',
          label: 'Step 1 — Extract',
          tech: 'Clause extractor',
          sub: 'find every clause',
          details: 'Walks the doc, returns structured list: {clause type, page, text}.',
          x: 280,
          y: 200,
        },
        {
          id: 'gate',
          type: 'gate',
          label: 'Check',
          tech: 'Programmatic gate',
          sub: 'all required found?',
          details: 'Plain code (not LLM): asserts the must-have clauses exist before continuing.',
          x: 500,
          y: 200,
        },
        {
          id: 'summarize',
          type: 'llm',
          label: 'Step 2 — Summarize',
          tech: 'Risk summarizer',
          sub: "what's risky?",
          details:
            'Reads the extracted clauses, ranks by business risk, writes plain-English summary.',
          x: 720,
          y: 200,
        },
        {
          id: 'redline',
          type: 'llm',
          label: 'Step 3 — Redline',
          tech: 'Redline drafter',
          sub: 'propose edits',
          details:
            "Suggests track-changes edits aligned to the company's playbook.",
          x: 940,
          y: 200,
        },
        {
          id: 'out',
          type: 'output',
          label: 'Review packet',
          tech: 'Final deliverable',
          details: 'PDF report + .docx redline ready for the lawyer to review.',
          x: 1160,
          y: 200,
        },
      ],
      edges: [
        { from: 'in', to: 'extract' },
        { from: 'extract', to: 'gate' },
        { from: 'gate', to: 'summarize' },
        { from: 'summarize', to: 'redline' },
        { from: 'redline', to: 'out' },
      ],
      steps: [
        {
          focus: 'in',
          title: '1. The contract drops in',
          text: "A vendor sends MSA_AcmeCorp_v3.pdf — 42 pages of dense legal prose. Asking one model to 'read this and tell me what's wrong' would produce mush: it would skim, miss clauses, and invent risks that aren't there. The contract is too big and too varied for a single prompt to do well.",
        },
        {
          focus: 'extract',
          title: '2. Step 1 — extract every clause',
          text: 'This is the chaining pattern. The first model has one job: walk the entire document and return a structured list — {clause type, page, text} — for every clause it finds. No analysis, no opinions, just structure. Doing one thing means doing it well.',
        },
        {
          focus: 'gate',
          title: '3. Programmatic sanity check',
          text: 'Now plain code (not a model) checks the output. Did we find a Termination clause? IP assignment? Liability cap? Data protection? If a must-have is missing, we stop or retry — because every downstream step assumes these exist. This is the gate that makes chaining reliable: each link verified before the next.',
        },
        {
          focus: 'summarize',
          title: '4. Step 2 — summarize the risks',
          text: 'With a clean list of clauses in hand, the second model reads them and ranks risks in plain English. The Termination clause requires 90 days notice (industry standard is 30). The Liability cap is set at fees paid in the last 3 months (we usually negotiate 12). It writes for a lawyer, not a robot.',
        },
        {
          focus: 'redline',
          title: '5. Step 3 — draft the redline',
          text: "The third model takes the risk summary and the company's playbook — our standard counter-positions — and proposes track-changes edits. §11: '90 days' → '30 days'. §14: cap at '12 months of fees paid'. Each edit linked to its clause and rationale.",
        },
        {
          focus: 'out',
          title: "6. The lawyer reviews, doesn't write",
          text: 'Final deliverable: a PDF report and a .docx redline ready for the partner. Three small focused steps, each verifiable, beat one giant prompt. The lawyer reviews — they don\'t draft from scratch. Hours saved per contract, every contract.',
        },
      ],
    },
    layers: {
      security: {
        adds: "Document never leaves the tenant. Outputs scrubbed of counterparty PII.",
        nodes: [
          {
            id: 'guard',
            type: 'guard',
            label: 'Tenant boundary',
            tech: 'Data residency policy',
            sub: 'no egress',
            details:
              "Documents stay in the customer's VPC. Model calls go through a private endpoint.",
            x: 60,
            y: 60,
          },
        ],
        edges: [{ from: 'guard', to: 'extract', dashed: true, label: 'policy' }],
        steps: [
          {
            focus: 'guard',
            title: 'Document never leaves',
            text: "Vendor contracts contain confidential business terms — pricing, partners, internal codenames. The data residency policy keeps the PDF inside the customer's VPC the entire time. Model calls go through a private endpoint with no logging. Outputs are scrubbed of counterparty PII before they're stored.",
          },
        ],
      },
      reliability: {
        adds: 'If the check fails, retry once with a stronger prompt.',
        nodes: [
          {
            id: 'retry',
            type: 'retry',
            label: 'Retry budget',
            tech: 'Retry controller',
            sub: 'max 2 attempts',
            details:
              'Gate failures loop back into extraction with a fortified prompt; capped to avoid runaway loops.',
            x: 380,
            y: 60,
          },
        ],
        edges: [
          { from: 'gate', to: 'retry', dashed: true, label: 'fail' },
          { from: 'retry', to: 'extract', dashed: true, curve: 'loop' },
        ],
        steps: [
          {
            focus: 'retry',
            title: 'Retry, but with a budget',
            text: "The gate caught a missing IP clause. Maybe the extractor genuinely missed it; maybe the contract is unusually structured. We loop back into extraction with a fortified prompt that explicitly enumerates what to look for. But we cap at two attempts — because an unbounded retry loop is how you accidentally bill someone $200 reviewing a single contract.",
          },
        ],
      },
      evaluation: {
        adds: 'A grader scores each redline. Below threshold, it loops back for another draft.',
        becomesPattern: 'Evaluator-optimizer',
        nodes: [
          {
            id: 'eval',
            type: 'eval',
            label: 'Redline grader',
            tech: 'Evaluator LLM',
            sub: 'completeness · risk coverage',
            details:
              'Scores against the playbook. Below threshold, kicks back with feedback for another pass.',
            x: 940,
            y: 60,
          },
        ],
        edges: [
          { from: 'redline', to: 'eval' },
          { from: 'eval', to: 'redline', dashed: true, label: 'revise', curve: 'loop' },
        ],
        steps: [
          {
            focus: 'eval',
            title: 'Grade, then loop',
            text: 'A separate model reads the redline against the playbook like a senior associate doing QC. Does it cover every flagged risk? Are the proposed edits aligned with our negotiating positions? Below threshold, the grader writes specific feedback ("missed the auto-renewal clause; liability cap counter is too aggressive") and the redliner takes another pass.',
          },
        ],
      },
    },
  },

  {
    id: 'code_agent',
    title: 'Code Modernization',
    industry: 'Software Engineering',
    blurb: 'Migrate a legacy module: a planner breaks the task down, workers edit files in parallel.',
    basePattern: 'Orchestrator-workers',
    patternWhy:
      "We can't predict how many files need to change. A planner LLM decides on the fly and spawns workers per file.",
    sampleInput: 'Migrate `payments/` from Python 2 → Python 3.11. Keep tests green.',
    sampleOutput: '12 files modified · 47 tests pass · 2 deprecation warnings logged',
    stacks: [
      {
        name: 'Claude Agent SDK / OpenAI Agents SDK',
        best: true,
        why: 'Built for orchestrator–worker patterns with tool use, planning, and child agent calls.',
      },
      {
        name: 'LangGraph',
        why: 'Great when subtasks form a stateful graph and you need branching, retries, and checkpoints.',
      },
      {
        name: 'AutoGen / CrewAI',
        why: 'Multi-agent debate; useful when workers need to negotiate, less useful for fan-out edits.',
      },
      {
        name: 'Plain LLM API + asyncio',
        why: 'Honestly fine for the first version. Frameworks earn their place once state grows.',
      },
    ],
    base: {
      nodes: [
        {
          id: 'in',
          type: 'input',
          label: 'Migration task',
          tech: 'User instruction',
          details:
            'High-level goal in plain English; the system figures out the work breakdown.',
          x: 60,
          y: 240,
        },
        {
          id: 'orch',
          type: 'orchestrator',
          label: 'Planner',
          tech: 'Orchestrator LLM',
          sub: 'decides the plan',
          details:
            'Reads the codebase, decides which files to change, spawns workers with focused subtasks.',
          x: 280,
          y: 240,
        },
        {
          id: 'w1',
          type: 'llm',
          label: 'Worker · src',
          tech: 'Worker LLM',
          sub: 'edits source files',
          details: "Gets a focused subtask: 'modernize payments/api.py to Python 3.11'.",
          x: 540,
          y: 100,
        },
        {
          id: 'w2',
          type: 'llm',
          label: 'Worker · tests',
          tech: 'Worker LLM',
          sub: 'updates tests',
          details: 'Updates pytest fixtures, syntax, and assertions for the new version.',
          x: 540,
          y: 240,
        },
        {
          id: 'w3',
          type: 'llm',
          label: 'Worker · deps',
          tech: 'Worker LLM',
          sub: 'bumps libraries',
          details: 'Updates pyproject.toml, pins versions, resolves conflicts.',
          x: 540,
          y: 380,
        },
        {
          id: 'syn',
          type: 'llm',
          label: 'Reviewer',
          tech: 'Synthesizer LLM',
          sub: 'merges & verifies',
          details:
            "Pulls all worker outputs together, resolves conflicts, ensures tests pass.",
          x: 800,
          y: 240,
        },
        {
          id: 'out',
          type: 'output',
          label: 'Pull request',
          tech: 'Final output',
          details: 'A clean PR with description, diff, and CI logs ready for human review.',
          x: 1040,
          y: 240,
        },
      ],
      edges: [
        { from: 'in', to: 'orch' },
        { from: 'orch', to: 'w1', branch: true },
        { from: 'orch', to: 'w2', branch: true },
        { from: 'orch', to: 'w3', branch: true },
        { from: 'w1', to: 'syn' },
        { from: 'w2', to: 'syn' },
        { from: 'w3', to: 'syn' },
        { from: 'syn', to: 'out' },
      ],
      steps: [
        {
          focus: 'in',
          title: '1. The ask',
          text: "A staff engineer files a one-line task: 'Migrate payments/ from Python 2 to 3.11. Keep tests green.' Sounds simple. But which files? How many? What about the third-party deps that haven't been touched in five years? We can't write a script that decides this in advance — the answer is in the code itself.",
        },
        {
          focus: 'orch',
          title: '2. The planner breaks it down',
          text: "This is the orchestrator-workers pattern. The planner LLM reads the codebase — file by file, imports, dependencies — and decides on the actual work breakdown. It picks: 8 source files need syntax updates, 3 test files need pytest 7 fixtures, the requests library needs bumping. It spawns one focused worker per concern.",
        },
        {
          focus: 'w1',
          title: '3a. Worker on source files',
          text: "The first worker gets a tight subtask: 'Modernize payments/api.py to Python 3.11.' It only has the context it needs — the one file plus the migration guide. Print statements become print(), unicode strings get cleaned up, type hints are added.",
        },
        {
          focus: 'w2',
          title: '3b. Worker on tests',
          text: "In parallel, the test worker updates pytest fixtures, replaces deprecated assertEquals with plain asserts, and fixes the syntax of mocked calls. It doesn't know or care what the source worker is doing — they meet at the synthesizer.",
        },
        {
          focus: 'w3',
          title: '3c. Worker on dependencies',
          text: 'A third worker bumps pyproject.toml: requests 2.20 → 2.31, drops the six compatibility shim, pins versions and resolves conflicts in the lock file. Each worker is excellent at its narrow lane.',
        },
        {
          focus: 'syn',
          title: '4. Reviewer merges it all',
          text: "The synthesizer pulls every worker's output together. If the source worker imported a symbol the deps worker didn't pin, it catches that. If two workers touched the same import block, it merges them cleanly. Then it runs the test suite to make sure the whole thing actually works.",
        },
        {
          focus: 'out',
          title: '5. A clean PR is opened',
          text: 'The result is a single pull request with a description, a clean diff, and green CI logs. A human reviews for design fit — not for missing semicolons. 12 files changed, 47 tests pass, ready for merge.',
        },
      ],
    },
    layers: {
      security: {
        adds: 'Run in a sandbox. Block the PR if it leaks secrets.',
        nodes: [
          {
            id: 'guard',
            type: 'guard',
            label: 'Secrets scan',
            tech: 'Output guardrail',
            sub: 'block on hit',
            details:
              'Static analysis blocks PRs that contain API keys, tokens, or .env files.',
            x: 800,
            y: 100,
          },
        ],
        edges: [
          { from: 'syn', to: 'guard', dashed: true },
          { from: 'guard', to: 'out', dashed: true },
        ],
        steps: [
          {
            focus: 'guard',
            title: 'Secrets caught before PR',
            text: "AI agents editing code can do a lot — including, accidentally, paste an API key into a comment or commit a .env file they found while exploring. The secrets scan catches this before the PR is ever opened. If hygiene fails, the synthesizer's output is blocked and the workers are asked to redo the affected files cleanly.",
          },
        ],
      },
      reliability: {
        adds: 'Each worker runs the test suite; failures retry with diff context.',
        nodes: [
          {
            id: 'tests',
            type: 'tools',
            label: 'Test runner',
            tech: 'CI tool',
            sub: 'pytest',
            details: 'Workers can run the test suite themselves, see failures, and patch.',
            x: 540,
            y: 500,
          },
        ],
        edges: [
          { from: 'w1', to: 'tests', dashed: true, bidir: true },
          { from: 'w2', to: 'tests', dashed: true, bidir: true },
          { from: 'w3', to: 'tests', dashed: true, bidir: true },
        ],
        steps: [
          {
            focus: 'tests',
            title: 'Workers test their own work',
            text: "Each worker runs pytest after its edits. The source worker sees test_parse.py fail with an AttributeError, reads the trace, realizes it changed a method signature without updating the call site, and patches it. Workers fixing their own breakages locally beats the synthesizer playing whack-a-mole later.",
          },
        ],
      },
      evaluation: {
        adds: "A senior dev reviews the diff before merge. Their feedback tunes future runs.",
        nodes: [
          {
            id: 'human',
            type: 'human',
            label: 'Senior review',
            tech: 'Human-in-the-loop',
            sub: 'approve · changes',
            details: "Code review by a senior engineer; their comments fine-tune future runs.",
            x: 1040,
            y: 100,
          },
        ],
        edges: [
          { from: 'syn', to: 'human', dashed: true },
          { from: 'human', to: 'out', dashed: true },
        ],
        steps: [
          {
            focus: 'human',
            title: 'Senior review before merge',
            text: "Tests can pass and the change can still be wrong — maybe it broke an unwritten convention, or chose the wrong abstraction. A senior engineer reviews for intent and style. Their comments (\"prefer Pathlib over os.path here\") feed back into the planner's prompt for next time. The agent gets better the more it ships.",
          },
        ],
      },
    },
  },

  {
    id: 'moderation',
    title: 'Content Moderation',
    industry: 'Marketplaces / Social',
    blurb: 'Screen new listings against policy using several specialized checks in parallel.',
    basePattern: 'Parallelization · Voting',
    patternWhy:
      'Different concerns deserve different prompts. We run them in parallel and vote.',
    sampleInput: "Listing: 'Vintage Rolex Submariner — $89, ships from overseas, no returns.'",
    sampleOutput: 'FLAGGED: counterfeit risk (3/3 votes). Action: hold for manual review.',
    stacks: [
      {
        name: 'LLM API + Promise.all',
        best: true,
        why: "Parallel calls + a vote function = ~30 lines. Don't over-engineer.",
      },
      {
        name: 'Modal / Inngest',
        why: 'If volume is huge, fan-out execution platforms keep latency low and costs predictable.',
      },
      {
        name: 'Vector DB + small classifier',
        why: 'Pre-filter with embeddings; only call LLMs on borderline content to save cost.',
      },
      {
        name: 'LangChain RunnableParallel',
        why: 'Tidy if your team already standardizes on LangChain primitives.',
      },
    ],
    base: {
      nodes: [
        {
          id: 'in',
          type: 'input',
          label: 'New listing',
          tech: 'User submission',
          details: 'Title, description, photos, price — typically posted from mobile.',
          x: 60,
          y: 240,
        },
        {
          id: 'v1',
          type: 'llm',
          label: 'Counterfeit checker',
          tech: 'Specialized LLM',
          sub: 'fakes & knockoffs',
          details: 'Looks for price-mismatch, vague provenance, suspicious branding.',
          x: 320,
          y: 100,
        },
        {
          id: 'v2',
          type: 'llm',
          label: 'Prohibited items',
          tech: 'Specialized LLM',
          sub: 'weapons · drugs · IP',
          details:
            "Compares against the platform's prohibited list with a focused prompt.",
          x: 320,
          y: 240,
        },
        {
          id: 'v3',
          type: 'llm',
          label: 'Pricing anomaly',
          tech: 'Specialized LLM',
          sub: 'scams & shills',
          details: 'Detects price/condition mismatches that signal fraud.',
          x: 320,
          y: 380,
        },
        {
          id: 'agg',
          type: 'aggregator',
          label: 'Vote tally',
          tech: 'Aggregator',
          sub: '≥ 2 of 3 → flag',
          details:
            'Programmatic vote: the listing is flagged if at least two checks agree.',
          x: 600,
          y: 240,
        },
        {
          id: 'out',
          type: 'output',
          label: 'Decision',
          tech: 'Action',
          details:
            'Outcome: live, held, or removed — with reasoning attached for appeals.',
          x: 860,
          y: 240,
        },
      ],
      edges: [
        { from: 'in', to: 'v1', branch: true },
        { from: 'in', to: 'v2', branch: true },
        { from: 'in', to: 'v3', branch: true },
        { from: 'v1', to: 'agg' },
        { from: 'v2', to: 'agg' },
        { from: 'v3', to: 'agg' },
        { from: 'agg', to: 'out' },
      ],
      steps: [
        {
          focus: 'in',
          title: '1. A new listing posts',
          text: "From a phone in 30 seconds: 'Vintage Rolex Submariner — $89, ships from overseas, no returns.' On a healthy marketplace this might be a deal of the century, a counterfeit, a scam, or a prohibited item. We don't have time to wait — the listing goes live in seconds either way.",
        },
        {
          focus: 'v1',
          title: '2a. Counterfeit checker',
          text: "This is the parallelization pattern. The first specialist looks at one thing only: does this look fake? It compares the price against real Rolex Submariner ranges ($8,000–$15,000), notes 'ships from overseas' as a counterfeit signal, and flags. Its prompt is tuned for fakes — it doesn't get distracted by other concerns.",
        },
        {
          focus: 'v2',
          title: '2b. Prohibited items checker',
          text: "At the same instant, the second specialist checks the prohibited items list — weapons, drugs, IP violations, restricted exports. A vintage watch isn't on it, so this checker says 'clean.' Different prompt, different concern, runs in parallel.",
        },
        {
          focus: 'v3',
          title: '2c. Pricing anomaly checker',
          text: "The third runs in parallel too: it just looks at price-versus-condition mismatches. $89 for an item that retails for $10,000 is a screaming anomaly. It flags. None of the three checkers know what the others are doing — and that's the point.",
        },
        {
          focus: 'agg',
          title: '3. The vote tally decides',
          text: "Programmatic, not LLM. Two of three flagged the listing (counterfeit + pricing). The threshold is 'two or more' — so the listing is held. Voting beats one judgmental model: each specialist is right about its own concern more often than a generalist judging all three at once.",
        },
        {
          focus: 'out',
          title: '4. Action with reasoning attached',
          text: "Decision: hold for manual review. Each checker's reasoning is recorded, so when the seller appeals, we can show exactly which signals fired and why. Transparency built in from the start — not bolted on after the first PR crisis.",
        },
      ],
    },
    layers: {
      security: {
        adds: 'Hash-match images against abuse databases before any model sees them.',
        nodes: [
          {
            id: 'guard',
            type: 'guard',
            label: 'Hash match',
            tech: 'Pre-LLM filter',
            sub: 'abuse DB',
            details:
              'Cryptographic hash check against known-abuse databases, blocking content before LLM exposure.',
            x: 180,
            y: 240,
          },
        ],
        edges: [
          { from: 'in', to: 'guard' },
          { from: 'guard', to: 'v1' },
          { from: 'guard', to: 'v2' },
          { from: 'guard', to: 'v3' },
        ],
        removeEdges: [
          { from: 'in', to: 'v1' },
          { from: 'in', to: 'v2' },
          { from: 'in', to: 'v3' },
        ],
        steps: [
          {
            focus: 'guard',
            title: 'Hash-match before models',
            text: "Some content shouldn't even be processed. Photos are hashed and matched against known-abuse databases before any model loads them. If there's a match, the listing is removed instantly, the user is reported, and no LLM is ever exposed to the content. Cheap, fast, and ethically critical.",
          },
        ],
      },
      reliability: {
        adds: "1-of-3 votes? Send to a human moderator — don't auto-decide.",
        nodes: [
          {
            id: 'human',
            type: 'human',
            label: 'Moderator queue',
            tech: 'Human-in-the-loop',
            sub: 'borderline cases',
            details: "Single-vote disagreements go to a human — too risky to auto-resolve.",
            x: 600,
            y: 440,
          },
        ],
        edges: [
          { from: 'agg', to: 'human', dashed: true, label: '1/3' },
          { from: 'human', to: 'out', dashed: true },
        ],
        steps: [
          {
            focus: 'human',
            title: 'Borderline goes to a human',
            text: "Only one model flagged the listing? That's the dangerous middle ground — confident enough to question, not confident enough to auto-remove. The aggregator routes these to a human moderator queue. Auto-decisions stay accurate; humans handle the genuinely ambiguous cases that an algorithm shouldn't.",
          },
        ],
      },
      evaluation: {
        adds: 'Daily false-positive sample is reviewed and feeds back into prompt tuning.',
        nodes: [
          {
            id: 'eval',
            type: 'eval',
            label: 'FP/FN audit',
            tech: 'Offline evaluator',
            sub: 'daily sample',
            details: 'Each day, a sample of decisions is hand-reviewed; deltas drive prompt updates.',
            x: 320,
            y: 520,
          },
        ],
        edges: [
          { from: 'agg', to: 'eval', dashed: true },
          { from: 'eval', to: 'v1', dashed: true, label: 'tune', curve: 'loop' },
        ],
        steps: [
          {
            focus: 'eval',
            title: 'Daily false-positive audit',
            text: "Every day, a stratified sample of decisions — some flagged, some passed — is hand-reviewed. The audit tracks two numbers: false positives (we blocked good listings) and false negatives (we let bad ones through). Both move us to update specific voter prompts. The system gets sharper with every cycle.",
          },
        ],
      },
    },
  },

  {
    id: 'deep_research',
    title: 'Research Assistant',
    industry: 'Finance / Consulting',
    blurb: "Open-ended research — the agent decides its own steps and iterates until satisfied.",
    basePattern: 'Autonomous agent',
    patternWhy:
      "Truly open-ended: number of searches and depth depend on what's found. We can't pre-script it.",
    sampleInput: "Brief me on the EU AI Act's impact on fintech compliance — 1-page memo.",
    sampleOutput: 'Memo · 6 sources · 3 risk areas · 4 recommendations (12 tool calls, 4 iterations)',
    stacks: [
      {
        name: 'Claude Agent SDK / OpenAI Agents SDK',
        best: true,
        why: 'Built for tool-using agents with stop conditions, memory, and trace logs.',
      },
      {
        name: 'LangGraph',
        why: 'Excellent for explicit plan-act-observe loops where you need checkpoint state.',
      },
      {
        name: 'Smolagents (HF)',
        why: 'Lightweight code-acting agents; good when the agent should write Python to act.',
      },
      {
        name: 'Browserbase / Browser tools',
        why: 'Add when the agent needs real web browsing rather than just search APIs.',
      },
    ],
    base: {
      nodes: [
        {
          id: 'in',
          type: 'input',
          label: 'Research brief',
          tech: 'User goal',
          details: 'Open-ended question. The agent decides scope, depth, and stopping point.',
          x: 60,
          y: 240,
        },
        {
          id: 'tools',
          type: 'tools',
          label: 'Toolbox',
          tech: 'Tools',
          sub: 'web · pdf · sql · memo',
          details:
            'Web search, PDF reader, SQL queries, and a memo writer — all callable on demand.',
          x: 360,
          y: 80,
        },
        {
          id: 'agent',
          type: 'agent',
          label: 'Agent',
          tech: 'Autonomous loop',
          sub: 'plan → act → observe',
          details:
            'The agent loops: thinks, picks a tool, observes the result, decides what\'s next. Stops when satisfied.',
          x: 360,
          y: 240,
        },
        {
          id: 'env',
          type: 'env',
          label: 'World',
          tech: 'Environment',
          sub: 'ground truth',
          details:
            "Real responses from real systems — the agent grounds itself in actual results, not assumptions.",
          x: 360,
          y: 400,
        },
        {
          id: 'out',
          type: 'output',
          label: 'Memo',
          tech: 'Final answer',
          details: 'Written deliverable with sources, recommendations, and confidence flags.',
          x: 700,
          y: 240,
        },
      ],
      edges: [
        { from: 'in', to: 'agent' },
        { from: 'tools', to: 'agent', dashed: true, bidir: true },
        { from: 'env', to: 'agent', dashed: true, bidir: true },
        { from: 'agent', to: 'out' },
      ],
      steps: [
        {
          focus: 'in',
          title: '1. An open question',
          text: "A partner asks: 'Brief me on the EU AI Act's impact on fintech compliance — one page, by 5pm.' We don't know how many sources to read, which databases to query, or how deep to go. The answer depends on what we find. This is the kind of task where a fixed workflow falls apart.",
        },
        {
          focus: 'agent',
          title: '2. The agent plans its own work',
          text: "This is the autonomous agent pattern. The agent reads the brief and writes a plan: search the EUR-Lex database for the official text, find recent commentary on Article 6 risk classifications, check what major fintechs have said, look up enforcement timelines. Then it starts executing.",
        },
        {
          focus: 'tools',
          title: '3. It picks tools as it goes',
          text: "It calls web search for recent news. The results mention a delegated act — it opens the PDF reader to skim it. The PDF references Recital 41; it queries SQL to pull our internal compliance map for related controls. Each tool gets called when needed, not on a schedule.",
        },
        {
          focus: 'env',
          title: '4. The world is the source of truth',
          text: "This is what makes agents work — they ground themselves in real responses, not assumptions. The agent doesn't guess what the EUR-Lex API will return; it asks. If a source contradicts an earlier finding, it updates its plan. Reality is the corrective force.",
        },
        {
          focus: 'agent',
          title: '5. Loops until satisfied',
          text: "Plan, act, observe, plan again. After four iterations and twelve tool calls, the agent decides it has enough — the risk areas are identified, the recommendations are grounded, the citations are solid. Now it writes the memo.",
        },
        {
          focus: 'out',
          title: '6. Memo delivered, with sources',
          text: "The deliverable: a one-page memo, six sources cited, three risk areas, four recommendations — plus confidence flags on each claim. Took 4 minutes and 14 seconds. The partner reads it, asks one follow-up, and the agent does another loop.",
        },
      ],
    },
    layers: {
      security: {
        adds: 'Tools have an allowlist. No writing to production. Hard cost cap per run.',
        nodes: [
          {
            id: 'guard',
            type: 'guard',
            label: 'Tool ACL',
            tech: 'Tool guardrail',
            sub: 'domain allowlist · cost cap',
            details:
              'Whitelisted domains only; read-only DB connections; per-run dollar cap.',
            x: 580,
            y: 80,
          },
        ],
        edges: [{ from: 'guard', to: 'tools', dashed: true, label: 'policy' }],
        steps: [
          {
            focus: 'guard',
            title: 'Tool policy keeps it safe',
            text: "Agents with internet access and unbounded tools are how things go wrong fast. The tool ACL restricts the agent to whitelisted domains (eur-lex.europa.eu, internal SharePoint, no random blogs). Database connections are read-only — it can query but never write. Per-run cost cap is $2 — hard ceiling, no exceptions.",
          },
        ],
      },
      reliability: {
        adds: 'Stop conditions — max 20 tool calls, 6 iterations, $2 budget.',
        nodes: [
          {
            id: 'stop',
            type: 'gate',
            label: 'Stop conditions',
            tech: 'Loop limiter',
            sub: 'iters · cost · time',
            details: 'Hard limits prevent runaway loops. Without these, an agent can spiral.',
            x: 560,
            y: 240,
          },
        ],
        edges: [{ from: 'agent', to: 'stop', dashed: true, bidir: true }],
        steps: [
          {
            focus: 'stop',
            title: 'Brakes on the loop',
            text: "Agents can spiral. They get fixated on a sub-question, keep refining a search query, never decide they have enough. Stop conditions — max 20 tool calls, max 6 iterations, $2 budget — force a return. If the limit hits, the agent must finalize with what it has and flag confidence as low. Brakes are non-negotiable.",
          },
        ],
      },
      evaluation: {
        adds: 'A critic grades the memo. Weak draft? Loop again with feedback.',
        becomesPattern: 'Agent + Evaluator-optimizer',
        nodes: [
          {
            id: 'eval',
            type: 'eval',
            label: 'Critic',
            tech: 'Evaluator LLM',
            sub: 'rubric · 1–5',
            details:
              'Scores the memo on factuality, sourcing, and clarity. Below 4, sends feedback for revision.',
            x: 700,
            y: 80,
          },
        ],
        edges: [
          { from: 'agent', to: 'eval' },
          { from: 'eval', to: 'agent', dashed: true, label: 'revise', curve: 'loop' },
        ],
        steps: [
          {
            focus: 'eval',
            title: 'Critic loop sharpens the memo',
            text: 'A separate critic model reads the memo against a rubric: factuality, sourcing quality, clarity, recommendation strength. Below 4 out of 5, it sends specific feedback ("recommendation 2 lacks a citation; risk area 3 is overstated") and the agent loops back into research. The partner gets a sharpened memo, not a first draft.',
          },
        ],
      },
    },
  },

  {
    id: 'coding_agent',
    title: 'Coding Agent',
    industry: 'Developer tools',
    blurb: 'Resolves a GitHub issue end-to-end — reads the repo, edits files, runs tests, iterates.',
    basePattern: 'Autonomous agent',
    patternWhy:
      "Tasks like SWE-bench can't be hardcoded — the agent decides which files to read, what to edit, and when tests prove it's done.",
    sampleInput: "Issue #482: 'TypeError when CSV has trailing comma. Repro in tests/test_parse.py.'",
    sampleOutput: 'PR opened · 3 files modified · 14/14 tests pass · diff +27 −9',
    stacks: [
      {
        name: 'Claude Agent SDK',
        best: true,
        why: 'Purpose-built for long-horizon coding loops with file tools, bash, and test feedback.',
      },
      {
        name: 'OpenAI Agents SDK',
        why: 'Comparable abstractions; pick based on model and trace tooling preferences.',
      },
      {
        name: 'Custom loop + tool API',
        why: 'What Anthropic actually recommends for production: own the loop, invest in good tools (ACI).',
      },
      {
        name: 'LangGraph',
        why: 'Use when the loop has explicit checkpoints you want to resume or branch from.',
      },
    ],
    base: {
      nodes: [
        {
          id: 'in',
          type: 'input',
          label: 'Issue + repo',
          tech: 'Task spec',
          details:
            'A GitHub issue with a failing test. The agent has read/write access to the repo and a sandbox shell.',
          x: 60,
          y: 240,
        },
        {
          id: 'tools',
          type: 'tools',
          label: 'Coding tools',
          tech: 'ACI',
          sub: 'read · edit · grep · bash',
          details:
            "The agent-computer interface: file read/write, codebase search, test runner. Anthropic's article: invest as much in ACI as you would in HCI.",
          x: 360,
          y: 80,
        },
        {
          id: 'agent',
          type: 'agent',
          label: 'Coding agent',
          tech: 'Plan → edit → test',
          sub: 'loops on test output',
          details:
            'Reads code, forms a hypothesis, edits files, runs tests. Test failures are the ground truth that drives the next iteration.',
          x: 360,
          y: 240,
        },
        {
          id: 'env',
          type: 'env',
          label: 'Sandbox',
          tech: 'Test runner',
          sub: 'ground truth',
          details:
            "Real test results — not the agent's guess. Pass/fail signal is what makes coding agents reliable.",
          x: 360,
          y: 400,
        },
        {
          id: 'out',
          type: 'output',
          label: 'Pull request',
          tech: 'Verifiable result',
          details: 'Diff + green tests. Human reviews for design fit before merge.',
          x: 700,
          y: 240,
        },
      ],
      edges: [
        { from: 'in', to: 'agent' },
        { from: 'tools', to: 'agent', dashed: true, bidir: true },
        { from: 'env', to: 'agent', dashed: true, bidir: true },
        { from: 'agent', to: 'out' },
      ],
      steps: [
        {
          focus: 'in',
          title: '1. Read the issue',
          text: "GitHub issue #482 lands: 'TypeError when CSV has trailing comma. Repro in tests/test_parse.py.' The agent has read/write access to the repo and a sandbox shell. It doesn't yet know which file has the bug, what caused it, or how many places need to change. The issue is the only context.",
        },
        {
          focus: 'agent',
          title: '2. Plan the fix',
          text: "This is the autonomous agent pattern. The agent skims the failing test, traces the import to csv_parser.py, reads the parse() function, and forms a hypothesis: the row-splitting logic doesn't handle trailing empty fields. It writes a plan: reproduce the failure, patch parse(), check related callers, run the full suite.",
        },
        {
          focus: 'tools',
          title: '3. Edit, then run tests',
          text: "It uses the file-edit tool to add a guard for trailing delimiters, then runs pytest. This is the agent-computer interface (ACI) — file read, file edit, codebase grep, bash. Anthropic's article: 'Invest as much in ACI as you would in HCI.' Good tools make agents reliable.",
        },
        {
          focus: 'env',
          title: '4. Tests are ground truth',
          text: "Tests are why coding agents work. The agent doesn't get to think 'looks fixed.' It runs the suite and reads real pass/fail output. test_parse passes now — but two unrelated tests started failing because the patch was too aggressive. Reality fights back. The agent must respond.",
        },
        {
          focus: 'agent',
          title: '5. Iterate until everything is green',
          text: "It reads the new failures, narrows the patch to only fire on trailing commas (not all empty fields), and re-runs. Green. Loops until every test passes. This is what unscripted iteration looks like — plan, act, observe, adjust. Same as a junior engineer at a debugger, just much faster.",
        },
        {
          focus: 'out',
          title: '6. Open the PR',
          text: 'Final PR opened: 3 files modified, 14/14 tests pass, +27 −9 diff. Description written, linked to the issue, ready for human review. The reviewer checks intent and design — they don\'t have to find missing semicolons. SWE-bench-style results, every day.',
        },
      ],
    },
    layers: {
      security: {
        adds: 'Sandboxed exec, no network, no writes outside the repo. Secrets scanned in the diff before PR.',
        nodes: [
          {
            id: 'guard',
            type: 'guard',
            label: 'Sandbox + secret scan',
            tech: 'Exec policy',
            sub: 'no net · scoped fs · scan diff',
            details:
              'Bash runs in a container with no internet and a read-only mount outside the repo. Diffs are scanned for keys before PR.',
            x: 580,
            y: 80,
          },
        ],
        edges: [{ from: 'guard', to: 'tools', dashed: true, label: 'policy' }],
        steps: [
          {
            focus: 'guard',
            title: 'Sandboxed execution',
            text: "The agent runs bash commands and reads files — a powerful and dangerous combination. The sandbox container has no internet (so a confused agent can't download arbitrary code), a read-only mount of anything outside the repo (so it can't touch /etc), and a secret scanner on every diff (so a key in a config file never reaches the PR).",
          },
        ],
      },
      reliability: {
        adds: 'Stop conditions (max edits, max iterations) and a human reviewer on the PR.',
        nodes: [
          {
            id: 'stop',
            type: 'gate',
            label: 'Stop conditions',
            tech: 'Loop limiter',
            sub: '20 iters · 50 edits · $5',
            details:
              'Hard caps on edits, iterations, and cost. Without these, agents can spiral on hard bugs.',
            x: 560,
            y: 240,
          },
          {
            id: 'human',
            type: 'human',
            label: 'PR reviewer',
            tech: 'Human-in-loop',
            sub: 'approve · request changes',
            details: 'Tests can pass and the change still be wrong. Humans review for intent and design.',
            x: 700,
            y: 100,
          },
        ],
        edges: [
          { from: 'agent', to: 'stop', dashed: true, bidir: true },
          { from: 'out', to: 'human' },
        ],
        steps: [
          {
            focus: 'stop',
            title: 'Brakes on the loop',
            text: "Hard caps: 20 iterations, 50 file edits, $5 budget. A coding agent on a genuinely hard bug can spiral — keep editing, keep retesting, keep burning tokens. The stop conditions force a return: 'I tried, here's what I learned, here's where I'm stuck.' Better than a $200 PR that never opened.",
          },
          {
            focus: 'human',
            title: 'Human review for intent',
            text: "Tests passing means the change works. It doesn't mean the change is right. Maybe the agent fixed the symptom and not the cause; maybe it added complexity where simplicity was warranted. A human reviewer checks for that. Their judgment is irreplaceable — and now they spend it on the interesting question, not on syntax.",
          },
        ],
      },
      evaluation: {
        adds: 'A reviewer LLM grades the diff against the issue. Weak fix → loop again with feedback.',
        becomesPattern: 'Agent + Evaluator-optimizer',
        nodes: [
          {
            id: 'eval',
            type: 'eval',
            label: 'Diff reviewer',
            tech: 'Evaluator LLM',
            sub: 'fixes issue? · style? · tests?',
            details:
              'A second model reads the issue + diff and scores: does this actually solve the bug? Is it minimal? Are tests adequate?',
            x: 700,
            y: 80,
          },
        ],
        edges: [
          { from: 'agent', to: 'eval' },
          { from: 'eval', to: 'agent', dashed: true, label: 'revise', curve: 'loop' },
        ],
        steps: [
          {
            focus: 'eval',
            title: 'Critic grades the diff',
            text: "A separate evaluator model reads the original issue plus the proposed diff and scores: does this actually solve the bug, not just pass the test? Is it minimal? Are tests adequate for the change? Below threshold, the critic writes specific feedback and the coding agent loops back for another iteration. Quality over speed.",
          },
        ],
      },
    },
  },

  {
    id: 'combined',
    title: 'Combined: Sales Ops Pipeline',
    industry: 'Sales / RevOps',
    blurb: 'Real systems combine patterns — routing, then chaining, then an agent, with humans in the loop.',
    basePattern: 'Combined patterns',
    patternWhy:
      "Anthropic's article: 'These building blocks aren't prescriptive. They're common patterns to shape and combine.' Real workflows mix several.",
    sampleInput: "Inbound: 'Hi, we're 200 people, evaluating Salesforce alternatives — can we get a demo?'",
    sampleOutput:
      'Lead enriched · qualified MQL · routed to AE Sarah · demo booked Thu 2pm · CRM updated',
    stacks: [
      {
        name: 'Hybrid: n8n + LLM API',
        best: true,
        why: 'n8n triggers + integrations on the outside; direct LLM API calls for the reasoning steps. Each pattern uses the simplest tool that fits.',
      },
      {
        name: 'LangGraph',
        why: 'Whole pipeline as a stateful graph if you want one place to debug + checkpoint.',
      },
      {
        name: 'Temporal + LLM API',
        why: 'When durability matters more than speed: each stage is a workflow step with retries baked in.',
      },
    ],
    base: {
      nodes: [
        {
          id: 'in',
          type: 'input',
          label: 'Inbound lead',
          tech: 'Form / email',
          details: 'Raw lead from a website form, an email reply, or a chat. Free text plus form fields.',
          x: 60,
          y: 240,
        },
        {
          id: 'router',
          type: 'router',
          label: 'Intent router',
          tech: 'Routing',
          sub: 'classify intent',
          details:
            'First pattern: classify the message. Spam → drop. Support → support flow. Demo/pricing → continue.',
          x: 230,
          y: 240,
        },
        {
          id: 'enrich',
          type: 'llm',
          label: 'Enrich + qualify',
          tech: 'Prompt chain',
          sub: 'lookup → score → summarize',
          details:
            'Second pattern: a fixed chain. Look up the company, score against ICP, summarize for the AE.',
          x: 420,
          y: 140,
        },
        {
          id: 'agent',
          type: 'agent',
          label: 'Scheduling agent',
          tech: 'Autonomous agent',
          sub: 'calendars · email · CRM',
          details:
            "Third pattern: an agent. Calendars and reply styles vary too much to script — it loops until a slot is booked.",
          x: 420,
          y: 340,
        },
        {
          id: 'human',
          type: 'human',
          label: 'AE review',
          tech: 'Human-in-loop',
          sub: 'approve before send',
          details:
            'Human checks the proposed time + email draft before the agent sends. Trust grows, oversight shrinks.',
          x: 620,
          y: 340,
        },
        {
          id: 'out',
          type: 'output',
          label: 'Booked + logged',
          tech: 'Final state',
          details: 'Demo on the calendar, CRM updated, AE notified. End-to-end with no manual triage.',
          x: 800,
          y: 240,
        },
      ],
      edges: [
        { from: 'in', to: 'router' },
        { from: 'router', to: 'enrich', label: 'qualified' },
        { from: 'router', to: 'out', dashed: true, label: 'spam · drop' },
        { from: 'enrich', to: 'agent' },
        { from: 'agent', to: 'human' },
        { from: 'human', to: 'agent', dashed: true, label: 'approve', curve: 'loop' },
        { from: 'agent', to: 'out' },
      ],
      steps: [
        {
          focus: 'in',
          title: '1. A lead lands',
          text: "At 9:14am Tuesday, an inbound message arrives: 'Hi, we're 200 people, evaluating Salesforce alternatives — can we get a demo?' Could be a serious enterprise buyer. Could be a competitor doing recon. Could be spam. Could be a current customer who hit the wrong form. The pipeline has to figure out the rest — and book the demo if it's real.",
        },
        {
          focus: 'router',
          title: '2. Routing first — classify intent',
          text: "Pattern one: routing. The intent classifier reads the message and picks a lane in milliseconds. Spam gets dropped. Existing-customer support questions get split off to the support flow. Demo and pricing requests continue. The classifier is small and fast — it doesn't need to be brilliant, it needs to be cheap and right 95% of the time.",
        },
        {
          focus: 'enrich',
          title: '3. Then chaining — enrich and qualify',
          text: "Pattern two: a fixed prompt chain. Step A: look up the company in our enrichment provider — 200 employees confirmed, $40M ARR, fintech vertical. Step B: score against ICP — strong match. Step C: write a one-paragraph summary for the AE. Each step small, each step verifiable, no creativity required.",
        },
        {
          focus: 'agent',
          title: '4. Then the agent — booking is messy',
          text: "Pattern three: an autonomous agent. Booking demos is unscripted — calendars conflict, prospects respond at odd hours, time zones get tangled. The agent reads our AE's calendar, drafts a proposal email, watches the inbox for a response, and adjusts. This is exactly where you want an agent: variability is high and stakes are recoverable.",
        },
        {
          focus: 'human',
          title: '5. Human checkpoint before sending',
          text: "Before the agent sends the proposed email, the AE sees it: subject line, body, suggested time. One click to approve, one click to tweak. Cheap insurance against an awkward email going to a serious prospect. As the agent earns trust over weeks, this checkpoint shrinks — maybe just for net-new logos.",
        },
        {
          focus: 'out',
          title: '6. Booked, logged, end-to-end',
          text: "Demo on Sarah's calendar Thursday at 2pm. CRM updated with the enriched data, the qualification score, and the conversation transcript. Sarah arrives at the demo informed, the prospect was answered in minutes instead of days, and three patterns worked together to get it done. That's what real systems look like.",
        },
      ],
    },
    layers: {
      security: {
        adds: 'PII redaction before any LLM call. CRM writes go through a scoped service account.',
        nodes: [
          {
            id: 'guard',
            type: 'guard',
            label: 'PII redact + scoped writes',
            tech: 'Data + write policy',
            sub: 'redact · scoped acct',
            details:
              'Strip PII fields before LLM context. CRM writes via a service account with field-level scopes.',
            x: 420,
            y: 30,
          },
        ],
        edges: [
          { from: 'guard', to: 'enrich', dashed: true, label: 'policy' },
          { from: 'guard', to: 'agent', dashed: true, label: 'policy' },
        ],
        steps: [
          {
            focus: 'guard',
            title: 'PII out, scoped writes in',
            text: "The chain reads enriched company data; the agent drafts emails to a real human. Both have access patterns that need locking down. PII fields are stripped from anything sent to LLMs (even our own enrichment data has names and emails we don't need to leak into a prompt log). CRM writes go through a scoped service account — not the global API key — so the worst case is a wrong field, not a wrong account taken over.",
          },
        ],
      },
      reliability: {
        adds: 'Retries on every external call. Stop conditions on the agent. Dead-letter queue for failures.',
        nodes: [
          {
            id: 'retry',
            type: 'retry',
            label: 'Retry + DLQ',
            tech: 'Resilience',
            sub: '3× backoff · queue',
            details:
              'Every external call gets retried with backoff. Persistent failures go to a dead-letter queue an ops engineer monitors.',
            x: 230,
            y: 100,
          },
          {
            id: 'stop',
            type: 'gate',
            label: 'Agent stop conds',
            tech: 'Loop limiter',
            sub: '8 iters · 4 emails',
            details: "Cap iterations and outbound emails so a confused agent can't spam a prospect.",
            x: 560,
            y: 340,
          },
        ],
        edges: [
          { from: 'retry', to: 'router', dashed: true },
          { from: 'agent', to: 'stop', dashed: true, bidir: true },
        ],
        steps: [
          {
            focus: 'retry',
            title: 'Retries baked in everywhere',
            text: "In production, external services fail. The enrichment API times out. The calendar API rate-limits. The email provider has a hiccup. Each external call retries with exponential backoff (3 attempts), and persistent failures land in a dead-letter queue an ops engineer watches. Production-grade reliability isn't optional — it's the difference between 'cool prototype' and 'we depend on this.'",
          },
          {
            focus: 'stop',
            title: 'Agent needs brakes',
            text: "Agents need stop conditions even more than other patterns. Without them, a confused agent can email a prospect four times trying to schedule a demo. Hard caps: 8 iterations max, 4 outbound emails max. If we hit the limit, we surface to the AE with what we have. Embarrassing email storms avoided.",
          },
        ],
      },
      evaluation: {
        adds: 'Sample 5% of runs for offline grading. Track lead-to-demo conversion as the north-star metric.',
        nodes: [
          {
            id: 'eval',
            type: 'eval',
            label: 'Offline eval + KPIs',
            tech: 'Evaluation',
            sub: 'sample · grade · track',
            details:
              "Sample runs for human grading. Track conversion + AE override rate. The article: 'measure performance and iterate.'",
            x: 800,
            y: 100,
          },
        ],
        edges: [{ from: 'out', to: 'eval', dashed: true }],
        steps: [
          {
            focus: 'eval',
            title: 'Measure, then iterate',
            text: "5% of runs are sampled for human grading. We track two things relentlessly: lead-to-demo conversion (the business metric that matters), and AE override rate (do humans agree with the agent's decisions?). The article's core advice: add complexity only when it demonstrably improves outcomes. Without measurement, you don't know which patterns are pulling weight — and you keep adding things that don't help.",
          },
        ],
      },
    },
  },
];
