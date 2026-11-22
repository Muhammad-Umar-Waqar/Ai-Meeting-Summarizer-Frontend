import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import {
  setDisplayName,
  joinMeeting,
  createMeeting,
} from '../features/meeting/meetingSlice';
import { toggleMic, toggleCam } from '../features/media/mediaSlice';
import { loadMockParticipants } from '../features/participants/participantsSlice';
import {
  MicIcon,
  MicOffIcon,
  VideocamIcon,
  VideocamOffIcon,
  PresentToAllIcon,
} from '../components/icons/MeetIcons';

export default function LobbyPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const meeting = useAppSelector((s) => s.meeting);
  const media = useAppSelector((s) => s.media);
  const authUser = useAppSelector((s) => s.auth.user);

  useEffect(() => {
    if (authUser?.name && (!meeting.displayName || meeting.displayName === 'You')) {
      dispatch(setDisplayName(authUser.name));
    }
  }, [authUser, meeting.displayName, dispatch]);

  const ensureCode = () => {
    if (!meeting.code) dispatch(createMeeting());
  };

  const join = () => {
    ensureCode();
    dispatch(joinMeeting());
    dispatch(
      loadMockParticipants({
        displayName: meeting.displayName || authUser?.name || 'You',
        micOn: media.micOn,
        camOn: media.camOn,
      }),
    );
    navigate('/room');
  };

  const initials = (meeting.displayName || authUser?.name || 'You')
    .split(' ')
    .filter(Boolean)
    .map((p) => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() || 'Y';

  return (
    <div className="flex min-h-screen flex-col bg-white overflow-x-hidden">
      {/* Top simple nav */}
      <header className="flex h-14 items-center justify-between px-4 sm:px-6 border-b border-slate-100">
        <Link to="/" className="flex items-center gap-2">
          <MeetLogoSmall />
          <span className="font-semibold text-slate-800">Meet AI</span>
        </Link>
        <button
          type="button"
          onClick={() => navigate('/')}
          className="text-xs sm:text-sm font-medium text-slate-500 hover:text-slate-800"
        >
          &larr; Back to Home
        </button>
      </header>

      <div className="flex flex-1 flex-col items-center justify-center p-4 sm:p-6 lg:flex-row lg:gap-12 max-w-6xl mx-auto w-full">
        {/* Video Preview Card */}
        <div className="flex w-full flex-1 flex-col items-center justify-center max-w-xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative w-full aspect-video overflow-hidden rounded-2xl bg-meet-dark shadow-xl"
          >
            {media.camOn ? (
              <div className="absolute inset-0 bg-gradient-to-br from-[#3c4043] to-[#202124]">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="flex h-20 w-20 sm:h-24 sm:w-24 items-center justify-center rounded-full bg-meet-blue text-2xl sm:text-3xl font-bold text-white shadow-lg">
                    {initials}
                  </div>
                </div>
                <p className="absolute left-3 top-3 sm:left-4 sm:top-4 text-xs sm:text-sm text-white/80">
                  Camera starting…
                </p>
              </div>
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-meet-dark text-white">
                <div className="flex h-20 w-20 sm:h-24 sm:w-24 items-center justify-center rounded-full bg-meet-blue text-2xl sm:text-3xl font-bold">
                  {initials}
                </div>
                <p className="text-xs sm:text-sm text-white/70">Camera is off</p>
              </div>
            )}

            {/* Media Toggles */}
            <div className="absolute bottom-3 sm:bottom-4 left-1/2 flex -translate-x-1/2 gap-3 z-10">
              <button
                type="button"
                aria-label={media.micOn ? 'Mute microphone' : 'Unmute microphone'}
                onClick={() => dispatch(toggleMic())}
                className={`flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-full border border-white/20 transition-all ${
                  media.micOn
                    ? 'bg-black/40 text-white hover:bg-black/60'
                    : 'bg-meet-red text-white hover:bg-meet-red-dark shadow-md'
                }`}
              >
                {media.micOn ? <MicIcon /> : <MicOffIcon />}
              </button>
              <button
                type="button"
                aria-label={media.camOn ? 'Turn off camera' : 'Turn on camera'}
                onClick={() => dispatch(toggleCam())}
                className={`flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-full border border-white/20 transition-all ${
                  media.camOn
                    ? 'bg-black/40 text-white hover:bg-black/60'
                    : 'bg-meet-red text-white hover:bg-meet-red-dark shadow-md'
                }`}
              >
                {media.camOn ? <VideocamIcon /> : <VideocamOffIcon />}
              </button>
            </div>

            <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 text-xs sm:text-sm font-medium text-white truncate max-w-[140px] sm:max-w-none">
              {meeting.displayName || 'You'}
            </div>
          </motion.div>
        </div>

        {/* Join Actions Form */}
        <div className="mt-6 flex w-full flex-col items-center justify-center lg:mt-0 lg:w-[380px] lg:shrink-0 text-center lg:text-left">
          <h1 className="text-2xl sm:text-3xl font-medium text-meet-text">Ready to join?</h1>
          <p className="mt-1.5 text-xs sm:text-sm text-meet-text-muted">
            {meeting.code
              ? `Meeting code: ${meeting.code}`
              : 'Join as guest or with your account'}
          </p>

          <label className="mt-5 w-full max-w-sm">
            <span className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5 text-left">
              Your Display Name
            </span>
            <input
              type="text"
              value={meeting.displayName}
              onChange={(e) => dispatch(setDisplayName(e.target.value))}
              className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm outline-none focus:border-meet-blue focus:ring-4 focus:ring-blue-100 transition"
              placeholder="Enter your name"
            />
          </label>

          <div className="mt-5 flex w-full max-w-sm flex-col gap-2.5 sm:flex-row">
            <button
              type="button"
              className="meet-btn-primary flex-1 min-h-[44px] justify-center"
              onClick={join}
            >
              Join now
            </button>
            <button
              type="button"
              className="meet-btn-secondary flex-1 min-h-[44px] justify-center"
              onClick={join}
            >
              <PresentToAllIcon width={18} height={18} />
              <span>Present</span>
            </button>
          </div>

          <button
            type="button"
            className="mt-6 text-xs sm:text-sm text-meet-blue-text hover:underline"
            onClick={() => navigate('/')}
          >
            Other ways to join
          </button>
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
