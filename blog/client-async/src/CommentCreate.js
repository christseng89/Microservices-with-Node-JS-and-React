import axios from "axios";
import { useState } from "react";

let server_url = 'localhost:4001';
if (process.env.REACT_APP_HOST === 'k8s') {
  server_url = 'posts.com';
}

const CommentCreate = ({ postId }) => {
  const [content, setContent] = useState("");
  const onSubmit = async (event) => {
    event.preventDefault();

    await axios.post(`http://${{server_url}}/posts/${postId}/comments`, {
      content,
    });

    setContent("");
  };

  return (
    <div>
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label>New Comment</label>
          <input
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="form-control"
          />
        </div>
        <button className="btn btn-primary">Submit</button>
      </form>
    </div>
  );
};

export default CommentCreate;
