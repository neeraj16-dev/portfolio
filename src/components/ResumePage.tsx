import React from 'react';
import {
  ArrowLeft,
  Printer,
  Download,
  Mail,
  Phone,
  MapPin,
  Github,
  Linkedin,
  ExternalLink,
  GraduationCap,
  Award,
  Trophy,
  Code2,
  Briefcase,
  Terminal,
  Cpu,
} from 'lucide-react';
import { ColorMode } from '../types/hero';

interface ResumePageProps {
  accentColor?: string;
  colorMode?: ColorMode;
  onBack?: () => void;
}

export const ResumePage: React.FC<ResumePageProps> = ({
  accentColor = '#ef4444',
  colorMode = 'dark',
  onBack,
}) => {
  const isDark = colorMode === 'dark';

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = '/Neeraj_Mayekar_Resume.pdf';
    link.download = 'Neeraj_Mayekar_Resume.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      window.history.pushState(null, '', '/');
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
  };

  return (
    <div
      className={`min-h-screen w-full transition-colors duration-300 flex flex-col ${
        isDark ? 'bg-[#08080A] text-[#F4F4F5]' : 'bg-[#F4F4F6] text-neutral-900'
      }`}
    >
      {/* Top Action Toolbar (Hidden during print) */}
      <header
        className={`print:hidden sticky top-0 z-40 w-full border-b backdrop-blur-md transition-colors ${
          isDark
            ? 'border-white/10 bg-[#08080A]/85 text-[#F4F4F5]'
            : 'border-neutral-200 bg-white/90 text-neutral-900 shadow-xs'
        }`}
      >
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 sm:px-6 py-3">
          {/* Back Button */}
          <button
            onClick={handleBack}
            data-cursor-label="Back"
            className={`cursor-target group flex items-center gap-2 rounded-xl border px-3.5 py-1.5 font-mono text-xs font-semibold tracking-wide transition-all ${
              isDark
                ? 'border-white/10 bg-white/[0.04] text-neutral-300 hover:border-white/25 hover:bg-white/[0.08] hover:text-white'
                : 'border-neutral-300 bg-black/[0.03] text-neutral-700 hover:border-neutral-400 hover:bg-black/[0.06] hover:text-black'
            }`}
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
            <span>PORTFOLIO</span>
          </button>

          {/* Central Title / Status */}
          <div className="hidden sm:flex items-center gap-2 font-mono text-xs tracking-wider">
            <span style={{ color: accentColor }}>//</span>
            <span className="font-bold">NEERAJ MAYEKAR</span>
            <span className="opacity-40">|</span>
            <span className="opacity-70 font-sans">Curriculum Vitae</span>
          </div>

          {/* Print & Download Actions */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Print Button */}
            <button
              onClick={handlePrint}
              data-cursor-label="Print"
              className={`cursor-target flex items-center gap-1.5 rounded-xl border px-3.5 py-1.5 font-mono text-xs font-semibold tracking-wide transition-all ${
                isDark
                  ? 'border-white/10 bg-white/[0.04] text-neutral-300 hover:border-white/25 hover:bg-white/[0.08] hover:text-white'
                  : 'border-neutral-300 bg-black/[0.03] text-neutral-700 hover:border-neutral-400 hover:bg-black/[0.06] hover:text-black'
              }`}
            >
              <Printer className="h-3.5 w-3.5" />
              <span>PRINT</span>
            </button>

            {/* Direct PDF Download Anchor & Button */}
            <a
              href="/Neeraj_Mayekar_Resume.pdf"
              download="Neeraj_Mayekar_Resume.pdf"
              onClick={handleDownload}
              data-cursor-label="Download PDF"
              className="cursor-target inline-flex items-center gap-1.5 rounded-xl px-4 py-1.5 font-mono text-xs font-bold tracking-wide transition-all shadow-[0_0_20px_rgba(239,68,68,0.3)] hover:shadow-[0_0_25px_rgba(239,68,68,0.5)] active:scale-95 bg-red-600 hover:bg-red-500 text-white"
            >
              <Download className="h-3.5 w-3.5 stroke-[2.5]" />
              <span>DOWNLOAD PDF</span>
            </a>
          </div>
        </div>
      </header>

      {/* Main Resume Canvas Container */}
      <main className="flex-1 w-full px-3 sm:px-6 py-6 sm:py-10 flex justify-center items-start">
        {/* Printable Paper Sheet Container */}
        <div
          id="resume-printable-area"
          className={`w-full max-w-5xl rounded-2xl sm:rounded-3xl border p-5 sm:p-10 lg:p-12 shadow-2xl transition-all flex flex-col gap-8 print:m-0 print:p-0 print:border-none print:shadow-none print:max-w-none print:w-full print:bg-white print:text-black ${
            isDark
              ? 'border-white/10 bg-[#0B0B0E]/95 text-neutral-200 shadow-black/80'
              : 'border-neutral-200 bg-white text-neutral-900 shadow-xl shadow-neutral-200/60'
          }`}
        >
          {/* ================= RESUME HEADER ================= */}
          <div className={`border-b pb-6 transition-colors ${isDark ? 'border-white/10' : 'border-neutral-200'}`}>
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-mono text-xs uppercase tracking-widest text-red-500 font-bold">
                    // CANDIDATE DOSSIER
                  </span>
                  <span className="h-1 w-5 rounded-xs bg-red-500" />
                </div>
                <h1 className="font-sans text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight">
                  Neeraj Mayekar
                </h1>
                <p className="mt-1 text-sm sm:text-base font-mono text-neutral-400 font-medium">
                  Software Development &amp; AI Engineer <span className="text-red-500">·</span> MCA Candidate
                </p>
              </div>

              {/* Contact & Professional Channels */}
              <div className="flex flex-wrap md:flex-col gap-2 md:gap-1.5 text-xs font-mono">
                <a
                  href="tel:+917057851756"
                  className={`inline-flex items-center gap-2 transition-colors ${
                    isDark ? 'text-neutral-300 hover:text-white' : 'text-neutral-700 hover:text-black'
                  }`}
                >
                  <Phone className="h-3.5 w-3.5 text-red-500 shrink-0" />
                  <span>+91 7057851756</span>
                </a>
                <a
                  href="mailto:neerajmayekar16@gmail.com"
                  className={`inline-flex items-center gap-2 transition-colors ${
                    isDark ? 'text-neutral-300 hover:text-white' : 'text-neutral-700 hover:text-black'
                  }`}
                >
                  <Mail className="h-3.5 w-3.5 text-red-500 shrink-0" />
                  <span>neerajmayekar16@gmail.com</span>
                </a>
                <div className={`inline-flex items-center gap-2 ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
                  <MapPin className="h-3.5 w-3.5 text-red-500 shrink-0" />
                  <span>Pune, India</span>
                </div>
                <div className="flex items-center gap-3 pt-1">
                  <a
                    href="https://linkedin.com/in/neerajmayekar"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-[11px] font-semibold transition-all ${
                      isDark
                        ? 'border-white/10 bg-white/5 text-neutral-200 hover:border-white/25 hover:text-white'
                        : 'border-neutral-300 bg-neutral-100 text-neutral-800 hover:border-neutral-400 hover:text-black'
                    }`}
                  >
                    <Linkedin className="h-3 w-3 text-red-500" />
                    <span>LinkedIn</span>
                    <ExternalLink className="h-2.5 w-2.5 opacity-60" />
                  </a>
                  <a
                    href="https://github.com/neeraj16-dev"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-[11px] font-semibold transition-all ${
                      isDark
                        ? 'border-white/10 bg-white/5 text-neutral-200 hover:border-white/25 hover:text-white'
                        : 'border-neutral-300 bg-neutral-100 text-neutral-800 hover:border-neutral-400 hover:text-black'
                    }`}
                  >
                    <Github className="h-3 w-3 text-red-500" />
                    <span>GitHub</span>
                    <ExternalLink className="h-2.5 w-2.5 opacity-60" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* ================= 01 SUMMARY ================= */}
          <section>
            <div className="flex items-center gap-2 mb-3">
              <span className="font-mono text-xs uppercase tracking-widest font-bold text-red-500">
                // 01 SUMMARY
              </span>
              <span className="h-1 w-4 rounded-xs bg-red-500" />
            </div>
            <p className={`text-sm sm:text-[15px] leading-relaxed ${isDark ? 'text-neutral-300' : 'text-neutral-700'}`}>
              MCA student building production-style full-stack applications with React.js, Node.js/Express, and Python (FastAPI), backed by PostgreSQL and MongoDB. Hands-on experience designing RESTful APIs with JWT authentication and role-based access control, and integrating LLM features such as Retrieval-Augmented Generation into web applications. Seeking a Full Stack Development internship where I can contribute to live industry projects and learn from experienced engineers.
            </p>
          </section>

          {/* ================= 02 TECHNICAL SKILLS ================= */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <span className="font-mono text-xs uppercase tracking-widest font-bold text-red-500">
                // 02 TECHNICAL SKILLS
              </span>
              <span className="h-1 w-4 rounded-xs bg-red-500" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {/* Programming Languages */}
              <div className={`p-3.5 rounded-xl border ${isDark ? 'bg-white/[0.02] border-white/10' : 'bg-neutral-50 border-neutral-200'}`}>
                <span className="font-mono text-xs font-bold text-red-500 uppercase tracking-wider block mb-2">
                  Programming Languages
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {['Python', 'Java', 'JavaScript', 'SQL'].map((s) => (
                    <span
                      key={s}
                      className={`font-mono text-xs px-2.5 py-1 rounded-md border ${
                        isDark
                          ? 'bg-neutral-900 border-white/10 text-neutral-200'
                          : 'bg-white border-neutral-300 text-neutral-800'
                      }`}
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              {/* Generative AI & RAG */}
              <div className={`p-3.5 rounded-xl border ${isDark ? 'bg-white/[0.02] border-white/10' : 'bg-neutral-50 border-neutral-200'}`}>
                <span className="font-mono text-xs font-bold text-red-500 uppercase tracking-wider block mb-2">
                  Generative AI &amp; RAG
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    'Retrieval-Augmented Generation',
                    'Hybrid Search (BM25 + Dense)',
                    'RRF',
                    'Cross-Encoder Reranking',
                    'LangChain',
                    'Gemini API',
                    'Prompt Engineering',
                    'ChromaDB',
                    'LangSmith',
                  ].map((s) => (
                    <span
                      key={s}
                      className={`font-mono text-xs px-2.5 py-1 rounded-md border ${
                        isDark
                          ? 'bg-neutral-900 border-white/10 text-neutral-200'
                          : 'bg-white border-neutral-300 text-neutral-800'
                      }`}
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              {/* Machine Learning & Data */}
              <div className={`p-3.5 rounded-xl border ${isDark ? 'bg-white/[0.02] border-white/10' : 'bg-neutral-50 border-neutral-200'}`}>
                <span className="font-mono text-xs font-bold text-red-500 uppercase tracking-wider block mb-2">
                  Machine Learning &amp; Data
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {['Scikit-learn', 'XGBoost', 'Random Forest', 'Pandas', 'NumPy', 'Matplotlib', 'Seaborn'].map((s) => (
                    <span
                      key={s}
                      className={`font-mono text-xs px-2.5 py-1 rounded-md border ${
                        isDark
                          ? 'bg-neutral-900 border-white/10 text-neutral-200'
                          : 'bg-white border-neutral-300 text-neutral-800'
                      }`}
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              {/* Backend, Frontend & Databases */}
              <div className={`p-3.5 rounded-xl border ${isDark ? 'bg-white/[0.02] border-white/10' : 'bg-neutral-50 border-neutral-200'}`}>
                <span className="font-mono text-xs font-bold text-red-500 uppercase tracking-wider block mb-2">
                  Backend, Frontend &amp; Databases
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    'FastAPI',
                    'React.js',
                    'Node.js',
                    'RESTful APIs',
                    'JWT',
                    'PostgreSQL',
                    'MongoDB',
                    'Docker',
                    'Git',
                    'Linux',
                    'AWS EC2',
                  ].map((s) => (
                    <span
                      key={s}
                      className={`font-mono text-xs px-2.5 py-1 rounded-md border ${
                        isDark
                          ? 'bg-neutral-900 border-white/10 text-neutral-200'
                          : 'bg-white border-neutral-300 text-neutral-800'
                      }`}
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* ================= 03 FEATURED PROJECTS ================= */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <span className="font-mono text-xs uppercase tracking-widest font-bold text-red-500">
                // 03 FEATURED PROJECTS
              </span>
              <span className="h-1 w-4 rounded-xs bg-red-500" />
            </div>

            <div className="space-y-6">
              {/* Project 1: Enterprise Policy Intelligence RAG Platform */}
              <div className={`p-5 rounded-2xl border transition-all ${
                isDark ? 'bg-white/[0.02] border-white/10 hover:border-white/20' : 'bg-neutral-50/70 border-neutral-200 hover:border-neutral-300'
              }`}>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                  <h3 className="text-base sm:text-lg font-bold font-sans tracking-tight">
                    Enterprise Policy Intelligence RAG Platform
                  </h3>
                  <a
                    href="https://github.com/neeraj16-dev"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-mono text-red-500 hover:underline"
                  >
                    <Github className="h-3.5 w-3.5" />
                    <span>View Repository</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>

                <div className="flex flex-wrap gap-1.5 mb-3.5">
                  {['LangChain', 'Gemini API', 'ChromaDB', 'FastAPI', 'React.js', 'Pydantic'].map((tech) => (
                    <span
                      key={tech}
                      className={`text-[11px] font-mono px-2 py-0.5 rounded-md border ${
                        isDark
                          ? 'bg-red-500/10 text-red-400 border-red-500/20'
                          : 'bg-red-50 text-red-600 border-red-200 font-medium'
                      }`}
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                <ul className={`space-y-2 text-xs sm:text-sm leading-relaxed ${isDark ? 'text-neutral-300' : 'text-neutral-700'}`}>
                  <li className="flex items-start gap-2.5">
                    <span className="text-red-500 font-bold select-none">•</span>
                    <span>
                      Built an enterprise policy RAG pipeline over 180 pages of compliance documentation, with a layout-aware PDF parser that preserves Markdown structure to ingest multi-column regulatory tables and nested clauses without context loss.
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-red-500 font-bold select-none">•</span>
                    <span>
                      Architected a hybrid retrieval pipeline combining dense embeddings (<code className="font-mono text-xs px-1 py-0.5 rounded bg-black/20 dark:bg-white/10">BAAI/bge-small-en-v1.5</code>) in ChromaDB with sparse BM25 via Reciprocal Rank Fusion (<code className="font-mono text-xs px-1 py-0.5 rounded bg-black/20 dark:bg-white/10">k = 60</code>), followed by a cross-encoder/<code className="font-mono text-xs px-1 py-0.5 rounded bg-black/20 dark:bg-white/10">ms-marco-MiniLM-L-6-v2</code> reranker to maximize clause retrieval precision.
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-red-500 font-bold select-none">•</span>
                    <span>
                      Implemented structured generation with LangChain + Gemini and strict Pydantic schemas, enforcing citation metadata (document IDs, section titles, verbatim quotes) to prevent ungrounded compliance advice.
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-red-500 font-bold select-none">•</span>
                    <span>
                      Added an LLM-as-a-judge guardrail scoring factual entailment and flagging phantom citations, achieving <strong className="text-red-500 font-semibold">96.1% Hit Rate@3</strong>, <strong className="text-red-500 font-semibold">0.892 MRR</strong>, and <strong className="text-red-500 font-semibold">99.8% Faithfulness</strong> across 51 benchmark queries.
                    </span>
                  </li>
                </ul>
              </div>

              {/* Project 2: Cost-Aware IT Support Ticket Router */}
              <div className={`p-5 rounded-2xl border transition-all ${
                isDark ? 'bg-white/[0.02] border-white/10 hover:border-white/20' : 'bg-neutral-50/70 border-neutral-200 hover:border-neutral-300'
              }`}>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                  <h3 className="text-base sm:text-lg font-bold font-sans tracking-tight">
                    Cost-Aware IT Support Ticket Router
                  </h3>
                  <a
                    href="https://github.com/neeraj16-dev"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-mono text-red-500 hover:underline"
                  >
                    <Github className="h-3.5 w-3.5" />
                    <span>View Repository</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>

                <div className="flex flex-wrap gap-1.5 mb-3.5">
                  {['XGBoost', 'LangChain', 'Sentence-Transformers', 'FastAPI', 'React.js', 'LangSmith'].map((tech) => (
                    <span
                      key={tech}
                      className={`text-[11px] font-mono px-2 py-0.5 rounded-md border ${
                        isDark
                          ? 'bg-red-500/10 text-red-400 border-red-500/20'
                          : 'bg-red-50 text-red-600 border-red-200 font-medium'
                      }`}
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                <ul className={`space-y-2 text-xs sm:text-sm leading-relaxed ${isDark ? 'text-neutral-300' : 'text-neutral-700'}`}>
                  <li className="flex items-start gap-2.5">
                    <span className="text-red-500 font-bold select-none">•</span>
                    <span>
                      Built an end-to-end ticket routing platform generating semantic embeddings via Sentence-Transformers and classifying tickets into 5 categories with XGBoost, achieving <strong className="text-red-500 font-semibold">0.74 weighted F1</strong> with class-balanced training on severe imbalance (95 to 2,953 samples per class).
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-red-500 font-bold select-none">•</span>
                    <span>
                      Designed a confidence-threshold decision system that resolves <strong className="text-red-500 font-semibold">64% of tickets independently at zero cost</strong> with 85% accuracy, routing ambiguous cases to LangChain + Gemini fallback prompts, cutting LLM calls by 64%; monitored token usage via LangSmith.
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-red-500 font-bold select-none">•</span>
                    <span>
                      Secured REST APIs with JWT and RBAC for users, queue managers, and admins (SQL storage), and built a human-in-the-loop feedback loop so managers can correct misrouted tickets for future model retraining.
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* ================= 04 EDUCATION ================= */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <span className="font-mono text-xs uppercase tracking-widest font-bold text-red-500">
                // 04 EDUCATION
              </span>
              <span className="h-1 w-4 rounded-xs bg-red-500" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* MIT WPU */}
              <div className={`p-4 sm:p-5 rounded-2xl border flex flex-col justify-between ${
                isDark ? 'bg-white/[0.02] border-white/10' : 'bg-neutral-50 border-neutral-200'
              }`}>
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <h3 className="font-bold text-sm sm:text-base tracking-tight">
                      MIT WPU, Pune, India
                    </h3>
                    <span className="font-mono text-xs text-red-500 font-semibold">
                      Jul 2025 – Present
                    </span>
                  </div>
                  <p className={`text-xs sm:text-sm ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
                    Master of Computer Application (Science)
                  </p>
                </div>
                <div className="mt-3 pt-3 border-t border-inherit flex items-center justify-between">
                  <span className="text-xs font-mono uppercase tracking-wider text-neutral-500">Academic Standing</span>
                  <span className="font-mono text-xs font-bold px-2.5 py-0.5 rounded-full bg-red-500/10 text-red-500 border border-red-500/30">
                    CGPA: 8.79
                  </span>
                </div>
              </div>

              {/* Vishwakarma College */}
              <div className={`p-4 sm:p-5 rounded-2xl border flex flex-col justify-between ${
                isDark ? 'bg-white/[0.02] border-white/10' : 'bg-neutral-50 border-neutral-200'
              }`}>
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <h3 className="font-bold text-sm sm:text-base tracking-tight">
                      Vishwakarma College of Arts, Commerce &amp; Science
                    </h3>
                    <span className="font-mono text-xs text-red-500 font-semibold">
                      Aug 2022 – Apr 2025
                    </span>
                  </div>
                  <p className={`text-xs sm:text-sm ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
                    Bachelor of Computer Science (Pune, India)
                  </p>
                </div>
                <div className="mt-3 pt-3 border-t border-inherit flex items-center justify-between">
                  <span className="text-xs font-mono uppercase tracking-wider text-neutral-500">Academic Standing</span>
                  <span className="font-mono text-xs font-bold px-2.5 py-0.5 rounded-full bg-red-500/10 text-red-500 border border-red-500/30">
                    CGPA: 9.04
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* ================= 05 CERTIFICATIONS & 06 ACHIEVEMENTS ================= */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Certifications */}
            <section>
              <div className="flex items-center gap-2 mb-3">
                <span className="font-mono text-xs uppercase tracking-widest font-bold text-red-500">
                  // 05 CERTIFICATIONS
                </span>
                <span className="h-1 w-4 rounded-xs bg-red-500" />
              </div>

              <div className="space-y-2.5">
                <div className={`p-3.5 rounded-xl border flex items-center justify-between ${
                  isDark ? 'bg-white/[0.02] border-white/10' : 'bg-neutral-50 border-neutral-200'
                }`}>
                  <div className="flex items-center gap-2.5">
                    <Award className="h-4 w-4 text-red-500 shrink-0" />
                    <span className="text-xs sm:text-sm font-semibold">Networking Basics</span>
                  </div>
                  <span className="font-mono text-xs px-2.5 py-0.5 rounded-md border border-red-500/20 bg-red-500/10 text-red-500 font-bold">
                    Cisco
                  </span>
                </div>

                <div className={`p-3.5 rounded-xl border flex items-center justify-between ${
                  isDark ? 'bg-white/[0.02] border-white/10' : 'bg-neutral-50 border-neutral-200'
                }`}>
                  <div className="flex items-center gap-2.5">
                    <Award className="h-4 w-4 text-red-500 shrink-0" />
                    <span className="text-xs sm:text-sm font-semibold">Agentic AI Foundations Associate</span>
                  </div>
                  <span className="font-mono text-xs px-2.5 py-0.5 rounded-md border border-red-500/20 bg-red-500/10 text-red-500 font-bold">
                    Oracle
                  </span>
                </div>
              </div>
            </section>

            {/* Achievements & Activities */}
            <section>
              <div className="flex items-center gap-2 mb-3">
                <span className="font-mono text-xs uppercase tracking-widest font-bold text-red-500">
                  // 06 ACHIEVEMENTS &amp; ATHLETICS
                </span>
                <span className="h-1 w-4 rounded-xs bg-red-500" />
              </div>

              <div className="space-y-2.5">
                <div className={`p-3.5 rounded-xl border flex items-start gap-3 ${
                  isDark ? 'bg-white/[0.02] border-white/10' : 'bg-neutral-50 border-neutral-200'
                }`}>
                  <Trophy className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs sm:text-sm font-semibold block">Winner &amp; Team Captain · Legacy Cup 2024</span>
                    <span className={`text-xs ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
                      Captained Forza Football Club to victory in the 2024 Legacy Cup.
                    </span>
                  </div>
                </div>

                <div className={`p-3.5 rounded-xl border flex items-start gap-3 ${
                  isDark ? 'bg-white/[0.02] border-white/10' : 'bg-neutral-50 border-neutral-200'
                }`}>
                  <Trophy className="h-4 w-4 text-neutral-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs sm:text-sm font-semibold block">Runner-up &amp; Team Captain · Troika 2024</span>
                    <span className={`text-xs ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
                      Led the team to a runner-up finish at BMCC&apos;s prestigious football tournament.
                    </span>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* ================= FOOTER BAR ================= */}
          <div className={`border-t pt-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] font-mono ${
            isDark ? 'border-white/10 text-neutral-500' : 'border-neutral-200 text-neutral-500'
          }`}>
            <span>NEERAJ MAYEKAR // VERIFIED CANDIDATE PROFILE</span>
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>AVAILABLE FOR FULL-STACK &amp; AI ENGINEERING ROLES</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ResumePage;
