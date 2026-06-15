import api from './api';

export const startSession = async (minutes) => {
  const { data } = await api.get(`/session/start?minutes=${minutes}`);
  return data;
};

export const completeSession = async ({ type, topic, duration, score, aiFeedback }) => {
  const { data } = await api.post('/session/complete', {
    type,
    topic,
    duration,
    score,
    aiFeedback,
  });
  return data;
};
