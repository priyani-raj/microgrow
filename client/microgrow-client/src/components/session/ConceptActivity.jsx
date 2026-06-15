import { useEffect, useState } from 'react';
import * as aiService from '../../services/aiService';

const MAX_ATTEMPTS = 2; // original explanation + 1 retry with a simpler one

const ConceptActivity = ({ topic, onComplete }) => {
  const [explanation, setExplanation] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [attempt, setAttempt] = useState(1);

  const fetchExplanation = async (simpler = false) => {
    setLoading(true);
    setError('');
    try {
      const data = await aiService.explainConcept(topic, simpler);
      setExplanation(data.explanation);
    } catch (err) {
      setError('Could not load explanation. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExplanation(false);
  }, [topic]);

  const handleClear = () => {
    onComplete({
      type: 'concept',
      topic,
      score: null,
      aiFeedback: `User understood after ${attempt} explanation${attempt > 1 ? 's' : ''}`,
    });
  };

  const handleConfused = async () => {
    if (attempt < MAX_ATTEMPTS) {
      // Try again with a simpler, different explanation
      setAttempt((a) => a + 1);
      await fetchExplanation(true);
    } else {
      // Already retried once - don't keep looping, end session and suggest saving for later
      onComplete({
        type: 'concept',
        topic,
        score: null,
        aiFeedback: `User still confused after ${attempt} explanations - flagged for deeper review`,
      });
    }
  };

  if (loading) {
    return (
      <p className="text-center text-sm text-slate-400 dark:text-slate-500">
        {attempt > 1 ? 'Trying a different way to explain it...' : 'Generating your explanation...'}
      </p>
    );
  }

  if (error) {
    return <p className="text-center text-sm text-red-500 dark:text-red-400">{error}</p>;
  }

  return (
    <div>
      {attempt > 1 && (
        <div className="mb-3 rounded-lg bg-amber-50 px-3 py-2 text-xs font-medium text-amber-700 dark:bg-amber-950 dark:text-amber-400">
          Here's a different way to look at it 👇
        </div>
      )}

      <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
        <span className="mb-2 inline-block rounded-full bg-indigo-50 px-2 py-0.5 text-xs font-medium text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
          {topic}
        </span>
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">{explanation}</p>
      </div>

      <p className="mt-4 text-center text-sm text-slate-500 dark:text-slate-400">
        Was this clear?
      </p>
      <div className="mt-2 grid grid-cols-2 gap-2">
        <button
          onClick={handleClear}
          className="rounded-lg bg-emerald-50 py-2 text-sm font-medium text-emerald-600 transition hover:bg-emerald-100 dark:bg-emerald-950 dark:text-emerald-400 dark:hover:bg-emerald-900"
        >
          👍 Yes, clear
        </button>
        <button
          onClick={handleConfused}
          className="rounded-lg bg-slate-100 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700"
        >
          {attempt < MAX_ATTEMPTS ? '👎 Still confused' : '👎 End session'}
        </button>
      </div>

      {attempt >= MAX_ATTEMPTS && (
        <p className="mt-3 text-center text-xs text-slate-400 dark:text-slate-500">
          This will be flagged so you can revisit it with more time later.
        </p>
      )}
    </div>
  );
};

export default ConceptActivity;
