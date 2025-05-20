import React, { useState, useEffect } from 'react';
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { supabase } from "../../utils/supabase";
import Swal from 'sweetalert2';
import {
  MAX_CHARACTERS,
  getBadgeLabel,
  getBadgeIcon,
} from "../../components/Badge";
import withAuth from "../../middleware/withAuth";
import { Star, Heart, MessageCircle, Loader2, PlusCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
const UserHome = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState("");
  const [users, setUsers] = useState([]);
  const [userStats, setUserStats] = useState({});
  const [refresh, setRefresh] = useState(false);
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);

useEffect(() => {
  const fetchData = async () => {
    try {
      setLoading(true);

      const [{ data: postData }, { data: userData }, { data: { user } }] = await Promise.all([
        supabase
          .from('posts')
          .select('*, likes:posts_likes(count), comments(count)')
          .order('created_at', { ascending: false }),
        supabase.from('users').select('id, username, badge'),
        supabase.auth.getUser(),
      ]);

      // Hitung like & comment per post
      const postsWithCounts = postData?.map((post) => ({
        ...post,
        like_count: post.likes[0]?.count || 0,
        comment_count: post.comments[0]?.count || 0,
      })) || [];

      // Hitung total like dan komentar berdasarkan id_user
      const userStats = {};
      postsWithCounts.forEach((post) => {
        const userId = post.id_user;
        if (!userStats[userId]) {
          userStats[userId] = {
            totalLikes: 0,
            totalComments: 0,
          };
        }
        userStats[userId].totalLikes += post.like_count || 0;
        userStats[userId].totalComments += post.comment_count || 0;
      });

      // Simpan semua data ke state
      setPosts(postsWithCounts);
      setUsers(userData || []);
      setCurrentUser(user || null);
      setUserStats(userStats); // <- Pastikan kamu bikin state ini juga
    } catch (error) {
      Swal.fire({ icon: 'error', title: 'Gagal memuat data, coba lagi ya!' });
    } finally {
      setLoading(false);
    }
  };

  fetchData();
}, [refresh]);


  const handlePostSubmit = async (e) => {
    e.preventDefault();
    const trimmedPost = newPost.trim();

    if (!currentUser) return Swal.fire({ icon: 'error', title: 'Login dahulu ya!' });
    if (trimmedPost === "") return Swal.fire({ icon: 'error', title: 'Isi postingan tidak boleh kosong!' });

    try {
      setPosting(true);
      const { error } = await supabase.from('posts').insert([{ 
        content: trimmedPost, 
        id_user: currentUser.id, 
        created_at: new Date() 
      }]);

      if (error) throw error;

      setNewPost("");
      setRefresh((prev) => !prev);
      Swal.fire({ icon: 'success', title: 'Postingan berhasil!' });
    } catch {
      Swal.fire({ icon: 'error', title: 'Gagal kirim postingan' });
    } finally {
      setPosting(false);
    }
  };

  const handlePostChange = (e) => {
    if (e.target.value.length <= MAX_CHARACTERS) {
      setNewPost(e.target.value);
    }
  };

  const handlePostLike = async (postId) => {
    if (!currentUser) {
      Swal.fire({ icon: 'error', title: 'Login dahulu ya!' });
      return;
    }

    const { data: existingLike } = await supabase
      .from('posts_likes')
      .select('*')
      .eq('post_id', postId)
      .eq('id_user', currentUser.id)
      .maybeSingle();

    if (existingLike) {
      Swal.fire({ icon: 'info', title: 'Kamu sudah menyukai postingan ini' });
      return;
    }

    const { error: insertError } = await supabase
      .from('posts_likes')
      .insert([{ post_id: postId, id_user: currentUser.id, created_at: new Date() }]);

    if (!insertError) {
      setRefresh(prev => !prev);
    }
  };

  const handleCommentSubmit = async (postId, comment) => {
    if (!currentUser || comment.trim() === "") return;

    const { error } = await supabase
      .from('comments')
      .insert([{ post_id: postId, id_user: currentUser.id, content: comment, created_at: new Date() }]);

    if (!error) {
      setRefresh(!refresh);
      Swal.fire({ icon: 'success', title: 'Komentar terkirim!' });
    }
  };

  const getPostComments = async (postId) => {
    const { data } = await supabase
      .from('comments')
      .select('*, users(id, username)')
      .eq('post_id', postId);
    return data || [];
  };
  const currentStats = userStats[currentUser?.id] || { totalLikes: 0, totalComments: 0 };

  const findUserData = (userId) => {
    return users.find(u => u.id === userId) || { username: 'User'};
  };

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

  if (loading || !currentUser) {
    return (
      <div className="flex flex-col gap-4 p-4 max-w-2xl mx-auto">
        {[...Array(3)].map((_, idx) => (
          <PostSkeleton key={idx} />
        ))}
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-pink-100 to-white text-black font-sans min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 p-4 max-w-2xl mx-auto">
        <div className="bg-white shadow-lg p-6 rounded-lg mb-6">
          
          <h1 className="text-2xl font-semibold mb-2 flex justify-between items-center">
            <Link 
              to={`/user/profile/${currentUser?.id}`} 
              className="hover:text-pink-600 hover:underline transition-colors"
            >
              <span>Halo, {findUserData(currentUser?.id)?.username} 👋</span>
            </Link>
            {/* ... */}
          </h1>

          <p className="text-sm text-gray-600 mb-4">Bagikan postinganmu hari ini🌠</p>

          {/* User statistics */}
          <div className="text-sm text-gray-600 mb-4 space-y-1">
            <div>Total Postingan Anda: <strong>📢{posts.filter(post => post.id_user === currentUser?.id).length}</strong></div>
            <div>Total Like Postingan: <strong>👍{currentStats.totalLikes}</strong></div>
            <div>Total Komentar Postingan: <strong>💭{currentStats.totalComments}</strong></div>
          </div>

          <textarea
            value={newPost}
            onChange={handlePostChange}
            placeholder="Tulis sesuatu..."
            className="w-full p-4 border border-gray-300 bg-gray-100 rounded-md resize-none"
            rows="4"
          />
          <div className="text-right text-sm text-gray-500 mt-1">
            {Math.max(0, MAX_CHARACTERS - newPost.length)} karakter tersisa
          </div>
          <button
            onClick={handlePostSubmit}
            disabled={posting}
            className={`flex items-center text-sm gap-1 px-2 rounded text-white ${
              posting ? "bg-blue-200" : "bg-blue-400 hover:bg-blue-600"
            }`}
          >
            <PlusCircle size={20} />
            {posting ? 'Mengirim...' : 'Bagikan'}
          </button>
        </div>

        <div className="space-y-6">
          {posts.map((post) => {
            const user = findUserData(post.id_user);
            const stats = userStats[post.id_user] || { totalLikes: 0, totalComments: 0 };

            return (
              <Post
                key={post.id}
                post={post}
                user={user}
                totalLikes={stats.totalLikes}
                totalComments={stats.totalComments}
                getPostComments={getPostComments}
                handlePostLike={handlePostLike}
                handleCommentSubmit={handleCommentSubmit}
              />
            );
          })}
        </div>
      </main>
      <Footer />
    </div>
  );
};

