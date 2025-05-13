// src/constants/index.js

export const MAX_CHARACTERS = 200;

export const getBadgeIcon = (likes) => {
  if (likes >= 100) return '👑';
  if (likes >= 50) return '🔥';
  if (likes >= 20) return '🌟';
  if (likes >= 10) return '👍';
  return '🙂';
};
