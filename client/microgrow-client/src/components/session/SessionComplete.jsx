import { useNavigate } from 'react-router-dom';

const SessionComplete = ({ streak, minutes }) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-3xl">
        🎉
      </div>
      <h2 className="mt-4 text-lg font-semibold text-slate-900">Nice work!</h2>
      <p className="mt-1 text-sm text-slate-500">
        You just turned {minutes} stolen minutes into real progress.
      </p>

      <div className="mt-4 rounded-xl border border-slate-200 bg-white px-6 py-4">
        <p className="text-2xl font-semibold text-orange-500">{streak?.current ?? '–'} 🔥</p>
        <p className="text-xs text-slate-500">day streak</p>
      </div>

      <div className="mt-6 flex w-full gap-2">
        <button
          onClick={() => window.location.reload()}
          className="flex-1 rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
        >
          Another session
        </button>
        <button
          onClick={() => navigate('/dashboard')}
          className="flex-1 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-700"
        >
          Back to dashboard
        </button>
      </div>
    </div>
  );
};

export default SessionComplete;
