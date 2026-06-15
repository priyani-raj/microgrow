const presets = [5, 10, 15, 20];

const TimePicker = ({ onSelect }) => {
  return (
    <div className="text-center">
      <h2 className="text-lg font-semibold text-slate-900">How much time do you have?</h2>
      <p className="mt-1 text-sm text-slate-500">We'll pick the perfect activity for you</p>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {presets.map((mins) => (
          <button
            key={mins}
            onClick={() => onSelect(mins)}
            className="rounded-xl border border-slate-200 bg-white py-4 text-center transition hover:border-indigo-300 hover:bg-indigo-50"
          >
            <p className="text-xl font-semibold text-slate-900">{mins}</p>
            <p className="text-xs text-slate-500">minutes</p>
          </button>
        ))}
      </div>

      <p className="mt-4 text-xs text-slate-400">Tap a card to start your session</p>
    </div>
  );
};

export default TimePicker;
