import React, { useState } from 'react';
import {
  MessageSquare,
  User,
  Mail,
  Tag,
  PenLine,
  Send,
  Loader2,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useToast } from '../../context/ToastContext';
import contactService from '../../services/contactService';

export const ContactForm = () => {
  const { isDark } = useTheme();
  const { success: showToastSuccess, error: showToastError } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [lastSubmitted, setLastSubmitted] = useState(null);

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,})+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!emailRegex.test(formData.email.trim())) {
      newErrors.email = 'Please provide a valid email address';
    }

    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required';
    } else if (formData.subject.trim().length < 2) {
      newErrors.subject = 'Subject must be at least 2 characters';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.trim().length < 5) {
      newErrors.message = 'Message must be at least 5 characters long';
    }

    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
    if (errorMessage) setErrorMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSubmitting) return;

    // Validate
    const formErrors = validate();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    // Client-side duplicate check (prevent sending exact same message twice consecutively)
    const payloadKey = `${formData.email.trim().toLowerCase()}_${formData.subject.trim()}_${formData.message.trim()}`;
    if (lastSubmitted && lastSubmitted === payloadKey) {
      setErrorMessage('You have already submitted this exact message. Please wait a moment.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const response = await contactService.submitMessage({
        name: formData.name.trim(),
        email: formData.email.trim(),
        subject: formData.subject.trim(),
        message: formData.message.trim()
      });

      const messageText = response.message || "Thank you! Your message has been received. We'll get back to you as soon as possible.";
      setSuccessMessage(messageText);
      showToastSuccess(messageText);
      setLastSubmitted(payloadKey);

      // Clear the form fields upon success
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
      setErrors({});
    } catch (err) {
      const serverMsg = err.response?.data?.message || err.message || 'Failed to submit message. Please try again.';
      setErrorMessage(serverMsg);
      showToastError(serverMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className={`relative rounded-2xl p-6 sm:p-8 border backdrop-blur-md transition-all duration-300 shadow-xl ${
        isDark
          ? 'bg-[#120a22]/85 border-purple-500/30 shadow-[0_12px_40px_rgba(0,0,0,0.5),0_0_25px_rgba(168,85,247,0.15)] text-white'
          : 'bg-white/95 border-purple-200/90 shadow-[0_12px_35px_rgba(147,51,234,0.08)] text-slate-900'
      }`}
    >
      {/* Card Header: "Send us a Message" */}
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-purple-500/15">
        <div
          className={`w-9 h-9 rounded-xl flex items-center justify-center border ${
            isDark
              ? 'bg-purple-950/60 border-purple-400/30 text-purple-300 shadow-[0_0_12px_rgba(168,85,247,0.3)]'
              : 'bg-purple-100 border-purple-300 text-purple-700 shadow-xs'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
        </div>
        <div>
          <h2 className="text-lg sm:text-xl font-bold font-serif tracking-tight">
            Send us a Message
          </h2>
          <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>
            Fill out the form below and our team will get back to you shortly.
          </p>
        </div>
      </div>

      {/* Success Notification Banner */}
      {successMessage && (
        <div
          className="mb-6 p-4 rounded-xl flex items-start gap-3 border animate-in fade-in duration-200 bg-emerald-950/40 border-emerald-500/40 text-emerald-200 text-xs sm:text-sm"
          role="alert"
        >
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-semibold text-emerald-300">Message Delivered</p>
            <p className="mt-0.5 text-xs text-emerald-200/90">{successMessage}</p>
          </div>
        </div>
      )}

      {/* Error Notification Banner */}
      {errorMessage && (
        <div
          className="mb-6 p-4 rounded-xl flex items-start gap-3 border animate-in fade-in duration-200 bg-rose-950/40 border-rose-500/40 text-rose-200 text-xs sm:text-sm"
          role="alert"
        >
          <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-semibold text-rose-300">Unable to Send</p>
            <p className="mt-0.5 text-xs text-rose-200/90">{errorMessage}</p>
          </div>
        </div>
      )}

      {/* Contact Form */}
      <form onSubmit={handleSubmit} noValidate className="space-y-4 sm:space-y-5">
        {/* Row 1: Name & Email */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Full Name */}
          <div>
            <label
              htmlFor="contact-name"
              className={`block text-xs font-semibold mb-1.5 ${
                isDark ? 'text-gray-300' : 'text-slate-700'
              }`}
            >
              Full Name <span className="text-purple-400">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-purple-400">
                <User className="w-4 h-4" />
              </div>
              <input
                id="contact-name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your Name"
                disabled={isSubmitting}
                className={`w-full pl-10 pr-4 py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm border transition-all outline-none ${
                  errors.name
                    ? 'border-rose-500/70 focus:border-rose-400 focus:ring-1 focus:ring-rose-400'
                    : isDark
                      ? 'border-purple-500/25 focus:border-purple-400 focus:ring-1 focus:ring-purple-400/50'
                      : 'border-purple-200 focus:border-purple-500 focus:ring-1 focus:ring-purple-500/40'
                } ${
                  isDark
                    ? 'bg-[#170e2b]/80 text-white placeholder-gray-400'
                    : 'bg-[#f8f5fc]/90 text-slate-900 placeholder-slate-400'
                } ${isSubmitting ? 'opacity-60 cursor-not-allowed' : ''}`}
              />
            </div>
            {errors.name && (
              <p className="text-xs text-rose-400 mt-1 pl-1 flex items-center gap-1">
                <span>⚠</span> {errors.name}
              </p>
            )}
          </div>

          {/* Email Address */}
          <div>
            <label
              htmlFor="contact-email"
              className={`block text-xs font-semibold mb-1.5 ${
                isDark ? 'text-gray-300' : 'text-slate-700'
              }`}
            >
              Email Address <span className="text-purple-400">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-purple-400">
                <Mail className="w-4 h-4" />
              </div>
              <input
                id="contact-email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Your Email"
                disabled={isSubmitting}
                className={`w-full pl-10 pr-4 py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm border transition-all outline-none ${
                  errors.email
                    ? 'border-rose-500/70 focus:border-rose-400 focus:ring-1 focus:ring-rose-400'
                    : isDark
                      ? 'border-purple-500/25 focus:border-purple-400 focus:ring-1 focus:ring-purple-400/50'
                      : 'border-purple-200 focus:border-purple-500 focus:ring-1 focus:ring-purple-500/40'
                } ${
                  isDark
                    ? 'bg-[#170e2b]/80 text-white placeholder-gray-400'
                    : 'bg-[#f8f5fc]/90 text-slate-900 placeholder-slate-400'
                } ${isSubmitting ? 'opacity-60 cursor-not-allowed' : ''}`}
              />
            </div>
            {errors.email && (
              <p className="text-xs text-rose-400 mt-1 pl-1 flex items-center gap-1">
                <span>⚠</span> {errors.email}
              </p>
            )}
          </div>
        </div>

        {/* Row 2: Subject */}
        <div>
          <label
            htmlFor="contact-subject"
            className={`block text-xs font-semibold mb-1.5 ${
              isDark ? 'text-gray-300' : 'text-slate-700'
            }`}
          >
            Subject <span className="text-purple-400">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-purple-400">
              <Tag className="w-4 h-4" />
            </div>
            <input
              id="contact-subject"
              name="subject"
              type="text"
              value={formData.subject}
              onChange={handleChange}
              placeholder="Subject"
              disabled={isSubmitting}
              className={`w-full pl-10 pr-4 py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm border transition-all outline-none ${
                errors.subject
                  ? 'border-rose-500/70 focus:border-rose-400 focus:ring-1 focus:ring-rose-400'
                  : isDark
                    ? 'border-purple-500/25 focus:border-purple-400 focus:ring-1 focus:ring-purple-400/50'
                    : 'border-purple-200 focus:border-purple-500 focus:ring-1 focus:ring-purple-500/40'
              } ${
                isDark
                  ? 'bg-[#170e2b]/80 text-white placeholder-gray-400'
                  : 'bg-[#f8f5fc]/90 text-slate-900 placeholder-slate-400'
              } ${isSubmitting ? 'opacity-60 cursor-not-allowed' : ''}`}
            />
          </div>
          {errors.subject && (
            <p className="text-xs text-rose-400 mt-1 pl-1 flex items-center gap-1">
              <span>⚠</span> {errors.subject}
            </p>
          )}
        </div>

        {/* Row 3: Message */}
        <div>
          <label
            htmlFor="contact-message"
            className={`block text-xs font-semibold mb-1.5 ${
              isDark ? 'text-gray-300' : 'text-slate-700'
            }`}
          >
            Message <span className="text-purple-400">*</span>
          </label>
          <div className="relative">
            <div className="absolute top-3.5 left-0 pl-3.5 flex items-start pointer-events-none text-purple-400">
              <PenLine className="w-4 h-4" />
            </div>
            <textarea
              id="contact-message"
              name="message"
              rows={5}
              value={formData.message}
              onChange={handleChange}
              placeholder="Your Message..."
              disabled={isSubmitting}
              className={`w-full pl-10 pr-4 py-3 rounded-xl text-xs sm:text-sm border transition-all outline-none resize-y min-h-[120px] ${
                errors.message
                  ? 'border-rose-500/70 focus:border-rose-400 focus:ring-1 focus:ring-rose-400'
                  : isDark
                    ? 'border-purple-500/25 focus:border-purple-400 focus:ring-1 focus:ring-purple-400/50'
                    : 'border-purple-200 focus:border-purple-500 focus:ring-1 focus:ring-purple-500/40'
              } ${
                isDark
                  ? 'bg-[#170e2b]/80 text-white placeholder-gray-400'
                  : 'bg-[#f8f5fc]/90 text-slate-900 placeholder-slate-400'
              } ${isSubmitting ? 'opacity-60 cursor-not-allowed' : ''}`}
            />
          </div>
          {errors.message && (
            <p className="text-xs text-rose-400 mt-1 pl-1 flex items-center gap-1">
              <span>⚠</span> {errors.message}
            </p>
          )}
        </div>

        {/* Row 4: Submit Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-3.5 px-6 rounded-xl font-semibold text-sm text-white flex items-center justify-center gap-2 transition-all duration-200 shadow-lg cursor-pointer ${
              isSubmitting
                ? 'opacity-70 cursor-not-allowed bg-purple-700'
                : 'bg-gradient-to-r from-purple-600 via-fuchsia-600 to-indigo-600 hover:from-purple-500 hover:via-fuchsia-500 hover:to-indigo-500 hover:shadow-[0_0_25px_rgba(168,85,247,0.5)] active:scale-[0.99]'
            }`}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-white" />
                <span>Sending Message...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4 fill-current ml-0.5" />
                <span>Send Message</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ContactForm;

