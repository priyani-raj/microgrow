import api from './api';

export const getSessionHistory = async () => {
  const { data } = await api.get('/session/history');
  return data;
};
