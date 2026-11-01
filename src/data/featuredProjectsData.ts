export interface FeaturedProject {
  id: string;
  index: string;
  domainTag: string;
  title: string;
  tagline: string;
  overview: string;
  categories: ('ALL' | 'AI' | 'ML' | 'SDE' | 'Client Based')[];
  keyFeatures: string[];
  technologies: string[];
  githubUrl?: string;
  liveUrl?: string;
  isPrivate?: boolean;
  statusBadge?: string;
}

export const FEATURED_PROJECTS: FeaturedProject[] = [
  {
    id: 'policy-rag-platform',
    index: '01',
    domainTag: '01 ──── GenAI • Enterprise RAG',
    title: 'Enterprise Policy Intelligence RAG Platform',
    tagline: 'Enterprise compliance RAG platform with hybrid search & citation verification.',
    overview:
      'Enterprise policy intelligence pipeline over compliance documentation with layout-aware parsing and factual guardrails.',
    categories: ['ALL', 'AI'],
    keyFeatures: [
      'Layout-aware PDF parsing',
      'Hybrid semantic retrieval',
      'Cross-encoder reranking',
      'LLM citation guardrails',
      'Structured output generation',
    ],
    technologies: ['LangChain', 'Gemini', 'ChromaDB', 'FastAPI', 'Next.js', 'Python', 'BM25', 'Pydantic'],
    githubUrl: 'https://github.com/neeraj16-dev/enterprise-policy-rag',
    liveUrl: 'https://github.com/neeraj16-dev/enterprise-policy-rag',
  },
  {
    id: 'ticket-router-system',
    index: '02',
    domainTag: '02 ──── ML / AI • Smart Routing System',
    title: 'Cost-Aware IT Support Ticket Router',
    tagline: 'Intelligent ticket routing with semantic classification & LLM cost optimization.',
    overview:
      'Automated support ticket triage classifying inquiries and routing ambiguous cases to cost-effective fallbacks.',
    categories: ['ALL', 'AI', 'ML'],
    keyFeatures: [
      'Semantic ticket classification',
      'Cost-aware fallback routing',
      'Role-based access control',
      'Human-in-the-loop feedback',
      'Token usage monitoring',
    ],
    technologies: ['XGBoost', 'LangChain', 'Sentence-Transformers', 'FastAPI', 'Next.js', 'Python', 'JWT', 'RBAC', 'LangSmith'],
    githubUrl: 'https://github.com/neeraj16-dev/cost-aware-it-support-router',
    liveUrl: 'https://github.com/neeraj16-dev/cost-aware-it-support-router',
  },
  {
    id: 'fraud-detection-engine',
    index: '03',
    domainTag: '03 ──── ML • Event Streaming Engine',
    title: 'Real-Time Fraud Transaction Detection',
    tagline: 'Streaming fraud detection pipeline with Kafka & explainable ML inference.',
    overview:
      'Event-driven transaction processing system delivering real-time fraud scoring and SHAP feature explanations.',
    categories: ['ALL', 'ML', 'SDE'],
    keyFeatures: [
      'Real-time event streaming',
      'XGBoost fraud classification',
      'SHAP feature explanations',
      'Interactive prediction dashboard',
    ],
    technologies: ['XGBoost', 'Apache Kafka', 'FastAPI', 'Next.js', 'Docker', 'Python', 'SHAP'],
    githubUrl: 'https://github.com/neeraj16-dev/fraud-transactions-api',
    liveUrl: 'https://github.com/neeraj16-dev/fraud-transactions-api',
  },
  {
    id: 'churn-predictor',
    index: '04',
    domainTag: '04 ──── ML • Predictive Analytics & MLOps',
    title: 'Telecom Customer Churn Predictor',
    tagline: 'End-to-end churn prediction pipeline with MLflow tracking & cloud deployment.',
    overview:
      'Predictive customer analytics pipeline benchmarking classification models with automated tracking and inference.',
    categories: ['ALL', 'ML'],
    keyFeatures: [
      'ML model benchmarking',
      'MLflow experiment tracking',
      'Real-time inference dashboard',
      'Automated deployment pipeline',
    ],
    technologies: ['Random Forest', 'MLflow', 'FastAPI', 'Next.js', 'AWS EC2', 'Docker', 'scikit-learn', 'TypeScript', 'Python'],
    githubUrl: 'https://github.com/neeraj16-dev/telecom-churn-api',
    liveUrl: 'https://github.com/neeraj16-dev/telecom-churn-api',
  },
  {
    id: 'football-academy-erp',
    index: '05',
    domainTag: '05 ──── Client Based • Sports ERP Platform',
    title: 'Football Academy Management System',
    tagline: 'Multi-module sports academy ERP with role-based staff & player workflows.',
    overview:
      'Comprehensive academy management system for multi-branch operations, player tracking, and administrative reporting.',
    categories: ['ALL', 'Client Based', 'SDE'],
    isPrivate: true,
    statusBadge: 'Private Client Repository',
    keyFeatures: [
      'Multi-branch operations',
      'Player & attendance tracking',
      'Role-based dashboards',
      'Automated CI/CD pipelines',
    ],
    technologies: ['Django', 'PostgreSQL', 'Next.js', 'Docker', 'JWT', 'RBAC', 'GitHub Actions', 'Python'],
  },
  {
    id: 'dairy-erp-system',
    index: '06',
    domainTag: '06 ──── SDE • Enterprise Resource Planning',
    title: 'Dairy ERP System',
    tagline: 'Full-lifecycle dairy ERP managing milk collection, batching & farmer payouts.',
    overview:
      'Multi-module enterprise resource planning system covering milk collection, inventory batching, and dynamic billing.',
    categories: ['ALL', 'SDE'],
    keyFeatures: [
      'Farmer & billing records',
      'Multi-stage inventory tracking',
      'Automated payout calculation',
      'Secure customer ordering',
    ],
    technologies: ['Java', 'Spring Boot', 'PostgreSQL', 'Next.js', 'Hibernate', 'REST APIs'],
    githubUrl: 'https://github.com/neeraj16-dev/dairy-erp',
    liveUrl: 'https://github.com/neeraj16-dev/dairy-erp',
  },
  {
    id: 'employee-management-system',
    index: '07',
    domainTag: '07 ──── SDE • Full Stack MERN System',
    title: 'Employee Management System',
    tagline: 'Hierarchical workforce platform for attendance, leave approval & team operations.',
    overview:
      'Full-stack organization portal managing attendance, multi-level reporting hierarchies, and department workflows.',
    categories: ['ALL', 'SDE'],
    keyFeatures: [
      'Attendance & leave tracking',
      'Multi-level reporting hierarchy',
      'Department & team management',
    ],
    technologies: ['MongoDB', 'Express.js', 'React', 'Node.js', 'JavaScript', 'REST APIs'],
    githubUrl: 'https://github.com/neeraj16-dev/employee-management-system',
    liveUrl: 'https://github.com/neeraj16-dev/employee-management-system',
  },
];
