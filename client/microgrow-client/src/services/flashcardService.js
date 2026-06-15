import api from './api';

export const getDueFlashcards = async (topic, limit = 5) => {
  const params = new URLSearchParams();
  if (topic) params.append('topic', topic);
  if (limit) params.append('limit', limit);

  const { data } = await api.get(`/flashcards/due?${params.toString()}`);
  return data;
};

export const reviewFlashcard = async (cardId, rating) => {
  const { data } = await api.post('/flashcards/review', { cardId, rating });
  return data;
};
