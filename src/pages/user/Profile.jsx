import React, { useEffect, useState } from "react";
import { supabase } from "../../utils/supabase";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import {
  MAX_CHARACTERS,
  getBadgeIcon,
  getCommentBadgeIcon,
  getBadgeLabel,
  getCommentBadgeLabel,
} from "../../components/Badge"; 
import withAuth from "../../middleware/withAuth";

const ProfileUser = () => {
  const [authUser, setAuthUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [posts, setPosts] = useState([]);
  const [commentsByPost, setCommentsByPost] = useState({});
  const [showComments, setShowComments] = useState({});
  const [loading, setLoading] = useState(true);

  const toggleComments = (postId) => {
    setShowComments((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true);

        // Ambil user saat ini
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();
        if (userError) throw userError;
        if (!user) {
          setLoading(false);
          return;
        }
        setAuthUser(user);

        // Ambil postingan user dengan join ke tabel users untuk username
        const { data: userPosts, error: postsError } = await supabase
          .from("posts")
          .select("*, like_count, comment_count, users(username)")
          .eq("id_user", user.id)
          .order("created_at", { ascending: false });

        if (postsError) throw postsError;

        const postsData = userPosts || [];
        setPosts(postsData);

        // Ambil semua komentar sekaligus supaya gak loop await per post (optimize)
        const postIds = postsData.map((p) => p.id);
        let commentsMap = {};

        if (postIds.length > 0) {
          const { data: allComments, error: commentsError } = await supabase
            .from("comments")
            .select("content, created_at, id_user, post_id")
            .in("post_id", postIds)
            .order("created_at", { ascending: true });

          if (commentsError) throw commentsError;

          // Ambil username untuk semua user komentar unik sekaligus
          const commenterIds = [
            ...new Set(allComments.map((c) => c.id_user).filter(Boolean)),
          ];

          const { data: commenters, error: commentersError } = await supabase
            .from("users")
            .select("id, username")
            .in("id", commenterIds);

          if (commentersError) throw commentersError;

          // Buat map id_user -> username
          const userIdToUsername = {};
          commenters.forEach((u) => {
            userIdToUsername[u.id] = u.username;
          });

          // Group komentar per post, tambahin username
          commentsMap = allComments.reduce((acc, comment) => {
            const username = userIdToUsername[comment.id_user] || "Anonim";
            const enrichedComment = { ...comment, username };
            if (!acc[comment.post_id]) acc[comment.post_id] = [];
            acc[comment.post_id].push(enrichedComment);
            return acc;
          }, {});
        }

        setCommentsByPost(commentsMap);

        // Update badge user berdasar total likes postingan
        const totalLikes = postsData.reduce(
          (sum, post) => sum + (post.like_count || 0),
          0
        );
        const newBadge = getBadgeIcon(totalLikes);

        const { error: updateBadgeError } = await supabase
          .from("users")
          .update({ badge: newBadge })
          .eq("id", user.id);

        if (updateBadgeError) throw updateBadgeError;

        // Ambil data user terbaru setelah update badge
        const { data: userInfo, error: userInfoError } = await supabase
          .from("users")
          .select("username, bio, badge")
          .eq("id", user.id)
          .maybeSingle();

        if (userInfoError) throw userInfoError;
        setUserData(userInfo);
      } catch (error) {
        console.error("Terjadi error saat mengambil data profil:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, []);

if (loading)
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="flex flex-col items-center">
        <svg
          className="animate-spin h-10 w-10 text-pink-500 mb-2"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v8z"
          ></path>
        </svg>
        <p className="text-pink-600">Memuat Data...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FFF3F7] text-black flex flex-col font-sans">
      <Header />

      <main className="flex-1 max-w-4xl mx-auto p-6">
        {userData && (
          <div className="bg-white border-4 border-black p-5 rounded-xl shadow-[4px_4px_0px_rgba(0,0,0,1)] mb-6 text-left">
            <h2 className="text-2xl font-bold mb-2">👤 Profil Kamu</h2>
            <p><strong>Username:</strong> {userData.username}</p>
            <p><strong>Kontribusi:</strong> <span className="italic text-gray-700">{getCommentBadgeLabel(userData.badge)}</span></p>
            <p><strong>Popularitas:</strong> <span className="italic text-gray-700">{getBadgeLabel(userData.badge)}</span></p>
          </div>
        )}

        <h3 className="text-xl font-bold mb-4">📬 Postingan Kamu</h3>
        {posts.length > 0 ? (
          posts.map((post) => (
            <div
              key={post.id}
              className="bg-white border-4 border-black p-4 rounded-xl mb-5 shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:scale-[1.01] transition-transform"
            >
              <div className="mb-2">
                <span className="font-semibold">{post.users?.username || "Anonim"}</span>
              </div>
              <p className="text-sm break-words">{post.content}</p>
              <div className="text-xs text-gray-600 mt-2">
                {new Date(post.created_at).toLocaleString("id-ID", {
                  hour12: false,
                  hour: "2-digit",
                  minute: "2-digit",
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                })}
              </div>
              <div className="flex gap-4 mt-2 text-sm text-blue-700">
                <span>{getBadgeIcon(post.like_count || 0)} {post.like_count || 0} like</span>
                <span>{getCommentBadgeIcon(post.comment_count || 0)} {post.comment_count || 0} komentar</span>
              </div>

              <button
                onClick={() => toggleComments(post.id)}
                className="mt-3 inline-block bg-yellow-300 hover:bg-yellow-400 text-black px-3 py-1 text-sm font-bold border-[3px] border-black rounded shadow-[2px_2px_0px_black] transition-all duration-200"
              >
                {showComments[post.id] ? "🙈 Sembunyikan" : "💬 Lihat Komentar"}
              </button>

              {showComments[post.id] && (
                <div className="mt-4 space-y-2 bg-gray-100 p-3 border-[2px] border-black rounded max-h-60 overflow-y-auto">
                  {commentsByPost[post.id]?.length > 0 ? (
                    commentsByPost[post.id].map((comment, index) => (
                      <div key={index} className="text-sm border-t border-black pt-2">
                        <strong>{comment.username}</strong>{" "}
                        <span className="ml-1 text-xs text-blue-600">{getCommentBadgeLabel(comment.comment_count)}</span>
                        <div className="text-sm break-words">{comment.content}</div>
                        <div className="text-xs text-gray-500">
                          {new Date(comment.created_at).toLocaleString("id-ID", {
                            hour12: false,
                            hour: "2-digit",
                            minute: "2-digit",
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                          })}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">Belum ada komentar.</p>
                  )}
                </div>
              )}
            </div>
          ))
        ) : (
          <p className="text-gray-500">Kamu belum membuat postingan.</p>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default withAuth(ProfileUser);