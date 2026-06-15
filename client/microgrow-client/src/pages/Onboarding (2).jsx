import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import * as userService from '../services/userService';
import { CORE_TOPICS, TARGET_COMPANIES } from '../constants/options';

const Onboarding = () => {
  const [weakTopics, setWeakTopics] = useState([]);
  const [targetCompanies, setTargetCompanies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { setUser, user } = useAuth();
  const navigate = useNavigate();

  const toggle = (list, setList, item) => {
    setList(list.includes(item) ? list.filter((i) => i !== item) : [...list, item]);
  };

  const handleSubmit = async () => {
    setError('');

    if (weakTopics.length === 0) {
      setError('Please select at least one topic to focus on');
      return;
    }

    setLoading(true);
    try {
      const data = await userService.completeOnboarding(targetCompanies, weakTopics);

      const updatedUser = { ...user, ...data };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);

      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10">
      <div className="w-full max-w-lg">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-semibold text-slate-900">Let's personalize MicroGrow</h1>
          <p className="mt-1 text-sm text-slate-500">
            We'll pick the right activities for your stolen time
          </p>
        </div>

        {error && (
          <div className="mb-4 rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600">{error}</div>
        )}

        <div className="mb-6 rounded-xl border border-slate-200 bg-white p-5">
          <h2 className="mb-1 text-sm font-medium text-slate-900">
            Which topics do you want to focus on? <span className="text-red-500">*</span>
          </h2>
          <p className="mb-3 text-xs text-slate-500">Pick the ones you feel weakest in</p>
          <div className="flex flex-wrap gap-2">
            {CORE_TOPICS.map((topic) => (
              <button
                key={topic}
                type="button"
                onClick={() => toggle(weakTopics, setWeakTopics, topic)}
                className={`rounded-full px-3 py-1.5 text-sm font-medium transition ${
                  weakTopics.includes(topic)
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {topic}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-6 rounded-xl border border-slate-200 bg-white p-5">
          <h2 className="mb-1 text-sm font-medium text-slate-900">Target companies</h2>
          <p className="mb-3 text-xs text-slate-500">Optional — helps tailor your roadmap</p>
          <div className="flex flex-wrap gap-2">
            {TARGET_COMPANIES.map((company) => (
              <button
                key={company}
                type="button"
                onClick={() => toggle(targetCompanies, setTargetCompanies, company)}
                className={`rounded-full px-3 py-1.5 text-sm font-medium transition ${
                  targetCompanies.includes(company)
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {company}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-700 disabled:opacity-60"
        >
          {loading ? 'Saving...' : "Let's go"}
        </button>
      </div>
    </div>
  );
};

export default Onboarding;
