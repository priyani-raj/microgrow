const StatCard = ({ label, value, sublabel, accent = 'indigo' }) => {
  const accentColors = {
    indigo: 'text-indigo-600 bg-indigo-50',
    green: 'text-emerald-600 bg-emerald-50',
    orange: 'text-orange-600 bg-orange-50',
    purple: 'text-purple-600 bg-purple-50',
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <p className="text-xs font-medium text-slate-500">{label}</p>
      <p className={`mt-1 text-2xl font-semibold text-slate-900`}>{value}</p>
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
