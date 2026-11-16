import { useNavigate } from 'react-router-dom';
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

  const ensureCode = () => {
    if (!meeting.code) dispatch(createMeeting());
  };

  const join = () => {
    ensureCode();
    dispatch(joinMeeting());
    dispatch(
      loadMockParticipants({
        displayName: meeting.displayName,
        micOn: media.micOn,
        camOn: media.camOn,
      }),
    );
    navigate('/room');
  };

  return (
    <div className="flex min-h-full flex-col bg-white lg:flex-row">
      <div className="flex flex-1 flex-col items-center justify-center px-4 py-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative w-full max-w-[720px] overflow-hidden rounded-tile bg-meet-dark aspect-video shadow-meet-lg"
        >
          {media.camOn ? (
            <div className="absolute inset-0 bg-gradient-to-br from-[#3c4043] to-[#202124]">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="flex h-28 w-28 items-center justify-center rounded-full bg-meet-blue text-4xl font-medium text-white">
                  {meeting.displayName
                    .split(' ')
                    .map((p) => p[0])
                    .join('')
                    .slice(0, 2)
                    .toUpperCase() || 'Y'}
                </div>
              </div>
              <p className="absolute left-4 top-4 text-sm text-white/80">
                Camera is starting…
              </p>
            </div>
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-meet-dark text-white">
              <div className="flex h-28 w-28 items-center justify-center rounded-full bg-meet-blue text-4xl font-medium">
                {meeting.displayName
                  .split(' ')
                  .map((p) => p[0])
                  .join('')
                  .slice(0, 2)
                  .toUpperCase() || 'Y'}
              </div>
              <p className="text-sm text-white/70">Camera is off</p>
            </div>
          )}

          <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-3">
            <button
              type="button"
              aria-label={media.micOn ? 'Mute microphone' : 'Unmute microphone'}
              onClick={() => dispatch(toggleMic())}
              className={`meet-icon-btn border border-white/20 ${
                media.micOn
                  ? 'bg-transparent text-white hover:bg-white/10'
                  : 'bg-meet-red text-white'
              }`}
            >
              {media.micOn ? <MicIcon /> : <MicOffIcon />}
            </button>
            <button
              type="button"
              aria-label={media.camOn ? 'Turn off camera' : 'Turn on camera'}
              onClick={() => dispatch(toggleCam())}
              className={`meet-icon-btn border border-white/20 ${
                media.camOn
                  ? 'bg-transparent text-white hover:bg-white/10'
                  : 'bg-meet-red text-white'
              }`}
            >
              {media.camOn ? <VideocamIcon /> : <VideocamOffIcon />}
            </button>
          </div>

          <div className="absolute bottom-4 left-4 text-sm text-white">
            {meeting.displayName || 'You'}
          </div>
        </motion.div>
      </div>

      <div className="flex w-full flex-col items-center justify-center px-6 py-10 lg:w-[420px] lg:shrink-0">
        <h1 className="text-2xl font-normal text-meet-text">Ready to join?</h1>
        <p className="mt-2 text-sm text-meet-text-muted">
          {meeting.code
            ? `Meeting code: ${meeting.code}`
            : 'No one else is here'}
        </p>

        <label className="mt-6 w-full max-w-sm">
          <span className="sr-only">Your name</span>
          <input
            type="text"
            value={meeting.displayName}
            onChange={(e) => dispatch(setDisplayName(e.target.value))}
            className="w-full rounded border border-meet-border px-3 py-2.5 text-sm outline-none focus:border-meet-blue focus:shadow-[inset_0_0_0_1px_#1a73e8]"
            placeholder="Your name"
          />
        </label>

        <div className="mt-6 flex w-full max-w-sm flex-col gap-3 sm:flex-row sm:justify-center">
          <button type="button" className="meet-btn-primary" onClick={join}>
            Join now
          </button>
          <button type="button" className="meet-btn-secondary">
            <PresentToAllIcon width={18} height={18} />
            Present
          </button>
        </div>

        <button
          type="button"
          className="mt-8 text-sm text-meet-blue-text hover:underline"
          onClick={() => navigate('/')}
        >
          Other ways to join
        </button>
      </div>
    </div>
  );
}
