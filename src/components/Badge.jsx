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
// Badge Likes dengan Kata-kata
export const getBadgeLabel = (likes) => {
  if (likes >= 100) return '👑Legenda';
  if (likes >= 50) return '🔥Influencer';
  if (likes >= 20) return '🌟Bintang Meningkat';
  if (likes >= 10) return '👍Aktif';
  return '🙂Pemula';
};

// Badge Komentar dengan Kata-kata
export const getCommentBadgeLabel = (commentCount) => {
  if (commentCount >= 100) return '🏆Komentator Terbaik';
  if (commentCount >= 50) return '👥Pemimpin Diskusi';
  if (commentCount >= 20) return '🗣️Pembicara';
  if (commentCount >= 5) return '👀Pengamat';
  return '🌱Pendatang Baru';
};
// Badge Likes per post dengan Kata-kata
export const getBadgeLikesPost = (likes) => {
  if (likes >= 30) return '👑Legenda';
  if (likes >= 20) return '🔥Influencer';
  if (likes >= 10) return '🌟Bintang Meningkat';
  if (likes >= 5) return '👍Aktif';
  return '🙂Pemula';
};

// Badge Komentar per post dengan Kata-kata
export const getBadgeCommentsPost = (commentCount) => {
  if (commentCount >= 20) return '🏆Komentator Terbaik';
  if (commentCount >= 15) return '👥Pemimpin Diskusi';
  if (commentCount >= 10) return '🗣️Pembicara';
  if (commentCount >= 5) return '👀Pengamat';
  return '🌱Pendatang Baru';
};