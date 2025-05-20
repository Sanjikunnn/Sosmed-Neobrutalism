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
import { Star, Heart, MessageCircle, Loader2, PlusCircle } from 'lucide-react';

const UserHome = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState("");
  const [users, setUsers] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);


// Menjalankan saat pertama render & saat refresh berubah
// Tujuannya untuk ambil data postingan, data user, dan data user yang sedang login dari Supabase
useEffect(() => {
  const fetchData = async () => {
    try {
      setLoading(true);

      const [{ data: postData }, { data: userData }, { data: { user } }] = await Promise.all([
        supabase.from('posts').select('*').order('created_at', { ascending: false }),
        supabase.from('users').select('id, username, badge'),
        supabase.auth.getUser(),
      ]);

      setPosts(postData || []);
      setUsers(userData || []);
      setCurrentUser(user || null);
    } catch (error) {
      Swal.fire({ icon: 'error', title: 'Gagal memuat data, coba lagi ya!' });
    } finally {
      setLoading(false);
    }
  };

  fetchData();
}, [refresh]);

// Handle submit post dengan disable button saat loading
const [posting, setPosting] = useState(false);

// Fungsi untuk mengirim postingan baru
// Validasi: user harus login dan isi postingan tidak boleh kosong
// Setelah posting berhasil, reset input dan refresh list postingan
const handlePostSubmit = async (e) => {
  e.preventDefault();
  const trimmedPost = newPost.trim();

  if (!currentUser) return Swal.fire({ icon: 'error', title: 'Login dahulu ya!' });
  if (trimmedPost === "") return Swal.fire({ icon: 'error', title: 'Isi postingan tidak boleh kosong!' });

  try {
    setPosting(true);
    const { error } = await supabase.from('posts').insert([{ content: trimmedPost, id_user: currentUser.id, created_at: new Date() }]);

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

// Fungsi untuk menangani perubahan pada textarea postingan
// Membatasi jumlah karakter sesuai `MAX_CHARACTERS`
  const handlePostChange = (e) => {
    if (e.target.value.length <= MAX_CHARACTERS) {
      setNewPost(e.target.value);
    }
  };

// Fungsi untuk menyukai postingan
// Cek apakah user sudah menyukai, kalau belum, simpan ke tabel 'posts_likes'
// Setelah menyukai, update jumlah like di tabel 'posts'
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

// Fungsi untuk mengirim komentar ke postingan tertentu
// Validasi: user harus login dan komentar tidak boleh kosong
// Setelah komentar terkirim, refresh list komentar
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

// Fungsi untuk menghitung jumlah like pada postingan
// Ambil data dari tabel 'posts_likes' berdasarkan post_id
  const getPostLikes = async (postId) => {
    const { data } = await supabase
      .from('posts_likes')
      .select('*')
      .eq('post_id', postId);
    return data?.length || 0;
  };

// Fungsi untuk mengambil komentar dari postingan
// Ambil dari tabel 'comments' beserta data user yang komentar
  const getPostComments = async (postId) => {
    const { data } = await supabase
      .from('comments')
      .select('*, users(id, username)')
      .eq('post_id', postId);
    return data || [];
  };

// Fungsi untuk menemukan data user berdasarkan userId
// Digunakan untuk menampilkan nama & badge user di tiap postingan
  const findUserData = (userId) => {
    return users.find(u => u.id === userId) || { username: 'User', badge: '❓' };
  };

// Komponen loading skeleton sementara data belum dimuat
// Dipakai saat `loading` true, biar ada efek animasi loading
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


if (loading || !currentUser)
  return (
    <div className="flex flex-col gap-4 p-4 max-w-2xl mx-auto">
      {[...Array(3)].map((_, idx) => (
        <PostSkeleton key={idx} />
      ))}
    </div>
  );

  return (
    <div className="bg-gradient-to-b from-pink-100 to-white text-black font-sans min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 p-4 max-w-2xl mx-auto">
        <div className="bg-white shadow-lg p-6 rounded-lg mb-6">
        <h1 className="text-2xl font-semibold mb-2 flex justify-between items-center">
          <span>Halo, {findUserData(currentUser?.id).username} 👋</span>
          <span className="text-sm text-pink-500 flex items-center gap-1">
            <Star size={16} />
            {getBadgeLabel(findUserData(currentUser?.id).badge)}
          </span>
        </h1>


        <p className="text-sm text-gray-600 mb-4">Bagikan pikiranmu hari ini</p>

        {/* Statistik */}
        <div className="text-sm text-gray-600">
          Total Postingan Anda: <strong>{posts.length}</strong>
        </div>

          <textarea
            value={newPost}
            onChange={handlePostChange}
            placeholder="Tulis sesuatu..."
            className="w-full p-4 border border-gray-300 bg-gray-100 rounded-md resize-none"
            rows="4"
          />
          <div className="text-right text-sm text-gray-500 mt-1">{Math.max(0, MAX_CHARACTERS - newPost.length)} karakter tersisa</div>
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

// Komponen untuk menampilkan 1 postingan lengkap dengan data user, isi postingan, like, dan komentar
// Pake `useEffect` untuk ambil like dan komentar saat komponen dimount
// Ada fitur toggle untuk menampilkan/menyembunyikan komentar
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
        <div className="font-semibold text-lg">
          <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.username}`} className="w-6 h-6 rounded-full inline-block mr-2" />
          {user.username}</div>
          <div className="text-sm text-pink-500 flex items-center gap-1">
            <Star size={14} />
            {getBadgeLabel(user.badge)}
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
          <span>{likes}</span>
        </button>
        <button
          className="flex items-center gap-1 text-sm px-3 py-1 rounded-full bg-green-100 text-green-600 hover:bg-green-200 hover:text-green-700"
          onClick={toggleComments}
        >
          <MessageCircle size={16} />
          <span>{comments.length}</span>
        </button>
      </div>


      {showComments && (
        <div className="mt-4 space-y-2">
          {comments.map((comment, index) => (
            <div key={index} className="text-sm border-t pt-2">
              <strong>
                <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${comment.users?.username}`} className="w-5 h-5 rounded-full inline-block mr-1" />
                {comment.users?.username || 'Anonim'}</strong> 
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