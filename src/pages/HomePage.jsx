import { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { createMeeting, setMeetingCode } from '../features/meeting/meetingSlice';
import { closeNewMeetingMenu } from '../features/ui/uiSlice';
import { logout } from '../features/auth/authSlice';
import {
  VideoCallIcon,
  KeyboardIcon,
  KeyboardArrowDownIcon,
} from '../components/icons/MeetIcons';

export default function HomePage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const code = useAppSelector((s) => s.meeting.code);
  const { user, isAuthenticated } = useAppSelector((s) => s.auth);

  const [codeInput, setCodeInput] = useState(code || '');
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [isSimulatingAI, setIsSimulatingAI] = useState(false);
  const [copiedSummary, setCopiedSummary] = useState(false);
  const userMenuRef = useRef(null);

  // Close user dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleStartInstant = () => {
    if (!isAuthenticated) {
      navigate('/login', {
        state: {
          from: '/lobby',
          message: 'Please sign in or create an account to start a new meeting.',
        },
      });
      return;
    }
    dispatch(createMeeting());
    dispatch(closeNewMeetingMenu());
    navigate('/lobby');
  };

  const handleJoinWithCode = (e) => {
    e.preventDefault();
    const trimmed = codeInput.trim();
    if (!trimmed) return;

    if (!isAuthenticated) {
      navigate('/login', {
        state: {
          from: '/lobby',
          code: trimmed,
          message: 'Please sign in to join this meeting room.',
        },
      });
      return;
    }

    dispatch(setMeetingCode(trimmed));
    navigate('/lobby');
  };

  const handleLogout = () => {
    dispatch(logout());
    setUserMenuOpen(false);
  };

  const simulateAISummarization = () => {
    setIsSimulatingAI(true);
    setTimeout(() => {
      setIsSimulatingAI(false);
    }, 700);
  };

  const handleCopySummary = () => {
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 1500);
  };

  const scrollToSection = (e, id) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      const headerOffset = 95;
      const elementPosition = el.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : 'U';

  return (
    <div className="flex min-h-screen flex-col bg-[#f8fafc] text-slate-800 selection:bg-blue-600 selection:text-white overflow-x-hidden font-sans">
      {/* Top Navigation - Sticky with Blur */}
      <header className="sticky top-0 z-30 flex h-20 shrink-0 items-center justify-between border-b border-slate-200/80 px-4 sm:px-8 backdrop-blur-md bg-white/85 shadow-xs">
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <svg className="h-5 w-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <polygon points="23 7 16 12 23 17 23 7" />
                <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="text-base sm:text-lg font-bold tracking-tight text-slate-900 flex items-center gap-1.5">
                Meet AI
                <span className="rounded-full bg-blue-50 px-2 text-[10px] font-semibold text-blue-700 border border-blue-200">
                  Live
                </span>
              </span>
              <span className="text-[11px] text-slate-500 hidden sm:inline">Intelligent Meeting Summarizer</span>
            </div>
          </Link>
        </div>

        {/* Center Desktop Links with Smooth Sliding */}
        <nav className="hidden lg:flex items-center gap-8 text-sm font-medium text-slate-600">
          <a
            href="#preview"
            onClick={(e) => scrollToSection(e, 'preview')}
            className="hover:text-blue-600 transition-colors cursor-pointer"
          >
            Live Preview
          </a>
          <a
            href="#features"
            onClick={(e) => scrollToSection(e, 'features')}
            className="hover:text-blue-600 transition-colors cursor-pointer"
          >
            Capabilities
          </a>
          <a
            href="#workflow"
            onClick={(e) => scrollToSection(e, 'workflow')}
            className="hover:text-blue-600 transition-colors cursor-pointer"
          >
            How It Works
          </a>
        </nav>

        {/* Auth CTA or User Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          {isAuthenticated && user ? (
            <div className="relative" ref={userMenuRef}>
              <button
                type="button"
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2.5 rounded-full border border-slate-200 bg-white py-1 pl-1.5 pr-3 text-sm text-slate-700 shadow-xs hover:border-slate-300 transition"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white shadow-xs">
                  {userInitial}
                </div>
                <span className="font-semibold text-xs sm:text-sm hidden sm:inline">{user.name}</span>
                <KeyboardArrowDownIcon width={16} height={16} className="text-slate-400" />
              </button>

              <AnimatePresence>
                {userMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -4 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -4 }}
                    className="absolute right-0 top-12 z-50 w-64 overflow-hidden rounded-2xl border border-slate-200 bg-white p-3 text-slate-800 shadow-xl"
                  >
                    <div className="border-b border-slate-100 pb-3 px-2">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Signed in as</p>
                      <p className="text-sm font-bold text-slate-900 truncate mt-0.5">{user.name}</p>
                      <p className="text-xs text-slate-500 truncate">{user.email}</p>
                    </div>

                    <div className="pt-2">
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 rounded-xl px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 transition font-medium"
                      >
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                          <polyline points="16 17 21 12 16 7" />
                          <line x1="21" y1="12" x2="9" y2="12" />
                        </svg>
                        Sign out
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="rounded-full px-3.5 sm:px-4 py-2 text-xs sm:text-sm font-medium text-slate-700 hover:text-blue-600 transition"
              >
                Sign in
              </Link>
              <Link
                to="/register"
                className="rounded-full bg-blue-600 px-4 sm:px-5 py-2 text-xs sm:text-sm font-semibold text-white shadow-md shadow-blue-500/20 hover:bg-blue-700 transition"
              >
                Create Account
              </Link>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-1">
        {/* Hero Section with Direct Aceternity Dotted Background */}
        <section className="relative mx-auto max-w-6xl px-4 sm:px-6 pt-14 pb-16 sm:pt-20 sm:pb-20 text-center overflow-hidden rounded-3xl mt-2">
          {/* Aceternity UI Dotted Background with Radial Mask */}
          <div className="pointer-events-none absolute inset-0 -z-10 h-full w-full">
            <div className="absolute inset-0 h-full w-full bg-[radial-gradient(#cbd5e1_1.25px,transparent_1.25px)] [background-size:22px_22px] opacity-75 [mask-image:radial-gradient(ellipse_65%_55%_at_50%_45%,#000_65%,transparent_100%)]" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[420px] w-[620px] rounded-full bg-blue-100/50 blur-[90px]" />
          </div>

          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50/90 px-3.5 py-1.5 text-xs font-semibold text-blue-700 backdrop-blur-md mb-6 shadow-xs">
            <span className="flex h-2 w-2 rounded-full bg-blue-600 animate-pulse" />
            AI Meeting Intelligence &middot; Real-Time Insights
          </div>

          {/* Main Headline */}
          <h1 className="mx-auto max-w-4xl text-3xl font-extrabold tracking-tight text-slate-900 sm:text-5xl md:text-6xl leading-[1.15]">
            Meetings that take their own notes,{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600">
              synthesized in seconds.
            </span>
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-sm sm:text-base text-slate-600 leading-relaxed">
            Never miss an action item or decision. Stream real-time speech-to-text transcripts and generate structured executive summaries automatically.
          </p>

          {/* Quick Launchpad Control Bar */}
          <div className="mx-auto mt-9 max-w-xl rounded-2xl border border-slate-200/90 bg-white p-3 shadow-xl shadow-slate-200/50">
            <div className="flex flex-col sm:flex-row items-center gap-3">
              {/* Instant Meeting Action */}
              <button
                type="button"
                onClick={handleStartInstant}
                className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-md shadow-blue-500/25 hover:bg-blue-700 transition active:scale-[0.98]"
              >
                <VideoCallIcon width={20} height={20} />
                <span>Start Instant Meeting</span>
              </button>

              {/* Join With Code */}
              <form onSubmit={handleJoinWithCode} className="flex w-full flex-1 items-center gap-2">
                <div className="relative flex-1 flex items-center rounded-xl border border-slate-300 bg-slate-50/60 px-3 py-1.5 focus-within:border-blue-600 focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-100 transition">
                  <KeyboardIcon width={18} height={18} className="text-slate-400 shrink-0" />
                  <input
                    type="text"
                    value={codeInput}
                    onChange={(e) => setCodeInput(e.target.value)}
                    placeholder="Enter meeting code or link"
                    className="w-full border-0 bg-transparent px-2.5 py-1.5 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 outline-none"
                  />
                </div>
                <button
                  type="submit"
                  disabled={!codeInput.trim()}
                  className="rounded-xl border border-slate-200 bg-slate-100 px-4 py-2.5 text-xs sm:text-sm font-semibold text-slate-700 hover:bg-slate-200 disabled:opacity-40 transition"
                >
                  Join
                </button>
              </form>
            </div>

            {!isAuthenticated && (
              <p className="mt-2 text-[11px] text-slate-400 text-center">
                Sign in is required to join or host meetings with end-to-end OTP verification.
              </p>
            )}
          </div>
        </section>

        {/* Clean, Non-Text-Heavy Visual Preview Card - Unified Light Theme */}
        <section id="preview" className="scroll-mt-28 mx-auto max-w-5xl px-4 sm:px-6 py-4">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.4 }}
            className="rounded-3xl border border-slate-200/90 bg-white shadow-xl shadow-slate-200/40 overflow-hidden"
          >
            {/* Window Chrome Header */}
            <div className="flex items-center justify-between border-b border-slate-200/80 px-5 py-3 bg-slate-50/80">
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-red-400/90" />
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-400/90" />
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/90" />
                </div>
                <span className="text-xs font-bold text-slate-700 ml-2">Meet AI Collaboration Room</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200/60">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Live Session Active</span>
              </div>
            </div>

            {/* Unified Light Grid Layout */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-0 divide-y md:divide-y-0 md:divide-x divide-slate-200/80">
              {/* Left Column: Visual Call Tiles (Clean Light Aesthetic) */}
              <div className="md:col-span-6 p-5 flex flex-col justify-between bg-slate-50/60">
                <div className="grid grid-cols-2 gap-3 mb-4">
                  {/* Tile 1 */}
                  <div className="relative aspect-video rounded-2xl bg-white flex items-center justify-center border border-slate-200 shadow-xs overflow-hidden">
                    <div className="h-11 w-11 rounded-full bg-blue-600 flex items-center justify-center text-sm font-bold text-white shadow-sm ring-4 ring-blue-50">
                      SP
                    </div>
                    <div className="absolute bottom-2 left-2 flex items-center gap-1.5 text-[11px] font-medium text-slate-700 bg-white/95 px-2 py-0.5 rounded-md border border-slate-200/80 shadow-xs">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Sarah P.
                    </div>
                  </div>

                  {/* Tile 2 */}
                  <div className="relative aspect-video rounded-2xl bg-white flex items-center justify-center border border-slate-200 shadow-xs overflow-hidden">
                    <div className="h-11 w-11 rounded-full bg-indigo-600 flex items-center justify-center text-sm font-bold text-white shadow-sm ring-4 ring-indigo-50">
                      AJ
                    </div>
                    <div className="absolute bottom-2 left-2 text-[11px] font-medium text-slate-700 bg-white/95 px-2 py-0.5 rounded-md border border-slate-200/80 shadow-xs">
                      Alex J.
                    </div>
                  </div>
                </div>

                {/* Live Transcript Bubble */}
                <div className="rounded-2xl border border-slate-200/80 bg-white p-3.5 shadow-xs">
                  <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                    <span className="font-bold text-blue-600 flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-blue-600" />
                      Live Audio Transcription
                    </span>
                    <span className="text-slate-400">10:04 AM</span>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed font-normal">
                    &ldquo;Let us finalize the audio pipeline and verify all action items before deployment.&rdquo;
                  </p>
                </div>
              </div>

              {/* Right Column: Clean Instant AI Summary (Light Theme) */}
              <div className="md:col-span-6 p-5 flex flex-col justify-between bg-white">
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
                    <div className="flex items-center gap-2">
                      <span className="h-6 w-6 rounded-lg bg-blue-600 text-white font-bold text-xs flex items-center justify-center shadow-xs">
                        AI
                      </span>
                      <span className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                        Instant Executive Summary
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={simulateAISummarization}
                      disabled={isSimulatingAI}
                      className="text-[11px] font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 disabled:opacity-50"
                    >
                      <svg className={`h-3 w-3 ${isSimulatingAI ? 'animate-spin' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <polyline points="23 4 23 10 17 10" />
                        <polyline points="1 20 1 14 7 14" />
                        <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
                      </svg>
                      {isSimulatingAI ? 'Updating…' : 'Re-summarize'}
                    </button>
                  </div>

                  {/* Summary Bullets */}
                  <div className="space-y-3 text-xs">
                    <div>
                      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Takeaway</p>
                      <p className="text-slate-700 font-medium leading-relaxed bg-slate-50 p-2.5 rounded-xl border border-slate-200/70">
                        Roadmap approved. Low-latency audio streaming & OTP authentication verified for production.
                      </p>
                    </div>

                    <div>
                      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Key Outcomes</p>
                      <ul className="space-y-1 text-slate-600">
                        <li className="flex items-center gap-2">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" />
                          <span>WebRTC media channel active with multi-speaker detection</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" />
                          <span>OTP security enabled for all participants</span>
                        </li>
                      </ul>
                    </div>

                    <div>
                      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Action Items</p>
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-200/70">
                          <span className="text-slate-700 font-medium">Deploy audio pipeline</span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 border border-blue-200/60">Alex J.</span>
                        </div>
                        <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-200/70">
                          <span className="text-slate-700 font-medium">Verify mobile responsive UI</span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 border border-blue-200/60">Sarah P.</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
                  <span className="text-slate-400">98% Positive Sentiment</span>
                  <button
                    type="button"
                    onClick={handleCopySummary}
                    className="text-blue-600 font-semibold hover:underline"
                  >
                    {copiedSummary ? 'Copied!' : 'Copy Summary'}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Bento Grid Feature Capabilities */}
        <section id="features" className="scroll-mt-28 mx-auto max-w-6xl px-4 sm:px-6 py-14">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-xs font-bold uppercase tracking-widest text-blue-600">Engineered for Collaboration</h2>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1.5">
              Every meeting asset, structured and secured.
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Feature 1 */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs hover:border-blue-300 hover:shadow-md transition">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 mb-4 border border-blue-100">
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                  <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                  <line x1="12" y1="19" x2="12" y2="23" />
                  <line x1="8" y1="23" x2="16" y2="23" />
                </svg>
              </div>
              <h4 className="text-base font-bold text-slate-900">Live Speech Recognition</h4>
              <p className="mt-1.5 text-xs sm:text-sm text-slate-600 leading-relaxed">
                Captures high-fidelity audio streams with multi-speaker identification and real-time word sequencing.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs hover:border-indigo-300 hover:shadow-md transition">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 mb-4 border border-indigo-100">
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="9 11 12 14 22 4" />
                  <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                </svg>
              </div>
              <h4 className="text-base font-bold text-slate-900">Automatic Action Items</h4>
              <p className="mt-1.5 text-xs sm:text-sm text-slate-600 leading-relaxed">
                Context-aware NLP detects verbal commitments and organizes them into assigned tasks with due dates.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs hover:border-emerald-300 hover:shadow-md transition">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 mb-4 border border-emerald-100">
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              </div>
              <h4 className="text-base font-bold text-slate-900">OTP & JWT Verification</h4>
              <p className="mt-1.5 text-xs sm:text-sm text-slate-600 leading-relaxed">
                Guaranteed security with 6-digit email OTP verification, bcrypt password hashing, and token-based sessions.
              </p>
            </div>
          </div>
        </section>

        {/* Workflow Steps Section */}
        <section id="workflow" className="scroll-mt-28 mx-auto max-w-6xl px-4 sm:px-6 py-10 border-t border-slate-200 text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-1">
            Simple 3-Step Flow
          </p>
          <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-6">
            How Intelligent Meetings Work
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-left">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-100 text-xs font-bold text-blue-700 mb-3">
                1
              </span>
              <h5 className="font-bold text-slate-900 text-sm">Launch or Join</h5>
              <p className="mt-1 text-xs text-slate-600 leading-relaxed">
                Start an instant meeting or share your unique meeting code with team members.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-100 text-xs font-bold text-indigo-700 mb-3">
                2
              </span>
              <h5 className="font-bold text-slate-900 text-sm">Speak Freely</h5>
              <p className="mt-1 text-xs text-slate-600 leading-relaxed">
                Audio is streamed and transcribed in real time with continuous multi-speaker detection.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-100 text-xs font-bold text-emerald-700 mb-3">
                3
              </span>
              <h5 className="font-bold text-slate-900 text-sm">Receive Executive Notes</h5>
              <p className="mt-1 text-xs text-slate-600 leading-relaxed">
                Review automated summaries, agreed decisions, and action items ready to export.
              </p>
            </div>
          </div>
        </section>

        {/* Bottom CTA Banner */}
        <section className="mx-auto max-w-4xl px-4 sm:px-6 py-12 text-center">
          <div className="rounded-3xl border border-blue-200 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 p-8 sm:p-10 shadow-xl shadow-blue-500/20 text-white">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
              Ready to elevate your team discussions?
            </h3>
            <p className="mt-2 text-sm text-blue-100 max-w-xl mx-auto">
              Join Meet AI now to host secure calls, transcribe speech, and generate automated summaries.
            </p>
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
              {isAuthenticated ? (
                <button
                  type="button"
                  onClick={handleStartInstant}
                  className="rounded-xl bg-white px-6 py-3 text-sm font-bold text-blue-700 shadow-md hover:bg-blue-50 transition w-full sm:w-auto"
                >
                  Start Meeting Now &rarr;
                </button>
              ) : (
                <>
                  <Link
                    to="/register"
                    className="rounded-xl bg-white px-6 py-3 text-sm font-bold text-blue-700 shadow-md hover:bg-blue-50 transition w-full sm:w-auto"
                  >
                    Create Free Account
                  </Link>
                  <Link
                    to="/login"
                    className="rounded-xl border border-white/30 bg-white/10 px-6 py-3 text-sm font-bold text-white hover:bg-white/20 transition w-full sm:w-auto"
                  >
                    Sign In to Account
                  </Link>
                </>
              )}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 px-4 text-center text-xs text-slate-500">
        <p className="font-medium text-slate-700">Meet AI &middot; Enterprise Meeting Intelligence & Real-Time Summarization</p>
        <p className="mt-1 text-slate-400">Secure end-to-end meetings with automated transcript synthesis</p>
      </footer>
    </div>
  );
}
