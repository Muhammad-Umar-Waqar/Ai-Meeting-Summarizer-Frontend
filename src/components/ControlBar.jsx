import { useEffect, useState } from 'react';
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
  SettingsIcon,
} from './icons/MeetIcons';

function ControlButton({
  label,
  onClick,
  active = false,
  danger = false,
  children,
  wide = false,
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      className={`${
        wide
          ? 'inline-flex h-12 min-w-[56px] items-center justify-center rounded-control px-4'
          : 'meet-icon-btn'
      } ${
        danger
          ? 'bg-meet-red text-white hover:bg-meet-red-dark'
          : active
            ? 'bg-meet-icon-light text-meet-dark hover:bg-white'
            : 'meet-icon-btn-dark'
      } transition-colors`}
    >
      {children}
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
    <div className="flex min-w-0 items-center gap-2 text-sm text-meet-icon-light">
      <span className="tabular-nums">{time}</span>
      <span className="hidden text-meet-dark-hover sm:inline">|</span>
      <span className="hidden truncate sm:inline">{code || 'meeting'}</span>
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
    <div className="grid h-20 shrink-0 grid-cols-[1fr_auto_1fr] items-center gap-2 px-2 text-meet-icon-light sm:px-4">
      <div className="min-w-0 justify-self-start">
        <MeetingClock />
      </div>

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

        <div className="hidden md:block">
          <ControlButton
            label="Present now"
            active={media.presenting}
            onClick={() => dispatch(togglePresent())}
          >
            <PresentToAllIcon />
          </ControlButton>
        </div>

        <div className="relative hidden sm:block">
          <ControlButton
            label="More options"
            onClick={() => dispatch(toggleMoreMenu())}
          >
            <MoreVertIcon />
          </ControlButton>
          {ui.moreMenuOpen && (
            <div
              className="absolute bottom-14 left-1/2 z-20 w-56 -translate-x-1/2 overflow-hidden rounded-xl bg-white py-2 text-meet-text shadow-meet-lg"
              onMouseLeave={() => dispatch(closeMoreMenu())}
            >
              <button
                type="button"
                className="flex w-full items-center gap-3 px-4 py-2.5 text-sm hover:bg-meet-surface-alt"
                onClick={() => dispatch(closeMoreMenu())}
              >
                <SettingsIcon width={20} height={20} />
                Settings
              </button>
              <button
                type="button"
                className="flex w-full items-center gap-3 px-4 py-2.5 text-sm hover:bg-meet-surface-alt"
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

        <ControlButton label="Leave call" danger wide onClick={leave}>
          <CallEndIcon />
        </ControlButton>
      </div>

      <div className="flex items-center justify-end gap-1 sm:gap-2">
        <ControlButton
          label="Meeting details"
          onClick={() => dispatch(openSidePanel('people'))}
        >
          <InfoIcon />
        </ControlButton>
        <ControlButton
          label="People"
          active={ui.sidePanel === 'people'}
          onClick={() => dispatch(openSidePanel('people'))}
        >
          <span className="relative inline-flex">
            <PeopleIcon />
            <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-meet-blue px-1 text-[10px] text-white">
              {participants.length}
            </span>
          </span>
        </ControlButton>
        <ControlButton
          label="Chat with everyone"
          active={ui.sidePanel === 'chat'}
          onClick={() => dispatch(openSidePanel('chat'))}
        >
          <ChatIcon />
        </ControlButton>
        <div className="hidden sm:block">
          <ControlButton
            label="Activities"
            active={ui.sidePanel === 'activities'}
            onClick={() => dispatch(openSidePanel('activities'))}
          >
            <AppsIcon />
          </ControlButton>
        </div>
      </div>
    </div>
  );
}
