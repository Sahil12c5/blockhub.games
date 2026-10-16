"use client";

import { useState } from "react";
import Breadcrumbs from "@/components/Breadcrumbs";
import { Mail, MessageSquare, Send, CheckCircle2, Gamepad2, Shield } from "lucide-react";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "General Inquiry",
    message: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

    try {
      const accessKey =
        process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY ||
        "6374e5d6-a850-4ad3-88ce-7dd121364f44";

      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          access_key: accessKey,
          from_name: "BlockHub Games Contact Form",
          subject: `[BlockHub] ${formData.subject} from ${formData.name}`,
          name: formData.name,
          email: formData.email,
          topic: formData.subject,
          message: formData.message,
        }),
      });

      const result = await response.json();
      if (result.success) {
        setSubmitted(true);
      } else {
        setErrorMessage(
          result.message || "Failed to send message. Please try again."
        );
      }
    } catch (err) {
      setErrorMessage("Network error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Breadcrumbs items={[{ label: "Contact Us" }]} />

      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 sm:p-10 backdrop-blur-sm space-y-8">
        <div className="border-b border-slate-800 pb-6">
          <div className="flex items-center gap-2 mb-2">
            <Mail className="h-5 w-5 text-emerald-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              Get in Touch
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            Contact & Support
          </h1>
          <p className="text-sm text-slate-300 mt-2 leading-relaxed">
            Have a game bug report, partnership inquiry, or developer submission? We&apos;d love to hear from you.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Left Info Column */}
          <div className="md:col-span-5 space-y-6">
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Mail className="h-4 w-4 text-emerald-400" />
                Direct Email
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                For official correspondence, developer submissions, and DMCA inquiries:
              </p>
              <a
                href="mailto:sahilchawan005@gmail.com"
                className="inline-block text-xs font-mono font-bold text-emerald-400 hover:underline"
              >
                sahilchawan005@gmail.com
              </a>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Gamepad2 className="h-4 w-4 text-emerald-400" />
                Game Developers & Publishers
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Are you an HTML5 voxel game creator? We feature high quality games distributed via GameMonetize and GameDistribution. Submit your embed link and game details to get featured on BlockHub.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Shield className="h-4 w-4 text-emerald-400" />
                Response Guarantee
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Our support team typically reviews all developer submissions and bug reports within 24 to 48 business hours.
              </p>
            </div>
          </div>

          {/* Right Contact Form Column */}
          <div className="md:col-span-7">
            {submitted ? (
              <div className="p-8 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-3">
                <div className="h-12 w-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <h3 className="text-base font-bold text-white">Message Received!</h3>
                <p className="text-xs text-slate-300 max-w-sm mx-auto leading-relaxed">
                  Thank you for reaching out to BlockHub.games. Our team will review your message and reply back shortly.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-3 px-4 py-2 rounded-lg bg-slate-800 text-xs font-bold text-slate-200 hover:bg-slate-700 transition-colors"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Steve Miner"
                    className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3.5 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    Your Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="steve@example.com"
                    className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3.5 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    Inquiry Topic
                  </label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 transition-colors cursor-pointer"
                  >
                    <option value="General Inquiry">General Question</option>
                    <option value="Game Bug Report">Game Bug / Broken Embed Report</option>
                    <option value="Developer Submission">Game Developer Submission</option>
                    <option value="AdSense / Partnership">Advertising & Partnerships</option>
                    <option value="DMCA Request">Copyright / DMCA Notice</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    Message
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Provide details about your question, game recommendation, or bug..."
                    className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3.5 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>

                {errorMessage && (
                  <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs">
                    {errorMessage}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-60 disabled:cursor-not-allowed text-slate-950 font-black text-xs transition-all shadow-md shadow-emerald-500/20"
                >
                  {loading ? (
                    <>
                      <span className="h-4 w-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></span>
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
