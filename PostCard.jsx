
import axios from "axios";

function PostCard({ post }) {

  const likePost = async (id) => {
    try {
      await axios.put(`/api/posts/like/${id}`);
      alert("Liked!");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <p>{post.text}</p>
      <button onClick={() => likePost(post._id)}>
        Like ({post.likes.length})
      </button>
    </div>
  );
}

export default PostCard;
