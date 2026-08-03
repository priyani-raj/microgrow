import { useEffect, useState } from 'react';
import * as aiService from '../../services/aiService';

const MAX_ATTEMPTS = 2;

const ConceptActivity = ({ topic, onComplete }) => {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [attempt, setAttempt] = useState(1);

  const fetchExplanation = async (simpler = false) => {
    setLoading(true);
    setError('');
    try {
      const data = await aiService.explainConcept(topic, simpler);
      setResult(data.explanation);
    } catch (err) {
      setError('Could not load explanation. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchExplanation(false); }, [topic]);

  const handleClear = () => {
    onComplete({ type: 'concept', topic, score: null, aiFeedback: `Understood after ${attempt} explanation(s)` });
  };

  const handleConfused = async () => {
    if (attempt < MAX_ATTEMPTS) {
      setAttempt((a) => a + 1);
      await fetchExplanation(true);
    } else {
      onComplete({ type: 'concept', topic, score: null, aiFeedback: `Flagged for deeper review after ${attempt} attempts` });
    }
  };

  if (loading) return (
    <p className="text-center text-sm text-slate-400 dark:text-slate-500">
      {attempt > 1 ? 'Trying a simpler explanation...' : 'Generating breakdown...'}
    </p>
  );

  if (error) return <p className="text-center text-sm text-red-500 dark:text-red-400">{error}</p>;

  return (
    <div className="space-y-3">
      {attempt > 1 && (
        <div className="rounded-lg bg-amber-50 dark:bg-amber-950 px-3 py-2 text-xs font-medium text-amber-700 dark:text-amber-400">
          Here's a different way to look at it 👇
        </div>
      )}

      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4">
        <span className="mb-2 inline-block rounded-full bg-indigo-50 dark:bg-indigo-950 px-2 py-0.5 text-xs font-medium text-indigo-600 dark:text-indigo-400">
          {topic}
        </span>
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">{result?.explanation}</p>
      </div>

      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4">
        <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">
          Optimized Approach
        </p>
        <p className="text-sm text-slate-700 dark:text-slate-300">{result?.optimizedApproach}</p>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <div className="rounded-lg bg-purple-50 dark:bg-purple-950 px-3 py-2">
          <p className="text-xs font-medium text-purple-500">Time</p>
          <p className="text-xs font-semibold text-purple-700 dark:text-purple-300">{result?.timeComplexity}</p>
        </div>
        <div className="rounded-lg bg-blue-50 dark:bg-blue-950 px-3 py-2">
          <p className="text-xs font-medium text-blue-500">Space</p>
          <p className="text-xs font-semibold text-blue-700 dark:text-blue-300">{result?.spaceComplexity}</p>
        </div>
        <div className="rounded-lg bg-emerald-50 dark:bg-emerald-950 px-3 py-2">
          <p className="text-xs font-medium text-emerald-500">Pattern</p>
          <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-300">{result?.pattern}</p>
        </div>
      </div>

      <div className="rounded-xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950 p-3">
        <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-amber-600 dark:text-amber-400">
          💡 Interview Tip
        </p>
        <p className="text-xs text-amber-800 dark:text-amber-300">{result?.interviewTip}</p>
      </div>

      {Array.isArray(result?.mostAskedQuestions) && result.mostAskedQuestions.length > 0 && (
        <div className="rounded-xl border border-rose-200 dark:border-rose-800 bg-rose-50 dark:bg-rose-950 p-3">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-rose-600 dark:text-rose-400">
            ❓ Most Asked Interview Questions
          </p>
          <ul className="space-y-1.5">
            {result.mostAskedQuestions.map((q, idx) => (
              <li key={idx} className="flex gap-2 text-xs text-rose-800 dark:text-rose-300">
                <span className="mt-0.5 shrink-0 text-rose-400 dark:text-rose-500">•</span>
                <span>{q}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <p className="text-center text-sm text-slate-500 dark:text-slate-400">Was this clear?</p>
      <div className="grid grid-cols-2 gap-2">
        <button onClick={handleClear}
          className="rounded-lg bg-emerald-50 dark:bg-emerald-950 py-2 text-sm font-medium text-emerald-600 dark:text-emerald-400 transition hover:bg-emerald-100 dark:hover:bg-emerald-900">
          👍 Yes, clear
        </button>
        <button onClick={handleConfused}
          className="rounded-lg bg-slate-100 dark:bg-slate-800 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 transition hover:bg-slate-200 dark:hover:bg-slate-700">
          {attempt < MAX_ATTEMPTS ? '👎 Still confused' : '👎 End session'}
        </button>
      </div>

      {attempt >= MAX_ATTEMPTS && (
        <p className="text-center text-xs text-slate-400 dark:text-slate-500">
          Flagged for deeper review later.
        </p>
      )}
    </div>
  );
};

export default ConceptActivity;