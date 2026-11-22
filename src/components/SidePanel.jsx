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
    activities: 'Activities & Summaries',
  };

  return (
    <AnimatePresence>
      {panel && (
        <>
          {/* Mobile backdrop blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => dispatch(closeSidePanel())}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs md:hidden"
          />

          {/* Drawer / Side Panel */}
          <motion.aside
            key={panel}
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 250 }}
            className="fixed inset-y-0 right-0 z-50 flex h-full w-full max-w-sm flex-col overflow-hidden bg-white text-meet-text shadow-2xl md:relative md:inset-auto md:z-auto md:w-[360px] md:max-w-[360px] md:shrink-0 md:rounded-2xl md:mb-4 md:mr-3 md:mt-3 md:shadow-meet-lg"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3 sm:py-4">
              <h2 className="text-base sm:text-lg font-semibold text-slate-800">{titles[panel]}</h2>
              <button
                type="button"
                aria-label="Close panel"
                className="flex h-9 w-9 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100 transition"
                onClick={() => dispatch(closeSidePanel())}
              >
                <CloseIcon />
              </button>
            </div>

            {/* Panel Content */}
            <div className="flex-1 overflow-y-auto px-4 py-4">
              {panel === 'people' && (
                <div className="space-y-4">
                  <div className="rounded-xl bg-slate-50 p-3.5 text-sm text-slate-600 border border-slate-100">
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Meeting code</p>
                    <p className="mt-1 font-mono font-bold text-slate-800 select-all">{code || 'meet-live-call'}</p>
                  </div>
                  <div>
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
                      In meeting ({participants.length})
                    </p>
                    <ul className="space-y-1.5">
                      {participants.map((p) => (
                        <li
                          key={p.id}
                          className="flex items-center gap-3 rounded-xl p-2 hover:bg-slate-50 transition"
                        >
                          <div
                            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-semibold text-white shadow-xs"
                            style={{ backgroundColor: p.color || '#1a73e8' }}
                          >
                            {p.initials}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium text-slate-800">
                              {p.name}
                              {p.isSelf ? ' (You)' : ''}
                            </p>
                          </div>
                          <div className="flex items-center gap-1.5 text-slate-400">
                            {p.handRaised && <HandIcon width={18} height={18} className="text-amber-500" />}
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
                <div className="flex h-full min-h-[300px] flex-col justify-between">
                  <div>
                    <p className="mb-4 rounded-xl bg-blue-50/70 p-3 text-xs leading-relaxed text-blue-900 border border-blue-100">
                      Messages are visible only during this call session and are cleared when the meeting ends.
                    </p>
                    <div className="text-center py-8 text-xs text-slate-400">
                      No messages yet. Start the conversation!
                    </div>
                  </div>
                  <form
                    className="flex gap-2 pt-2 border-t border-slate-100"
                    onSubmit={(e) => {
                      e.preventDefault();
                      e.currentTarget.reset();
                    }}
                  >
                    <input
                      type="text"
                      placeholder="Send a message"
                      className="flex-1 rounded-full border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-meet-blue focus:ring-2 focus:ring-blue-100"
                    />
                    <button type="submit" className="meet-btn-primary px-4 py-2 text-xs">
                      Send
                    </button>
                  </form>
                </div>
              )}

              {panel === 'activities' && (
                <div className="space-y-3 pt-1">
                  <div className="rounded-xl border border-blue-200 bg-blue-50/50 p-4">
                    <div className="flex items-center gap-2 text-blue-700 font-semibold text-sm">
                      <span className="h-2 w-2 rounded-full bg-blue-600 animate-pulse" />
                      Live AI Summarizer
                    </div>
                    <p className="mt-1 text-xs text-slate-600 leading-relaxed">
                      Real-time meeting notes and summaries are automatically generated using audio transcription.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5 pt-2">
                    {['Live Transcript', 'Action Items', 'Key Decisions', 'Export Summary'].map(
                      (item) => (
                        <button
                          key={item}
                          type="button"
                          className="flex flex-col items-center justify-center rounded-xl border border-slate-200 p-3 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:border-blue-300 transition text-center min-h-[70px]"
                        >
                          {item}
                        </button>
                      ),
                    )}
                  </div>
                </div>
              )}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
