import { AnimatePresence, motion } from 'framer-motion';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { closeSidePanel } from '../features/ui/uiSlice';
import { CloseIcon, MicOffIcon, HandIcon } from './icons/MeetIcons';

export default function SidePanel() {
  const dispatch = useAppDispatch();
  const panel = useAppSelector((s) => s.ui.sidePanel);
  const participants = useAppSelector((s) => s.participants.list);
  const code = useAppSelector((s) => s.meeting.code);

  const titles = {
    people: 'People',
    chat: 'In-call messages',
    activities: 'Activities',
  };

  return (
    <AnimatePresence>
      {panel && (
        <motion.aside
          key={panel}
          initial={{ x: 24, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 24, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="flex h-full w-full max-w-[360px] shrink-0 flex-col overflow-hidden rounded-t-2xl bg-white text-meet-text shadow-meet-lg sm:mb-4 sm:mr-3 sm:mt-3 sm:rounded-2xl"
        >
          <div className="flex items-center justify-between px-4 py-3">
            <h2 className="text-lg font-medium">{titles[panel]}</h2>
            <button
              type="button"
              aria-label="Close panel"
              className="meet-icon-btn-light h-10 w-10"
              onClick={() => dispatch(closeSidePanel())}
            >
              <CloseIcon />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-4 pb-4">
            {panel === 'people' && (
              <div className="space-y-4">
                <div className="rounded-xl bg-meet-surface-alt p-3 text-sm text-meet-text-muted">
                  <p className="font-medium text-meet-text">Meeting code</p>
                  <p className="mt-1 tracking-wide">{code}</p>
                </div>
                <div>
                  <p className="mb-2 text-sm text-meet-text-muted">
                    In meeting ({participants.length})
                  </p>
                  <ul className="space-y-1">
                    {participants.map((p) => (
                      <li
                        key={p.id}
                        className="flex items-center gap-3 rounded-lg px-2 py-2 hover:bg-meet-surface-alt"
                      >
                        <div
                          className="flex h-9 w-9 items-center justify-center rounded-full text-sm font-medium text-white"
                          style={{ backgroundColor: p.color }}
                        >
                          {p.initials}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium">
                            {p.name}
                            {p.isSelf ? ' (You)' : ''}
                          </p>
                        </div>
                        <div className="flex items-center gap-1 text-meet-text-muted">
                          {p.handRaised && <HandIcon width={18} height={18} />}
                          {!p.micOn && (
                            <MicOffIcon
                              width={18}
                              height={18}
                              className="text-meet-red"
                            />
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {panel === 'chat' && (
              <div className="flex h-full min-h-[280px] flex-col">
                <p className="mb-4 rounded-lg bg-meet-blue-soft px-3 py-2 text-xs text-meet-text-secondary">
                  Messages can only be seen by people in the call and are deleted
                  when the call ends.
                </p>
                <div className="flex-1" />
                <form
                  className="flex gap-2"
                  onSubmit={(e) => {
                    e.preventDefault();
                    e.currentTarget.reset();
                  }}
                >
                  <input
                    type="text"
                    placeholder="Send a message"
                    className="flex-1 rounded-full border border-meet-border px-4 py-2.5 text-sm outline-none focus:border-meet-blue"
                  />
                  <button type="submit" className="meet-btn-primary px-4">
                    Send
                  </button>
                </form>
              </div>
            )}

            {panel === 'activities' && (
              <div className="grid grid-cols-2 gap-3 pt-2">
                {['Polls', 'Q&A', 'Whiteboarding', 'Breakout rooms'].map(
                  (item) => (
                    <button
                      key={item}
                      type="button"
                      className="rounded-xl border border-meet-border px-3 py-6 text-sm font-medium text-meet-text-secondary hover:bg-meet-surface-alt"
                    >
                      {item}
                    </button>
                  ),
                )}
              </div>
            )}
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
