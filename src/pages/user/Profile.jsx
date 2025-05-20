import React, { useEffect, useState, useCallback } from "react";
import { supabase } from "../../utils/supabase";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import {
  getBadgeIcon,
  getBadgeLabel,
  getCommentBadgeIcon,
  getCommentBadgeLabel,
} from "../../components/Badge";
import withAuth from "../../middleware/withAuth";
import { 
  Heart, MessageSquare, User, Calendar, ChevronDown, ChevronUp, 
  Mail, Trophy, Star, Smile, Frown, Meh, ArrowRight, Lock 
} from "lucide-react";
import { useParams } from "react-router-dom";

const ProfileUser = () => {
  const [authUser, setAuthUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [posts, setPosts] = useState([]);
  const [commentsByPost, setCommentsByPost] = useState({});
  const [showComments, setShowComments] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedPosts, setExpandedPosts] = useState([]);
  const { userId } = useParams();

const toggleReadMore = (postId) => {
  if (expandedPosts.includes(postId)) {
    setExpandedPosts(expandedPosts.filter(id => id !== postId));
  } else {
    setExpandedPosts([...expandedPosts, postId]);
  }
};

const MAX_LENGTH = 100;
  const toggleComments = useCallback((postId) => {
    setShowComments((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  }, []);

  // Ambil user yang sedang login (authenticated user)
  const fetchAuthUser = async () => {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) throw error;
      return user;
    } catch (err) {
      console.error("Gagal mengambil user yang login:", err);
      return null;
    }
  };

  // Ambil postingan user lengkap dengan jumlah like, komentar, dan username
  const fetchUserPosts = async (userId) => {
    try {
      const { data, error } = await supabase
        .from("posts")
        .select("*, like_count, comment_count, users(username)")
        .eq("id_user", userId)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data || [];
    } catch (err) {
      console.error("Gagal mengambil postingan user:", err);
      throw new Error("Gagal memuat postingan pengguna");
    }
  };

  // Ambil semua komentar berdasarkan daftar ID post + username komentator
  const fetchCommentsByPosts = async (postIds) => {
    if (!postIds || postIds.length === 0) return {};

    try {
      const { data: allComments, error: commentsError } = await supabase
        .from("comments")
        .select("content, created_at, id_user, post_id")
        .in("post_id", postIds)
        .order("created_at", { ascending: true });

      if (commentsError) throw commentsError;
      if (!allComments || allComments.length === 0) return {};

      // Ambil ID user yang komen tanpa duplikasi
      const commenterIds = [
        ...new Set(allComments.map((c) => c.id_user).filter(Boolean)),
      ];

      const { data: commenters, error: commentersError } = await supabase
        .from("users")
        .select("id, username")
        .in("id", commenterIds);

      if (commentersError) throw commentersError;

      const userIdToUsername = {};
      commenters.forEach((u) => {
        userIdToUsername[u.id] = u.username;
      });

      // Gabungkan komentar dengan username
      return allComments.reduce((acc, comment) => {
        const username = userIdToUsername[comment.id_user] || "Anonim";
        acc[comment.post_id] = acc[comment.post_id] || [];
        acc[comment.post_id].push({ ...comment, username });
        return acc;
      }, {});
    } catch (err) {
      console.error("Gagal mengambil komentar:", err);
      throw new Error("Gagal memuat komentar");
    }
  };

  // Update badge user berdasarkan total like dan komentar
  const updateUserBadge = async (userId, totalLikes, totalComments) => {
    try {
      const newBadge = getBadgeIcon(totalLikes);
      const { error } = await supabase
        .from("users")
        .update({ 
          badge: newBadge,
        })
        .eq("id", userId);
      if (error) throw error;
      return newBadge;
    } catch (err) {
      console.error("Gagal update badge:", err);
      throw new Error("Gagal memperbarui badge");
    }
  };

  // Ambil data profil user (username, bio, badge)
  const fetchUserProfile = async (userId) => {
    try {
      const { data, error } = await supabase
        .from("users")
        .select("username, bio, badge")
        .eq("id", userId)
        .maybeSingle();
      if (error) throw error;
      return data || {};
    } catch (err) {
      console.error("Gagal mengambil data profil user:", err);
      throw new Error("Gagal memuat profil pengguna");
    }
  };

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      setLoading(true);
      setError(null);

      try {
        // kamu bisa tetap fetch user yang login buat authUser
        const auth = await fetchAuthUser();
        if (!isMounted) return;

        setAuthUser(auth);

        if (!userId) {
          setError("User ID tidak ditemukan di URL");
          setLoading(false);
          return;
        }

        // Ambil data user profil dan postingan berdasarkan userId dari URL
        const [userPosts, profile] = await Promise.all([
          fetchUserPosts(userId),
          fetchUserProfile(userId),
        ]);

        if (!isMounted) return;

        setPosts(userPosts);
        setUserData(profile);

        const commentsMap = await fetchCommentsByPosts(userPosts.map((p) => p.id));

        if (!isMounted) return;

        setCommentsByPost(commentsMap);

        // Kalau mau update badge, mending hanya kalau userId === auth.id (user yang login)
        if (auth && auth.id === userId) {
          const totalLikes = userPosts.reduce((sum, post) => sum + (post.like_count || 0), 0);
          const totalComments = userPosts.reduce((sum, post) => sum + (post.comment_count || 0), 0);
          await updateUserBadge(userId, totalLikes, totalComments);
        }
      } catch (err) {
        if (!isMounted) return;
        console.error("Error memuat data profil:", err);
        setError(err.message || "Gagal memuat data profil.");
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, [userId]);


  // Komponen rendernya bisa lanjut ya

const PostSkeleton = () => (
  // Komponen skeleton loading untuk tampilan sementara saat data post belum datang
  <div className="bg-white border-4 border-black p-4 rounded-xl mb-5 shadow-[4px_4px_0px_rgba(0,0,0,1)] animate-pulse space-y-2">
    <div className="h-4 bg-gray-300 rounded w-1/4" />
    <div className="h-4 bg-gray-300 rounded w-full" />
    <div className="h-4 bg-gray-200 rounded w-5/6" />
    <div className="h-3 bg-gray-200 rounded w-1/3" />
    <div className="flex gap-4 mt-2">
      <div className="h-4 w-20 bg-blue-200 rounded-full" />
      <div className="h-4 w-24 bg-blue-200 rounded-full" />
    </div>
    <div className="h-8 w-32 bg-yellow-300 rounded-md border-[3px] border-black shadow-[2px_2px_0px_black]" />
  </div>
);

if (loading) {
  // Jika data masih loading, tampilkan 3 buah skeleton post sebagai placeholder
  return (
    <div className="flex flex-col gap-4 p-4 max-w-2xl mx-auto">
      {[...Array(3)].map((_, idx) => (
        <PostSkeleton key={idx} />
      ))}
    </div>
  );
}

if (!authUser) {
  // Jika user belum login, tampilkan pesan supaya login dulu
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 p-4 max-w-2xl mx-auto text-center">
      <Lock className="w-12 h-12 text-pink-500" />
      <p className="text-lg text-gray-600">Kamu belum login. Silakan login dulu ya.</p>
    </div>
  );
}

