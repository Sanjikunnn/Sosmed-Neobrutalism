export const MAX_CHARACTERS = 200;

// Badge Likes dengan Emoji
export const getBadgeIcon = (likes) => {
  if (likes >= 100) return '👑';
  if (likes >= 50) return '🔥';
  if (likes >= 20) return '🌟';
  if (likes >= 10) return '👍';
  return '🙂';
};

// Badge Komentar dengan Emoji
export const getCommentBadgeIcon = (commentCount) => {
  if (commentCount >= 100) return '🏆';
  if (commentCount >= 50) return '👥';
  if (commentCount >= 20) return '🗣️';
  if (commentCount >= 10) return '👀';
  return '🌱';
};
