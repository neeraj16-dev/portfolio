import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Copy, Check, Mail, ExternalLink, ArrowRight } from 'lucide-react';
import { ColorMode } from '../types/hero';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  brandName: string;
  colorMode?: ColorMode;
  accentColor?: string;
  directEmail?: string;
}

export const ContactModal: React.FC<ContactModalProps> = ({
  isOpen,
  onClose,
  brandName,
  colorMode = 'dark',
  accentColor = '#38BDF8',
  directEmail = 'neerajmayekar16@gmail.com',
}) => {
  const [copied, setCopied] = useState(false);
  const isDark = colorMode === 'dark';
  const email = directEmail || 'neerajmayekar16@gmail.com';

  const copyEmail = () => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="contact-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.28, ease: 'easeOut' }}
          className={`fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md ${
            isDark ? 'bg-black/80' : 'bg-black/50'
          }`}
          onClick={onClose}
        >
          <motion.div
            key="contact-card"
            initial={{ opacity: 0, scale: 0.94, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className={`relative w-full max-w-lg rounded-2xl border p-4 sm:p-8 shadow-2xl ${
              isDark
                ? 'border-white/10 bg-[#0C0C0E] text-[#F4F4F5]'
                : 'border-neutral-200 bg-white text-neutral-900 shadow-2xl'
            }`}
            role="dialog"
            aria-modal="true"
          >
            <div className={`flex items-center justify-between border-b pb-4 ${isDark ? 'border-white/10' : 'border-neutral-200'}`}>
              <div>
                <span className="text-[11px] font-semibold uppercase tracking-widest" style={{ color: accentColor }}>
                  Direct Communication
                </span>
                <h3 className={`text-xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-neutral-950'}`}>
                  Initiate Collaboration
                </h3>
              </div>
              <button
                onClick={onClose}
                className={`cursor-target rounded-lg p-2 transition ${
                  isDark
                    ? 'text-neutral-400 hover:bg-white/10 hover:text-white'
                    : 'text-neutral-600 hover:bg-neutral-100 hover:text-black'
                }`}
                aria-label="Close modal"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <p className={`mt-4 text-xs leading-relaxed ${isDark ? 'text-neutral-300' : 'text-neutral-600'}`}>
              Interested in bespoke full-stack systems, custom WebGL interactive shaders, or autonomous AI agent pipelines? Reach out directly:
            </p>

            <div
              className={`mt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 rounded-xl border p-3.5 sm:p-4 ${
                isDark ? 'border-white/10 bg-black/60' : 'border-neutral-200 bg-neutral-50'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
                  style={{ backgroundColor: `${accentColor}18`, color: accentColor }}
                >
                  <Mail className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <span className="block text-[11px] text-neutral-500">Direct Email</span>
                  <span className={`font-mono text-xs font-semibold truncate block ${isDark ? 'text-white' : 'text-neutral-950'}`}>
                    {email}
                  </span>
                </div>
              </div>
              <button
                onClick={copyEmail}
                className={`cursor-target self-end sm:self-auto flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition ${
                  isDark
                    ? 'border-white/10 bg-white/5 text-white hover:bg-white/10'
                    : 'border-neutral-200 bg-white text-neutral-800 hover:bg-neutral-100'
                }`}
              >
                {copied ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-emerald-500" />
                    <span className="text-emerald-500 font-mono text-[11px]">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5 text-neutral-400" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>

            <div className="mt-6 flex flex-col gap-2.5">
              <a
                href={`mailto:${email}?subject=Project%20Collaboration%20Inquiry%20-%20${encodeURIComponent(brandName)}`}
                className="cursor-target flex items-center justify-center gap-2 rounded-xl py-3 text-xs font-bold transition"
                style={{
                  backgroundColor: accentColor,
                  color: isDark ? '#09090B' : '#FFFFFF',
                }}
              >
                <span>Compose Mail in Client</span>
                <ArrowRight className="h-4 w-4" />
              </a>
              <a
                href="https://github.com/neerajmayekar"
                target="_blank"
                rel="noopener noreferrer"
                className={`cursor-target flex items-center justify-center gap-2 rounded-xl border py-2.5 text-xs font-semibold transition ${
                  isDark
                    ? 'border-white/10 bg-white/[0.03] text-neutral-300 hover:bg-white/[0.08] hover:text-white'
                    : 'border-neutral-200 bg-neutral-50 text-neutral-800 hover:bg-neutral-100 hover:text-black'
                }`}
              >
                <span>GitHub Repositories &amp; Contributions</span>
                <ExternalLink className="h-3.5 w-3.5 text-neutral-400" />
              </a>
            </div>

            <div className={`mt-6 border-t pt-4 text-center ${isDark ? 'border-white/10' : 'border-neutral-200'}`}>
              <span className="text-[11px] font-mono text-neutral-500">
                STATUS: AVAILABLE FOR SELECT Q2/Q3 COLLABORATIONS
              </span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ContactModal;
