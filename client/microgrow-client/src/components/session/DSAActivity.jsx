import { useEffect, useState } from 'react';
import * as dsaService from '../../services/dsaService';
import * as aiService from '../../services/aiService';

const DSAActivity = ({ topic, onComplete }) => {
  const [problem, setProblem] = useState(null);
  const [approach, setApproach] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        const data = await dsaService.getRandomProblem(topic);
        setProblem(data);
      } catch (err) {
        setError('Could not load a problem. Try a different topic.');
      } finally {
        setLoading(false);
      }
    };
    fetchProblem();
  }, [topic]);

  const handleSubmit = async () => {
    if (!approach.trim()) return;
    setSubmitting(true);
    setError('');

    try {
      const result = await aiService.evaluateApproach(problem._id, approach);
      setFeedback(result);
    } catch (err) {
      setError('Could not evaluate your approach. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleFinish = () => {
    onComplete({
      type: 'dsa',
      topic: problem.topic,
      score: feedback?.score || null,
      aiFeedback: feedback?.feedback || '',
    });
  };

  if (loading) {
    return <p className="text-center text-sm text-slate-400 dark:text-slate-500">Loading a problem for you...</p>;
  }

  if (error && !problem) {
    return <p className="text-center text-sm text-red-500 dark:text-red-400">{error}</p>;
  }

  return (
    <div>
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
        <div className="mb-2 flex items-center gap-2">
          <span className="rounded-full bg-indigo-50 dark:bg-indigo-950 px-2 py-0.5 text-xs font-medium text-indigo-600 dark:text-indigo-400">
            {problem.topic}
          </span>
          <span className="rounded-full bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-xs font-medium text-slate-500 dark:text-slate-400 capitalize">
            {problem.difficulty}
          </span>
        </div>
        <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">{problem.title}</h3>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{problem.prompt}</p>
      </div>

      {!feedback ? (
        <div className="mt-4">
          <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
            Describe your approach
          </label>
          <textarea
            value={approach}
            onChange={(e) => setApproach(e.target.value)}
            rows={4}
            placeholder="e.g. I would use a hash map to store..."
            className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
          />
          {error && <p className="mt-2 text-sm text-red-500 dark:text-red-400">{error}</p>}
          <button
            onClick={handleSubmit}
            disabled={submitting || !approach.trim()}
            className="mt-3 w-full rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-700 disabled:opacity-60"
          >
            {submitting ? 'Evaluating...' : 'Get AI feedback'}
          </button>
        </div>
      ) : (
        <div className="mt-4">
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">{feedback.verdict}</span>
              <span className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">
                {feedback.score}/5
              </span>
            </div>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Time complexity: {feedback.timeComplexity}
            </p>
            <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">{feedback.feedback}</p>
          </div>

          <button
            onClick={handleFinish}
            className="mt-3 w-full rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-700"
          >
            Finish session
          </button>
        </div>
      )}
    </div>
  );
};

export default DSAActivity;
