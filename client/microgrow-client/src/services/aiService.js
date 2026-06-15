import api from './api';

export const explainConcept = async (topic, simpler = false) => {
  const { data } = await api.post('/ai/explain', { topic, simpler });
  return data;
};

export const evaluateApproach = async (problemId, userApproach) => {
  const { data } = await api.post('/ai/evaluate', { problemId, userApproach });
  return data;
};

export const generateFlashcards = async (topic, count = 5) => {
  const { data } = await api.post('/ai/generate-flashcards', { topic, count });
  return data;
};
