import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { loadMockParticipants } from '../features/participants/participantsSlice';
import TopBar from '../components/TopBar';
import ControlBar from '../components/ControlBar';
import SidePanel from '../components/SidePanel';
import VideoTile from '../components/VideoTile';

export default function MeetingRoomPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const meeting = useAppSelector((s) => s.meeting);
  const media = useAppSelector((s) => s.media);
  const participants = useAppSelector((s) => s.participants.list);
  const sidePanel = useAppSelector((s) => s.ui.sidePanel);

  useEffect(() => {
    if (!meeting.joined) {
      navigate('/lobby', { replace: true });
      return;
    }
    if (participants.length === 0) {
      dispatch(loadMockParticipants({ displayName: meeting.displayName }));
    }
  }, [
    meeting.joined,
    meeting.displayName,
    participants.length,
    dispatch,
    navigate,
  ]);

  const gridClass =
    participants.length <= 1
      ? 'grid-cols-1 max-w-4xl mx-auto'
      : participants.length <= 2
        ? 'grid-cols-1 sm:grid-cols-2'
        : participants.length <= 4
          ? 'grid-cols-1 sm:grid-cols-2'
          : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3';

  return (
    <div className="flex h-full min-h-0 flex-col bg-meet-dark">
      <TopBar title={meeting.title || 'Meeting'} />

      <div className="flex min-h-0 flex-1 overflow-hidden">
        <div className="relative flex min-w-0 flex-1 flex-col">
          <div className="min-h-0 flex-1 overflow-auto p-2 sm:p-3">
            <div
              className={`grid min-h-full auto-rows-fr gap-2 sm:gap-3 ${gridClass}`}
            >
              {participants.map((p) => (
                <VideoTile
                  key={p.id}
                  participant={{
                    ...p,
                    micOn: p.isSelf ? media.micOn : p.micOn,
                    camOn: p.isSelf ? media.camOn : p.camOn,
                    handRaised: p.isSelf ? media.handRaised : p.handRaised,
                  }}
                  large={participants.length <= 2}
                  className="min-h-[160px] sm:min-h-[200px]"
                />
              ))}
            </div>
          </div>

          <AnimatePresence>
            {media.captionsOn && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                className="pointer-events-none absolute bottom-4 left-1/2 z-10 w-[min(720px,90%)] -translate-x-1/2 rounded-lg bg-black/70 px-4 py-3 text-center text-sm text-white"
              >
                Captions will appear here when speech is detected.
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <SidePanel />
      </div>

      <ControlBar />
    </div>
  );
}
