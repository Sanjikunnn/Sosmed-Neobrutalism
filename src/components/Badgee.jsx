// Badge Likes dengan Kata-kata
export const getBadgeLabel = (likes) => {
  if (likes >= 100) return '👑 Legenda';
  if (likes >= 50) return '🔥 Influencer';
  if (likes >= 20) return '🌟 Bintang Meningkat';
  if (likes >= 10) return '👍 Aktif';
  return '🙂 Pemula';
};

// Badge Komentar dengan Kata-kata
export const getCommentBadgeLabel = (commentCount) => {
  if (commentCount >= 100) return '🏆 Komentator Terbaik';
  if (commentCount >= 50) return '👥 Pemimpin Diskusi';
  if (commentCount >= 20) return '🗣️ Pembicara';
  if (commentCount >= 10) return '👀 Pengamat';
  return '🌱 Pendatang Baru';
};
