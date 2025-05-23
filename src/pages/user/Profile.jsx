import React, { useEffect, useState, useCallback, useRef } from "react";
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
  Mail, Frown, Lock, Edit, Save, X  
} from "lucide-react";
import { useParams } from "react-router-dom";
import Swal from 'sweetalert2';


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
  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [newUsername, setNewUsername] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [newBio, setNewBio] = useState("");
  const [bioError, setBioError] = useState("");
  const usernameInputRef = useRef(null);
  const bioTextareaRef = useRef(null);

  // Tambahkan useEffect untuk setiap section
  useEffect(() => {
    if (isEditingUsername && usernameInputRef.current) {
      usernameInputRef.current.focus();
    }
  }, [isEditingUsername]);

  useEffect(() => {
    if (isEditingBio && bioTextareaRef.current) {
      bioTextareaRef.current.focus();
    }
  }, [isEditingBio]);

// Fungsi untuk memulai edit bio
const startEditingBio = () => {
  setNewBio(userData?.bio || "");
  setIsEditingBio(true);
  setBioError("");
};

// Fungsi untuk membatalkan edit bio
const cancelEditingBio = () => {
  setIsEditingBio(false);
  setNewBio("");
  setBioError("");
};

// Fungsi untuk menyimpan bio baru
const saveBio = async () => {
  if (newBio.length > 150) {
    setBioError("Bio maksimal 150 karakter");
    return;
  }

  try {
    setLoading(true);
    
    const { error } = await supabase
      .from("users")
      .update({ bio: newBio })
      .eq("id", userId);

    if (error) throw error;

    setUserData(prev => ({ ...prev, bio: newBio }));
    setIsEditingBio(false);
    setBioError("");

    Swal.fire({
      icon: 'success',
      title: 'Berhasil!',
      text: 'Bio berhasil diperbarui.',
      timer: 2000,
      showConfirmButton: false,
    });

  } catch (error) {
    console.error("Gagal update bio:", error);
    setBioError(error.message || "Gagal memperbarui bio");

    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: error.message || 'Gagal memperbarui bio',
    });
  } finally {
    setLoading(false);
  }
};

// Fungsi untuk memulai edit username
  const startEditingUsername = () => {
    setNewUsername(userData?.username || "");
    setIsEditingUsername(true);
    setUsernameError("");
  };

  // Fungsi untuk membatalkan edit
  const cancelEditingUsername = () => {
    setIsEditingUsername(false);
    setNewUsername("");
    setUsernameError("");
  };

