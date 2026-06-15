import api from './api';

export const getRandomProblem = async (topic) => {
  const params = topic ? `?topic=${encodeURIComponent(topic)}` : '';
  const { data } = await api.get(`/dsa/problems/random${params}`);
  return data;
};
