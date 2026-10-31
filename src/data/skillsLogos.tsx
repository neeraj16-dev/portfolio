import antigravityLogo from '../data/Google-Antigravity-Icon-Full-Color.png'; // Adjust the relative path if needed
import nextjslogo from '../data/icons8-next.js-48.png';

export interface SkillLogoItem {
  name: string;
  logoUrl: string;
}

// Complete verified 38 skills with official SVG logos
export const ALL_SKILLS_LOGOS: SkillLogoItem[] = [
  // Ticker 1: Languages, Core Web & Full Stack Frameworks, Databases & DevOps (19 Skills)
  {
    name: 'Python',
    logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/python/python-original.svg',
  },
  {
    name: 'Java',
    logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/java/java-original.svg',
  },
  {
    name: 'Javascript',
    logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-original.svg',
  },
  {
    name: 'HTML',
    logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/html5/html5-original.svg',
  },
  {
    name: 'CSS',
    logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/css3/css3-original.svg',
  },
  {
    name: 'React',
    logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg',
  },
  {
    name: 'Next.js',
    logoUrl: nextjslogo,
  },
  {
    name: 'Node.js',
    logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nodejs/nodejs-original.svg',
  },
  {
    name: 'Express.js',
    logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/express/express-original.svg',
  },
  {
    name: 'FastAPI',
    logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/fastapi/fastapi-original.svg',
  },
  {
    name: 'Django',
    logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/django/django-plain.svg',
  },
  {
    name: 'PostgreSQL',
    logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/postgresql/postgresql-original.svg',
  },
  {
    name: 'MongoDB',
    logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mongodb/mongodb-original.svg',
  },
  {
    name: 'SQL',
    logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/sqldeveloper/sqldeveloper-original.svg',
  },
  {
    name: 'Docker',
    logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/docker/docker-original.svg',
  },
  {
    name: 'Linux',
    logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/linux/linux-original.svg',
  },
  {
    name: 'Git',
    logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/git/git-original.svg',
  },

  // Ticker 2: Cloud, AI / ML, LLM Frameworks & Modern Tooling (19 Skills)
  {
    name: 'LangChain',
    logoUrl: 'https://cdn.jsdelivr.net/npm/simple-icons@v14/icons/langchain.svg',
  },
  {
    name: 'LangGraph',
    logoUrl: 'https://cdn.jsdelivr.net/npm/simple-icons@v14/icons/langgraph.svg',
  },
  {
    name: 'LangSmith',
    logoUrl: 'https://unpkg.com/@lobehub/icons-static-svg@latest/icons/langsmith.svg',
  },
  {
    name: 'ChromaDB',
    logoUrl: 'https://cdn.jsdelivr.net/gh/homarr-labs/dashboard-icons/svg/chroma.svg',
  },
  {
    name: 'GitHub',
    logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/github/github-original.svg',
  },
  {
    name: 'GitHub Actions',
    logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/githubactions/githubactions-original.svg',
  },
  {
    name: 'Trae',
    logoUrl: 'https://unpkg.com/@lobehub/icons-static-svg@latest/icons/trae.svg',
  },
  {
    name: 'Stitch',
    logoUrl: 'https://www.vectorlogo.zone/logos/stitchdata/stitchdata-icon.svg',
  },
  {
    name: 'Antigravity',
    logoUrl: antigravityLogo,
  },
];

// Ticker 1: Languages, Full Stack, Databases & DevOps (19 Skills)
export const TICKER_ROW_1: SkillLogoItem[] = ALL_SKILLS_LOGOS.slice(0, 19);

// Ticker 2: Cloud, AI / ML, Vector DBs, Agents & Data Science (19 Skills)
export const TICKER_ROW_2: SkillLogoItem[] = ALL_SKILLS_LOGOS.slice(19, 38);

export interface CircularCarouselItem {
  src: string;
  alt: string;
  title: string;
  subtitle: string;
  isMonochrome?: boolean;
}

