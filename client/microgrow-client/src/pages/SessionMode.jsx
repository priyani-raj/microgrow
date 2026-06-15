import { useState } from 'react';
import Navbar from '../components/common/Navbar';
import TimePicker from '../components/session/TimePicker';
import SessionTimer from '../components/session/SessionTimer';
import DSAActivity from '../components/session/DSAActivity';
import FlashcardActivity from '../components/session/FlashcardActivity';
import ConceptActivity from '../components/session/ConceptActivity';
import SessionComplete from '../components/session/SessionComplete';
import * as sessionService from '../services/sessionService';

// Steps: 'pick' -> 'loading' -> 'activity' -> 'done'
const SessionMode = () => {
  const [step, setStep] = useState('pick');
  const [sessionInfo, setSessionInfo] = useState(null);
  const [error, setError] = useState('');
  const [streak, setStreak] = useState(null);

  const handleTimeSelect = async (minutes) => {
    setStep('loading');
    setError('');

    try {
      const data = await sessionService.startSession(minutes);
      setSessionInfo({ ...data, minutesAvailable: minutes });
      setStep('activity');
    } catch (err) {
      setError('Could not start a session. Please try again.');
      setStep('pick');
    }
  };

  const handleActivityComplete = async ({ type, topic, score, aiFeedback }) => {
    try {
      const result = await sessionService.completeSession({
        type,
        topic,
        duration: sessionInfo.minutesAvailable,
        score,
        aiFeedback,
      });
      setStreak(result.streak);
    } catch (err) {
      // even if saving fails, still show completion
    }
    setStep('done');
  };

  const renderActivity = () => {
    const { activityType, topic } = sessionInfo;

    switch (activityType) {
      case 'dsa':
        return <DSAActivity topic={topic} onComplete={handleActivityComplete} />;
      case 'flashcard':
        return <FlashcardActivity topic={topic} onComplete={handleActivityComplete} />;
      case 'concept':
        return <ConceptActivity topic={topic} onComplete={handleActivityComplete} />;
      default:
        return <p className="text-center text-sm text-slate-400 dark:text-slate-500">Unknown activity type.</p>;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Navbar />

      <div className="mx-auto max-w-lg px-4 py-8">
        {error && (
          <div className="mb-4 rounded-lg bg-red-50 dark:bg-red-950 px-4 py-2 text-center text-sm text-red-600 dark:text-red-400">
            {error}
          </div>
        )}

        {step === 'pick' && <TimePicker onSelect={handleTimeSelect} />}

        {step === 'loading' && (
          <p className="text-center text-sm text-slate-400 dark:text-slate-500">Picking the right activity for you...</p>
        )}

        {step === 'activity' && sessionInfo && (
          <div>
            <div className="mb-4">
              <SessionTimer totalMinutes={sessionInfo.minutesAvailable} />
            </div>
            {renderActivity()}
          </div>
        )}

        {step === 'done' && (
          <SessionComplete streak={streak} minutes={sessionInfo?.minutesAvailable} />
        )}
      </div>
    </div>
  );
};

export default SessionMode;
