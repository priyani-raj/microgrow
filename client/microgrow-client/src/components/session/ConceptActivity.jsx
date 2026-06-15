import { useEffect, useState } from 'react';
import * as aiService from '../../services/aiService';

const ConceptActivity = ({ topic, onComplete }) => {
  const [explanation, setExplanation] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [helpful, setHelpful] = useState(null);

  useEffect(() => {
    const fetchExplanation = async () => {
      try {
        const data = await aiService.explainConcept(topic);
        setExplanation(data.explanation);
      } catch (err) {
        setError('Could not load explanation. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchExplanation();
  }, [topic]);

  const handleFinish = (rating) => {
    setHelpful(rating);
    onComplete({
      type: 'concept',
      topic,
      score: null,
      aiFeedback: `User found explanation ${rating ? 'helpful' : 'not helpful'}`,
    });
  };

  if (loading) {
    return <p className="text-center text-sm text-slate-400">Generating your explanation...</p>;
  }

  if (error) {
    return <p className="text-center text-sm text-red-500">{error}</p>;
  }

  return (
    <div>
      <div className="rounded-xl border border-slate-200 bg-white p-5">
        <span className="mb-2 inline-block rounded-full bg-indigo-50 px-2 py-0.5 text-xs font-medium text-indigo-600">
          {topic}
        </span>
        <p className="text-sm leading-relaxed text-slate-700">{explanation}</p>
      </div>

      <p className="mt-4 text-center text-sm text-slate-500">Was this clear?</p>
      <div className="mt-2 grid grid-cols-2 gap-2">
        <button
          onClick={() => handleFinish(true)}
          className="rounded-lg bg-emerald-50 py-2 text-sm font-medium text-emerald-600 transition hover:bg-emerald-100"
        >
          👍 Yes, clear
        </button>
        <button
          onClick={() => handleFinish(false)}
          className="rounded-lg bg-slate-100 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-200"
        >
          👎 Still confused
        </button>
      </div>
    </div>
  );
};

export default ConceptActivity;
