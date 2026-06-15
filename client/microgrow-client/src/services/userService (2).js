import api from './api';

export const completeOnboarding = async (targetCompanies, weakTopics) => {
  const { data } = await api.put('/user/onboarding', { targetCompanies, weakTopics });
  return data;
};

export const updateSettings = async (updates) => {
  const { data } = await api.put('/user/settings', updates);
  return data;
};
