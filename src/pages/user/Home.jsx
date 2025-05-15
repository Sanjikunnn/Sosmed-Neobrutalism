import React, { useState, useEffect } from 'react';
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { supabase } from "../../utils/supabase";
import Swal from 'sweetalert2';
import {
  MAX_CHARACTERS,
  getBadgeLabel,
  getCommentBadgeLabel,
} from "../../components/Badge";
import { useNavigate } from 'react-router-dom';
import withAuth from "../../middleware/withAuth";

const UserHome = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState("");
  const [users, setUsers] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);


useEffect(() => {
  const fetchData = async () => {
    const { data: postData } = await supabase
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false });

    const { data: userData } = await supabase
      .from('users')
      .select('id, username, badge');

    const { data: { user } } = await supabase.auth.getUser();

    setPosts(postData || []);
    setUsers(userData || []);
    setCurrentUser(user || null);
    setLoading(false); // ⬅️ Tambahkan ini biar loading hilang setelah semua data selesai
  };

  fetchData();
}, [refresh, navigate]);

  const handlePostChange = (e) => {
    if (e.target.value.length <= MAX_CHARACTERS) {
      setNewPost(e.target.value);
    }
  };

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    const trimmedPost = newPost.trim();

    if (!currentUser) {
      Swal.fire({ icon: 'error', title: 'Login dahulu ya!' });
      return;
    }

    if (trimmedPost === "") {
      Swal.fire({ icon: 'error', title: 'Isi postingan tidak boleh kosong!' });
      return;
    }

    const { error } = await supabase
      .from('posts')
      .insert([{ content: trimmedPost, id_user: currentUser.id, created_at: new Date() }]);

    if (error) {
      Swal.fire({ icon: 'error', title: 'Gagal kirim postingan' });
    } else {
      setNewPost("");
      setRefresh(!refresh);
      Swal.fire({ icon: 'success', title: 'Postingan berhasil!' });
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
      const { data: allLikes } = await supabase
        .from('posts_likes')
        .select('*')
        .eq('post_id', postId);

      const totalLikes = allLikes?.length || 0;

      await supabase
        .from('posts')
        .update({ like: totalLikes })
        .eq('id', postId);

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

  const getPostLikes = async (postId) => {
    const { data } = await supabase
      .from('posts_likes')
      .select('*')
      .eq('post_id', postId);
    return data?.length || 0;
  };

  const getPostComments = async (postId) => {
    const { data } = await supabase
      .from('comments')
      .select('*, users(id, username)')
      .eq('post_id', postId);
    return data || [];
  };

  const findUserData = (userId) => {
    return users.find(u => u.id === userId) || { username: 'User', badge: '❓' };
  };

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
    <div className="bg-gradient-to-b from-pink-100 to-white text-black font-sans min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 p-4 max-w-2xl mx-auto">
        <div className="bg-white shadow-lg p-6 rounded-lg mb-6">
        <h1 className="text-2xl font-semibold mb-2">Halo, {findUserData(currentUser?.id).username} 👋</h1>
          <p className="text-sm text-gray-600 mb-4">Bagikan pikiranmu hari ini:</p>

          <textarea
            value={newPost}
            onChange={handlePostChange}
            placeholder="Tulis sesuatu..."
            className="w-full p-4 border border-gray-300 bg-gray-100 rounded-md resize-none"
            rows="4"
          />
          <div className="text-right text-sm text-gray-500 mt-1">{MAX_CHARACTERS - newPost.length} karakter tersisa</div>
          <button
            onClick={handlePostSubmit}
            className="mt-2 bg-pink-500 text-white px-6 py-2 rounded-full hover:bg-pink-600 transition"
          >
            + Kirim Postingan
          </button>
        </div>

        <div className="space-y-6">
          {posts.map((post) => {
            const user = findUserData(post.id_user);
            return (
              <Post
                key={post.id}
                post={post}
                user={user}
                getPostLikes={getPostLikes}
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

const Post = ({ post, user, getPostLikes, getPostComments, handlePostLike, handleCommentSubmit }) => {
  const [likes, setLikes] = useState(0);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [showComments, setShowComments] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLikes(await getPostLikes(post.id));
      setComments(await getPostComments(post.id));
    };
    fetchData();
  }, [post]);

  const toggleComments = () => {
    setShowComments(!showComments);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
      <div className="flex justify-between items-center mb-2">
        <div className="font-semibold text-lg">{user.username}</div>
        <div className="text-sm text-pink-500">{getBadgeLabel(user.username)}</div>
      </div>

      <div className="mb-2 text-gray-800 whitespace-pre-line">{post.content}</div>

      <div className="text-xs text-gray-400 mb-2">
        {new Date(post.created_at).toLocaleString('id-ID', {
          hour12: false,
          hour: '2-digit',
          minute: '2-digit',
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
        })}
      </div>

      <div className="flex gap-3 items-center">
        <button
          className="text-sm px-3 py-1 rounded-full bg-red-100 text-red-500 hover:bg-red-200 hover:text-red-600"
          onClick={() => handlePostLike(post.id)}
        >❤️ {likes}</button>
        <button
          className="text-sm px-3 py-1 rounded-full bg-green-100 text-green-600 hover:bg-green-200 hover:text-green-700"
          onClick={toggleComments}
        >💬 {comments.length}</button>
      </div>

      {showComments && (
        <div className="mt-4 space-y-2">
          {comments.map((comment, index) => (
            <div key={index} className="text-sm border-t pt-2">
              <strong>{comment.users?.username || 'Anonim'}</strong> 
              <span className="ml-2 text-xs text-blue-600">
                {getCommentBadgeLabel(comment.comment_count)}
              </span>
              <div className="text-sm">{comment.content}</div>
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
        </div>
      )}
    </div>
  );
};

export default withAuth(UserHome);