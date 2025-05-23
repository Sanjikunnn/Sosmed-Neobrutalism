import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import { supabase } from "../../utils/supabase";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import {
  MAX_CHARACTERS,
  getBadgeLabel,
  getBadgeIcon,
} from "../../components/Badge";
import withAuth from "../../middleware/withAuth";
import { Heart, MessageCircle, Loader2, PlusCircle } from 'lucide-react';

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

const UserHome = () => {
  // 4. State management yang lebih efisien
  const [currentUser, setCurrentUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState("");
  const [users, setUsers] = useState([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);

  // 5. Memoisasi data fetching
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [{ data: postData }, { data: userData }, { data: { user } }] = await Promise.all([
        supabase
          .from('posts')
          .select('*, user:users(id, username, badge), likes:posts_likes(count), comments(count)')
          .order('created_at', { ascending: false })
          .range(0, 19),
        supabase.from('users').select('id, username, badge'),
        supabase.auth.getUser(),
      ]);

      const postsWithCounts = postData?.map((post) => ({
        ...post,
        like_count: post.likes?.[0]?.count || 0,
        comment_count: post.comments?.[0]?.count || 0,
      })) || [];

      setPosts(postsWithCounts);
      setUsers(userData || []);
      setCurrentUser(user || null);
    } catch (error) {
      console.error('Fetch error:', error);
      Swal.fire({ icon: 'error', title: 'Gagal memuat data, coba lagi ya!' });
    } finally {
      setLoading(false);
    }
  }, []);

  // 6. Efek dengan dependencies yang dioptimasi
  useEffect(() => {
    fetchData();
  }, [fetchData, refreshTrigger]);

  // 7. Memoisasi perhitungan statistik user
  const userStats = useMemo(() => {
    return posts.reduce((acc, post) => {
      const userId = post.id_user;
      if (!acc[userId]) {
        acc[userId] = { totalLikes: 0, totalComments: 0 };
      }
      acc[userId].totalLikes += post.like_count;
      acc[userId].totalComments += post.comment_count;
      return acc;
    }, {});
  }, [posts]);

  const currentStats = useMemo(() => 
    userStats[currentUser?.id] || { totalLikes: 0, totalComments: 0 }, 
    [userStats, currentUser]
  );

  // 8. Memoisasi fungsi pencarian user
  const findUserData = useCallback((userId) => {
    return users.find(u => u.id === userId) || { username: 'User' };
  }, [users]);

  // 9. Optimasi handler dengan useCallback
  const handlePostChange = useCallback((e) => {
    if (e.target.value.length <= MAX_CHARACTERS) {
      setNewPost(e.target.value);
    }
  }, []);

  const handlePostSubmit = useCallback(async (e) => {
    e.preventDefault();
    const trimmedPost = newPost.trim();
    if (!currentUser) return Swal.fire({ icon: 'error', title: 'Login dahulu ya!' });
    if (!trimmedPost) return Swal.fire({ icon: 'error', title: 'Isi postingan tidak boleh kosong!' });

    try {
      setPosting(true);
      const { error } = await supabase.from('posts').insert([
        { content: trimmedPost, id_user: currentUser.id, created_at: new Date().toISOString() }
      ]);
      if (error) throw error;

      setNewPost("");
      setRefreshTrigger(prev => prev + 1);
      Swal.fire({ icon: 'success', title: 'Postingan berhasil!' });
    } catch (error) {
      console.error('Post error:', error);
      Swal.fire({ icon: 'error', title: 'Gagal kirim postingan' });
    } finally {
      setPosting(false);
    }
  }, [currentUser, newPost]);

  const handlePostLike = useCallback(async (postId) => {
    if (!currentUser) return Swal.fire({ icon: 'error', title: 'Login dahulu ya!' });

    try {
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

      const { error } = await supabase
        .from('posts_likes')
        .insert([{ post_id: postId, id_user: currentUser.id, created_at: new Date().toISOString() }]);

      if (!error) setRefreshTrigger(prev => prev + 1);
    } catch (error) {
      console.error('Like error:', error);
    }
  }, [currentUser]);

  const handleCommentSubmit = useCallback(async (postId, comment) => {
    if (!currentUser || !comment.trim()) return;
    
    try {
      const { error } = await supabase
        .from('comments')
        .insert([{ 
          post_id: postId, 
          id_user: currentUser.id, 
          content: comment, 
          created_at: new Date().toISOString() 
        }]);

      if (!error) {
        setRefreshTrigger(prev => prev + 1);
        Swal.fire({ icon: 'success', title: 'Komentar terkirim!' });
      }
    } catch (error) {
      console.error('Comment error:', error);
    }
  }, [currentUser]);

  const getPostComments = useCallback(async (postId) => {
    try {
      const { data } = await supabase
        .from('comments')
        .select('*, users(id, username)')
        .eq('post_id', postId);
      return data || [];
    } catch (error) {
      console.error('Fetch comments error:', error);
      return [];
    }
  }, []);

  // 10. Memoisasi render posts
  const renderedPosts = useMemo(() => {
    return posts.map((post) => {
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
    });
  }, [posts, findUserData, userStats, getPostComments, handlePostLike, handleCommentSubmit]);

  // 11. Hitungan post user yang dimemoisasi
  const userPostCount = useMemo(() => 
    posts.filter(p => p.id_user === currentUser?.id).length,
    [posts, currentUser]
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
<div className="bg-yellow-50 text-black font-sans min-h-screen flex flex-col">
  <Header />
  <main className="flex-1 p-4 max-w-2xl mx-auto">
    <div className="bg-white border-4 border-black shadow-[4px_4px_0_black] p-6 rounded-md mb-6">
      <h1 className="text-2xl font-bold mb-2 flex justify-between items-center">
        <span>Halo, {findUserData(currentUser?.id)?.username} 👋</span>
      </h1>
      <p className="text-sm text-gray-700 mb-4">Bagikan postinganmu hari ini 🌠</p>

      <div className="text-sm text-gray-800 mb-4 space-y-1 font-mono">
        <div>Total Postingan Anda: <strong>📢 {userPostCount}</strong></div>
        <div>Total Like Postingan: <strong>👍 {currentStats.totalLikes}</strong></div>
        <div>Total Komentar Postingan: <strong>💭 {currentStats.totalComments}</strong></div>
      </div>

      <textarea
        value={newPost}
        onChange={handlePostChange}
        placeholder="Tulis sesuatu..."
        className="w-full p-4 border-2 border-black bg-gray-100 rounded-md resize-none font-mono"
        rows="4"
        maxLength={MAX_CHARACTERS}
      />
      <div className="text-right text-sm text-gray-500 mt-1">
        {Math.max(0, MAX_CHARACTERS - newPost.length)} karakter tersisa
      </div>
      <button
        onClick={handlePostSubmit}
        disabled={posting}
        className={`mt-2 flex items-center gap-2 px-4 py-2 border-2 border-black rounded-md text-white font-bold transition-all ${
          posting ? "bg-blue-300" : "bg-blue-500 hover:bg-blue-700"
        }`}
      >
        <PlusCircle size={20} />
        {posting ? 'Mengirim...' : 'Bagikan'}
      </button>
    </div>

    <div className="space-y-6">
      {renderedPosts}
    </div>
  </main>
  <Footer />
</div>

  );
};

