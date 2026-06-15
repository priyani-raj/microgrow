import api from './api';

export const getProgress = async () => {
  const { data } = await api.get('/progress');
  return data;
};
