import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import * as progressService from '../services/progressService';
import Navbar from '../components/common/Navbar';
import StatCard from '../components/dashboard/StatCard';

const Dashboard = () => {
  const { user } = useAuth();
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const data = await progressService.getProgress();
        setProgress(data);
      } catch (err) {
        console.error('Failed to fetch progress', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProgress();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Navbar />

      <div className="mx-auto max-w-5xl px-4 py-8">
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
          Hey {user?.name?.split(' ')[0]} 👋
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Ready to turn a few minutes into real progress?
        </p>

        {/* Quick start CTA */}
        <div className="mt-6 rounded-2xl bg-indigo-600 p-6 text-white">
          <h2 className="text-lg font-semibold">How much time do you have?</h2>
          <p className="mt-1 text-sm text-indigo-100">
            Tell us, and we'll pick the perfect activity for you.
          </p>
          <button
            onClick={() => navigate('/session')}
            className="mt-4 rounded-lg bg-white dark:bg-slate-900 px-4 py-2 text-sm font-medium text-indigo-600 dark:text-indigo-400 transition hover:bg-indigo-50 dark:hover:bg-indigo-950"
          >
            Start a session
          </button>
        </div>

        {/* Stats grid */}
        {loading ? (
          <p className="mt-6 text-sm text-slate-400 dark:text-slate-500">Loading your progress...</p>
        ) : progress ? (
          <>
            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
              <StatCard
                label="Current Streak"
                value={`${progress.streak.current} 🔥`}
                sublabel={`Longest: ${progress.streak.longest}`}
                accent="orange"
              />
              <StatCard
                label="Readiness Score"
                value={`${progress.readinessScore}/100`}
                sublabel="Updated live"
                accent="indigo"
              />
              <StatCard
                label="Total Sessions"
                value={progress.totalSessions}
                sublabel={`${progress.totalMinutes} mins total`}
                accent="green"
              />
              <StatCard
                label="Topics Covered"
                value={progress.topicsCovered}
                sublabel="Keep exploring"
                accent="purple"
              />
            </div>

            {/* This week */}
            <div className="mt-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">This week's stolen time</h3>
              <div className="mt-3 grid grid-cols-3 gap-4 sm:grid-cols-3">
                <div>
                  <p className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                    {progress.weeklyStats.minutesSpent}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">minutes used</p>
                </div>
                <div>
                  <p className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                    {progress.weeklyStats.flashcardsReviewed}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">flashcards reviewed</p>
                </div>
                <div>
                  <p className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                    {progress.weeklyStats.dsaProblemsAttempted}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">DSA problems tried</p>
                </div>
              </div>
            </div>

            {/* Readiness breakdown */}
            <div className="mt-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Readiness breakdown</h3>
              <div className="mt-3 space-y-2">
                {Object.entries(progress.readinessBreakdown).map(([key, value]) => (
                  <div key={key}>
                    <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400">
                      <span className="capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                      <span>{value} pts</span>
                    </div>
                    <div className="mt-1 h-1.5 w-full rounded-full bg-slate-100 dark:bg-slate-800">
                      <div
                        className="h-1.5 rounded-full bg-indigo-500"
                        style={{ width: `${(value / 40) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <p className="mt-6 text-sm text-red-500 dark:text-red-400">Couldn't load progress data.</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