const Post = ({ post, user, totalComments, totalLikes, getPostComments, handlePostLike, handleCommentSubmit }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [showComments, setShowComments] = useState(false);
  const [loadingComments, setLoadingComments] = useState(false);

  useEffect(() => {
    if (showComments) {
      const fetchComments = async () => {
        setLoadingComments(true);
        const commentsData = await getPostComments(post.id);
        setComments(commentsData);
        setLoadingComments(false);
      };
      fetchComments();
    }
  }, [showComments, post.id]);

  return (
    <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
      <div className="flex justify-between items-center mb-2">
      <div className="font-semibold text-lg">
        <Link 
          to={`/user/profile/${user.id}`} 
          className="hover:text-pink-600 hover:underline transition-colors"
        >
          <img 
            src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.username}`} 
            className="w-6 h-6 rounded-full inline-block mr-2" 
            alt={user.username}
          />
          {user.username}
        </Link>
      </div>
        <div className="text-sm text-pink-500 flex items-center gap-1">
          {getBadgeIcon(totalLikes)}{getBadgeLabel(totalLikes)}
        </div>      
      </div>

      <div className="mb-2 text-gray-800 whitespace-pre-line">{post.content}</div>

      <div className="text-xs text-gray-400 mb-2">
        {new Date(post.created_at).toLocaleString('id-ID', {
          dateStyle: 'medium',
          timeStyle: 'short'
        })}
      </div>
      <div className="flex gap-3 items-center">
        <button
          className="flex items-center gap-1 text-sm px-3 py-1 rounded-full bg-red-100 text-red-500 hover:bg-red-200 hover:text-red-600"
          onClick={() => handlePostLike(post.id)}
        >
          <Heart size={16} />
          <span>{post.like_count || 0}</span>
        </button>
        <button
          className="flex items-center gap-1 text-sm px-3 py-1 rounded-full bg-green-100 text-green-600 hover:bg-green-200 hover:text-green-700"
          onClick={() => setShowComments(!showComments)}
        >
          <MessageCircle size={16} />
          <span>{post.comment_count || 0}</span>
        </button>
      </div>

      {showComments && (
        <div className="mt-4 space-y-2">
          {loadingComments ? (
            <div className="flex justify-center">
              <Loader2 className="animate-spin" />
            </div>
          ) : (
            <>
              {comments.map((comment, index) => (
                <div key={index} className="text-sm border-t pt-2">
                  <strong>
                    <Link 
                      to={`/user/profile/${comment.users?.id}`} 
                      className="hover:text-pink-600 hover:underline transition-colors"
                    >
                    <img 
                      src={`https://api.dicebear.com/7.x/initials/svg?seed=${comment.users?.username}`} 
                      className="w-5 h-5 rounded-full inline-block mr-1 mb-1" 
                      alt={comment.users?.username}
                    />
                    {comment.users?.username || 'Anonim'}
                    </Link>
                  </strong> 
                  <div className="text-sm mb-1">{comment.content}</div>
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
              ))}

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleCommentSubmit(post.id, newComment);
                  setNewComment("");
                }}
                className="mt-2"
              >
                <input
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Tulis komentar..."
                  className="w-full border px-4 py-2 rounded-md text-sm"
                />
              </form>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default withAuth(UserHome);