if (error) {
  // Jika ada error ketika fetch data, tampilkan pesan errornya
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 p-4 max-w-2xl mx-auto text-center">
      <Frown className="w-12 h-12 text-red-500" />
      <p className="text-lg text-red-600">{error}</p>
    </div>
  );
}

// Hitung total like dari semua post yang ada
const totalLikes = posts.reduce((acc, post) => acc + (post.like_count || 0), 0);
// Hitung total komentar dari semua post
const totalComments = posts.reduce((acc, post) => acc + (post.comment_count || 0), 0);


return (
  <div className="min-h-screen bg-[#FFF3F7] text-black flex flex-col font-sans">
    <Header />

    <main className="flex-1 max-w-4xl mx-auto p-6 w-full">
      {userData && (
        <section className="bg-transparent border-4 border-black p-6 rounded-xl shadow-[4px_4px_0px_rgba(0,0,0,1)] mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-pink-100 p-3 rounded-full border-2 border-black">
              <User className="w-8 h-8 text-pink-600" />
            </div>
            <h2 className="text-2xl font-bold">Profil Kamu</h2>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="font-semibold min-w-[100px]">Username:</span>
              <span className="flex-1 bg-pink-50 px-3 py-1 rounded-md border border-pink-700">
                {userData.username || 'Tidak tersedia'}
              </span>
            </div>

            <div className="relative group flex items-center gap-2">
              <span className="font-semibold min-w-[100px]">Popularitas:</span>
              <span className="flex items-center gap-1 flex-1 bg-blue-50 px-1 py-1 rounded-md border border-blue-700">
                {/* Tampilkan ikon badge komentar berdasarkan total komentar */}
                🗯{(totalComments)} ||
                <span className="absolute italic text-sm text-gray-700 right-1">
                  {getCommentBadgeIcon(totalComments)}{getCommentBadgeLabel(totalComments)}
                </span>
              </span>
              {/* Tooltip yang muncul saat hover untuk info total komentar dan status */}
              <span className="absolute left-0 ml-2 w-max px-3 py-1 text-xs text-white bg-pink-700 rounded opacity-0 group-hover:opacity-100 pointer-events-none z-50 transition-opacity duration-300 text-left">
                Total komentar: {totalComments}
                <br />
                Status: {getCommentBadgeIcon(totalComments)}{getCommentBadgeLabel(totalComments)}
              </span>
            </div>

            <div className="relative group flex items-center gap-2">
              <span className="font-semibold min-w-[100px]">Kontribusi:</span>
              <span className="flex items-center gap-1 flex-1 bg-yellow-50 px-1 py-1 rounded-md border border-yellow-700">
                {/* Tampilkan ikon badge like berdasarkan total like */}
                👍{(totalLikes)} ||
                <span className="absolute italic text-sm text-gray-700 right-1">
                  {getBadgeIcon(totalLikes)}{getBadgeLabel(totalLikes)}
                </span>
              </span>
              {/* Tooltip yang muncul saat hover untuk info total like dan status */}
              <span className="absolute left-0 ml-2 w-max px-3 py-1 text-xs text-white bg-pink-700 rounded opacity-0 group-hover:opacity-100 pointer-events-none z-50 transition-opacity duration-300 text-left">
                Total like: {totalLikes}
                <br />
                Status: {getBadgeIcon(totalLikes)}{getBadgeLabel(totalLikes)}
              </span>
            </div>
          </div>
        </section>
      )}

      <div className="flex items-center gap-3 mb-6">
        <Mail className="w-6 h-6 text-pink-600" />
        <h3 className="text-2xl font-bold">Postingan Kamu</h3>
      </div>

    {posts.length > 0 ? (
      <div className="space-y-6">
        {posts.map((post) => (
          <article
            key={post.id}
            className="bg-transparent border-4 border-black p-5 rounded-xl shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_rgba(0,0,0,1)] transition-all duration-200"
          >
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center gap-2">
                <img
                  src={`https://api.dicebear.com/7.x/initials/svg?seed=${post.users?.username || 'User'}`}
                  className="w-8 h-8 rounded-full border-2 border-black"
                  alt="avatar"
                />
                <span className="font-semibold">
                  {post.users?.username || 'Anonim'}
                </span>
              </div>
              <div className="flex items-center gap-1 text-sm text-gray-600">
                <Calendar className="w-4 h-4" />
                <span>{new Date(post.created_at).toLocaleDateString()}</span>
              </div>
            </div>

            {/* Konten post dengan read more/less */}

            <div className="relative mb-10">
              <p className="whitespace-pre-wrap text-gray-800">
                {expandedPosts.includes(post.id) || post.content.length <= MAX_LENGTH
                  ? post.content
                  : post.content.substring(0, MAX_LENGTH) + '...'}
              </p>

              {post.content.length > MAX_LENGTH && (
                <span
                  onClick={() => toggleReadMore(post.id)}
                  className="absolute right-0 text-blue-600 hover:underline hover:text-green-600 cursor-pointer text-sm font-semibold"
                  role="button"
                  tabIndex={0}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') toggleReadMore(post.id);
                  }}
                >
                  {expandedPosts.includes(post.id) ? 'Lebih Sedikit' : 'Lihat Selengkapnya'}
                </span>
              )}
            </div>
            <div className="flex justify-between items-center mt-4">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1 text-gray-600">
                  <Heart className="w-5 h-5 text-pink-500" />
                  <span>{post.like_count || 0}</span>
                </span>

                <span className="flex items-center gap-1 text-gray-600">
                  <MessageSquare className="w-5 h-5 text-blue-500" />
                  <span>{post.comment_count || 0}</span>
                </span>
              </div>

              <button
                onClick={() => toggleComments(post.id)}
                className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 transition-colors"
              >
                {showComments[post.id] ? (
                  <>
                    <ChevronUp className="w-4 h-4" />
                    Sembunyikan
                  </>
                ) : (
                  <>
                    <ChevronDown className="w-4 h-4" />
                    Lihat Komentar
                  </>
                )}
              </button>
            </div>

            {showComments[post.id] && (
              <section className="mt-4 bg-[#FFE6F1] p-4 rounded-lg border-2 border-pink-300 max-h-60 overflow-y-auto">
                {(commentsByPost[post.id]?.length > 0) ? (
                  <div className="space-y-3">
                    {commentsByPost[post.id].map((comment, idx) => (
                      <div
                        key={`${comment.created_at}-${idx}`}
                        className="pb-2 border-b border-pink-200 last:border-none"
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <img
                            src={`https://api.dicebear.com/7.x/initials/svg?seed=${comment.username}`}
                            className="w-5 h-5 rounded-full"
                            alt="avatar"
                          />
                          <span className="font-semibold">{comment.username}</span>
                          <span className="text-xs text-gray-500">
                            {new Date(comment.created_at).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700 whitespace-pre-wrap">
                          {comment.content}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 italic text-center">
                    Belum ada komentar.
                  </p>
                )}
              </section>
            )}
          </article>
        ))}
      </div>
    ) : (
      <p className="text-center text-gray-500 italic">Kamu belum punya postingan.</p>
    )}
    </main>

    <Footer />
  </div>
);

};

export default withAuth(ProfileUser);
