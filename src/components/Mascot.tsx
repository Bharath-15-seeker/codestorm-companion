import { motion } from 'framer-motion';

interface MascotProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
  showMessage?: boolean;
}

const Mascot = ({ message = "Hey there! Ready to code?", size = 'md', showMessage = true }: MascotProps) => {
  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32',
  };

  return (
    <div className="flex items-end gap-3">
      {/* Robot Mascot */}
      <motion.div
        className={`${sizeClasses[size]} relative`}
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      >
        <svg
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          {/* Antenna */}
          <motion.g
            animate={{ rotate: [-5, 5, -5] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            style={{ transformOrigin: '50px 20px' }}
          >
            <line x1="50" y1="20" x2="50" y2="8" stroke="hsl(var(--accent))" strokeWidth="3" strokeLinecap="round" />
            <circle cx="50" cy="6" r="4" fill="hsl(var(--accent))" />
            <motion.circle
              cx="50"
              cy="6"
              r="4"
              fill="hsl(var(--accent))"
              animate={{ scale: [1, 1.3, 1], opacity: [1, 0.5, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          </motion.g>

          {/* Head */}
          <rect x="20" y="20" width="60" height="45" rx="12" fill="hsl(var(--primary))" />
          
          {/* Face plate */}
          <rect x="28" y="28" width="44" height="30" rx="6" fill="hsl(var(--primary-foreground))" opacity="0.1" />

          {/* Eyes */}
          <motion.g
            animate={{ scaleY: [1, 0.1, 1] }}
            transition={{ duration: 4, repeat: Infinity, repeatDelay: 2 }}
          >
            <circle cx="38" cy="42" r="8" fill="hsl(var(--primary-foreground))" />
            <circle cx="62" cy="42" r="8" fill="hsl(var(--primary-foreground))" />
            <circle cx="40" cy="40" r="3" fill="hsl(var(--accent))" />
            <circle cx="64" cy="40" r="3" fill="hsl(var(--accent))" />
          </motion.g>

          {/* Mouth */}
          <motion.path
            d="M 40 55 Q 50 62 60 55"
            stroke="hsl(var(--primary-foreground))"
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
            animate={{ d: ["M 40 55 Q 50 62 60 55", "M 40 55 Q 50 58 60 55", "M 40 55 Q 50 62 60 55"] }}
            transition={{ duration: 2, repeat: Infinity }}
          />

          {/* Body */}
          <rect x="30" y="68" width="40" height="25" rx="8" fill="hsl(var(--primary))" />
          
          {/* Body screen */}
          <rect x="36" y="73" width="28" height="15" rx="4" fill="hsl(var(--accent))" opacity="0.8" />
          
          {/* Screen lines (code animation) */}
          <motion.g
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1, repeat: Infinity }}
          >
            <rect x="40" y="77" width="12" height="2" rx="1" fill="hsl(var(--accent-foreground))" />
            <rect x="40" y="81" width="18" height="2" rx="1" fill="hsl(var(--accent-foreground))" />
            <rect x="40" y="85" width="8" height="2" rx="1" fill="hsl(var(--accent-foreground))" />
          </motion.g>

          {/* Arms */}
          <motion.g
            animate={{ rotate: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            style={{ transformOrigin: '25px 75px' }}
          >
            <rect x="15" y="72" width="12" height="6" rx="3" fill="hsl(var(--primary))" />
          </motion.g>
          <motion.g
            animate={{ rotate: [0, -10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
            style={{ transformOrigin: '75px 75px' }}
          >
            <rect x="73" y="72" width="12" height="6" rx="3" fill="hsl(var(--primary))" />
          </motion.g>

          {/* Feet */}
          <rect x="35" y="93" width="10" height="5" rx="2" fill="hsl(var(--primary))" />
          <rect x="55" y="93" width="10" height="5" rx="2" fill="hsl(var(--primary))" />
        </svg>
      </motion.div>

      {/* Speech Bubble */}
      {showMessage && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, x: -10 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          transition={{ delay: 0.5, duration: 0.3 }}
          className="relative bg-card border border-border rounded-xl px-4 py-2 shadow-card max-w-[200px]"
        >
          {/* Bubble pointer */}
          <div className="absolute left-[-8px] top-1/2 -translate-y-1/2 w-0 h-0 border-t-[8px] border-t-transparent border-b-[8px] border-b-transparent border-r-[8px] border-r-border" />
          <div className="absolute left-[-6px] top-1/2 -translate-y-1/2 w-0 h-0 border-t-[7px] border-t-transparent border-b-[7px] border-b-transparent border-r-[7px] border-r-card" />
          
          <p className="text-sm text-foreground font-medium">{message}</p>
        </motion.div>
      )}
    </div>
  );
};

export default Mascot;
