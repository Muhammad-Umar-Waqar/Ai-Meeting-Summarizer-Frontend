import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import {
  toggleMic,
  toggleCam,
  toggleCaptions,
  toggleHand,
  togglePresent,
  resetMedia,
} from '../features/media/mediaSlice';
import {
  syncSelfMedia,
  clearParticipants,
} from '../features/participants/participantsSlice';
import {
  openSidePanel,
  toggleMoreMenu,
  closeMoreMenu,
  resetUi,
} from '../features/ui/uiSlice';
import { leaveMeeting } from '../features/meeting/meetingSlice';
import {
  MicIcon,
  MicOffIcon,
  VideocamIcon,
  VideocamOffIcon,
  CallEndIcon,
  ClosedCaptionIcon,
  PresentToAllIcon,
  MoreVertIcon,
  PeopleIcon,
  ChatIcon,
  AppsIcon,
  HandIcon,
  InfoIcon,
} from './icons/MeetIcons';

function ControlButton({
  label,
  onClick,
  active = false,
  danger = false,
  children,
  wide = false,
  badge = null,
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      className={`relative inline-flex items-center justify-center transition-colors rounded-full ${
        wide
          ? 'h-10 sm:h-12 px-3 sm:px-5'
          : 'h-10 w-10 sm:h-12 sm:w-12 shrink-0'
      } ${
        danger
          ? 'bg-meet-red text-white hover:bg-meet-red-dark shadow-sm'
          : active
            ? 'bg-meet-icon-light text-meet-dark hover:bg-white shadow-sm'
            : 'meet-icon-btn-dark'
      }`}
    >
      {children}
      {badge !== null && (
        <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-meet-blue px-1 text-[10px] font-bold text-white shadow-xs">
          {badge}
        </span>
      )}
    </button>
  );
}

function MeetingClock() {
  const startedAt = useAppSelector((s) => s.meeting.startedAt);
  const code = useAppSelector((s) => s.meeting.code);
  const [time, setTime] = useState(() => formatNow());

  useEffect(() => {
    const id = setInterval(() => setTime(formatNow()), 1000);
    return () => clearInterval(id);
  }, [startedAt]);

  return (
    <div className="flex min-w-0 items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-meet-icon-light">
      <span className="tabular-nums font-medium">{time}</span>
      <span className="hidden text-meet-dark-hover sm:inline">|</span>
      <span className="hidden truncate sm:inline max-w-[120px]">{code || 'meeting'}</span>
    </div>
  );
}

function formatNow() {
  return new Date().toLocaleTimeString([], {
    hour: 'numeric',
    minute: '2-digit',
  });
}

