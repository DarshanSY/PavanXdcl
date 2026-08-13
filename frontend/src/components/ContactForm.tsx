import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, CheckCircle2, AlertCircle } from 'lucide-react';

interface FormState {
  name: string;
  email: string;
  program: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  program?: string;
  message?: string;
}

export const ContactForm: React.FC = () => {
  const [form, setForm] = useState<FormState>({
    name: '',
    email: '',
    program: 'dsa',
    message: ''
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    
    if (!form.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!form.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!form.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (form.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters long';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    
    // Clear error for field on change
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    // Simulate network submission
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      setForm({ name: '', email: '', program: 'dsa', message: '' });
      
      // Auto close success message after 5 seconds
      setTimeout(() => setIsSuccess(false), 5000);
    }, 1500);
  };

  return (
    <div className="w-full max-w-xl mx-auto bg-home-bg/40 backdrop-blur-xl border border-home-border rounded-3xl p-6 md:p-10 shadow-2xl relative overflow-hidden">
      
      {/* Glow highlight */}
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-home-accent/10 rounded-full filter blur-3xl pointer-events-none" />
      
      <div className="text-center mb-8">
        <span className="text-[10px] font-bold uppercase tracking-widest text-home-accent">
          Placements Mentorship
        </span>
        <h3 className="text-2xl md:text-3xl font-extrabold text-white mt-2">
          Connect with <span className="bg-gradient-to-r from-white via-home-accentLight to-home-accent bg-clip-text text-transparent">PavanxDCL</span>
        </h3>
        <p className="text-gray-400 text-xs md:text-sm mt-2 max-w-sm mx-auto">
          Interested in live bootcamps or corporate placements? Send us a message and we'll get back to you!
        </p>
      </div>

      <AnimatePresence mode="wait">
        {isSuccess ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex flex-col items-center justify-center py-8 text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15 }}
              className="w-16 h-16 bg-[#25d366]/10 border border-[#25d366]/30 text-[#25d366] rounded-full flex items-center justify-center mb-4"
            >
              <CheckCircle2 size={32} />
            </motion.div>
            <h4 className="text-xl font-bold text-white">Message Sent Successfully!</h4>
            <p className="text-gray-400 text-xs md:text-sm max-w-xs mt-2">
              Thanks for reaching out! We've received your query and will contact you via email shortly.
            </p>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setIsSuccess(false)}
              className="mt-6 text-xs text-home-accent hover:underline"
            >
              Send another message
            </motion.button>
          </motion.div>
        ) : (
          <motion.form
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onSubmit={handleSubmit}
            className="space-y-5"
            noValidate
          >
            {/* Name Input */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="name" className="text-xs font-semibold text-gray-300">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="e.g. Rahul Kumar"
                className={`w-full bg-[#0a0915]/60 border ${errors.name ? 'border-red-500/50 focus:border-red-500 focus:ring-2 focus:ring-red-500/20' : 'border-white/10 focus:border-home-accent focus:ring-2 focus:ring-home-accent/20'} rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 outline-none transition-all`}
              />
              {errors.name && (
                <span className="text-[10px] text-red-400 flex items-center gap-1 mt-0.5">
                  <AlertCircle size={10} /> {errors.name}
                </span>
              )}
            </div>

            {/* Email Input */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="email" className="text-xs font-semibold text-gray-300">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="e.g. rahul@example.com"
                className={`w-full bg-[#0a0915]/60 border ${errors.email ? 'border-red-500/50 focus:border-red-500 focus:ring-2 focus:ring-red-500/20' : 'border-white/10 focus:border-home-accent focus:ring-2 focus:ring-home-accent/20'} rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 outline-none transition-all`}
              />
              {errors.email && (
                <span className="text-[10px] text-red-400 flex items-center gap-1 mt-0.5">
                  <AlertCircle size={10} /> {errors.email}
                </span>
              )}
            </div>

            {/* Select program */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="program" className="text-xs font-semibold text-gray-300">
                Interested Program
              </label>
              <select
                id="program"
                name="program"
                value={form.program}
                onChange={handleChange}
                className="w-full bg-[#0a0915] border border-white/10 focus:border-home-accent focus:ring-2 focus:ring-home-accent/20 rounded-xl px-4 py-3 text-sm text-white outline-none transition-all appearance-none cursor-pointer"
              >
                <option value="dsa">⚡ DSA Pro-MAX Course</option>
                <option value="fullstack">🚀 Full Stack Development Sheet</option>
                <option value="aptitude">📊 Aptitude practice Hub</option>
                <option value="mentorship">🤝 1-on-1 Placement Mentorship</option>
              </select>
            </div>

            {/* Message input */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="message" className="text-xs font-semibold text-gray-300">
                Your Message
              </label>
              <textarea
                id="message"
                name="message"
                value={form.message}
                onChange={handleChange}
                rows={4}
                placeholder="Tell us about your learning goals..."
                className={`w-full bg-[#0a0915]/60 border ${errors.message ? 'border-red-500/50 focus:border-red-500 focus:ring-2 focus:ring-red-500/20' : 'border-white/10 focus:border-home-accent focus:ring-2 focus:ring-home-accent/20'} rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 outline-none transition-all resize-none`}
              />
              {errors.message && (
                <span className="text-[10px] text-red-400 flex items-center gap-1 mt-0.5">
                  <AlertCircle size={10} /> {errors.message}
                </span>
              )}
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={isSubmitting}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3.5 bg-gradient-to-r from-home-accent to-home-accentDark text-white font-bold rounded-xl shadow-lg shadow-home-accent/25 hover:shadow-home-accent/35 flex items-center justify-center gap-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Sending Message...
                </>
              ) : (
                <>
                  Send Message <Send size={15} />
                </>
              )}
            </motion.button>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ContactForm;
