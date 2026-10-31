export type ProjectCategory = 'all' | 'ai' | 'fullstack' | 'infra' | 'webgl' | 'cloud';

export type SpecializationKey = 'ai' | 'fullstack' | 'infra';

export interface SpecializationTab {
  key: SpecializationKey;
  label: string;
  badge: string;
  countLabel: string;
  description: string;
  accent: string;
}

export const SPECIALIZATION_TABS: SpecializationTab[] = [
  {
    key: 'ai',
    label: 'AI & Agents',
    badge: '[01]',
    countLabel: 'AUTONOMOUS SYSTEMS',
    description: 'Multi-agent loops, tool orchestration, streaming LLM workflows, and semantic vector graphs.',
    accent: '#00F0FF',
  },
  {
    key: 'fullstack',
    label: 'Full Stack',
    badge: '[02]',
    countLabel: 'CLIENT & SERVER',
    description: 'React 19, Next.js, WebGL spatial canvases, microservices, and sub-100ms fluid web apps.',
    accent: '#38BDF8',
  },
  {
    key: 'infra',
    label: 'Infra & DB',
    badge: '[03]',
    countLabel: 'DISTRIBUTED DATA',
    description: 'High-throughput telemetry, pgvector hybrid search, distributed Redis queues, and resilient databases.',
    accent: '#FFB703',
  },
];

export const normalizeProjectSpecialization = (category: ProjectCategory): SpecializationKey => {
  if (category === 'ai') return 'ai';
  if (category === 'infra' || category === 'cloud') return 'infra';
  return 'fullstack';
};

export interface ProjectMetric {
  label: string;
  value: string;
  detail?: string;
}

export interface Project {
  id: string;
  title: string;
  subtitle: string;
  category: ProjectCategory;
  categoryLabel: string;
  year: string;
  featured: boolean;
  description: string;
  challenge: string;
  solution: string;
  architectureNotes: string[];
  metrics: ProjectMetric[];
  techStack: string[];
  demoUrl?: string;
  githubUrl?: string;
  accentColor: string;
  previewType: 'agent' | 'shader' | 'vector' | 'telemetry' | 'workflow';
}

