import { useState } from 'react';
import Navbar from '../components/common/Navbar';
import * as aiService from '../services/aiService';
import { CORE_TOPICS } from '../constants/options';

const AIExplainer = () => {
  const [topic, setTopic] = useState('');
  const [explanation, setExplanation] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [history, setHistory] = useState([]);

  const handleSearch = async (searchTopic) => {
    const query = (searchTopic ?? topic).trim();
    if (!query) return;

    setLoading(true);
    setError('');
    setExplanation('');

    try {
      const data = await aiService.explainConcept(query);
      setExplanation(data.explanation);
      setTopic(query);

      // Add to history (avoid duplicates, keep last 5)
      setHistory((prev) => {
        const filtered = prev.filter((h) => h.toLowerCase() !== query.toLowerCase());
        return [query, ...filtered].slice(0, 5);
      });
    } catch (err) {
      setError('Could not fetch explanation. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSearch();
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Navbar />

      <div className="mx-auto max-w-2xl px-4 py-8">
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">AI Explainer</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Search any CS concept, get a clear explanation in under 60 seconds.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 flex gap-2">
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g. Binary Search, Process vs Thread, Indexing..."
            className="flex-1 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
          />
          <button
            type="submit"
            disabled={loading || !topic.trim()}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-700 disabled:opacity-60"
          >
            {loading ? 'Thinking...' : 'Explain'}
          </button>
        </form>

        {/* Quick topic suggestions */}
        <div className="mt-3 flex flex-wrap gap-2">
          {CORE_TOPICS.map((t) => (
            <button
              key={t}
              onClick={() => handleSearch(t)}
              className="rounded-full bg-slate-100 dark:bg-slate-800 px-3 py-1 text-xs font-medium text-slate-600 dark:text-slate-400 transition hover:bg-slate-200 dark:hover:bg-slate-600"
            >
              {t}
            </button>
          ))}
        </div>

        {error && (
          <div className="mt-4 rounded-lg bg-red-50 dark:bg-red-950 px-4 py-2 text-sm text-red-600 dark:text-red-400">{error}</div>
        )}

        {loading && (
          <div className="mt-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
            <p className="text-sm text-slate-400 dark:text-slate-500">Generating a clear explanation...</p>
          </div>
        )}

        {explanation && !loading && (
          <div className="mt-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
            <span className="mb-2 inline-block rounded-full bg-indigo-50 dark:bg-indigo-950 px-2 py-0.5 text-xs font-medium text-indigo-600 dark:text-indigo-400">
              {topic}
            </span>
            <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">{explanation}</p>
          </div>
        )}

        {/* Recent searches */}
        {history.length > 0 && (
          <div className="mt-8">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">
              Recent searches
            </h3>
            <div className="mt-2 flex flex-wrap gap-2">
              {history.map((h) => (
                <button
                  key={h}
                  onClick={() => handleSearch(h)}
                  className="rounded-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-1 text-xs font-medium text-slate-600 dark:text-slate-400 transition hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  {h}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIExplainer;
