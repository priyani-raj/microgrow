import { useEffect, useState } from 'react';
import Navbar from '../components/common/Navbar';
import * as flashcardService from '../services/flashcardService';
import * as aiService from '../services/aiService';
import { CORE_TOPICS } from '../constants/options';

const ratingButtons = [
  { key: 'again', label: 'Again', color: 'bg-red-50 text-red-600 hover:bg-red-100' },
  { key: 'hard', label: 'Hard', color: 'bg-orange-50 text-orange-600 hover:bg-orange-100' },
  { key: 'easy', label: 'Easy', color: 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100' },
];

const Flashcards = () => {
  const [cards, setCards] = useState([]);
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [generating, setGenerating] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState('');

  const fetchDue = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await flashcardService.getDueFlashcards(null, 10);
      setCards(data.flashcards);
      setIndex(0);
      setFlipped(false);
    } catch (err) {
      setError('Could not load flashcards.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDue();
  }, []);

  const handleRate = async (rating) => {
    const card = cards[index];
    try {
      await flashcardService.reviewFlashcard(card._id, rating);
    } catch (err) {
      // non-blocking
    }

    if (index + 1 < cards.length) {
      setIndex(index + 1);
      setFlipped(false);
    } else {
      // finished deck, refresh
      fetchDue();
    }
  };

  const handleGenerate = async (topic) => {
    setGenerating(true);
    setSelectedTopic(topic);
    setError('');

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

  const card = cards[index];

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <div className="mx-auto max-w-lg px-4 py-8">
        <h1 className="text-2xl font-semibold text-slate-900">Flashcards</h1>
        <p className="mt-1 text-sm text-slate-500">Review what's due, or generate new cards.</p>

        {/* Generate new cards by topic */}
        <div className="mt-4">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
            Generate new cards
          </p>
          <div className="flex flex-wrap gap-2">
            {CORE_TOPICS.map((t) => (
              <button
                key={t}
                onClick={() => handleGenerate(t)}
                disabled={generating}
                className={`rounded-full px-3 py-1 text-xs font-medium transition disabled:opacity-50 ${
                  selectedTopic === t
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="mt-4 rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600">{error}</div>
        )}

        {/* Card area */}
        <div className="mt-6">
          {loading || generating ? (
            <p className="text-center text-sm text-slate-400">
              {generating ? 'Generating flashcards...' : 'Loading due cards...'}
            </p>
          ) : cards.length === 0 ? (
            <div className="rounded-xl border border-slate-200 bg-white p-8 text-center">
              <p className="text-sm text-slate-500">
                🎉 No cards due right now! Generate new ones above, or come back later.
              </p>
            </div>
          ) : (
            <>
              <p className="mb-2 text-center text-xs text-slate-400">
                Card {index + 1} of {cards.length}
              </p>

              <div
                onClick={() => setFlipped(!flipped)}
                className="flex min-h-[180px] cursor-pointer flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white p-6 text-center transition hover:border-indigo-200"
              >
                <span className="mb-2 rounded-full bg-indigo-50 px-2 py-0.5 text-xs font-medium text-indigo-600">
                  {card.topic}
                </span>
                <p className="text-base font-medium text-slate-900">
                  {flipped ? card.answer : card.question}
                </p>
                {!flipped && <p className="mt-3 text-xs text-slate-400">Tap to reveal answer</p>}
              </div>

              {flipped && (
                <div className="mt-4 grid grid-cols-3 gap-2">
                  {ratingButtons.map((btn) => (
                    <button
                      key={btn.key}
                      onClick={() => handleRate(btn.key)}
                      className={`rounded-lg py-2 text-sm font-medium transition ${btn.color}`}
                    >
                      {btn.label}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Flashcards;
