import { SecurityIcon } from './icons/MeetIcons';

export default function TopBar({ title }) {
  return (
    <header className="flex h-12 shrink-0 items-center justify-between px-4 text-meet-icon-light">
      <div className="flex min-w-0 items-center gap-2">
        <h1 className="truncate text-sm sm:text-base">{title}</h1>
      </div>
      <div className="flex items-center gap-2 text-meet-text-muted">
        <button
          type="button"
          className="meet-icon-btn-dark h-9 w-9"
          aria-label="Meeting is secure"
          title="Meeting is secure"
        >
          <SecurityIcon width={20} height={20} />
        </button>
      </div>
    </header>
  );
}