const Post = React.memo(({ post, user, totalLikes, getPostComments, handlePostLike, handleCommentSubmit }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [showComments, setShowComments] = useState(false);
  const [loadingComments, setLoadingComments] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchComments = useCallback(async () => {
    setLoadingComments(true);
    try {
      const commentsData = await getPostComments(post.id);
      setComments(commentsData);
    } catch (error) {
      console.error("Gagal memuat komentar:", error);
    } finally {
      setLoadingComments(false);
    }
  }, [getPostComments, post.id]);

  useEffect(() => {
    if (showComments) {
      fetchComments();
    }
  }, [showComments, fetchComments]);

  const handleCommentSend = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setIsSubmitting(true);
    try {
      await handleCommentSubmit(post.id, newComment);
      setNewComment("");
      fetchComments();
    } catch (error) {
      console.error("Gagal mengirim komentar:", error);
    } finally {
      setIsSubmitting(false);
    }
  };


return (
<div className="bg-yellow-100 p-4 shadow-[4px_4px_0px_#000] border-2 border-black">
  <div className="flex justify-between items-center mb-3">
    <div className="font-bold text-lg">
      <Link to={`/user/profile/${user.id}`} className="text-black font-bold hover:text-pink-600 underline underline-offset-4">
        <img
          src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.username}`}
          className="w-8 h-8 inline-block mr-2 border-2 border-black"
          alt={user.username}
        />
        {user.username}
      </Link>
    </div>
    <div className="text-sm text-black bg-pink-400 px-2 py-1 border-2 border-black shadow-[2px_2px_0px_#000]">
      {getBadgeIcon(totalLikes)} {getBadgeLabel(totalLikes)}
    </div>
  </div>

  <div className="mb-3 text-black whitespace-pre-line font-medium">{post.content}</div>
  <div className="text-xs text-gray-800 mb-3 font-mono border-l-4 border-black pl-2">
    {new Date(post.created_at).toLocaleString('id-ID', {
      dateStyle: 'medium',
      timeStyle: 'short'
    })}
  </div>

  <div className="flex gap-4 items-center">
    <button
      className="flex items-center gap-1 text-sm px-3 py-1 bg-red-300 text-black border-2 border-black shadow-[2px_2px_0px_#000] hover:bg-red-400 hover:text-black"
      onClick={() => handlePostLike(post.id)}
    >
      <Heart size={16} />
      <span>{post.like_count || 0}</span>
    </button>
    <button
      className="flex items-center gap-1 text-sm px-3 py-1 bg-green-300 text-black border-2 border-black shadow-[2px_2px_0px_#000] hover:bg-green-500 hover:text-black"
      onClick={() => setShowComments(!showComments)}
    >
      <MessageCircle size={16} />
      <span>{post.comment_count || 0}</span>
    </button>
  </div>

  {showComments && (
    <div className="mt-4 space-y-3">
      {loadingComments ? (
        <div className="flex justify-center">
          <Loader2 className="animate-spin" />
        </div>
      ) : (
        <>
          {comments.map((comment) => (
            <div key={comment.id} className="text-sm border-t-2 border-black pt-3">
              <strong>
                <Link
                  to={`/user/profile/${comment.users?.id}`}
                  className="text-black hover:text-pink-600 underline underline-offset-4"
                >
                  <img
                    src={`https://api.dicebear.com/7.x/initials/svg?seed=${comment.users?.username}`}
                    className="w-5 h-5 inline-block mr-1 border-2 border-black"
                    alt={comment.users?.username}
                  />
                  {comment.users?.username || 'Anonim'}
                </Link>
              </strong>
              <div className="text-sm mt-1 mb-1 font-medium">{comment.content}</div>
              <div className="text-xs text-gray-700 font-mono">
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

          <form onSubmit={handleCommentSend} className="mt-3">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Tulis komentar..."
              rows={3}
              className="w-full border-2 border-black px-4 py-2 font-medium bg-white text-sm resize-none shadow-[2px_2px_0px_#000]"
            />
            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-2 px-4 py-2 bg-blue-400 text-black border-2 border-black shadow-[2px_2px_0px_#000] text-sm hover:bg-blue-500 disabled:opacity-50"
            >
              {isSubmitting ? 'Mengirim...' : 'Kirim'}
            </button>
          </form>
        </>
      )}
    </div>
  )}
</div>

  );
});


export default withAuth(UserHome);