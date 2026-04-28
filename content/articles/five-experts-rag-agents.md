---
title: "The Five Experts: A Story About How AI Learns to Think and Act"
slug: five-experts-rag-agents
language: en
status: published
date_written: 2025-11-05
word_count: ~2100
category: ai
tags: [rag, agents, llm, ai-architecture, prompt-engineering]
sources_factuelles:
  - https://docs.ragas.io/
  - https://www.pinecone.io/learn/retrieval-augmented-generation/
  - https://developer.nvidia.com/blog/rag-101-demystifying-retrieval-augmented-generation-pipelines/
---

Since 2022 and the release of ChatGPT, we've heard about AI every single day.

That moment marked a turning point: the race between tech giants officially began in the public eye. Since then, many of us have written our first prompt — and realized how astonishing this tool could be.

In the U.S., by 2023, around **20% of employees** reported using AI at work. Two years later, it reached **40%**. Such rapid adoption shows how useful this technology already is across industries. For comparison: electricity took 30 years to reach most homes, and the internet took 20.

Yet, most companies **lack a clear AI vision or internal tools**. Employees use AI individually — for basic tasks like writing emails, translations, coding help — but rarely in an organized, secure, or domain-specific way.

Why? Because of **knowledge gaps**, **fear of data leaks**, **resistance to change**, and **the lack of custom AI models** adapted to their domain.

When companies use generic AI models, they quickly hit a wall: **hallucinations**. We've all experienced it — you ask a question, and the AI answers something that **sounds smart but doesn't make sense in your context**.

That hallucination happens when the model **lacks context**, **accurate data**, or **up-to-date information**. AI is not a magician — **it doesn't know what it doesn't know**. It's totally normal: the model is trained on public data, not on your own data. It's like using an old GPS that doesn't know about the new highway bypass or a sudden road closure.

Moreover, a basic LLM is passive: you pose a question, and it answers — even if it lacks relevant information and context. But companies' issues are often complex and multi-layered.

Now imagine this use case:

You are the CEO of **BioNatura**, a company producing **microbial-based biofertilizers**. Your latest product is promising: eco-friendly, high-yield, and low-impact.

*But there is a big problem:*

- The bacteria inside **die too quickly** during storage.
- After 4–6 weeks, the fertilizer loses efficiency.
- Your clients complain, your sales team sweats, and you're out of excuses.

So, you decide to hire **"experts."**

---

## 1. Gerald

Gerald proudly holds a Master's in Biology from the prestigious Calthoch University. Ask him about bacterial survival, and you'll get a 15-minute lecture on the socio-ecological implications of nitrogen fixation.

Gerald arrives in your office at 10 a.m. with the serene confidence of someone who has *read everything.* He sits down, sips his green tea, and waits.

> You say: *"Gerald, we have an issue with our new fertilizer."*

He closes his eyes, breathes deeply, and begins:

> *"So, soil fertility is influenced by phosphorus, potassium, pH balance, irrigation patterns, climate cycles, and global agricultural practices…"*

He speaks for **10 minutes**. Not once does he mention **microbial stability**, **carrier media**, **cryoprotectants**, or **shelf-life**.

You thank him. He smiles, proud. You are exhausted.

**💾 Tech Insight**

This is a **raw LLM prompt**.

You ask a too generic question → the model generates patterns from generic knowledge. No company data. No context. No additional question to understand your issue deeply.

→ **High confidence, low relevance.**
→ *Hallucination risk = high.*

---

## 2. Claude

You step out, drained. The second consultant is waiting in the break room. You and Claude walk together. He listens carefully and takes notes. This time, you try harder:

> *"Claude, we're dealing specifically with* ***Bacillus amyloliquefaciens*** *surviving poorly in peat-based carriers at >20 °C. Suggestions?"*

Claude nods thoughtfully:

> *"Consider adding* ***trehalose*** *or* ***glycerol*** *as cryoprotectants to reduce membrane stress during dehydration. Also evaluate humidity-controlled* ***mycelium-based carriers*** *as alternative substrates."*

Finally — **a relevant answer.**

But Claude still doesn't know your supplier constraints, what you've already tested, or your regulatory limits. He guesses well — but he still **guesses**.

**💾 Tech Insight**

This is **prompt engineering**: a precise requirement with context. Provide context and define the role, tone, audience, persona, and output format. Encourage the model to "think" step by step.

**Better input** → **better output**.

But the model still **doesn't know your internal knowledge.**

---

## 3. Victor

The next morning, more confident, you meet **Victor**. Armed with three screens and two cups of cold coffee, he doesn't talk much. You give him **access to your internal "warehouse"**: ten years of lab notebooks, reports, formulation sheets, supplier specs, customer complaints, and stability spreadsheets.

Victor does something different. He doesn't *read* everything — he **organizes meaning**:

- He **scans** your corpus.
- He **chunks** documents into small, meaningful observations (one experiment per chunk).
- He turns each chunk into **geographic coordinates** in a semantic map (embeddings).
- He **indexes** the map, so the closest places can be found fast.

When you ask Victor about the stability issue, he **retrieves the nearest "places"** in the map — the **top-k** most relevant chunks — and uses them to craft an accurate, up-to-date answer grounded in your data.

If needed, he **re-ranks** the candidates to surface the truly best evidence.