const SKILL_SUBTITLES: Record<string, string> = {
  Python: 'Programming Language',
  Java: 'Programming Language',
  Javascript: 'Programming Language',
  'C++': 'Systems Programming',
  HTML: 'Markup Language',
  CSS: 'Styling & Design',
  React: 'Frontend Library',
  'Next.js': 'Full Stack Framework',
  'Node.js': 'Runtime Environment',
  'Express.js': 'Backend Framework',
  FastAPI: 'Python API Framework',
  Django: 'Full Stack Framework',
  'Spring Boot': 'Enterprise Framework',
  PostgreSQL: 'Relational Database',
  MongoDB: 'NoSQL Database',
  SQL: 'Database Querying',
  Docker: 'Containerization',
  Linux: 'Operating System',
  Git: 'Version Control',
  Gemini: 'Multimodal AI',
  LangChain: 'LLM Orchestration',
  LangGraph: 'Multi-Agent Workflows',
  LangSmith: 'LLM Observability',
  ChromaDB: 'Vector Database',
  'Sentence Transformers': 'Embeddings',
  'Scikit-learn': 'Machine Learning',
  XGBoost: 'Gradient Boosting',
  NumPy: 'Numerical Computing',
  Pandas: 'Data Analysis',
  Matplotlib: 'Data Visualization',
  Seaborn: 'Statistical Graphics',
  AWS: 'Cloud Infrastructure',
  'Apache Kafka': 'Event Streaming',
  GitHub: 'Code Repository',
  'GitHub Actions': 'CI/CD Automation',
  Trae: 'AI IDE',
  Stitch: 'Design Systems',
  Antigravity: 'Advanced Agentic AI',
};

const MONOCHROME_SKILLS = new Set([
  'GitHub',
  'LangChain',
  'LangGraph',
  'LangSmith',
  'Trae',
  'Express.js',
]);

// 3D Circular Carousel Skill Items with Titles, Subtitles and Logos
export const CIRCULAR_CAROUSEL_SKILLS: CircularCarouselItem[] = ALL_SKILLS_LOGOS.map((skill) => ({
  src: skill.logoUrl,
  alt: skill.name,
  title: skill.name,
  subtitle: SKILL_SUBTITLES[skill.name] || 'Technology',
  isMonochrome: MONOCHROME_SKILLS.has(skill.name),
}));

export type SkillCategoryKey = 'languages' | 'frameworks' | 'databases' | 'tools';

export const SKILL_CATEGORY_MAP: Record<string, SkillCategoryKey> = {
  // Languages
  Python: 'languages',
  Java: 'languages',
  Javascript: 'languages',
  HTML: 'languages',
  CSS: 'languages',
  'C++': 'languages',

  // Frameworks
  React: 'frameworks',
  'Next.js': 'frameworks',
  'Node.js': 'frameworks',
  'Express.js': 'frameworks',
  FastAPI: 'frameworks',
  Django: 'frameworks',
  'Spring Boot': 'frameworks',
  LangChain: 'frameworks',
  LangGraph: 'frameworks',
  'Sentence Transformers': 'frameworks',

  // Databases
  PostgreSQL: 'databases',
  MongoDB: 'databases',
  ChromaDB: 'databases',
  SQL: 'databases',

  // Tools
  Docker: 'tools',
  Linux: 'tools',
  Git: 'tools',
  GitHub: 'tools',
  'GitHub Actions': 'tools',
  LangSmith: 'tools',
  Trae: 'tools',
  Stitch: 'tools',
  Antigravity: 'tools',
  AWS: 'tools',
  'Apache Kafka': 'tools',
};

export interface SkillCategoryGroup {
  id: SkillCategoryKey;
  title: string;
  subtitle: string;
  badge: string;
  skills: string[];
}

export const getSkillCategories = (): SkillCategoryGroup[] => [
  {
    id: 'languages',
    title: 'Languages',
    subtitle: 'Core Programming & Scripting',
    badge: '01',
    skills: ALL_SKILLS_LOGOS.filter((s) => SKILL_CATEGORY_MAP[s.name] === 'languages').map((s) => s.name),
  },
  {
    id: 'frameworks',
    title: 'Frameworks',
    subtitle: 'Full Stack & AI Architectures',
    badge: '02',
    skills: ALL_SKILLS_LOGOS.filter((s) => SKILL_CATEGORY_MAP[s.name] === 'frameworks').map((s) => s.name),
  },
  {
    id: 'databases',
    title: 'Databases',
    subtitle: 'Relational, NoSQL & Vector Stores',
    badge: '03',
    skills: ALL_SKILLS_LOGOS.filter((s) => SKILL_CATEGORY_MAP[s.name] === 'databases').map((s) => s.name),
  },
  {
    id: 'tools',
    title: 'Tools',
    subtitle: 'DevOps, CI/CD & AI Platforms',
    badge: '04',
    skills: ALL_SKILLS_LOGOS.filter((s) => SKILL_CATEGORY_MAP[s.name] === 'tools').map((s) => s.name),
  },
];

export const SKILL_CATEGORIES: SkillCategoryGroup[] = getSkillCategories();



