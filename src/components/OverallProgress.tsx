interface Props {
    solved: number;
    total: number;
    easy: { solved: number; total: number };
    medium: { solved: number; total: number };
    hard: { solved: number; total: number };
  }
  
  const OverallProgress = ({
    solved,
    total,
    easy,
    medium,
    hard,
  }: Props) => {
    const percentage = total ? Math.round((solved / total) * 100) : 0;
    const radius = 26;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percentage / 100) * circumference;
  
    return (
      <div className="rounded-xl border bg-card p-4 flex items-center justify-between">
        {/* LEFT SIDE */}
        <div className="flex items-center gap-4">
          {/* Circular Progress */}
          <div className="relative w-16 h-16">
            <svg className="w-16 h-16 -rotate-90">
              <circle
                cx="32"
                cy="32"
                r={radius}
                stroke="hsl(var(--muted))"
                strokeWidth="6"
                fill="none"
              />
              <circle
                cx="32"
                cy="32"
                r={radius}
                stroke="hsl(var(--accent))"
                strokeWidth="6"
                fill="none"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                strokeLinecap="round"
              />
            </svg>
  
            <div className="absolute inset-0 flex items-center justify-center text-sm font-semibold">
              {percentage}%
            </div>
          </div>
  
          {/* Text */}
          <div>
            <p className="text-sm text-muted-foreground">Overall Progress</p>
            <p className="text-base font-semibold">
              {solved} / {total}
            </p>
          </div>
        </div>
  
        {/* RIGHT SIDE */}
        <div className="flex gap-6 text-sm">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-success" />
            <span>
              Easy {easy.solved}/{easy.total}
            </span>
          </div>
  
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-warning" />
            <span>
              Medium {medium.solved}/{medium.total}
            </span>
          </div>
  
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-destructive" />
            <span>
              Hard {hard.solved}/{hard.total}
            </span>
          </div>
        </div>
      </div>
    );
  };
  
  export default OverallProgress;
  