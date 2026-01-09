import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface StatusBadgeProps {
  status: 'OPEN' | 'CLOSED' | 'COMPLETED' | 'EASY' | 'MEDIUM' | 'HARD';
  animate?: boolean;
}

const StatusBadge = ({ status, animate = true }: StatusBadgeProps) => {
  const statusConfig = {
    OPEN: {
      bg: 'bg-success/10',
      text: 'text-success',
      border: 'border-success/30',
      label: 'Open',
    },
    CLOSED: {
      bg: 'bg-destructive/10',
      text: 'text-destructive',
      border: 'border-destructive/30',
      label: 'Closed',
    },
    COMPLETED: {
      bg: 'bg-muted',
      text: 'text-muted-foreground',
      border: 'border-muted-foreground/30',
      label: 'Completed',
    },
    EASY: {
      bg: 'bg-success/10',
      text: 'text-success',
      border: 'border-success/30',
      label: 'Easy',
    },
    MEDIUM: {
      bg: 'bg-warning/10',
      text: 'text-warning',
      border: 'border-warning/30',
      label: 'Medium',
    },
    HARD: {
      bg: 'bg-destructive/10',
      text: 'text-destructive',
      border: 'border-destructive/30',
      label: 'Hard',
    },
  };

  const config = statusConfig[status];

  const BadgeContent = () => (
    <span
      className={cn(
        "inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border",
        config.bg,
        config.text,
        config.border
      )}
    >
      {status === 'OPEN' && (
        <span className="w-2 h-2 rounded-full bg-success mr-2 animate-pulse" />
      )}
      {config.label}
    </span>
  );

  if (animate) {
    return (
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.2 }}
      >
        <BadgeContent />
      </motion.div>
    );
  }

  return <BadgeContent />;
};

export default StatusBadge;
