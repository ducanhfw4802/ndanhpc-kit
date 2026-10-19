---
name: ai-rag-patterns
description: Production-grade Retrieval-Augmented Generation (RAG) & LLM engineering patterns. Vector search (pgvector, Pinecone, Qdrant), semantic chunking, hybrid search (BM25 + Dense), reranking, prompt routing, and evaluation.
when_to_use: "When building RAG systems, integrating vector databases, designing chunking strategies, configuring hybrid search or rerankers, implementing tool-calling/agents, or evaluating LLM outputs."
allowed-tools: Read, Write, Edit, Glob, Grep, Bash
version: 1.0.0
---

# AI & RAG Engineering Patterns

> Production-grade architecture for Retrieval-Augmented Generation (RAG), Vector Databases, Semantic Search, and LLM Applications.

---

## 🎯 When to Use This Skill

- Building **RAG (Retrieval-Augmented Generation)** pipelines or semantic search over enterprise documents
- Selecting and optimizing **Vector Databases** (PostgreSQL `pgvector`, Qdrant, Pinecone, Milvus)
- Designing high-recall **Chunking Strategies** (Recursive character, semantic, markdown/AST-aware)
- Implementing **Hybrid Search** (Dense Vector + Sparse BM25 / Full-Text) with **RRF** (Reciprocal Rank Fusion)
- Integrating **Rerankers** (Cohere Rerank, BGE-Reranker) to boost precision
- Managing LLM token budgets, conversation memory, and hallucination guardrails
- Evaluating retrieval and response quality via **RAG Triad** (Faithfulness, Answer Relevance, Context Relevance)

---

## 🏛️ 1. Modern RAG Architecture

```text
User Query
    │
    ├── 1. Query Transformation (HyDE, Sub-queries, Step-Back)
    │
    ├── 2. Hybrid Retrieval
    │       ├── Dense Vector Search (HNSW / Cosine / Dot Product)
    │       └── Sparse Search (BM25 / PostgreSQL tsvector)
    │
    ├── 3. Fusion & Reranking
    │       ├── Reciprocal Rank Fusion (RRF)
    │       └── Cross-Encoder Reranker (Top-K Filter)
    │
    ├── 4. Context Assembly & Compression (Lost-in-the-middle ordering)
    │
    └── 5. LLM Generation with Citations & Guardrails
```

---

## 🗄️ 2. Vector Database & Indexing Strategy

### 2.1 Database Selection Matrix

| Engine | Best For | Storage Type | Scale (Vectors) | Index Types |
| :--- | :--- | :--- | :--- | :--- |
| **PostgreSQL + `pgvector`** | Existing PG databases, relational + vector joins | Embedded / Serverless (Neon/Supabase) | < 10M vectors | HNSW, IVFFlat |
| **Qdrant** | Dedicated vector search, payload filtering, Rust speed | Cloud / Self-hosted Docker | 100M+ vectors | HNSW |
| **Pinecone** | Fully managed serverless, zero maintenance | Cloud SaaS | Billions | Proprietary |
| **Chroma** | Local development, rapid prototyping, unit testing | In-memory / DuckDB | < 500k vectors | HNSW |

### 2.2 PostgreSQL `pgvector` Best Practices (HNSW)

```sql
-- 1. Enable extension
CREATE EXTENSION IF NOT EXISTS vector;

-- 2. Create documents table with metadata
CREATE TABLE document_chunks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_id UUID NOT NULL,
    content TEXT NOT NULL,
    metadata JSONB NOT NULL DEFAULT '{}',
    embedding vector(1536) -- Matches text-embedding-3-small
);

-- 3. Create HNSW Index (Hierarchical Navigable Small World)
-- m: max connections per node (default 16)
-- ef_construction: size of dynamic candidate list (default 64)
CREATE INDEX ON document_chunks USING hnsw (embedding vector_cosine_ops)
WITH (m = 16, ef_construction = 64);

-- 4. Query with cosine distance (<=>)
SELECT id, content, 1 - (embedding <=> $query_embedding) AS similarity
FROM document_chunks
WHERE metadata->>'tenant_id' = $tenant_id
ORDER BY embedding <=> $query_embedding
LIMIT 5;
```

---

## ✂️ 3. Chunking Strategies

Never chunk raw text arbitrarily by fixed character counts without semantic boundaries.

| Strategy | Target Content | Chunk Size | Overlap | Notes |
| :--- | :--- | :--- | :--- | :--- |
| **Recursive Character** | General Prose, Articles | 500 - 1000 tokens | 10 - 20% | Splits on `\n\n`, `\n`, `.`, ` ` |
| **Markdown / Structural** | Docs, Technical Specs | Section-based | Header-linked | Preserves heading hierarchy as chunk metadata |
| **Semantic Chunking** | Long-form narratives | Dynamic | Adaptive | Splits when cosine similarity between sentences drops |
| **Parent-Document / Small-to-Big** | Detailed manuals | 100-token child (index) | N/A | Search on child chunks, feed parent chunk (1000 tokens) to LLM |

---

## 🔍 4. Hybrid Search & Reranking

Dense retrieval understands semantics but struggles with exact identifiers, product codes, or rare terms. Combine Dense + Sparse.

### 4.1 Reciprocal Rank Fusion (RRF) Formula

$$\text{RRF\_Score}(d) = \sum_{m \in M} \frac{1}{k + \text{rank}_m(d)}$$
*(where $k = 60$ is standard)*

### 4.2 Two-Stage Retrieval Pattern (Python)

```python
def retrieve_context(query: str, top_k: int = 5) -> list[dict]:
    # Stage 1: Broad retrieval (Fetch 25 candidates)
    dense_results = vector_db.similarity_search(query, k=25)
    sparse_results = keyword_search.bm25_search(query, k=25)
    
    # Stage 2: Merge candidates via RRF
    merged_candidates = reciprocal_rank_fusion([dense_results, sparse_results], k=60)
    
    # Stage 3: Cross-Encoder Reranking
    reranked = reranker.rerank(
        query=query,
        documents=[c["content"] for c in merged_candidates[:15]],
        top_n=top_k
    )
    return reranked
```

---

## 🛡️ 5. Hallucination Mitigation & Guardrails

1. **System Prompt Constraint**:
   ```markdown
   Answer the question ONLY based on the provided context below.
   If the answer cannot be determined from the context, state:
   "I do not have sufficient information in the provided context to answer."
   Do NOT assume or extrapolate facts not present in the sources.
   ```
2. **Context Placement (Lost in the Middle)**: Place the most relevant chunks at the very beginning and very end of the prompt context window.
3. **Structured Citation Outputs**: Require the model to output source chunk IDs alongside factual claims.

---

## 📊 6. RAG Evaluation Metrics (The RAG Triad)

| Metric | Target | Evaluates | How to Improve |
| :--- | :--- | :--- | :--- |
| **Context Relevance** | Retrieval | Are retrieved chunks relevant to query? | Tune embeddings, add hybrid search + reranker |
| **Groundedness / Faithfulness** | Generation | Is the answer strictly derived from context? | Tighten system prompt, add verification step |
| **Answer Relevance** | Generation | Does the answer directly address user's intent? | Query rewriting, sub-query generation |
