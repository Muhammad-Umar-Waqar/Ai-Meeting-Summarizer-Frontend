import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import {
  createMeeting,
  setMeetingCode,
} from '../features/meeting/meetingSlice';
import {
  toggleNewMeetingMenu,
  closeNewMeetingMenu,
} from '../features/ui/uiSlice';
import {
  VideoCallIcon,
  KeyboardIcon,
  HelpIcon,
  FeedbackIcon,
  SettingsIcon,
  AppsIcon,
  KeyboardArrowDownIcon,
} from '../components/icons/MeetIcons';

export default function HomePage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const code = useAppSelector((s) => s.meeting.code);
  const menuOpen = useAppSelector((s) => s.ui.newMeetingMenuOpen);
  const [codeInput, setCodeInput] = useState(code || '');

  const startInstant = () => {
    dispatch(createMeeting());
    dispatch(closeNewMeetingMenu());
    navigate('/lobby');
  };

  const joinWithCode = (e) => {
    e.preventDefault();
    const trimmed = codeInput.trim();
    if (!trimmed) return;
    dispatch(setMeetingCode(trimmed));
    navigate('/lobby');
  };

  return (
    <div className="flex min-h-full flex-col bg-white">
      <header className="flex h-16 items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-2">
          <MeetLogo />
          <span className="text-xl text-meet-text-muted">Meet</span>
        </div>
        <div className="flex items-center gap-1 text-meet-text-muted">
          <span className="mr-2 hidden text-sm tabular-nums sm:inline">
            {new Date().toLocaleString([], {
              weekday: 'short',
              hour: 'numeric',
              minute: '2-digit',
            })}
          </span>
          <IconBtn label="Support">
            <HelpIcon />
          </IconBtn>
          <IconBtn label="Report a problem">
            <FeedbackIcon />
          </IconBtn>
          <IconBtn label="Settings">
            <SettingsIcon />
          </IconBtn>
          <IconBtn label="Google apps">
            <AppsIcon />
          </IconBtn>
          <button
            type="button"
            aria-label="Account"
            className="ml-1 flex h-9 w-9 items-center justify-center rounded-full bg-meet-blue text-sm font-medium text-white"
          >
            Y
          </button>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col items-center gap-10 px-6 py-10 lg:flex-row lg:items-center lg:justify-between lg:gap-16 lg:py-16">
        <div className="max-w-xl flex-1 text-center lg:text-left">
          <h1 className="text-4xl font-normal leading-tight tracking-tight text-meet-text sm:text-5xl">
            Video calls and meetings for everyone
          </h1>
          <p className="mt-4 text-base text-meet-text-muted sm:text-lg">
            Connect, collaborate, and celebrate from anywhere with Meet AI
          </p>

          <div className="mt-8 flex flex-col items-stretch gap-4 sm:flex-row sm:flex-wrap sm:items-center">
            <div className="relative">
              <button
                type="button"
                className="meet-btn-primary w-full sm:w-auto"
                onClick={() => dispatch(toggleNewMeetingMenu())}
              >
                <VideoCallIcon width={20} height={20} />
                New meeting
                <KeyboardArrowDownIcon width={18} height={18} />
              </button>
              <AnimatePresence>
                {menuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    className="absolute left-0 top-12 z-10 w-64 overflow-hidden rounded-xl bg-white py-2 shadow-meet-lg"
                  >
                    <button
                      type="button"
                      className="flex w-full px-4 py-2.5 text-left text-sm hover:bg-meet-surface-alt"
                      onClick={startInstant}
                    >
                      Start an instant meeting
                    </button>
                    <button
                      type="button"
                      className="flex w-full px-4 py-2.5 text-left text-sm hover:bg-meet-surface-alt"
                      onClick={startInstant}
                    >
                      Create a meeting for later
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <form
              onSubmit={joinWithCode}
              className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center"
            >
              <label className="relative flex min-w-[220px] flex-1 items-center rounded border border-meet-border px-3 focus-within:border-meet-blue focus-within:shadow-[inset_0_0_0_1px_#1a73e8]">
                <KeyboardIcon
                  width={20}
                  height={20}
                  className="shrink-0 text-meet-text-muted"
                />
                <input
                  type="text"
                  value={codeInput}
                  onChange={(e) => setCodeInput(e.target.value)}
                  placeholder="Enter a code or link"
                  className="w-full border-0 bg-transparent px-3 py-2.5 text-sm outline-none"
                  aria-label="Enter a code or link"
                />
              </label>
              <button
                type="submit"
                disabled={!codeInput.trim()}
                className="rounded px-4 py-2.5 text-sm font-medium text-meet-blue-text disabled:text-meet-border enabled:hover:bg-meet-blue-soft"
              >
                Join
              </button>
            </form>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex w-full max-w-md flex-col items-center"
        >
          <div className="relative aspect-square w-full max-w-[360px] overflow-hidden rounded-full bg-gradient-to-br from-[#e8f0fe] via-[#fce8e6] to-[#e6f4ea]">
            <div className="absolute inset-8 rounded-full border border-white/60 bg-white/40 backdrop-blur-sm" />
            <div className="absolute inset-0 flex flex-col items-center justify-center p-10 text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-meet">
                <VideoCallIcon width={32} height={32} className="text-meet-blue" />
              </div>
              <p className="text-lg font-medium text-meet-text">Get a link you can share</p>
              <p className="mt-2 text-sm text-meet-text-muted">
                Click <span className="font-medium">New meeting</span> to get a
                link you can send to people you want to meet with
              </p>
            </div>
          </div>
          <div className="mt-6 flex gap-2">
            <span className="h-2 w-2 rounded-full bg-meet-blue" />
            <span className="h-2 w-2 rounded-full bg-meet-border" />
            <span className="h-2 w-2 rounded-full bg-meet-border" />
          </div>
        </motion.div>
      </main>

      <footer className="pb-6 text-center text-sm text-meet-text-muted">
        <a href="#learn" className="text-meet-blue-text hover:underline">
          Learn more
        </a>{' '}
        about Meet AI
      </footer>
    </div>
  );
}

function MeetLogo() {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" aria-hidden="true">
      <path fill="#00832d" d="M24 16v8l6 3.5V12.5z" />
      <path fill="#0066da" d="M8 12h12v8H8z" />
      <path fill="#e94235" d="M8 20h12v8H8z" />
      <path fill="#ffba00" d="M20 12h4v8h-4z" />
      <path fill="#2684fc" d="M20 20h4v8h-4z" />
    </svg>
  );
}

function IconBtn({ label, children }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className="meet-icon-btn-light h-10 w-10"
    >
      {children}
    </button>
  );
}