**💾 Tech Insight**

What Victor did is the **RAG principle** — Retrieval-Augmented Generation.

```
Document
↓
Chunk into small segments
↓
Embedding (each chunk → vector/coordinates)
↓
Store in a Vector DB (Deep Lake, Pinecone, Chroma…)
↓
Index the vectors for fast retrieval
↓
Query (embed question)
↓
Cosine similarity → retrieve top-k relevant chunks (optionally re-rank)
↓
LLM generates a grounded answer
```

Unlike traditional models that rely on static, pre-trained knowledge, RAG dynamically accesses real-time data.

Your report uses "Bacillus amyloliquefaciens viability trials." But a customer writes "BA32 survival tests." A **vector search** will catch the similarity — because it understands *meaning*, not spelling.

Even if we retrieve the **top-k chunks**, not all of them are equally useful. **Reranking** is an extra filtering step where another model re-evaluates the retrieved chunks and reorders them by true relevance based on the *actual query*.

---

## 4. Félix

Victor's answers are good — **not perfect.** Sometimes a useful protocol is buried; sometimes a less relevant chunk slips in.

So you bring in **Félix.** Félix doesn't add more documents. He adds **signal.** He calls your lab lead and product manager:

*"Which parts of Victor's answer actually helped? Which were useless? Was anything missing? Did the suggested protocol work?"*

He collects **explicit feedback** and **implicit signals** (which chunks your team opened, time on page, which references appeared in the final report). He compares Victor's answers to your ground truth, then **updates the warehouse map**:

- **Boosts** chunks that proved helpful.
- **Down-weights** misleading or redundant chunks.
- Adjusts **top-k** and **re-ranking** thresholds.
- Suggests **re-chunking** where answers drift.
- Tweaks prompts so the LLM cites sources more precisely.

Next time, Victor feels smarter — because **Félix taught the system what your business values.**

**💾 Tech Insight**

RAG is sometimes introduced like a **miracle promise**: *"Simply add an LLM to our documents and you have a knowledge expert."* But getting a RAG system running is one thing. Getting it right — reliable, accurate, and actually useful — is another beast entirely.

This is the **Feedback Loop** (Human-in-the-Loop + evaluation):

First, fetch metrics to catch the **what**. Frameworks like RAGAS give you **faithfulness** (does the answer match the sources?) and **context relevance** (did we retrieve useful stuff?).

Second, catch the **why**. Did the LLM hallucinate? Did it misinterpret subtle wording? Was the source itself ambiguous? This is where automated metrics hand off to human reviewers.

Finally, **act** on this feedback: refine retrieval logic, tune prompts or parameters, update the dataset or embeddings. Closing the loop improves the system.

---

## 5. Agnès

Six months pass. A new problem hits: your fertilizer **clumps during storage** at fluctuating humidity, causing **nozzle clogging** and uneven field application. Complaints rise.

You do **not** want to re-hire the whole committee. You call **Agnès.**

Agnès doesn't restart from zero. She **stands on Victor and Félix's work**. But she has a complete set of tools and methods.

1. **Plan.** She breaks down the problem: cause → tests → mitigation → rollout.
2. **Retrieve.** She asks Victor's system for the best evidence (now **prioritized** thanks to Félix).
3. **Branch.** She adds a **web lookup** for known anti-caking agents in microbial carriers.
4. **Verify.** She cross-checks sources, asks one clarifying question in your lab Slack, and flags any contradictions.
5. **Act.** She drafts a **three-step plan**: reduce carrier moisture below 12% during storage. Evaluate an anti-caking agent (e.g., xanthan gum) in three concentrations. Schedule a 4-point humidity stability test (45/60/75/85% RH, 30 days).
6. **Execute.** She opens **Jira** tasks with owners and due dates, posts the plan in **R&D Slack**, and sets a **checkpoint** in two weeks to review results.

She doesn't just answer. **She moves the work forward.**

**💾 Tech Insight**

This is **Agentic RAG** — RAG + **perception → plan → act → verify** loop.

- **Perception:** retrieve the right internal (Victor) and external knowledge (web scraping).
- **Preference:** apply learned priorities from feedback (Félix).
- **Planning:** choose tools (vector, keyword, web, API), design steps.
- **Action:** create tickets, notify people, kick off tests.
- **Verification:** check outcomes, feed results back into Félix's loop.

Your AI is no longer a **library**. It's an **operations partner.**

These agents leverage agentic design patterns — reflection, planning, tool use, and multi-agent collaboration — to dynamically manage retrieval strategies, iteratively refine contextual understanding, and adapt workflows through clearly defined operational structures ranging from sequential steps to adaptive collaboration.

Agentic RAG offers greater autonomy than traditional RAG but brings major challenges: complex coordination, imperfect retrieval, potential bias and ethical drift, high operational costs, security vulnerabilities, and the need for strong governance and oversight.

---

## The Lesson

*Without RAG, an AI is a smart talker.
With RAG, it becomes a specialist.
With Agentic RAG, it becomes a teammate.*

Your goal is not to build a bigger model — but a **smarter system** that learns, adapts, and collaborates. But even if these solutions sound magic, they raise heavy challenges: industrialization, accuracy, ranking, and content consolidation — reinforcing the need for careful optimization at both the retrieval and generation stages.
