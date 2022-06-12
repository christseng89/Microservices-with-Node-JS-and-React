import axios from "axios";
import { useState } from "react";

let server_url = 'http://localhost:4001/posts';
if (process.env.REACT_APP_HOST === 'k8s') {
  server_url = 'http://posts.com/posts';
}

const CommentCreate = ({ postId }) => {
  const [content, setContent] = useState("");
  const onSubmit = async (event) => {
    event.preventDefault();

    await axios.post(server_url +`/${postId}/comments`, {
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
