const StatCard = ({ label, value, sublabel, accent = 'indigo' }) => {
  const accentColors = {
    indigo: 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950',
    green: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950',
    orange: 'text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-950',
    purple: 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950',
  };

  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4">
      <p className="text-xs font-medium text-slate-500 dark:text-slate-400">{label}</p>
      <p className={`mt-1 text-2xl font-semibold text-slate-900 dark:text-slate-100`}>{value}</p>
      {sublabel && (
        <span
          className={`mt-2 inline-block rounded-full px-2 py-0.5 text-xs font-medium ${accentColors[accent]}`}
        >
          {sublabel}
        </span>
      )}
    </div>
  );
};

export default StatCard;