// Fungsi untuk menyimpan username baru
const saveUsername = async () => {
  if (!newUsername.trim()) {
    setUsernameError("Username tidak boleh kosong");
    return;
  }

  if (newUsername.length > 20) {
    setUsernameError("Username maksimal 20 karakter");
    return;
  }

  try {
    setLoading(true);
    
    const { error: updateError } = await supabase
      .from("users")
      .update({ username: newUsername })
      .eq("id", userId);

    if (updateError) throw updateError;

    const { data: userPosts, error: postsError } = await supabase
      .from("posts")
      .select("id")
      .eq("id_user", userId);

    if (postsError) throw postsError;

    setUserData(prev => ({ ...prev, username: newUsername }));
    setPosts(prev => prev.map(post => ({
      ...post,
      users: { ...post.users, username: newUsername }
    })));

    setIsEditingUsername(false);
    setUsernameError("");

    // Swal berhasil
    Swal.fire({
      icon: 'success',
      title: 'Berhasil!',
      text: 'Username berhasil diperbarui.',
      timer: 2000,
      showConfirmButton: false,
    });

  } catch (error) {
    console.error("Gagal update username:", error);
    setUsernameError(error.message || "Gagal memperbarui username");

    // Swal gagal
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: error.message || 'Gagal memperbarui username',
    });
  } finally {
    setLoading(false);
  }
};

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
  <div className="min-h-screen bg-yellow-50 text-black flex flex-col font-sans border-4 border-black">
    <Header />

    <main className="flex-1 max-w-4xl mx-auto p-3 sm:p-6 w-full font-bold tracking-tight">
      {userData && (
      <section className="bg-pink-200 border-2 sm:border-4 border-black p-2 sm:p-6 rounded-lg sm:rounded-xl shadow-[4px_4px_0px_rgba(0,0,0,1)] mb-3 sm:mb-8">
        <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-4">
          <div className="bg-yellow-300 p-1.5 sm:p-3 rounded-full border-2 sm:border-4 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] sm:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
            <User className="w-5 h-5 sm:w-8 sm:h-8 text-black" />
          </div>
          <h2 className="text-base sm:text-3xl font-bold border-b-2 sm:border-b-4 border-black pb-1">DATA PENGGUNA</h2>
        </div>

        <div className="space-y-2 sm:space-y-4">
          {/* Username Section */}
          <div className="flex flex-row items-center gap-2">
            <span className="font-bold min-w-[78px] sm:min-w-[120px] text-xs sm:text-lg">USERNAME:</span>
            {isEditingUsername ? (
              <div className="flex-1 flex flex-col gap-1">
                <div className="flex gap-1 sm:gap-2">
                  <input
                    type="text"
                    ref={usernameInputRef}
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                    className="flex-1 bg-white px-2 py-1 sm:px-4 sm:py-2 rounded-md sm:rounded-lg border-2 sm:border-4 border-black text-xs sm:text-base"
                    maxLength={20}
                  />
                  <div className="flex gap-1 sm:gap-2">
                    <button
                      onClick={saveUsername}
                      className="bg-green-500 text-white p-1 sm:p-2 rounded-md sm:rounded-lg border-2 sm:border-4 border-black"
                    >
                      <Save className="w-3 h-3 sm:w-5 sm:h-5" />
                    </button>
                    <button
                      onClick={cancelEditingUsername}
                      className="bg-red-500 text-white p-1 sm:p-2 rounded-md sm:rounded-lg border-2 sm:border-4 border-black"
                    >
                      <X className="w-3 h-3 sm:w-5 sm:h-5" />
                    </button>
                  </div>
                </div>
                {usernameError && (
                  <span className="text-red-500 text-[10px] sm:text-sm">{usernameError}</span>
                )}
              </div>
            ) : (
              <div className="flex-1 flex items-center gap-1 sm:gap-2">
                <span className="flex-1 bg-lime-200 px-2 py-1 sm:px-4 sm:py-2 rounded-md sm:rounded-lg border-2 sm:border-4 border-black text-xs sm:text-base">
                  {userData?.username || '❌ ANONIM'}
                </span>
                {authUser?.id === userId && (
                  <button
                    onClick={startEditingUsername}
                    className="bg-yellow-300 p-1 sm:p-2 rounded-md sm:rounded-lg border-2 sm:border-4 border-black"
                  >
                    <Edit className="w-3 h-3 sm:w-5 sm:h-5" />
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Bio Section */}
          <div className="flex flex-row items-start gap-2">
            <span className="font-bold min-w-[78px] sm:min-w-[120px] text-xs sm:text-lg pt-1">BIO:</span>
            {isEditingBio ? (
              <div className="flex-1 flex flex-col gap-1">
                <div className="flex flex-col sm:flex-row gap-1 sm:gap-2">
                  <textarea
                    value={newBio}
                    ref={bioTextareaRef}
                    onChange={(e) => setNewBio(e.target.value)}
                    className="flex-1 bg-white px-2 py-1 sm:px-4 sm:py-2 rounded-md sm:rounded-lg border-2 sm:border-4 border-black min-h-[60px] text-xs sm:text-base"
                    maxLength={150}
                  />
                  <div className="flex flex-row gap-1 sm:gap-2 sm:flex-col">
                    <button
                      onClick={saveBio}
                      className="bg-green-500 text-white p-1 sm:p-2 rounded-md sm:rounded-lg border-2 sm:border-4 border-black"
                    >
                      <Save className="w-3 h-3 sm:w-5 sm:h-5" />
                    </button>
                    <button
                      onClick={cancelEditingBio}
                      className="bg-red-500 text-white p-1 sm:p-2 rounded-md sm:rounded-lg border-2 sm:border-4 border-black"
                    >
                      <X className="w-3 h-3 sm:w-5 sm:h-5" />
                    </button>
                  </div>
                </div>
                <div className="flex justify-between">
                  {bioError && <span className="text-red-500 text-[10px] sm:text-sm">{bioError}</span>}
                  <span className="text-[10px] sm:text-sm text-gray-600">
                    {newBio.length}/150
                  </span>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex items-start gap-1 sm:gap-2">
                <div className="flex-1 bg-lime-200 px-2 py-1 sm:px-4 sm:py-2 rounded-md sm:rounded-lg border-2 sm:border-4 border-black text-xs sm:text-base">
                  {userData?.bio || 'Belum ada bio...'}
                </div>
                {authUser?.id === userId && (
                  <button
                    onClick={startEditingBio}
                    className="bg-yellow-300 p-1 sm:p-2 rounded-md sm:rounded-lg border-2 sm:border-4 border-black"
                  >
                    <Edit className="w-3 h-3 sm:w-5 sm:h-5" />
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Popularitas & Kontribusi Sections */}
          <div className="flex flex-col gap-2 sm:gap-4">
            <div className="flex flex-row items-center gap-2">
              <span className="font-bold min-w-[78px] sm:min-w-[120px] text-xs sm:text-lg">POPULARITAS:</span>
              <div className="relative flex-1 bg-sky-300 px-2 py-1 sm:px-4 sm:py-2 rounded-md sm:rounded-lg border-2 sm:border-4 border-black">
                <span className="flex items-center justify-between text-xs sm:text-base">
                  💭{totalComments}
                  <span className="bg-fuchsia-700 text-white px-1 sm:px-2 py-0.5 rounded-md text-[10px] sm:text-sm">
                    {getCommentBadgeIcon(totalComments)}{getCommentBadgeLabel(totalComments)}
                  </span>
                </span>
              </div>
            </div>

            <div className="flex flex-row items-center gap-2">
              <span className="font-bold min-w-[78px] sm:min-w-[120px] text-xs sm:text-lg">KONTRIBUSI:</span>
              <div className="relative flex-1 bg-sky-300 px-2 py-1 sm:px-4 sm:py-2 rounded-md sm:rounded-lg border-2 sm:border-4 border-black">
                <span className="flex items-center justify-between text-xs sm:text-base">
                  👍{totalLikes}
                  <span className="bg-fuchsia-700 text-white px-1 sm:px-2 py-0.5 rounded-md text-[10px] sm:text-sm">
                    {getBadgeIcon(totalLikes)}{getBadgeLabel(totalLikes)}
                  </span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
      )}

      {/* Postingan Section */}
      <div className="flex items-center gap-3 mb-4 p-3 bg-purple-200 border-4 border-black rounded-xl">
        <Mail className="w-6 h-6 md:w-8 md:h-8 text-black" />
        <h3 className="text-xl md:text-3xl font-bold">POSTINGAN</h3>
      </div>

      {posts.length > 0 ? (
        <div className="space-y-6">
          {posts.map((post) => (
            <article
              key={post.id}
              className="bg-white border-4 border-black p-4 md:p-6 rounded-xl shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_rgba(0,0,0,1)] transition-all"
            >
              {/* Header - tetap row baik di mobile maupun desktop */}
              <div className="flex justify-between items-start mb-3 gap-2">
                <div className="flex items-center gap-2">
                  <img
                    src={`https://api.dicebear.com/7.x/initials/svg?seed=${post.users?.username || 'User'}`}
                    className="w-8 h-8 md:w-10 md:h-10 rounded-full border-4 border-black bg-yellow-300"
                    alt="avatar"
                  />
                  <span className="font-bold text-base md:text-xl">
                    {post.users?.username || '👻 ANONIM'}
                  </span>
                </div>
                <div className="flex items-center gap-2 bg-pink-200 px-2 py-1 md:px-3 md:py-1 rounded-lg border-2 border-black">
                  <Calendar className="w-4 h-4 md:w-5 md:h-5" />
                  <span className="font-semibold text-xs md:text-sm">
                    {new Date(post.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {/* Konten Postingan */}
              <div className="relative mb-8 md:mb-10 bg-blue-50 p-3 md:p-4 rounded-lg border-4 border-black">
                <p className="whitespace-pre-wrap text-base md:text-lg font-medium">
                  {expandedPosts.includes(post.id) || post.content.length <= MAX_LENGTH
                    ? post.content
                    : post.content.substring(0, MAX_LENGTH) + '...'}
                </p>
                {post.content.length > MAX_LENGTH && (
                  <button
                    onClick={() => toggleReadMore(post.id)}
                    className="absolute -bottom-7 md:-bottom-8 right-0 bg-black text-white px-3 py-1 md:px-4 md:py-1 rounded-lg border-2 border-white hover:bg-white hover:text-black transition-colors font-bold text-xs md:text-sm"
                  >
                    {expandedPosts.includes(post.id) ? '🙈 TUTUP' : '🐵 LIHAT SEMUA'}
                  </button>
                )}
              </div>

              {/* Footer - Tetap row baik di mobile maupun desktop */}
              <div className="flex justify-between items-center mt-3 md:mt-4 border-t-4 border-black pt-3 md:pt-4">
                <div className="flex items-center gap-4 md:gap-6">
                  <span className="flex items-center gap-2 font-bold text-base md:text-xl">
                    ❤️ {post.like_count || 0}
                  </span>
                  <span className="flex items-center gap-2 font-bold text-base md:text-xl">
                    💭 {post.comment_count || 0}
                  </span>
                </div>

                <button
                  onClick={() => toggleComments(post.id)}
                  className="bg-yellow-300 px-3 py-1 md:px-4 md:py-1 rounded-lg border-4 border-black hover:bg-yellow-400 hover:text-black hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all text-sm"
                >
                  {showComments[post.id] ? 'TUTUP' : 'Komentar'}
                </button>
              </div>

              {/* Komentar - Tetap sama layoutnya */}
              {showComments[post.id] && (
                <section className="mt-3 md:mt-4 bg-green-200 p-3 md:p-4 rounded-xl border-4 border-black max-h-60 overflow-y-auto">
                  {(commentsByPost[post.id]?.length > 0) ? (
                    <div className="space-y-3 md:space-y-4">
                      {commentsByPost[post.id].map((comment, idx) => (
                        <div
                          key={`${comment.created_at}-${idx}`}
                          className="bg-white p-3 rounded-lg border-4 border-black"
                        >
                          <div className="flex items-center gap-3 mb-2">
                            <img
                              src={`https://api.dicebear.com/7.x/initials/svg?seed=${comment.username}`}
                              className="w-8 h-8 rounded-full border-2 border-black"
                              alt="avatar"
                            />
                            <span className="font-bold text-sm md:text-base">{comment.username}</span>
                            <span className="ml-auto text-xs md:text-sm bg-transparent text-black rounded">
                              {new Date(comment.created_at).toLocaleString('id-ID', {
                                hour12: false,
                                year: '2-digit',
                                month: '2-digit',
                                day: '2-digit',
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </span>
                          </div>
                          <p className="text-base md:text-lg font-medium whitespace-pre-wrap">
                            {comment.content}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-black text-white p-3 md:p-4 rounded-lg border-4 border-white text-center font-bold text-sm md:text-base">
                      🚫 BELUM ADA KOMENTAR
                    </div>
                  )}
                </section>
              )}
            </article>
          ))}
        </div>
      ) : (
        <div className="bg-red-200 p-4 md:p-6 rounded-xl border-4 border-black text-center">
          <p className="text-xl md:text-2xl font-bold">📭 BELUM ADA POSTINGAN!</p>
        </div>
      )}
    </main>

    <Footer />
  </div>
);

};

export default withAuth(ProfileUser);
