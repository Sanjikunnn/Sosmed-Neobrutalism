import React, { useState, useEffect } from 'react';
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { supabase } from "../../utils/supabase";
import Swal from 'sweetalert2';
import { MAX_CHARACTERS, getBadgeIcon } from '../../components/Badge';
import { useNavigate } from 'react-router-dom';
import withAuth from "../../middleware/withAuth";

const UserHome = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState("");
  const [users, setUsers] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const navigate = useNavigate(); 

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
  const { data, error } = await supabase
    .from('comments')
    .select('*, users(id, username)')
    .eq('post_id', postId);

  return data || [];
};


  const findUserData = (userId) => {
    return users.find(u => u.id === userId) || { username: 'Anonim', badge: '❓' };
  };

  return (
    <div className="bg-[#fdfdfd] text-black font-mono min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 p-2 text-center">
        <h1 className="text-xl font-semibold mb-4">Apa yang ingin kamu posting hari ini?</h1>

        <textarea
          value={newPost}
          onChange={handlePostChange}
          placeholder="Tulis sesuatu..."
          className="w-full p-4 border border-black bg-gray-100 rounded-md resize-none"
          rows="4"
        />
        <div className="text-left text-sm ml-1">{MAX_CHARACTERS - newPost.length} karakter tersisa</div>
        <button
          onClick={handlePostSubmit}
          className="mt-2 bg-[#FF4D6E] text-white px-4 py-2 rounded-lg transition-all duration-200 hover:bg-[#FF334D]"
        >
          POST
        </button>

        <div className="mt-8 space-y-6">
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
    <div className="border-2 border-black bg-white p-4 rounded-lg shadow-md text-left mb-4">
      <div className="font-bold text-lg">
        {user.username} {getBadgeIcon(likes)}
      </div>
      <div className="my-2">{post.content}</div>

      <div className="text-sm text-gray-600">
        {new Date(post.created_at).toLocaleString('id-ID', {
          hour12: false,
          hour: '2-digit',
          minute: '2-digit',
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
        })}
      </div>

      <div className="flex justify-between items-center mt-2">
        <button 
          className="text-sm py-1 px-2 rounded bg-blue-500 text-white"
          onClick={() => handlePostLike(post.id)}
        >
          ❤️ {likes}
        </button>
        <button 
          className="text-sm py-1 px-2 rounded bg-green-500 text-white"
          onClick={toggleComments}
        >
          💬 {comments.length}
        </button>
      </div>

      {showComments && (
        <div className="mt-4 space-y-2">
          {comments.map((comment, index) => (
            <div key={index} className="text-sm border-t pt-2">
              <strong>{comment.users?.username || 'Anonim'}</strong>: {comment.content}
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
              className="w-full border-2 border-gray-300 px-4 py-2 rounded-md"
            />
          </form>
        </div>
      )}
    </div>
  );
};

export default  withAuth(UserHome);
