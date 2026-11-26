import { useState, type FormEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, CheckCircle } from "@phosphor-icons/react";

interface ConnectModalProps {
  open: boolean;
  onClose: () => void;
}

export function ConnectModal({ open, onClose }: ConnectModalProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Please enter your name before sending.");
      return;
    }
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email.trim())) {
      setError("Enter a valid email address so our team can reply.");
      return;
    }
    setError("");
    setSubmitted(true);
  };

  const resetAndClose = () => {
    setSubmitted(false);
    setError("");
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[70] flex items-center justify-center bg-[#171C19]/30 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="connect-modal-title"
        >
          <motion.div
            initial={{ opacity: 0, y: 18, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="w-full max-w-md rounded-3xl border border-[#E4EAE5] bg-white p-6 shadow-[0_24px_60px_rgba(23,28,25,0.14)] sm:p-8"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="caption-4 uppercase tracking-wider text-[#176B43]">
                  Connect with Algora
                </span>
                <h2 id="connect-modal-title" className="heading-5 mt-1 text-[#171C19]">
                  Research and pilot inquiries
                </h2>
              </div>
              <button
                type="button"
                onClick={resetAndClose}
                aria-label="Close dialog"
                className="rounded-full p-1.5 text-[#777F79] hover:bg-[#F8FAF7] hover:text-[#171C19]"
              >
                <X size={18} />
              </button>
            </div>

            {submitted ? (
              <div className="mt-6 rounded-2xl border border-[#E4EAE5] bg-[#F8FAF7] p-6 text-center">
                <CheckCircle
                  size={36}
                  weight="duotone"
                  className="mx-auto text-[#176B43]"
                  aria-hidden="true"
                />
                <p className="title-2 mt-3 text-[#171C19]">
                  Inquiry recorded for {name}
                </p>
                <p className="body-6 mt-2 text-[#777F79]">
                  We will follow up at {email} regarding your interest in Algora.
                </p>
                <button
                  type="button"
                  onClick={resetAndClose}
                  className="button-sm mt-5 rounded-full bg-[#176B43] px-5 py-2 text-white hover:bg-[#135837]"
                >
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-4">
                <div>
                  <label htmlFor="algora-name" className="caption-1 block text-[#171C19]">
                    Full name
                  </label>
                  <input
                    id="algora-name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Dana Lin"
                    className="body-5 mt-1.5 w-full rounded-xl border border-[#E4EAE5] bg-[#F8FAF7] px-3.5 py-2.5 text-[#171C19] focus:border-[#176B43] focus:bg-white focus:outline-none"
                  />
                </div>

                <div>
                  <label htmlFor="algora-email" className="caption-1 block text-[#171C19]">
                    Work email
                  </label>
                  <input
                    id="algora-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="dana@studio.org"
                    className="body-5 mt-1.5 w-full rounded-xl border border-[#E4EAE5] bg-[#F8FAF7] px-3.5 py-2.5 text-[#171C19] focus:border-[#176B43] focus:bg-white focus:outline-none"
                  />
                </div>

                <div>
                  <label htmlFor="algora-notes" className="caption-1 block text-[#171C19]">
                    Context or space
                  </label>
                  <textarea
                    id="algora-notes"
                    rows={3}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tell us about your workspace or research interest"
                    className="body-5 mt-1.5 w-full rounded-xl border border-[#E4EAE5] bg-[#F8FAF7] px-3.5 py-2.5 text-[#171C19] focus:border-[#176B43] focus:bg-white focus:outline-none"
                  />
                </div>

                {error && (
                  <p role="alert" className="caption-1 text-red-700">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  className="button-md w-full rounded-full bg-[#176B43] px-4 py-2.5 text-white transition-colors hover:bg-[#135837] active:scale-[0.98]"
                >
                  Send inquiry
                </button>
              </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
