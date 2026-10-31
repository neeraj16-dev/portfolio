export type StackCategory = 'all' | 'fullstack' | 'ai' | 'spatial' | 'cloud';

export interface TechItem {
  id: string;
  name: string;
  category: StackCategory;
  categoryLabel: string;
  proficiency: string;
  experience: string;
  description: string;
  highlight: string;
}

export const DEFAULT_TECH_STACK: TechItem[] = [
  {
    id: 'ai-agents',
    name: 'Agentic AI & LLMs',
    category: 'ai',
    categoryLabel: 'AI & Intelligence',
    proficiency: 'Expert',
    experience: '4+ Years in GenAI',
    description: 'Orchestrating multi-agent systems, function calling, structured outputs, and real-time streaming workflows.',
    highlight: 'Gemini 2.5/Flash, OpenAI SDK, LangChain, Tool Use',
  },
  {
    id: 'rag-vector',
    name: 'RAG & Vector Pipelines',
    category: 'ai',
    categoryLabel: 'AI & Intelligence',
    proficiency: 'Advanced',
    experience: '3+ Years',
    description: 'Semantic search, hybrid vector retrieval, embeddings indexing, and context window optimization.',
    highlight: 'Pinecone, pgvector, Chroma, Chunking Strategies',
  },
  {
    id: 'react-next',
    name: 'Next.js & React 19',
    category: 'fullstack',
    categoryLabel: 'Full Stack Core',
    proficiency: 'Mastery',
    experience: '6+ Years',
    description: 'Server Components (RSC), Server Actions, high-performance client rendering, and state management.',
    highlight: 'TypeScript, Tailwind CSS, SSR/SSG, Zustand',
  },
  {
    id: 'node-python',
    name: 'Node.js & Python',
    category: 'fullstack',
    categoryLabel: 'Full Stack Core',
    proficiency: 'Mastery',
    experience: '6+ Years',
    description: 'Scalable REST & WebSocket servers, asynchronous queues, background worker jobs, and microservices.',
    highlight: 'FastAPI, Express, tRPC, WebSocket Streaming',
  },
  {
    id: 'three-webgl',
    name: 'WebGL & Three.js',
    category: 'spatial',
    categoryLabel: 'Spatial & WebGL',
    proficiency: 'Advanced',
    experience: '4+ Years',
    description: 'Custom fragment & vertex shaders, particle systems, interactive 3D physics, and GSAP ScrollTrigger choreography.',
    highlight: 'GLSL, Three.js, Canvas 2D, GSAP Flip/ScrollTrigger',
  },
  {
    id: 'cloud-db',
    name: 'PostgreSQL & Cloud Infrastructure',
    category: 'cloud',
    categoryLabel: 'Cloud & Infrastructure',
    proficiency: 'Advanced',
    experience: '5+ Years',
    description: 'ACID relational modeling, high-concurrency Redis caching, Docker containerization, and edge deployments.',
    highlight: 'PostgreSQL, Drizzle/Prisma, Redis, Docker, Cloud Run',
  },
];
