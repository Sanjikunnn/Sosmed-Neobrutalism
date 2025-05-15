import React, { useEffect, useState } from "react";
import { supabase } from "../../utils/supabase";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import {
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
  const [error, setError] = useState(null);

  const toggleComments = (postId) => {
    setShowComments((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

  // Fetch current authenticated user
  const fetchAuthUser = async () => {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();
    if (error) throw error;
    return user;
  };

  // Fetch posts by user with like & comment count + username
  const fetchUserPosts = async (userId) => {
    const { data, error } = await supabase
      .from("posts")
      .select("*, like_count, comment_count, users(username)")
      .eq("id_user", userId)
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data || [];
  };

  // Fetch all comments for given post IDs + commenters username
  const fetchCommentsByPosts = async (postIds) => {
    if (postIds.length === 0) return {};

    const { data: allComments, error: commentsError } = await supabase
      .from("comments")
      .select("content, created_at, id_user, post_id")
      .in("post_id", postIds)
      .order("created_at", { ascending: true });

    if (commentsError) throw commentsError;

    if (!allComments || allComments.length === 0) return {};

    const commenterIds = [
      ...new Set(allComments.map((c) => c.id_user).filter(Boolean)),
    ];

    const { data: commenters, error: commentersError } = await supabase
      .from("users")
      .select("id, username")
      .in("id", commenterIds);

    if (commentersError) throw commentersError;

    const userIdToUsername = Object.fromEntries(
      commenters.map((u) => [u.id, u.username])
    );

    return allComments.reduce((acc, comment) => {
      const username = userIdToUsername[comment.id_user] || "Anonim";
      acc[comment.post_id] = acc[comment.post_id] || [];
      acc[comment.post_id].push({ ...comment, username });
      return acc;
    }, {});
  };

  // Update badge based on total likes
  const updateUserBadge = async (userId, totalLikes) => {
    const newBadge = getBadgeIcon(totalLikes);
    const { error } = await supabase
      .from("users")
      .update({ badge: newBadge })
      .eq("id", userId);
    if (error) throw error;
    return newBadge;
  };

  // Fetch user profile data (username, bio, badge)
  const fetchUserProfile = async (userId) => {
    const { data, error } = await supabase
      .from("users")
      .select("username, bio, badge")
      .eq("id", userId)
      .maybeSingle();
    if (error) throw error;
    return data;
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      try {
        const user = await fetchAuthUser();
        if (!user) {
          setAuthUser(null);
          setLoading(false);
          return;
        }
        setAuthUser(user);

        const userPosts = await fetchUserPosts(user.id);
        setPosts(userPosts);

        const commentsMap = await fetchCommentsByPosts(
          userPosts.map((p) => p.id)
        );
        setCommentsByPost(commentsMap);

        const totalLikes = userPosts.reduce(
          (sum, post) => sum + (post.like_count || 0),
          0
        );
        await updateUserBadge(user.id, totalLikes);

        const profile = await fetchUserProfile(user.id);
        setUserData(profile);
      } catch (err) {
        console.error("Terjadi error saat mengambil data profil:", err);
        setError("Gagal memuat data profil.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const PostSkeleton = () => (
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

  if (loading)
    return (
      <div className="flex flex-col gap-4 p-4 max-w-2xl mx-auto">
        {[...Array(3)].map((_, idx) => (
          <PostSkeleton key={idx} />
        ))}
      </div>
    );

  if (!authUser)
    return (
      <div className="flex flex-col gap-4 p-4 max-w-2xl mx-auto text-center text-gray-600">
        <p>Kamu belum login. Silakan login dulu ya.</p>
      </div>
    );

  if (error)
    return (
      <div className="flex flex-col gap-4 p-4 max-w-2xl mx-auto text-center text-red-600">
        <p>{error}</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-[#FFF3F7] text-black flex flex-col font-sans">
      <Header />

      <main className="flex-1 max-w-4xl mx-auto p-6">
        {userData && (
          <section className="bg-white border-4 border-black p-5 rounded-xl shadow-[4px_4px_0px_rgba(0,0,0,1)] mb-6 text-left">
            <h2 className="text-2xl font-bold mb-2">👤 Profil Kamu</h2>
            <p>
              <strong>Username:</strong> {userData.username}
            </p>

            <p className="relative group inline-block cursor-default">
              <strong>Kontribusi:</strong>{" "}
              <span className="italic text-gray-700">
                {getCommentBadgeLabel(posts.reduce((acc, post) => acc + (post.comment_count || 0), 0))}
              </span>
              <span className="absolute left-1/2 -bottom-10 transform -translate-x-1/2 w-max px-3 py-1 text-xs text-white bg-pink-700 rounded opacity-0 group-hover:opacity-100 pointer-events-none z-50 transition-opacity duration-300 text-left">
                Total komentar seluruh postingan kamu:{" "}
                {posts.reduce((acc, post) => acc + (post.comment_count || 0), 0)}
                <br />
                Status: {getCommentBadgeLabel(userData.badge)}
              </span>
            </p>

            <br />

            <p className="relative group inline-block cursor-default">
              <strong>Popularitas:</strong>{" "}
              <span className="italic text-gray-700">
                {getBadgeLabel(posts.reduce((acc, post) => acc + (post.like_count || 0), 0))}
              </span>
              <span className="absolute left-1/2 -bottom-10 transform -translate-x-1/2 w-max px-3 py-1 text-xs text-white bg-pink-700 rounded opacity-0 group-hover:opacity-100 pointer-events-none z-50 transition-opacity duration-300 text-left">
                Total like seluruh postingan kamu:{" "}
                {posts.reduce((acc, post) => acc + (post.like_count || 0), 0)}
                <br />
                Status: {getBadgeLabel(userData.badge)}
              </span>
            </p>
          </section>
        )}

        <h3 className="text-xl font-bold mb-4">📬 Postingan Kamu</h3>
        {posts.length > 0 ? (
          posts.map((post) => (
            <article
              key={post.id}
              className="bg-white border-4 border-black p-4 rounded-xl mb-5 shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:scale-[1.01] transition-transform"
            >
              <div className="mb-2">
                <span className="font-semibold">
                  <img
                    src={`https://api.dicebear.com/7.x/initials/svg?seed=${post.users?.username}`}
                    className="w-6 h-6 rounded-full inline-block mr-2"
                    alt="avatar"
                  />
                  {post.users?.username}
                </span>
                <span className="text-sm text-gray-600 ml-2">
                  {new Date(post.created_at).toLocaleDateString()}
                </span>
              </div>

              <p className="mb-4 whitespace-pre-wrap">{post.content}</p>

              <div className="flex items-center gap-4 mb-3">
                <span className="flex items-center gap-1 text-gray-600">
                  {getBadgeIcon(post.like_count)}
                  {post.like_count || 0} Like
                </span>

                <span className="flex items-center gap-1 text-gray-600">
                  {getCommentBadgeIcon(post.comment_count)}
                  {post.comment_count || 0} Komentar
                </span>

                <button
                  onClick={() => toggleComments(post.id)}
                  className="flex text-xs text-blue-700 underline-offset-2 hover:underline p-1 cursor-pointer"
                >
                  {showComments[post.id] ? "Tutup Komentar" : "Lihat Komentar"}
                </button>
              </div>

              {showComments[post.id] && (
                <section className="bg-[#FFE6F1] p-3 rounded-lg max-h-48 overflow-y-auto border-2 border-pink-500">
                  {(commentsByPost[post.id] && commentsByPost[post.id].length > 0) ? (
                    commentsByPost[post.id].map((comment, idx) => (
                      <div
                        key={`${comment.created_at}-${idx}`}
                        className="mb-2 border-b border-gray-300 pb-2 last:border-none"
                      >
                        <p className="text-sm text-gray-700 font-semibold">
                          {comment.username}: <span className="text-xs">{comment.content}</span>
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 italic text-sm">Belum ada komentar.</p>
                  )}
                </section>
              )}
            </article>
          ))
        ) : (
          <p>Kamu belum memiliki postingan.</p>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default withAuth(ProfileUser);
