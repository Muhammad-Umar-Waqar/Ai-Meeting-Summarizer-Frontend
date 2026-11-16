import { motion } from 'framer-motion';
import { MicOffIcon, HandIcon } from './icons/MeetIcons';

export default function VideoTile({
  participant,
  large = false,
  className = '',
}) {
  const showAvatar = !participant.camOn;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.25 }}
      className={`relative overflow-hidden rounded-tile bg-meet-dark-tile ${
        large ? 'min-h-[220px]' : 'min-h-[140px]'
      } ${className}`}
    >
      {showAvatar ? (
        <div className="absolute inset-0 flex items-center justify-center bg-[#3c4043]">
          <div
            className={`flex items-center justify-center rounded-full text-white font-medium ${
              large ? 'h-28 w-28 text-4xl' : 'h-16 w-16 text-xl'
            }`}
            style={{ backgroundColor: participant.color }}
          >
            {participant.initials}
          </div>
        </div>
      ) : (
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(145deg, ${participant.color}55, #202124 70%)`,
          }}
        >
          <div className="absolute inset-0 flex items-center justify-center opacity-30">
            <div
              className={`rounded-full ${large ? 'h-40 w-40' : 'h-24 w-24'}`}
              style={{ backgroundColor: participant.color }}
            />
          </div>
        </div>
      )}

      <div className="absolute bottom-2 left-2 flex items-center gap-1.5 rounded bg-black/50 px-2 py-0.5 text-xs text-white">
        {!participant.micOn && (
          <MicOffIcon width={14} height={14} className="text-meet-red" />
        )}
        <span className="max-w-[140px] truncate">
          {participant.name}
          {participant.isSelf ? ' (You)' : ''}
        </span>
      </div>

      {participant.handRaised && (
        <div className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-[#f9ab00] text-meet-dark">
          <HandIcon width={18} height={18} />
        </div>
      )}
    </motion.div>
  );
}