export const PROJECTS_DATA: Project[] = [
  // ─── Specialization: AI & Agents ──────────────────────────────────────────
  {
    id: 'neuroagent-engine',
    title: 'NeuroAgent Engine',
    subtitle: 'Autonomous Multi-Agent Workflow Orchestrator',
    category: 'ai',
    categoryLabel: 'AI & Autonomous Systems',
    year: '2026',
    featured: true,
    description:
      'A distributed agent runtime engine executing multi-step reasoning chains with real-time tool calling, memory compression, and deterministic execution verification.',
    challenge:
      'Large multi-turn agent conversations frequently suffered from prompt context exhaustion, hallucinated API arguments, and slow synchronous tool execution.',
    solution:
      'Engineered a streaming DAG execution planner in Python/FastAPI with LangChain and Redis state streaming. Integrated Pydantic schemas for deterministic tool validation and automated context window sliding.',
    architectureNotes: [
      'Async event-driven execution DAG via Redis Streams',
      'Dynamic token budget sliding window with automatic summarization',
      'Deterministic JSON schema validation for 100% reliable tool calling',
      'Sub-90ms P90 tool execution dispatch with fallback failover',
    ],
    metrics: [
      { label: 'Dispatch Latency', value: '85ms', detail: 'P90 latency' },
      { label: 'Token Throughput', value: '4.2M', detail: 'tokens / day' },
      { label: 'Execution Reliability', value: '99.98%', detail: 'zero crash rate' },
    ],
    techStack: ['Python', 'FastAPI', 'Gemini 2.5 Pro', 'LangChain', 'Redis Streams', 'Docker'],
    demoUrl: 'https://github.com/neerajmayekar',
    githubUrl: 'https://github.com/neerajmayekar/neuroagent-engine',
    accentColor: '#00F0FF',
    previewType: 'agent',
  },
  {
    id: 'chronos-automator',
    title: 'Chronos Workflow Copilot',
    subtitle: 'Multimodal Browser Agent & Test Synthesizer',
    category: 'ai',
    categoryLabel: 'AI & Autonomous Systems',
    year: '2025',
    featured: false,
    description:
      'An intelligent browser automation agent that consumes natural language goals, analyzes accessibility trees, and executes resilient end-to-end user journeys.',
    challenge:
      'Traditional XPath and CSS selector test scripts break constantly upon slight UI revisions, requiring endless maintenance.',
    solution:
      'Utilized multimodal vision and semantic accessibility tree nodes with self-healing selector fallback heuristics, boosting automation test longevity.',
    architectureNotes: [
      'DOM Accessibility Tree parsing with visual spatial bounding box fusion',
      'Self-healing selectors using semantic embedding similarity',
      'Automated Playwright code generation from interactive recordings',
      'Sandboxed parallel execution in headless Chromium clusters',
    ],
    metrics: [
      { label: 'Task Success', value: '94.2%', detail: 'autonomous completion' },
      { label: 'Maintenance', value: '-80%', detail: 'less script repair time' },
      { label: 'Parallel Runners', value: '32', detail: 'concurrent instances' },
    ],
    techStack: ['TypeScript', 'Playwright', 'Gemini Multimodal', 'Node.js', 'Tailwind CSS'],
    demoUrl: 'https://github.com/neerajmayekar',
    githubUrl: 'https://github.com/neerajmayekar/chronos-copilot',
    accentColor: '#38BDF8',
    previewType: 'workflow',
  },
  {
    id: 'cortex-eval-guard',
    title: 'CortexGuard Eval Suite',
    subtitle: 'Deterministic LLM Evaluation & Safety Guardrails',
    category: 'ai',
    categoryLabel: 'AI & Autonomous Systems',
    year: '2025',
    featured: false,
    description:
      'Automated latency, hallucination detection, and policy-compliance validation harness for production LLM endpoints with offline regression gates.',
    challenge:
      'Prompt regressions and non-deterministic model updates frequently escaped CI/CD without automated semantic verification benchmarks.',
    solution:
      'Engineered an automated synthetic evaluation matrix with dual-critic LLM judges, token entropy tracking, and strict JSON structural validators.',
    architectureNotes: [
      'Synthetic test fixture generation via AST-based prompt perturbation',
      'Dual-critic consensus scoring with statistical variance rejection',
      'Zero-overhead streaming interceptor for live production anomaly tagging',
      'Self-contained Dockerized CI test runner with parallel batch execution',
    ],
    metrics: [
      { label: 'Eval Speed', value: '450 t/s', detail: 'parallel token analysis' },
      { label: 'FPR Reduction', value: '92.4%', detail: 'false positive reduction' },
      { label: 'CI Pipeline Duration', value: '< 90s', detail: '1,000 test cases' },
    ],
    techStack: ['Python', 'Pydantic v2', 'PyTest', 'FastAPI', 'Gemini Flash', 'ClickHouse'],
    demoUrl: 'https://github.com/neerajmayekar',
    githubUrl: 'https://github.com/neerajmayekar/cortexguard-eval',
    accentColor: '#00F0FF',
    previewType: 'agent',
  },

  // ─── Specialization: Full Stack ───────────────────────────────────────────
  {
    id: 'spectragl-studio',
    title: 'SpectraGL Spatial Studio',
    subtitle: 'Interactive 3D WebGL Shader & Particle Synthesizer',
    category: 'fullstack',
    categoryLabel: 'Full Stack & Spatial Web',
    year: '2025',
    featured: true,
    description:
      'High-performance WebGL 3D spatial canvas featuring custom GLSL raymarching shaders, audio-reactive bloom post-processing, and interactive spring physics.',
    challenge:
      'Rendering dense procedural particle meshes with complex dynamic lighting caused severe frame drops on lower-spec mobile and GPU devices.',
    solution:
      'Authored instanced vertex shaders and computed light reflections directly on the GPU using custom GLSL fragments, offloading calculation from the main JS thread and ensuring locked 60/120fps.',
    architectureNotes: [
      'Custom instanced GPU vertex transforms for 40,000+ interactive particles',
      'Multi-pass post-processing pipeline: UnrealBloom, chromatic aberration, grain',
      'Pointer-reactive inertial springs mapped via GSAP & requestAnimationFrame',
      'Zero layout reflow: pure GPU-bound rendering within isolated WebGL contexts',
    ],
    metrics: [
      { label: 'Frame Rate', value: '120 FPS', detail: 'locked refresh' },
      { label: 'Frame Budget', value: '< 8.2ms', detail: 'zero GPU spikes' },
      { label: 'Active Instances', value: '45,000', detail: 'procedural particles' },
    ],
    techStack: ['Three.js', 'WebGL', 'GLSL Shaders', 'React 19', 'GSAP', 'TypeScript'],
    demoUrl: 'https://github.com/neerajmayekar',
    githubUrl: 'https://github.com/neerajmayekar/spectragl-studio',
    accentColor: '#A855F7',
    previewType: 'shader',
  },
  {
    id: 'pulsestream-edge',
    title: 'PulseStream Telemetry Cloud',
    subtitle: 'Distributed Edge Observability & Anomaly Radar',
    category: 'fullstack',
    categoryLabel: 'Full Stack & Infrastructure',
    year: '2025',
    featured: false,
    description:
      'Real-time telemetry and microservices monitoring platform processing 250,000+ metrics per second with live SVG stream graphs and instant anomaly alerts.',
    challenge:
      'Visualizing hundreds of real-time time-series streams in browser dashboards caused excessive DOM nodes and garbage collection freezes.',
    solution:
      'Implemented off-screen Canvas chunk rendering with sliding buffer circular arrays and ultra-lightweight binary WebSocket frames.',
    architectureNotes: [
      'Binary WebSocket frames minimizing wire payload overhead by 68%',
      'Ring buffer memory allocation preventing garbage collection pauses',
      'Sub-millisecond sliding window statistical anomaly computation',
      'Automated PagerDuty and Slack webhook alert dispatches',
    ],
    metrics: [
      { label: 'Ingest Rate', value: '250k', detail: 'events / second' },
      { label: 'Wire Reduction', value: '68%', detail: 'binary WebSocket frames' },
      { label: 'P99 Latency', value: '< 15ms', detail: 'ingest to visualization' },
    ],
    techStack: ['Node.js', 'ClickHouse', 'WebSockets', 'Tailwind CSS', 'React 19', 'Docker'],
    demoUrl: 'https://github.com/neerajmayekar',
    githubUrl: 'https://github.com/neerajmayekar/pulsestream-telemetry',
    accentColor: '#F59E0B',
    previewType: 'telemetry',
  },
  {
    id: 'nexus-canvas-realtime',
    title: 'NexusCanvas Spatial Engine',
    subtitle: 'Multiplayer Collaborative Infinite Canvas with CRDT',
    category: 'fullstack',
    categoryLabel: 'Full Stack & Spatial Web',
    year: '2025',
    featured: false,
    description:
      'Real-time infinite workspace powered by conflict-free replicated data types (CRDTs), optimistic local mutation previews, and sub-40ms spatial synchronization.',
    challenge:
      'Network jitter and simultaneous multi-cursor edits caused visual tearing, cursor jumping, and document conflict desynchronization.',
    solution:
      'Built a Yjs binary protocol over secure WebSockets with peer-to-peer WebRTC fallback and dirty-region quadtree canvas rendering.',
    architectureNotes: [
      'State-based Yjs CRDT synchronization with linear undo/redo trees',
      'Quadtree spatial indexing for 60fps pan/zoom over 100,000 vectors',
      'WebRTC Datachannels for ultra-low latency peer cursor broadcasts',
      'Persistent RocksDB snapshot storage with instant Delta replay',
    ],
    metrics: [
      { label: 'Sync Latency', value: '28ms', detail: 'P95 global mesh' },
      { label: 'Concurrent Users', value: '500+', detail: 'per canvas room' },
      { label: 'Render Budget', value: '16ms', detail: 'locked 60 FPS' },
    ],
    techStack: ['TypeScript', 'React 19', 'Canvas API', 'Yjs', 'WebSockets', 'Tailwind CSS'],
    demoUrl: 'https://github.com/neerajmayekar',
    githubUrl: 'https://github.com/neerajmayekar/nexus-canvas',
    accentColor: '#38BDF8',
    previewType: 'workflow',
  },

  // ─── Specialization: Infra & DB ───────────────────────────────────────────
  {
    id: 'omnivector-hybrid',
    title: 'OmniVector Semantic Graph',
    subtitle: 'Enterprise Hybrid Dense-Sparse RAG Pipeline',
    category: 'infra',
    categoryLabel: 'Vector Databases & RAG',
    year: '2025',
    featured: false,
    description:
      'Enterprise knowledge retrieval engine combining dense vector embeddings with sparse BM25 lexical search and Cross-Encoder re-ranking for ultra-precise retrieval.',
    challenge:
      'Pure vector embeddings often misranked exact keywords, SKU codes, and acronyms, leading to inaccurate context injected into downstream LLM responses.',
    solution:
      'Designed a two-stage hybrid retrieval architecture combining pgvector cosine distance and PostgreSQL full-text search, scored using Reciprocal Rank Fusion (RRF).',
    architectureNotes: [
      'Two-stage hybrid retrieval combining pgvector with BM25 full-text indexing',
      'Reciprocal Rank Fusion (RRF) with Cross-Encoder reranking tier',
      'Hierarchical chunking with metadata inheritance for document context preservation',
      'Streaming token hydration direct to client via Server-Sent Events (SSE)',
    ],
    metrics: [
      { label: 'Recall@5 Boost', value: '+38%', detail: 'vs pure vector baseline' },
      { label: 'Query Latency', value: '42ms', detail: 'hybrid search roundtrip' },
      { label: 'Index Capacity', value: '1.5M', detail: 'indexed embeddings' },
    ],
    techStack: ['PostgreSQL', 'pgvector', 'Next.js 15', 'TypeScript', 'Drizzle ORM', 'Docker'],
    demoUrl: 'https://github.com/neerajmayekar',
    githubUrl: 'https://github.com/neerajmayekar/omnivector-rag',
    accentColor: '#10B981',
    previewType: 'vector',
  },
  {
    id: 'hyperkv-distributed-cache',
    title: 'HyperKV In-Memory Engine',
    subtitle: 'Zero-GC Distributed Key-Value Store with Raft',
    category: 'infra',
    categoryLabel: 'Distributed Infrastructure & DB',
    year: '2024',
    featured: false,
    description:
      'High-throughput distributed in-memory key-value store implementing leader-elected Raft consensus, memory-mapped disk snapshots, and sub-millisecond p99 lookups.',
    challenge:
      'JVM/GC pauses in traditional cache layers caused latency spikes exceeding 150ms under heavy concurrent read-write storms.',
    solution:
      'Engineered an off-heap memory arena with atomic CAS operations, epoll-based asynchronous I/O, and append-only write-ahead logging (WAL).',
    architectureNotes: [
      'Leader-elected Raft consensus with automated split-brain recovery',
      'Zero-allocation memory arena eliminating garbage collection overhead',
      'Append-only Write-Ahead Log (WAL) with periodic background compaction',
      'Lock-free concurrent skiplist supporting 800,000 QPS on a 4-core node',
    ],
    metrics: [
      { label: 'Throughput', value: '820k QPS', detail: 'per 4-core instance' },
      { label: 'P99 Latency', value: '0.85ms', detail: 'zero GC jitter' },
      { label: 'Recovery Time', value: '< 2.4s', detail: 'from 10GB snapshot' },
    ],
    techStack: ['Go', 'Raft Consensus', 'mmap', 'Docker', 'Linux epoll', 'Prometheus'],
    demoUrl: 'https://github.com/neerajmayekar',
    githubUrl: 'https://github.com/neerajmayekar/hyperkv-store',
    accentColor: '#FFB703',
    previewType: 'telemetry',
  },
  {
    id: 'axiom-cdc-pipeline',
    title: 'AxiomCDC Event Streamer',
    subtitle: 'High-Throughput Change-Data-Capture & Lakehouse Sync',
    category: 'infra',
    categoryLabel: 'Distributed Infrastructure & DB',
    year: '2024',
    featured: false,
    description:
      'Scalable Change-Data-Capture (CDC) gateway streaming PostgreSQL write-ahead log events directly into Apache Kafka and compressed S3 Parquet partitions in real time.',
    challenge:
      'Batch ETL cron jobs overloaded production OLTP databases during peak operating hours and introduced 4-hour data staleness.',
    solution:
      'Utilized logical decoding via test_decoding/pgoutput with schema evolution tracking and backpressure-managed streaming buffers.',
    architectureNotes: [
      'Native logical replication decoding with zero table-locking impact',
      'Kafka cluster integration with strict at-least-once delivery guarantees',
      'Dynamic Snappy/ZSTD compressed Parquet columnar writes direct to S3',
      'Automatic schema migration drift detection and dead-letter queue routing',
    ],
    metrics: [
      { label: 'Replication Lag', value: '< 180ms', detail: 'from OLTP commit to Kafka' },
      { label: 'Compression Ratio', value: '4.8x', detail: 'Parquet vs JSON' },
      { label: 'Monthly Volume', value: '1.2B', detail: 'processed row mutations' },
    ],
    techStack: ['Python', 'PostgreSQL WAL', 'Apache Kafka', 'DuckDB', 'AWS S3', 'Terraform'],
    demoUrl: 'https://github.com/neerajmayekar',
    githubUrl: 'https://github.com/neerajmayekar/axiom-cdc',
    accentColor: '#F59E0B',
    previewType: 'vector',
  },
];
