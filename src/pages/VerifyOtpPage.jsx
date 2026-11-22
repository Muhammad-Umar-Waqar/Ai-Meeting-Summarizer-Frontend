import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import {
  verifyOtp,
  resendOtp,
  clearError,
  clearSuccessMessage,
  setVerificationEmail,
} from '../features/auth/authSlice';

export default function VerifyOtpPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const {
    loading,
    resendLoading,
    error,
    successMessage,
    verificationEmail: storedEmail,
  } = useAppSelector((state) => state.auth);

  // Email passed from registration location state, or fallback to Redux/localStorage
  const email = location.state?.email || storedEmail || '';
  const [targetEmail, setTargetEmail] = useState(email);

  // 6 individual digit inputs for OTP
  const [digits, setDigits] = useState(['', '', '', '', '', '']);
  const inputRefs = useRef([]);

  // Countdown timer for resend
  const [countdown, setCountdown] = useState(60);
  const canResend = countdown <= 0;

  // Resend Email Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [customEmail, setCustomEmail] = useState(email);
  const [localSuccess, setLocalSuccess] = useState('');
  const [localError, setLocalError] = useState('');

  useEffect(() => {
    dispatch(clearError());
    dispatch(clearSuccessMessage());
    // Auto-focus first input
    inputRefs.current[0]?.focus();
  }, [dispatch]);

  // Resend countdown timer
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // Handle single digit change & auto advance
  const handleDigitChange = (index, value) => {
    // Only accept numeric digits
    const cleaned = value.replace(/\D/g, '');
    if (!cleaned) {
      const newDigits = [...digits];
      newDigits[index] = '';
      setDigits(newDigits);
      return;
    }

    // If user pasted or entered multiple digits
    if (cleaned.length > 1) {
      handlePasteDigits(cleaned);
      return;
    }

    const newDigits = [...digits];
    newDigits[index] = cleaned;
    setDigits(newDigits);

    // Auto-focus next input
    if (index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text').replace(/\D/g, '');
    handlePasteDigits(pasteData);
  };

  const handlePasteDigits = (pastedStr) => {
    if (!pastedStr) return;
    const newDigits = [...digits];
    for (let i = 0; i < 6; i++) {
      newDigits[i] = pastedStr[i] || '';
    }
    setDigits(newDigits);
    const lastFilled = Math.min(pastedStr.length, 5);
    inputRefs.current[lastFilled]?.focus();
  };

  const fullOtp = digits.join('');

  const handleVerify = async (e) => {
    e.preventDefault();
    setLocalError('');
    setLocalSuccess('');

    if (fullOtp.length !== 6) {
      setLocalError('Please enter all 6 digits of your verification code.');
      return;
    }

    const result = await dispatch(
      verifyOtp({
        email: targetEmail.trim(),
        otp: fullOtp,
      })
    );

    if (verifyOtp.fulfilled.match(result)) {
      setLocalSuccess('Account verified successfully! Redirecting to login…');
      setTimeout(() => {
        navigate('/login', {
          state: {
            verifiedEmail: targetEmail,
            message: 'Your account is verified! Please sign in.',
          },
        });
      }, 1500);
    }
  };

  const handleTriggerResend = async (emailToSend) => {
    const mail = (emailToSend || targetEmail).trim();
    if (!mail) {
      setLocalError('Please enter a valid email address.');
      return;
    }

    setLocalError('');
    setLocalSuccess('');
    dispatch(clearError());

    const result = await dispatch(resendOtp(mail));
    if (resendOtp.fulfilled.match(result)) {
      setLocalSuccess(`A new 6-digit OTP has been sent to ${mail}`);
      setTargetEmail(mail);
      dispatch(setVerificationEmail(mail));
      setIsModalOpen(false);
      setCountdown(60);
      setDigits(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-[#f8fafc] px-4 py-8 sm:px-6 lg:px-8">
      {/* Background ambient gradient */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-gradient-to-tr from-blue-100 to-indigo-100 opacity-70 blur-3xl" />
        <div className="absolute bottom-0 right-10 h-72 w-72 rounded-full bg-blue-50 opacity-80 blur-2xl" />
      </div>

      <div className="relative z-10 w-full max-w-5xl overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-xl shadow-slate-200/50">
        <div className="grid grid-cols-1 md:grid-cols-12">
          {/* Form Column */}
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
                Back to Sign in
              </Link>
            </div>

            <div className="mb-8">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
                <span className="h-1.5 w-1.5 rounded-full bg-blue-600 animate-pulse" />
                Security Verification
              </div>
              <h1 className="mt-3 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                Verify Your Account
              </h1>
              <p className="mt-2 text-sm text-slate-500">
                {targetEmail ? (
                  <>
                    Enter the 6-digit code sent to{' '}
                    <span className="font-semibold text-slate-800 break-all">
                      {targetEmail}
                    </span>
                  </>
                ) : (
                  'Enter the 6-digit code sent to your registered email'
                )}
              </p>
            </div>

            {/* Alerts */}
            {(error || localError) && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 rounded-xl border border-red-200 bg-red-50 p-3.5 text-sm text-red-700"
              >
                {error || localError}
              </motion.div>
            )}

            {(successMessage || localSuccess) && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 rounded-xl border border-emerald-200 bg-emerald-50 p-3.5 text-sm text-emerald-800"
              >
                {localSuccess || successMessage}
              </motion.div>
            )}

            <form onSubmit={handleVerify} className="space-y-6">
              {/* 6 Digit Inputs */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-3">
                  Verification Code (OTP)
                </label>
                <div
                  className="flex items-center justify-between gap-1.5 sm:gap-2.5"
                  onPaste={handlePaste}
                >
                  {digits.map((digit, idx) => (
                    <input
                      key={idx}
                      ref={(el) => (inputRefs.current[idx] = el)}
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleDigitChange(idx, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(idx, e)}
                      className="h-12 w-11 sm:h-14 sm:w-13 text-center text-xl sm:text-2xl font-bold text-slate-900 border border-slate-300 rounded-xl bg-slate-50/60 focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-100 transition-all outline-none"
                    />
                  ))}
                </div>
              </div>

              {/* Resend OTP Link and Timer */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-sm">
                <span className="text-slate-500">
                  {canResend ? (
                    "Didn't receive the email?"
                  ) : (
                    <>
                      Resend code in{' '}
                      <span className="font-semibold text-slate-700 tabular-nums">
                        {countdown}s
                      </span>
                    </>
                  )}
                </span>
                <button
                  type="button"
                  disabled={!canResend || resendLoading}
                  onClick={() => setIsModalOpen(true)}
                  className={`font-semibold text-left sm:text-right ${
                    canResend
                      ? 'text-blue-600 hover:text-blue-700 underline cursor-pointer'
                      : 'text-slate-400 cursor-not-allowed'
                  }`}
                >
                  {resendLoading ? 'Sending new code…' : 'Resend code'}
                </button>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={loading || fullOtp.length !== 6}
                className="w-full flex items-center justify-center rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-semibold text-white shadow-md shadow-blue-500/20 hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <SpinnerSmall />
                    Verifying…
                  </span>
                ) : (
                  'Verify & Continue'
                )}
              </button>

              <div className="pt-2 text-center text-sm text-slate-500">
                Wrong email address?{' '}
                <button
                  type="button"
                  onClick={() => setIsModalOpen(true)}
                  className="font-medium text-blue-600 hover:underline"
                >
                  Change email
                </button>
              </div>
            </form>
          </div>

          {/* Right Hero / Branded Showcase Column - Cohesive Light Theme */}
          <div className="hidden md:flex md:col-span-5 flex-col justify-between bg-gradient-to-br from-blue-50/90 via-indigo-50/40 to-slate-100/70 border-l border-slate-200/80 p-8 sm:p-10 text-slate-800">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-blue-100/90 border border-blue-200 px-3 py-1 text-xs font-bold text-blue-700 shadow-xs">
                Security Hub
              </div>
              <h2 className="mt-5 text-2xl font-extrabold text-slate-900 leading-snug">
                AI Meeting Summarizer & Real-Time Collaboration
              </h2>
              <p className="mt-2.5 text-sm text-slate-600 leading-relaxed">
                Experience next-generation intelligent meetings with instant transcriptions, automated action items, and secure role-based access.
              </p>
            </div>

            <div className="space-y-3.5 my-8">
              <FeaturePill
                title="End-to-End Secure"
                desc="Guaranteed verification with OTP authentication"
              />
              <FeaturePill
                title="AI Powered Summaries"
                desc="Key takeaways synthesized automatically"
              />
              <FeaturePill
                title="Cross-Device Responsive"
                desc="Seamless experience from desktop to mobile"
              />
            </div>

            <div className="border-t border-slate-200/80 pt-4 text-xs text-slate-500 font-medium">
              Protected Identity Verification &middot; Encrypted Session Auth
            </div>
          </div>
        </div>
      </div>

      {/* Resend Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
            >
              <h3 className="text-lg font-bold text-slate-900">Resend Verification Code</h3>
              <p className="mt-1 text-xs text-slate-500">
                Confirm or update the email address where you want to receive the new OTP code.
              </p>

              <div className="mt-4">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={customEmail}
                  onChange={(e) => setCustomEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={resendLoading || !customEmail.trim()}
                  onClick={() => handleTriggerResend(customEmail)}
                  className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
                >
                  {resendLoading ? 'Sending…' : 'Send Code'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function FeaturePill({ title, desc }) {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-slate-200/90 bg-white/95 p-3.5 shadow-xs">
      <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-700">
        <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </div>
      <div>
        <p className="text-xs font-bold text-slate-900">{title}</p>
        <p className="text-[11px] text-slate-500 mt-0.5">{desc}</p>
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
