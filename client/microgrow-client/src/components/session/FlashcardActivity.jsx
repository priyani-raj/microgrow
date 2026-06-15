import { useEffect, useState } from 'react';
import * as flashcardService from '../../services/flashcardService';
import * as aiService from '../../services/aiService';

const ratingButtons = [
  { key: 'again', label: 'Again', color: 'bg-red-50 text-red-600 hover:bg-red-100' },
  { key: 'hard', label: 'Hard', color: 'bg-orange-50 text-orange-600 hover:bg-orange-100' },
  { key: 'easy', label: 'Easy', color: 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100' },
];

const FlashcardActivity = ({ topic, onComplete }) => {
  const [cards, setCards] = useState([]);
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reviewedCount, setReviewedCount] = useState(0);

  useEffect(() => {
    const fetchCards = async () => {
      try {
        let data = await flashcardService.getDueFlashcards(topic, 5);

        // If no due cards for this topic, generate new ones
        if (data.flashcards.length === 0) {
          const generated = await aiService.generateFlashcards(topic, 5);
          data = { flashcards: generated.flashcards };
        }

        setCards(data.flashcards);
      } catch (err) {
        setError('Could not load flashcards. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchCards();
  }, [topic]);

  const handleRate = async (rating) => {
    const card = cards[index];
    try {
      await flashcardService.reviewFlashcard(card._id, rating);
    } catch (err) {
      // non-blocking - continue even if review save fails
    }

    setReviewedCount((c) => c + 1);

    if (index + 1 < cards.length) {
      setIndex(index + 1);
      setFlipped(false);
    } else {
      onComplete({
        type: 'flashcard',
        topic,
        score: null,
        aiFeedback: `Reviewed ${reviewedCount + 1} flashcards on ${topic}`,
      });
    }
  };

  if (loading) {
    return <p className="text-center text-sm text-slate-400">Preparing your flashcards...</p>;
  }

  if (error || cards.length === 0) {
    return (
      <p className="text-center text-sm text-red-500">
        {error || 'No flashcards available right now.'}
      </p>
    );
  }

  const card = cards[index];

  return (
    <div>
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
    </div>
  );
};

export default FlashcardActivity;
