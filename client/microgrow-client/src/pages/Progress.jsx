import { useEffect, useState } from 'react';
import Navbar from '../components/common/Navbar';
import * as progressService from '../services/progressService';
import { getSessionHistory } from '../services/sessionHistoryService';

const activityLabels = {
  dsa: { label: 'DSA Problem', color: 'bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400' },
  flashcard: { label: 'Flashcards', color: 'bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400' },
  concept: { label: 'Concept', color: 'bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400' },
};

const Progress = () => {
  const [progress, setProgress] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [progressData, historyData] = await Promise.all([
          progressService.getProgress(),
          getSessionHistory(),
        ]);
        setProgress(progressData);
        setHistory(historyData);
      } catch (err) {
        setError('Could not load your progress.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
  };

  const topicEntries = progress ? Object.entries(progress.topicBreakdown) : [];
  const maxMinutes = topicEntries.length
    ? Math.max(...topicEntries.map(([, v]) => v.totalMinutes))
    : 1;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Navbar />

      <div className="mx-auto max-w-3xl px-4 py-8">
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">Your Progress</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Every minute you steal back, tracked here.
        </p>

        {loading && <p className="mt-6 text-sm text-slate-400 dark:text-slate-500">Loading...</p>}
        {error && <p className="mt-6 text-sm text-red-500 dark:text-red-400">{error}</p>}

        {progress && (
          <>
            {/* Topic breakdown */}
            <div className="mt-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
              <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Topic breakdown</h2>
              {topicEntries.length === 0 ? (
                <p className="mt-2 text-sm text-slate-400 dark:text-slate-500">
                  No sessions yet — complete one to see your breakdown here.
                </p>
              ) : (
                <div className="mt-3 space-y-3">
                  {topicEntries.map(([topic, data]) => (
                    <div key={topic}>
                      <div className="flex justify-between text-sm text-slate-700 dark:text-slate-300">
                        <span className="font-medium">{topic}</span>
                        <span className="text-xs text-slate-500 dark:text-slate-400">
                          {data.sessions} session{data.sessions !== 1 ? 's' : ''} ·{' '}
                          {data.totalMinutes} min
                        </span>
                      </div>
                      <div className="mt-1 h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800">
                        <div
                          className="h-2 rounded-full bg-indigo-500"
                          style={{ width: `${(data.totalMinutes / maxMinutes) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Session history */}
            <div className="mt-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
              <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Session history</h2>
              {history.length === 0 ? (
                <p className="mt-2 text-sm text-slate-400 dark:text-slate-500">No sessions logged yet.</p>
              ) : (
                <div className="mt-3 divide-y divide-slate-100 dark:divide-slate-800">
                  {history.map((s) => {
                    const activity = activityLabels[s.type] || {
                      label: s.type,
                      color: 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400',
                    };
                    return (
                      <div
                        key={s._id}
                        className="flex items-center justify-between py-2.5 text-sm"
                      >
                        <div className="flex items-center gap-2">
                          <span
                            className={`rounded-full px-2 py-0.5 text-xs font-medium ${activity.color}`}
                          >
                            {activity.label}
                          </span>
                          <span className="text-slate-700 dark:text-slate-300">{s.topic}</span>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-slate-400 dark:text-slate-500">
                          {s.score !== null && s.score !== undefined && (
                            <span className="font-medium text-slate-600 dark:text-slate-400">
                              {s.score}/5
                            </span>
                          )}
                          <span>{s.duration} min</span>
                          <span>{formatDate(s.createdAt)}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Progress;
