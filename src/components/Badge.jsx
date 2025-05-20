export const MAX_CHARACTERS = 200;

// Badge untuk Likes terbanyak di postingan user dengan Emoji
export const getBadgeIcon = (likes) => {
  if (likes >= 100) return '🙇🏼‍♂️';
  if (likes >= 30) return '👑';
  if (likes >= 20) return '🌟';
  if (likes >= 10) return '🤳🏼';
  return '🤹🏼‍♂️';
};

// Badge untuk Komentar terbanyak di postingan user dengan Emoji
export const getCommentBadgeIcon = (commentCount) => {
  if (commentCount >= 50) return '🏆';
  if (commentCount >= 30) return '🍻';
  if (commentCount >= 10) return '🗣️';
  if (commentCount >= 5) return '🫂';
  return '🗿';
};
// Badge untuk Likes terbanyak di postingan user dengan Kata-kata
export const getBadgeLabel = (likes) => {
  if (likes >= 100) return 'Legenda';
  if (likes >= 30) return 'Influencer';
  if (likes >= 20) return 'Seleb Baru';
  if (likes >= 10) return 'Aktif';
  return 'Pemula';
};

// Badge untuk Komentar terbanyak di postingan user dengan Kata-kata
export const getCommentBadgeLabel = (commentCount) => {
  if (commentCount >= 50) return 'Titik Kumpul';
  if (commentCount >= 30) return 'Warkop';
  if (commentCount >= 10) return 'Pusat Drama';
  if (commentCount >= 5) return 'Viral';
  return 'Nolep';
};