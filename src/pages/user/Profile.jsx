import React, { useEffect, useState } from 'react';
import { supabase } from "../../utils/supabase";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { MAX_CHARACTERS, getBadgeIcon } from '../../components/Badge';

const ProfileUser = () => {
  const [authUser, setAuthUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [posts, setPosts] = useState([]);
  const [commentsByPost, setCommentsByPost] = useState({});
  const [showComments, setShowComments] = useState({});
  const [newComments, setNewComments] = useState({});

  const toggleComments = (postId) => {
    setShowComments((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError) throw userError;
        if (!user) return;
    
        setAuthUser(user);
    
        const { data: userPosts, error: postsError } = await supabase
          .from("posts")
          .select("*")
          .eq("id_user", user.id)
          .order("created_at", { ascending: false });
    
        if (postsError) throw postsError;
    
        const postsData = userPosts || [];
        setPosts(postsData);
    
        const commentsMap = {};
        for (const post of postsData) {
          const { data: comments, error: commentsError } = await supabase
            .from("comments")
            .select("content, created_at, id_user")
            .eq("post_id", post.id)
            .order("created_at", { ascending: true });
    
          // Ambil username untuk setiap komentator
          const commentsWithUsername = await Promise.all(comments.map(async (comment) => {
            const { data: userData, error: userError } = await supabase
              .from("users")
              .select("username")
              .eq("id", comment.id_user)
              .single(); // Ambil username dari pengguna yang memberi komentar
            if (userError) throw userError;
            return { ...comment, username: userData.username };
          }));
    
          commentsMap[post.id] = commentsWithUsername;
        }
        setCommentsByPost(commentsMap);
    
        const totalLikes = postsData.reduce((sum, post) => sum + (post.like_count || 0), 0);
        const newBadge = getBadgeIcon(totalLikes);
    
        await supabase
          .from("users")
          .update({ badge: newBadge })
          .eq("id", user.id);
    
        const { data: userInfo, error: userInfoError } = await supabase
          .from("users")
          .select("username, bio, badge")
          .eq("id", user.id)
          .maybeSingle();
    
        if (userInfoError) throw userInfoError;
        setUserData(userInfo);
      } catch (error) {
        console.error("Terjadi error saat mengambil data profil:", error);
      }
    };
    

    fetchProfileData();
  }, []);

  return (
      <div className="bg-[#fdfdfd] text-black font-mono min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 p-6 text-center">

        {userData ? (
          <div className="mb-6 bg-white border-[4px] border-black p-6 rounded-xl shadow-[4px_4px_0px_rgba(0,0,0,1)] inline-block transition-transform duration-200 hover:scale-[1.02]">
            <p className="text-lg">📛 <strong>Username:</strong> {userData.username}</p>
            <p className="text-lg">📝 <strong>Bio:</strong> <span className="italic text-gray-700">{userData.bio}</span></p>
            <p className="text-lg">🎖️ <strong>Badge:</strong> <span className="text-2xl">{userData.badge}</span></p>
          </div>
        ) : (
          <p className="text-gray-600">Belum login atau data tidak ditemukan.</p>
        )}

        <div className="space-y-4">
          {posts.length > 0 ? (
            posts.map((post) => (
                <div key={post.id} className="border-[4px] border-black bg-white p-4 rounded-xl shadow-[4px_4px_0px_rgba(0,0,0,1)] text-left hover:-translate-y-1 transition-all duration-200">
                <p className="font-semibold">{post.content}</p>
                <p className="text-sm text-gray-600 mt-2">
                  {new Date(post.created_at).toLocaleString('id-ID', {
                    hour12: false,
                    hour: '2-digit',
                    minute: '2-digit',
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                  })}
                </p>
                <p className="text-sm text-blue-600">
                  {getBadgeIcon(post.like_count || 0)} {post.like_count || 0} like
                </p>
                <p className="text-sm text-blue-600">
                  💬 {commentsByPost[post.id]?.length || 0} komentar
                </p>

                <button
                  onClick={() => toggleComments(post.id)}
                  className="mt-3 inline-block bg-[#FF66C4] hover:bg-pink-500 text-black px-2 py-1 text-sm font-bold border-[3px] border-black rounded shadow-[2px_2px_0px_black] transition-all duration-200"
                >
                  {showComments[post.id] ? "🙈" : "💬"}
                </button>
                {showComments[post.id] && (
                <div className="mt-4 space-y-2 bg-gray-100 p-3 border-[2px] border-black rounded">
                  {commentsByPost[post.id]?.length > 0 ? (
                    commentsByPost[post.id].map((comment, index) => (
                      <div key={index} className="text-sm border-t border-black pt-2">
                        {/* Tampilkan username dari komentator */}
                        <strong>{comment.username}:</strong> {comment.content}
                        <div className="text-xs text-gray-500">
                          {new Date(comment.created_at).toLocaleString("id-ID", {
                            hour: "2-digit",
                            minute: "2-digit",
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                            hour12: false,
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
            <p className="text-gray-500">Belum ada postingan.</p>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProfileUser;
