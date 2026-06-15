import { useEffect, useState } from 'react';

const SessionTimer = ({ totalMinutes }) => {
  const [secondsLeft, setSecondsLeft] = useState(totalMinutes * 60);

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const interval = setInterval(() => {
      setSecondsLeft((s) => Math.max(0, s - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [secondsLeft]);

  const mins = Math.floor(secondsLeft / 60);
  const secs = secondsLeft % 60;
  const percent = ((totalMinutes * 60 - secondsLeft) / (totalMinutes * 60)) * 100;

  return (
    <div className="flex items-center gap-3">
      <div className="h-1.5 flex-1 rounded-full bg-slate-100 dark:bg-slate-800">
        <div
          className="h-1.5 rounded-full bg-indigo-500 transition-all"
          style={{ width: `${percent}%` }}
        />
      </div>
      <span className="whitespace-nowrap text-xs font-medium text-slate-500 dark:text-slate-400">
        {mins}:{secs.toString().padStart(2, '0')} left
      </span>
    </div>
  );
};

export default SessionTimer;
