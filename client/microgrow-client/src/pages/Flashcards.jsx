import { useEffect, useState } from 'react';
import Navbar from '../components/common/Navbar';
import * as flashcardService from '../services/flashcardService';
import * as aiService from '../services/aiService';
import { CORE_TOPICS } from '../constants/options';

const ratingButtons = [
  { key: 'again', label: '✕ Again', color: 'border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900' },
  { key: 'hard', label: '~ Hard', color: 'border border-orange-200 dark:border-orange-800 bg-orange-50 dark:bg-orange-950 text-orange-600 dark:text-orange-400 hover:bg-orange-100 dark:hover:bg-orange-900' },
  { key: 'easy', label: '✓ Easy', color: 'border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900' },
];

const Flashcards = () => {
  const [cards, setCards] = useState([]);
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [generating, setGenerating] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState('');
  const [reviewedCount, setReviewedCount] = useState(0);
  const [sessionDone, setSessionDone] = useState(false);

  const fetchDue = async () => {
    setLoading(true);
    setError('');
    setSessionDone(false);
    setReviewedCount(0);
    try {
      const data = await flashcardService.getDueFlashcards(null, 10);
      setCards(data.flashcards);
      setIndex(0);
      setFlipped(false);
      setSelectedTopic('');
    } catch (err) {
      setError('Could not load flashcards.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchDue(); }, []);

  const handleRate = async (rating) => {
    const card = cards[index];
    try {
      await flashcardService.reviewFlashcard(card._id, rating);
    } catch (err) { /* non-blocking */ }

    setReviewedCount((c) => c + 1);

    if (index + 1 < cards.length) {
      setIndex(index + 1);
      setFlipped(false);
    } else {
      setSessionDone(true);
    }
  };

  const handleGenerate = async (topic) => {
    setGenerating(true);
    setSelectedTopic(topic);
    setError('');
    setSessionDone(false);
    setReviewedCount(0);
    try {
      const data = await aiService.generateFlashcards(topic, 5);
      setCards(data.flashcards);
      setIndex(0);
      setFlipped(false);
    } catch (err) {
      setError('Could not generate flashcards. Please try again.');
    } finally {
      setGenerating(false);
    }
  };

  const difficultyColor = {
    easy: 'bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400',
    medium: 'bg-orange-50 dark:bg-orange-950 text-orange-600 dark:text-orange-400',
    hard: 'bg-red-50 dark:bg-red-950 text-red-600 dark:text-red-400',
  };

  const card = cards[index];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Navbar />

      <div className="mx-auto max-w-xl px-4 py-8">
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">Flashcards</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Review due cards or generate new ones for any topic.
        </p>

        {/* Generate topic buttons */}
        <div className="mt-5">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">
            Generate new cards by topic
          </p>
          <div className="flex flex-wrap gap-2">
            {CORE_TOPICS.map((t) => (
              <button
                key={t}
                onClick={() => handleGenerate(t)}
                disabled={generating}
                className={`rounded-full px-3 py-1.5 text-xs font-medium transition disabled:opacity-50 ${
                  selectedTopic === t
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="mt-4 rounded-lg bg-red-50 dark:bg-red-950 px-4 py-2 text-sm text-red-600 dark:text-red-400">
            {error}
          </div>
        )}

        {/* Card area */}
        <div className="mt-6">
          {loading || generating ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-16">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
              <p className="mt-3 text-sm text-slate-400 dark:text-slate-500">
                {generating ? 'Generating flashcards...' : 'Loading due cards...'}
              </p>
            </div>

          ) : sessionDone ? (
            <div className="flex flex-col items-center rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-14 text-center px-6">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 dark:bg-emerald-950 text-2xl">
                🎉
              </div>
              <h3 className="mt-4 text-base font-semibold text-slate-900 dark:text-slate-100">
                Session complete!
              </h3>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                You reviewed {reviewedCount} card{reviewedCount !== 1 ? 's' : ''}.
              </p>
              <button
                onClick={fetchDue}
                className="mt-5 rounded-lg bg-indigo-600 px-5 py-2 text-sm font-medium text-white transition hover:bg-indigo-700"
              >
                Review more due cards
              </button>
            </div>

          ) : cards.length === 0 ? (
            <div className="flex flex-col items-center rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 py-14 text-center px-6">
              <span className="text-3xl">✨</span>
              <p className="mt-3 text-sm font-medium text-slate-700 dark:text-slate-300">
                No cards due right now
              </p>
              <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
                Generate new cards for a topic above, or come back later.
              </p>
            </div>

          ) : (
            <>
              {/* Progress bar */}
              <div className="mb-4 flex items-center gap-3">
                <div className="flex-1 h-1.5 rounded-full bg-slate-100 dark:bg-slate-800">
                  <div
                    className="h-1.5 rounded-full bg-indigo-500 transition-all"
                    style={{ width: `${((index) / cards.length) * 100}%` }}
                  />
                </div>
                <span className="text-xs text-slate-400 dark:text-slate-500 whitespace-nowrap">
                  {index + 1} / {cards.length}
                </span>
              </div>

              {/* Card */}
              <div
                onClick={() => setFlipped(!flipped)}
                className={`relative cursor-pointer rounded-2xl border p-8 text-center transition-all duration-200 select-none
                  ${flipped
                    ? 'border-indigo-200 dark:border-indigo-800 bg-indigo-50 dark:bg-indigo-950'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-indigo-200 dark:hover:border-indigo-800'
                  }`}
              >
                {/* Top meta row */}
                <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                  <span className="rounded-full bg-indigo-50 dark:bg-indigo-950 px-2 py-0.5 text-xs font-medium text-indigo-600 dark:text-indigo-400">
                    {card.topic}
                  </span>
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium capitalize ${difficultyColor[card.difficulty] || difficultyColor.medium}`}>
                    {card.difficulty}
                  </span>
                </div>

                {/* Label */}
                <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500">
                  {flipped ? 'Answer' : 'Question'}
                </p>

                {/* Content */}
                <p className={`text-base font-medium leading-relaxed ${
                  flipped
                    ? 'text-indigo-900 dark:text-indigo-100'
                    : 'text-slate-900 dark:text-slate-100'
                }`}>
                  {flipped ? card.answer : card.question}
                </p>

                {!flipped && (
                  <p className="mt-5 text-xs text-slate-400 dark:text-slate-500">
                    Tap to reveal answer
                  </p>
                )}
              </div>

              {/* Rating buttons */}
              {flipped && (
                <div className="mt-4 grid grid-cols-3 gap-2">
                  {ratingButtons.map((btn) => (
                    <button
                      key={btn.key}
                      onClick={() => handleRate(btn.key)}
                      className={`rounded-xl py-2.5 text-sm font-medium transition ${btn.color}`}
                    >
                      {btn.label}
                    </button>
                  ))}
                </div>
              )}

              {/* Hint when not flipped */}
              {!flipped && (
                <p className="mt-3 text-center text-xs text-slate-400 dark:text-slate-500">
                  Rate after revealing the answer
                </p>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Flashcards;