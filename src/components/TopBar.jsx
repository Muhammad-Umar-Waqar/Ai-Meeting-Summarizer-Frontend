import { SecurityIcon } from './icons/MeetIcons';

export default function TopBar({ title }) {
  return (
    <header className="flex h-12 shrink-0 items-center justify-between px-3 sm:px-4 text-meet-icon-light border-b border-white/5">
      <div className="flex min-w-0 items-center gap-2">
        <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
        <h1 className="truncate text-xs sm:text-sm font-medium tracking-wide text-slate-200">
          {title || 'AI Meeting Summarizer'}
        </h1>
      </div>
      <div className="flex items-center gap-1.5 text-meet-text-muted">
        <button
          type="button"
          className="flex h-8 w-8 items-center justify-center rounded-full bg-white/5 text-slate-300 hover:bg-white/10 transition"
          aria-label="Meeting is end-to-end encrypted and secure"
          title="Encrypted & Secure"
        >
          <SecurityIcon width={18} height={18} />
        </button>
      </div>
    </header>
  );
}
