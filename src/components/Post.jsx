import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  getBadgeLabel,
  getBadgeIcon,
} from "./Badge";
import {Loader2} from 'lucide-react';


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
      <span>❤️ {post.like_count || 0}</span>
    </button>
    <button
      className="flex items-center gap-1 text-sm px-3 py-1 bg-green-300 text-black border-2 border-black shadow-[2px_2px_0px_#000] hover:bg-green-500 hover:text-black"
      onClick={() => setShowComments(!showComments)}
    >
      <span>💭 {post.comment_count || 0}</span>
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

export default Post;