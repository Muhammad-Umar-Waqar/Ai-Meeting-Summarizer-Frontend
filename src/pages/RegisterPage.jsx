import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { registerUser, clearError } from '../features/auth/authSlice';

export default function RegisterPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated } = useAppSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState('');

  useEffect(() => {
    dispatch(clearError());
    if (isAuthenticated) {
      navigate('/');
    }
  }, [dispatch, isAuthenticated, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');
    dispatch(clearError());

    if (!formData.name.trim() || !formData.email.trim() || !formData.password) {
      setLocalError('Please fill in all required fields.');
      return;
    }

    if (formData.password.length < 6) {
      setLocalError('Password must be at least 6 characters.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setLocalError('Passwords do not match.');
      return;
    }

    const result = await dispatch(
      registerUser({
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
      })
    );

    if (registerUser.fulfilled.match(result)) {
      // Redirect directly to /verify-otp with target email state
      navigate('/verify-otp', {
        state: { email: formData.email.trim() },
      });
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-[#f8fafc] px-4 py-8 sm:px-6 lg:px-8">
      {/* Background ambient lighting */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 left-1/3 h-96 w-96 rounded-full bg-blue-100 opacity-60 blur-3xl" />
        <div className="absolute bottom-10 right-1/4 h-80 w-80 rounded-full bg-indigo-50 opacity-70 blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-5xl overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-xl shadow-slate-200/50">
        <div className="grid grid-cols-1 md:grid-cols-12">
          {/* Left: Registration Form */}
          <div className="p-6 sm:p-10 md:col-span-7 lg:p-12">
            <div className="mb-6 flex items-center justify-between">
              <Link to="/" className="flex items-center gap-2">
                <MeetLogoSmall />
                <span className="font-semibold text-slate-800">Meet AI</span>
              </Link>
              <Link
                to="/login"
                className="text-xs font-medium text-blue-600 hover:text-blue-700"
              >
                Sign in instead
              </Link>
            </div>

            <div className="mb-6">
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                Create an account
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                Join Meet AI to organize, attend, and automatically summarize meetings.
              </p>
            </div>

            {/* Error alerts */}
            {(error || localError) && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-5 rounded-xl border border-red-200 bg-red-50 p-3.5 text-sm text-red-700"
              >
                {error || localError}
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Alex Johnson"
                  className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="alex@example.com"
                  className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="At least 6 characters"
                    className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 pr-10 text-sm text-slate-900 outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                  Confirm Password
                </label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Repeat your password"
                  className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-semibold text-white shadow-md shadow-blue-500/20 hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 transition-all disabled:opacity-50"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <SpinnerSmall />
                      Creating account & sending OTP…
                    </span>
                  ) : (
                    'Sign Up'
                  )}
                </button>
              </div>

              <p className="pt-2 text-center text-xs text-slate-500">
                By creating an account, an OTP code will be sent to your email to verify identity.
              </p>
            </form>
          </div>

          {/* Right: Branding side panel - Cohesive Light Theme */}
          <div className="hidden md:flex md:col-span-5 flex-col justify-between bg-gradient-to-br from-blue-50/90 via-indigo-50/40 to-slate-100/70 border-l border-slate-200/80 p-8 sm:p-9 text-slate-800">
            <div>
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-100/90 border border-blue-200 px-3 py-1 text-xs font-bold text-blue-700 shadow-2xs">
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-600 animate-pulse" />
                  Enterprise Workspace
                </span>
                <span className="text-[11px] font-semibold text-slate-400 tracking-wide uppercase">
                  v2.4 Cloud
                </span>
              </div>
              <h2 className="mt-4 text-2xl font-extrabold text-slate-900 leading-snug">
                Smart Meetings with Automated AI Insights
              </h2>
              <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
                Seamless video collaboration integrated with real-time speech transcription and automated summary generation.
              </p>
            </div>

            {/* Live Interactive Meeting Insight Preview */}
            <div className="my-4 rounded-2xl border border-slate-200/90 bg-white/95 p-3.5 shadow-2xs">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-2">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                  </span>
                  <span className="text-xs font-bold text-slate-800">Sprint Planning Sync</span>
                </div>
                <span className="text-[10px] font-medium text-slate-400 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-200/60">
                  Live &middot; 24m
                </span>
              </div>

              {/* Transcript snippet */}
              <div className="flex items-start gap-2.5 bg-slate-50/90 rounded-xl p-2.5 border border-slate-100 mb-2.5">
                <div className="h-6 w-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] font-bold shrink-0">
                  SP
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-800">Sarah P. (Product)</span>
                    <span className="text-[10px] text-slate-400">10:04 AM</span>
                  </div>
                  <p className="text-[11px] text-slate-600 mt-0.5 leading-snug italic">
                    "Streaming audio pipeline verified. All meeting action items are automatically synthesized."
                  </p>
                </div>
              </div>

              {/* Synthesized Extraction Preview */}
              <div className="rounded-xl bg-gradient-to-r from-blue-50/70 to-indigo-50/50 p-2.5 border border-blue-100">
                <div className="flex items-center justify-between mb-1">
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-blue-700">
                    <span className="flex h-3.5 w-3.5 items-center justify-center rounded-sm bg-blue-600 text-[8px] text-white">AI</span>
                    Synthesized Summary
                  </span>
                  <span className="text-[10px] font-semibold text-emerald-700">98% Accuracy</span>
                </div>
                <p className="text-[11px] font-medium text-slate-700 leading-snug">
                  Key Takeaway: Low-latency audio streaming & 6-digit OTP security verified for production deployment.
                </p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  <span className="inline-flex items-center gap-1 rounded-md bg-white px-2 py-0.5 text-[10px] font-medium text-slate-700 border border-slate-200/80 shadow-2xs">
                    <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                    Deploy audio pipeline
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-md bg-white px-2 py-0.5 text-[10px] font-medium text-slate-700 border border-slate-200/80 shadow-2xs">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    Verify OTP flow
                  </span>
                </div>
              </div>
            </div>

            {/* Feature Capabilities Grid */}
            <div className="space-y-2 mb-3">
              <div className="flex items-center gap-3 rounded-xl border border-slate-200/80 bg-white/90 p-2.5 shadow-2xs">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-700 font-bold text-xs">
                  AI
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="text-xs font-bold text-slate-800">Meeting Summarization</h4>
                  <p className="text-[11px] text-slate-500 truncate">Action items, key takeaways & structured notes</p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-xl border border-slate-200/80 bg-white/90 p-2.5 shadow-2xs">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 100-6 3 3 0 000 6z" />
                  </svg>
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="text-xs font-bold text-slate-800">Real-Time Transcription</h4>
                  <p className="text-[11px] text-slate-500 truncate">Low-latency streaming audio with speaker identification</p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-xl border border-slate-200/80 bg-white/90 p-2.5 shadow-2xs">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-100 text-indigo-700">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="text-xs font-bold text-slate-800">Verified Security & OTP</h4>
                  <p className="text-[11px] text-slate-500 truncate">Encrypted JWT session tokens & email verification</p>
                </div>
              </div>
            </div>

            {/* Highlights Bar */}
            <div className="flex items-center justify-between text-[11px] text-slate-600 bg-white/80 px-3 py-2 rounded-xl border border-slate-200/70 mb-3">
              <span className="flex items-center gap-1 font-semibold text-slate-700">
                <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                &lt; 3s AI Synthesis
              </span>
              <span>&middot;</span>
              <span className="flex items-center gap-1 font-semibold text-slate-700">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                WebRTC Encrypted
              </span>
              <span>&middot;</span>
              <span className="flex items-center gap-1 font-semibold text-slate-700">
                <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
                Zero Retention
              </span>
            </div>

            <div className="border-t border-slate-200/80 pt-3 text-xs text-slate-500 font-medium flex items-center justify-between">
              <span>Enterprise Meeting Intelligence</span>
              <span>Secure Cloud Infrastructure</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MeetLogoSmall() {
  return (
    <svg width="28" height="28" viewBox="0 0 40 40" aria-hidden="true">
      <path fill="#00832d" d="M24 16v8l6 3.5V12.5z" />
      <path fill="#0066da" d="M8 12h12v8H8z" />
      <path fill="#e94235" d="M8 20h12v8H8z" />
      <path fill="#ffba00" d="M20 12h4v8h-4z" />
      <path fill="#2684fc" d="M20 20h4v8h-4z" />
    </svg>
  );
}

function SpinnerSmall() {
  return (
    <svg className="h-4 w-4 animate-spin text-white" viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
    </svg>
  );
}
