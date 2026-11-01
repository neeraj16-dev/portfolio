import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ColorMode } from '../types/hero';
import {
  Copy,
  Check,
  FileText,
  Download,
  Github,
  Linkedin,
  Code,
  ArrowUpRight,
  ArrowRight,
  Phone,
  ArrowUp,
  Loader2,
} from 'lucide-react';

// Google Apps Script Web App URL for spreadsheet submission.
// You can either paste your deployed Web App URL (/exec) directly here,
// or add VITE_GOOGLE_SHEETS_SCRIPT_URL to your .env file or Vercel Environment Variables.
const GOOGLE_SHEETS_SCRIPT_URL =
  import.meta.env.VITE_GOOGLE_SHEETS_SCRIPT_URL || '';

interface ContactSectionProps {
  accentColor?: string;
  colorMode?: ColorMode;
  brandName?: string;
  directEmail?: string;
  status?: string;
  location?: string;
  timezone?: string;
  sla?: string;
  githubUrl?: string;
  linkedinUrl?: string;
  twitterUrl?: string;
  onOpenRoadmap?: () => void;
}

export const ContactSection: React.FC<ContactSectionProps> = ({
  colorMode = 'dark',
  brandName = 'NEERAJ MAYEKAR',
  directEmail = 'neerajmayekar16@gmail.com',
  location = 'Mumbai, India',
  githubUrl = 'https://github.com/neeraj16-dev',
  linkedinUrl = 'https://linkedin.com/in/neerajmayekar',
}) => {
  const sectionRef = useRef<HTMLElement>(null);
  const isDark = colorMode === 'dark';
  const [copied, setCopied] = useState(false);
  const [phoneCopied, setPhoneCopied] = useState(false);
  const [currentTime, setCurrentTime] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const activeEmail =
    directEmail && directEmail !== 'princerajput.rk7@gmail.com'
      ? directEmail
      : 'neerajmayekar16@gmail.com';

  // Live IST Clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const timeStr = now.toLocaleTimeString('en-US', {
        timeZone: 'Asia/Kolkata',
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
      });
      setCurrentTime(`${timeStr} IST · UTC+5:30`);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // GSAP Animations
  useEffect(() => {
    const ScrollTriggerPlugin =
      (typeof window !== 'undefined' &&
        (window as unknown as { ScrollTrigger?: typeof ScrollTrigger }).ScrollTrigger) ||
      ScrollTrigger;

    if (ScrollTriggerPlugin && gsap) {
      gsap.registerPlugin(ScrollTriggerPlugin);
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.contact-divider-line',
        { scaleX: 0, opacity: 0 },
        {
          scaleX: 1,
          opacity: 1,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 95%',
            once: true,
          },
        }
      );

      gsap.fromTo(
        ['.contact-header', '.contact-col-left', '.contact-col-right'],
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 85%',
            once: true,
          },
        }
      );

      // Watermark Parallax Drift
      gsap.to('.contact-watermark-num', {
        y: 125,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [isDark]);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(activeEmail);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyPhone = () => {
    navigator.clipboard.writeText('+91 7057851756');
    setPhoneCopied(true);
    setTimeout(() => setPhoneCopied(false), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    // If Google Apps Script Web App URL is not provided yet, fallback to mailto:
    if (!GOOGLE_SHEETS_SCRIPT_URL) {
      const subjectLine = encodeURIComponent(formData.subject || 'Portfolio Inquiry');
      const bodyContent = encodeURIComponent(
        `Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`
      );
      window.location.href = `mailto:${activeEmail}?subject=${subjectLine}&body=${bodyContent}`;
      setSubmitted(true);
      setIsSubmitting(false);
      return;
    }

    try {
      // Send as URLSearchParams so Google Apps Script automatically parses e.parameter without CORS preflight block
      const payload = new URLSearchParams();
      payload.append('name', formData.name);
      payload.append('email', formData.email);
      payload.append('subject', formData.subject);
      payload.append('message', formData.message);

      await fetch(GOOGLE_SHEETS_SCRIPT_URL, {
        method: 'POST',
        body: payload,
        mode: 'no-cors', // Critical: Google Apps Script redirects require no-cors in browser fetch
      });

      setSubmitted(true);
    } catch (err) {
      console.error('Contact form submission error:', err);
      setSubmitError('Unable to record to spreadsheet. You can send your message directly via email below.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section
      ref={sectionRef}
      id="contact"
      className={`relative min-h-screen px-4 py-24 sm:px-6 lg:px-8 overflow-hidden transition-colors duration-500 ${isDark
        ? 'bg-[#060608] text-[#F4F4F5]'
        : 'bg-neutral-50 text-neutral-900'
        }`}
    >

      {/* Atmospheric Spatial Glow */}
      <div
        className="pointer-events-none absolute -top-40 right-1/4 h-[350px] w-[700px] rounded-full opacity-15 transition-opacity duration-700 will-change-transform transform-gpu"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(220, 38, 38, 0.8) 0%, transparent 70%)',
          transform: 'translateZ(0)',
        }}
      />

      {/* Atmospheric Parallax Numeric Watermark */}
      <div
        className="contact-watermark-num pointer-events-none absolute right-4 sm:right-14 top-12 select-none font-mono text-[140px] sm:text-[260px] font-black leading-none opacity-[0.025] dark:opacity-[0.045] transition-opacity will-change-transform transform-gpu"
        aria-hidden="true"
      >
        05
      </div>

      <div className="relative z-10 mx-auto max-w-7xl">
        {/* ================= SECTION HEADER (CENTERED) ================= */}
        <div className="contact-header mb-16 flex flex-col items-center justify-center text-center">
          <div className="flex items-center gap-2 mb-3">
            <span className="font-mono text-xs uppercase tracking-widest text-red-500 font-bold">
              // 05 INITIATE CONTACT &amp; COLLABORATE
            </span>
            <span className="h-1 w-6 rounded-xs bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]" />
          </div>

          {/* Styled Callout matching reference image typography */}
          <h3
            className={`mt-6 text-2xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight ${isDark ? 'text-white' : 'text-neutral-950'
              }`}
          >
            Have something in mind?{' '}
            <span className="font-serif italic font-normal text-red-500 drop-shadow-[0_0_20px_rgba(239,68,68,0.35)]">
              Let's connect.
            </span>
          </h3>

          <p className="mt-4 max-w-2xl text-base sm:text-lg text-neutral-400 font-light leading-relaxed">
            Whether it's a project, an interesting idea, or a role you think I'd fit, I'd be happy to hear from you.
          </p>
        </div>

        {/* ================= MAIN 2-COLUMN LAYOUT ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">

          {/* ================= LEFT COLUMN ================= */}
          <div className="contact-col-left lg:col-span-5 space-y-7">

            {/* EMAIL */}
            <div>
              <span className={`block font-mono text-xs uppercase tracking-widest ${isDark ? 'text-neutral-400' : 'text-neutral-500'} font-semibold mb-2.5`}>
                EMAIL
              </span>
              <button
                type="button"
                onClick={handleCopyEmail}
                className={`cursor-target w-full flex items-center justify-between px-5 py-3.5 rounded-2xl border transition-all duration-200 group ${isDark
                  ? 'bg-[#0b0b0e] border-white/10 hover:border-white/25 text-neutral-200 hover:text-white'
                  : 'bg-white border-neutral-300 hover:border-neutral-500 text-neutral-800'
                  }`}
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  {copied ? (
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  ) : (
                    <Copy className={`w-4 h-4 shrink-0 transition-colors ${isDark ? 'text-neutral-400 group-hover:text-white' : 'text-neutral-500 group-hover:text-neutral-900'}`} />
                  )}
                  <span className="font-mono text-xs sm:text-sm font-medium tracking-wide truncate">
                    {activeEmail}
                  </span>
                </div>
                <span className={`font-mono text-xs shrink-0 ml-2 ${isDark ? 'text-neutral-500 group-hover:text-neutral-300' : 'text-neutral-500 group-hover:text-neutral-900'}`}>
                  {copied ? 'Copied!' : 'Copy'}
                </span>
              </button>
            </div>

            {/* PHONE */}
            <div>
              <span className={`block font-mono text-xs uppercase tracking-widest ${isDark ? 'text-neutral-400' : 'text-neutral-500'} font-semibold mb-2.5`}>
                PHONE
              </span>
              <button
                type="button"
                onClick={handleCopyPhone}
                className={`cursor-target w-full flex items-center justify-between px-5 py-3.5 rounded-2xl border transition-all duration-200 group ${isDark
                  ? 'bg-[#0b0b0e] border-white/10 hover:border-white/25 text-neutral-200 hover:text-white'
                  : 'bg-white border-neutral-300 hover:border-neutral-500 text-neutral-800'
                  }`}
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  {phoneCopied ? (
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  ) : (
                    <Phone className={`w-4 h-4 shrink-0 transition-colors ${isDark ? 'text-neutral-400 group-hover:text-white' : 'text-neutral-500 group-hover:text-neutral-900'}`} />
                  )}
                  <span className="font-mono text-xs sm:text-sm font-medium tracking-wide truncate">
                    +91 7057851756
                  </span>
                </div>
                <span className={`font-mono text-xs shrink-0 ml-2 ${isDark ? 'text-neutral-500 group-hover:text-neutral-300' : 'text-neutral-500 group-hover:text-neutral-900'}`}>
                  {phoneCopied ? 'Copied!' : 'Copy'}
                </span>
              </button>
            </div>

            {/* RÉSUMÉ */}
            <div>
              <span className={`block font-mono text-xs uppercase tracking-widest ${isDark ? 'text-neutral-400' : 'text-neutral-500'} font-semibold mb-2.5`}>
                RÉSUMÉ
              </span>
              <div className="flex flex-wrap items-center gap-3">
                <a
                  href="/resume"
                  className={`cursor-target inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 active:scale-95 ${isDark
                    ? 'bg-[#0b0b0e] border border-white/15 hover:border-white/30 text-white hover:bg-neutral-900'
                    : 'bg-white border border-neutral-300 hover:border-neutral-500 text-neutral-900 hover:bg-neutral-50'
                    }`}
                >
                  <FileText className={`w-4 h-4 ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`} />
                  <span>View</span>
                </a>

                <a
                  href="/Neeraj_Mayekar_Resume.pdf"
                  download="Neeraj_Mayekar_Resume.pdf"
                  className={`cursor-target inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 active:scale-95 ${isDark
                    ? 'bg-[#0b0b0e] border border-white/15 hover:border-white/30 text-white hover:bg-neutral-900'
                    : 'bg-white border border-neutral-300 hover:border-neutral-500 text-neutral-900 hover:bg-neutral-50'
                    }`}
                >
                  <Download className={`w-4 h-4 ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`} />
                  <span>Download PDF</span>
                </a>
              </div>
            </div>

            {/* ELSEWHERE */}
            <div className="pt-2">
              <span className={`block font-mono text-xs uppercase tracking-widest ${isDark ? 'text-neutral-400' : 'text-neutral-500'} font-semibold mb-3`}>
                ELSEWHERE
              </span>
              <div className={`border-t ${isDark ? 'border-white/10 divide-y divide-white/10' : 'border-neutral-200 divide-y divide-neutral-200'}`}>
                {/* GitHub */}
                <a
                  href="https://www.github.com/neeraj16-dev"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`cursor-target group flex items-center justify-between py-4 px-2.5 rounded-xl transition-all ${isDark ? 'hover:bg-white/[0.04]' : 'hover:bg-neutral-100/80'}`}
                >
                  <div className="flex items-center gap-3.5">
                    <Github className={`w-5 h-5 transition-colors ${isDark ? 'text-neutral-400 group-hover:text-white' : 'text-neutral-600 group-hover:text-neutral-900'}`} />
                    <div>
                      <span className={`text-sm font-semibold block transition-colors ${isDark ? 'text-white group-hover:text-red-400' : 'text-neutral-900 group-hover:text-red-600'}`}>GitHub</span>
                      <span className={`text-xs font-mono ${isDark ? 'text-neutral-500' : 'text-neutral-500'}`}>@neeraj16-dev</span>
                    </div>
                  </div>
                  <ArrowUpRight className={`w-4 h-4 transition-colors ${isDark ? 'text-neutral-500 group-hover:text-white' : 'text-neutral-400 group-hover:text-neutral-900'}`} />
                </a>

                {/* LinkedIn */}
                <a
                  href="https://www.linkedin.com/in/neerajmayekar"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`cursor-target group flex items-center justify-between py-4 px-2.5 rounded-xl transition-all ${isDark ? 'hover:bg-white/[0.04]' : 'hover:bg-neutral-100/80'}`}
                >
                  <div className="flex items-center gap-3.5">
                    <Linkedin className={`w-5 h-5 transition-colors ${isDark ? 'text-neutral-400 group-hover:text-white' : 'text-neutral-600 group-hover:text-neutral-900'}`} />
                    <div>
                      <span className={`text-sm font-semibold block transition-colors ${isDark ? 'text-white group-hover:text-red-400' : 'text-neutral-900 group-hover:text-red-600'}`}>LinkedIn</span>
                      <span className={`text-xs font-mono ${isDark ? 'text-neutral-500' : 'text-neutral-500'}`}>in/neerajmayekar</span>
                    </div>
                  </div>
                  <ArrowUpRight className={`w-4 h-4 transition-colors ${isDark ? 'text-neutral-500 group-hover:text-white' : 'text-neutral-400 group-hover:text-neutral-900'}`} />
                </a>

              </div>
            </div>

            {/* BASED IN & LOCAL TIME */}
            <div className={`pt-4 grid grid-cols-2 gap-6 border-t ${isDark ? 'border-white/10' : 'border-neutral-200'}`}>
              <div>
                <span className={`block font-mono text-xs uppercase tracking-widest ${isDark ? 'text-neutral-400' : 'text-neutral-500'} mb-1`}>
                  BASED IN
                </span>
                <span className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-neutral-900'}`}>
                  Pune, India
                </span>
              </div>
              <div>
                <span className={`block font-mono text-xs uppercase tracking-widest ${isDark ? 'text-neutral-400' : 'text-neutral-500'} mb-1`}>
                  LOCAL TIME
                </span>
                <span className={`text-sm font-mono ${isDark ? 'text-neutral-300' : 'text-neutral-800 font-medium'}`}>
                  {currentTime || 'IST · UTC+5:30'}
                </span>
              </div>
            </div>

          </div>

          {/* ================= RIGHT COLUMN (FORM) ================= */}
          <div className="contact-col-right lg:col-span-7">
            <div
              className={`rounded-2xl sm:rounded-3xl border p-4 sm:p-8 lg:p-10 shadow-2xl transition-all ${isDark
                ? 'bg-[#0a0a0d]/90 border-white/10 shadow-black/60'
                : 'bg-white border-neutral-200 shadow-xl shadow-neutral-200/60'
                }`}
            >
              {submitted ? (
                <div className="py-14 text-center space-y-4">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    <Check className="h-7 w-7" />
                  </div>
                  <h4 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-neutral-900'}`}>Message Dispatched</h4>
                  <p className={`max-w-md mx-auto text-sm leading-relaxed font-light ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
                    Thank you, {formData.name || 'friend'}! Your message has been received and saved. I will review it and get back to you shortly.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({ name: '', email: '', subject: '', message: '' });
                    }}
                    className={`cursor-target mt-4 inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold border transition-all ${isDark
                      ? 'bg-white/10 hover:bg-white/20 text-white border-white/15'
                      : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-900 border-neutral-300'
                      }`}
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Name */}
                    <div>
                      <label className={`block text-sm font-semibold mb-2 ${isDark ? 'text-neutral-300' : 'text-neutral-800'}`}>
                        Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Patrick Jane"
                        className={`w-full rounded-xl px-4 py-3 text-sm focus:outline-none transition-all duration-300 ease-out ${isDark
                          ? 'border border-white/10 bg-neutral-950/80 text-white placeholder-neutral-500 focus:border-red-500 focus:bg-neutral-900/90 focus:ring-2 focus:ring-red-500/25 focus:shadow-[0_0_15px_rgba(239,68,68,0.2)]'
                          : 'border border-neutral-300 bg-neutral-50/90 text-neutral-900 placeholder-neutral-400 focus:border-red-500 focus:bg-white focus:ring-2 focus:ring-red-500/20 focus:shadow-[0_0_15px_rgba(239,68,68,0.12)]'
                          }`}
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label className={`block text-sm font-semibold mb-2 ${isDark ? 'text-neutral-300' : 'text-neutral-800'}`}>
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="patrickjane@company.com"
                        className={`w-full rounded-xl px-4 py-3 text-sm focus:outline-none transition-all duration-300 ease-out ${isDark
                          ? 'border border-white/10 bg-neutral-950/80 text-white placeholder-neutral-500 focus:border-red-500 focus:bg-neutral-900/90 focus:ring-2 focus:ring-red-500/25 focus:shadow-[0_0_15px_rgba(239,68,68,0.2)]'
                          : 'border border-neutral-300 bg-neutral-50/90 text-neutral-900 placeholder-neutral-400 focus:border-red-500 focus:bg-white focus:ring-2 focus:ring-red-500/20 focus:shadow-[0_0_15px_rgba(239,68,68,0.12)]'
                          }`}
                      />
                    </div>
                  </div>

                  {/* Subject */}
                  <div>
                    <label className={`block text-sm font-semibold mb-2 ${isDark ? 'text-neutral-300' : 'text-neutral-800'}`}>
                      Subject
                    </label>
                    <input
                      type="text"
                      name="subject"
                      required
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      placeholder="A question about something I've built"
                      className={`w-full rounded-xl px-4 py-3 text-sm focus:outline-none transition-all duration-300 ease-out ${isDark
                        ? 'border border-white/10 bg-neutral-950/80 text-white placeholder-neutral-500 focus:border-red-500 focus:bg-neutral-900/90 focus:ring-2 focus:ring-red-500/25 focus:shadow-[0_0_15px_rgba(239,68,68,0.2)]'
                        : 'border border-neutral-300 bg-neutral-50/90 text-neutral-900 placeholder-neutral-400 focus:border-red-500 focus:bg-white focus:ring-2 focus:ring-red-500/20 focus:shadow-[0_0_15px_rgba(239,68,68,0.12)]'
                        }`}
                    />
                  </div>

                  {/* Message */}
                  <div>
                    <label className={`block text-sm font-semibold mb-2 ${isDark ? 'text-neutral-300' : 'text-neutral-800'}`}>
                      Message
                    </label>
                    <textarea
                      name="message"
                      required
                      rows={5}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="A few lines about what's on your mind..."
                      className={`w-full resize-none rounded-xl px-4 py-3 text-sm focus:outline-none transition-all duration-300 ease-out ${isDark
                        ? 'border border-white/10 bg-neutral-950/80 text-white placeholder-neutral-500 focus:border-red-500 focus:bg-neutral-900/90 focus:ring-2 focus:ring-red-500/25 focus:shadow-[0_0_15px_rgba(239,68,68,0.2)]'
                        : 'border border-neutral-300 bg-neutral-50/90 text-neutral-900 placeholder-neutral-400 focus:border-red-500 focus:bg-white focus:ring-2 focus:ring-red-500/20 focus:shadow-[0_0_15px_rgba(239,68,68,0.12)]'
                        }`}
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2">
                    {submitError && (
                      <div className="mb-4 p-3.5 rounded-xl border border-red-500/20 bg-red-500/10 text-xs text-red-400 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                        <span>{submitError}</span>
                        <a
                          href={`mailto:${activeEmail}?subject=${encodeURIComponent(formData.subject || 'Portfolio Inquiry')}&body=${encodeURIComponent(`Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`)}`}
                          className="font-bold underline hover:text-red-300 shrink-0"
                        >
                          Email directly &rarr;
                        </a>
                      </div>
                    )}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`cursor-target w-full py-4 px-6 rounded-full font-bold text-sm sm:text-base flex items-center justify-center gap-2 transition-all active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed ${isDark
                        ? 'bg-white hover:bg-neutral-200 text-neutral-950 shadow-[0_0_25px_rgba(255,255,255,0.25)] hover:shadow-[0_0_30px_rgba(255,255,255,0.4)]'
                        : 'bg-neutral-950 hover:bg-neutral-800 text-white shadow-lg shadow-neutral-950/20 hover:shadow-xl'
                        }`}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Sending message...</span>
                        </>
                      ) : (
                        <>
                          <span>Send message</span>
                          <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>

        </div>

        {/* ================= FOOTER / COLOPHON ================= */}
        <div className={`mt-24 border-t pt-8 ${isDark ? 'border-white/10' : 'border-neutral-200'}`}>
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between text-xs text-neutral-500">
            <div className="flex items-center gap-2 font-mono">
              <span className={`font-bold tracking-wider ${isDark ? 'text-white' : 'text-neutral-900'}`}>{brandName}</span>
              <span>— PORTFOLIO 2026</span>
            </div>

            <button
              type="button"
              onClick={handleScrollToTop}
              className={`cursor-target flex items-center gap-1.5 rounded-full border px-4 py-2 font-mono text-[11px] transition-all active:scale-95 ${isDark
                ? 'border-white/10 bg-white/5 text-neutral-300 hover:bg-white/10 hover:text-white'
                : 'border-neutral-300 bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                }`}
            >
              <ArrowUp className="h-3.5 w-3.5" />
              <span>BACK TO TOP</span>
            </button>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-[10px] font-mono text-neutral-600">
            <span>&copy; {new Date().getFullYear()} {brandName}. ALL RIGHTS RESERVED.</span>
            <span>BUILT WITH REACT, NEXT.JS &amp; GSAP</span>
          </div>
        </div>

      </div>
    </section>
  );
};

export default ContactSection;