export default function ControlBar() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const media = useAppSelector((s) => s.media);
  const ui = useAppSelector((s) => s.ui);
  const participants = useAppSelector((s) => s.participants.list);
  const moreMenuRef = useRef(null);

  // Close more menu on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (moreMenuRef.current && !moreMenuRef.current.contains(e.target)) {
        dispatch(closeMoreMenu());
      }
    }
    if (ui.moreMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [ui.moreMenuOpen, dispatch]);

  const leave = () => {
    dispatch(leaveMeeting());
    dispatch(clearParticipants());
    dispatch(resetMedia());
    dispatch(resetUi());
    navigate('/');
  };

  const withSelfSync = (action, patch) => {
    dispatch(action());
    dispatch(syncSelfMedia(patch));
  };

  return (
    <footer className="relative flex h-16 sm:h-20 shrink-0 items-center justify-between px-2 sm:px-4 text-meet-icon-light bg-meet-dark border-t border-white/5 select-none">
      {/* Left section: Clock / Info */}
      <div className="flex items-center min-w-0 max-w-[90px] sm:max-w-none">
        <MeetingClock />
      </div>

      {/* Center section: Media controls & leave call */}
      <div className="flex items-center justify-center gap-1.5 sm:gap-2.5">
        <ControlButton
          label={media.micOn ? 'Turn off microphone' : 'Turn on microphone'}
          active={!media.micOn}
          onClick={() => withSelfSync(toggleMic, { micOn: !media.micOn })}
        >
          {media.micOn ? <MicIcon /> : <MicOffIcon />}
        </ControlButton>

        <ControlButton
          label={media.camOn ? 'Turn off camera' : 'Turn on camera'}
          active={!media.camOn}
          onClick={() => withSelfSync(toggleCam, { camOn: !media.camOn })}
        >
          {media.camOn ? <VideocamIcon /> : <VideocamOffIcon />}
        </ControlButton>

        <ControlButton
          label="Turn on captions"
          active={media.captionsOn}
          onClick={() => dispatch(toggleCaptions())}
        >
          <ClosedCaptionIcon />
        </ControlButton>

        {/* Hand raise: visible on sm+ screens */}
        <div className="hidden sm:block">
          <ControlButton
            label="Raise hand"
            active={media.handRaised}
            onClick={() =>
              withSelfSync(toggleHand, { handRaised: !media.handRaised })
            }
          >
            <HandIcon />
          </ControlButton>
        </div>

        {/* Present: visible on md+ screens */}
        <div className="hidden md:block">
          <ControlButton
            label="Present now"
            active={media.presenting}
            onClick={() => dispatch(togglePresent())}
          >
            <PresentToAllIcon />
          </ControlButton>
        </div>

        {/* More options (Settings, Details, Hand raise on mobile) */}
        <div className="relative" ref={moreMenuRef}>
          <ControlButton
            label="More options"
            active={ui.moreMenuOpen}
            onClick={() => dispatch(toggleMoreMenu())}
          >
            <MoreVertIcon />
          </ControlButton>

          {ui.moreMenuOpen && (
            <div className="absolute bottom-12 sm:bottom-14 left-1/2 z-50 w-56 -translate-x-1/2 overflow-hidden rounded-2xl bg-white py-2 text-meet-text shadow-2xl border border-slate-100">
              {/* Mobile-only items in More menu */}
              <button
                type="button"
                className="flex sm:hidden w-full items-center gap-3 px-4 py-2.5 text-sm hover:bg-slate-50 text-slate-700"
                onClick={() => {
                  withSelfSync(toggleHand, { handRaised: !media.handRaised });
                  dispatch(closeMoreMenu());
                }}
              >
                <HandIcon width={20} height={20} />
                {media.handRaised ? 'Lower hand' : 'Raise hand'}
              </button>
              <button
                type="button"
                className="flex md:hidden w-full items-center gap-3 px-4 py-2.5 text-sm hover:bg-slate-50 text-slate-700"
                onClick={() => {
                  dispatch(togglePresent());
                  dispatch(closeMoreMenu());
                }}
              >
                <PresentToAllIcon width={20} height={20} />
                {media.presenting ? 'Stop presenting' : 'Present screen'}
              </button>
              <button
                type="button"
                className="flex w-full items-center gap-3 px-4 py-2.5 text-sm hover:bg-slate-50 text-slate-700"
                onClick={() => {
                  dispatch(openSidePanel('activities'));
                  dispatch(closeMoreMenu());
                }}
              >
                <AppsIcon width={20} height={20} />
                AI Summaries & Notes
              </button>
              <button
                type="button"
                className="flex w-full items-center gap-3 px-4 py-2.5 text-sm hover:bg-slate-50 text-slate-700"
                onClick={() => {
                  dispatch(openSidePanel('people'));
                  dispatch(closeMoreMenu());
                }}
              >
                <InfoIcon width={20} height={20} />
                Meeting details
              </button>
            </div>
          )}
        </div>

        {/* Leave call button */}
        <ControlButton label="Leave call" danger wide onClick={leave}>
          <CallEndIcon />
        </ControlButton>
      </div>

      {/* Right section: Panels triggers (People, Chat, Activities) */}
      <div className="flex items-center justify-end gap-1 sm:gap-2">
        <ControlButton
          label="People"
          active={ui.sidePanel === 'people'}
          badge={participants.length}
          onClick={() =>
            dispatch(
              openSidePanel(ui.sidePanel === 'people' ? null : 'people')
            )
          }
        >
          <PeopleIcon />
        </ControlButton>

        <ControlButton
          label="Chat with everyone"
          active={ui.sidePanel === 'chat'}
          onClick={() =>
            dispatch(openSidePanel(ui.sidePanel === 'chat' ? null : 'chat'))
          }
        >
          <ChatIcon />
        </ControlButton>

        <div className="hidden sm:block">
          <ControlButton
            label="AI Activities"
            active={ui.sidePanel === 'activities'}
            onClick={() =>
              dispatch(
                openSidePanel(ui.sidePanel === 'activities' ? null : 'activities')
              )
            }
          >
            <AppsIcon />
          </ControlButton>
        </div>
      </div>
    </footer>
  );
}
