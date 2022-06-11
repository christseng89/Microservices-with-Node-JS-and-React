import axios from "axios";
import { useState } from "react";

let server_url = 'localhost:4000';
if (process.env.REACT_APP_HOST === 'k8s') {
  server_url = 'posts.com';
}
console.log('Server Url: ', server_url);

const PostCreate = () => {
  const [title, setTitle] = useState("");
  const onSubmit = async (event) => {
    event.preventDefault();
    await axios.post(`http://${{server_url}}/posts`, {
      title,
    });

    setTitle("");
  };

  return (
    <div>
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label>Title</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="form-control"
          />
        </div>
        <button className="btn btn-primary">Submit</button>
      </form>
    </div>
  );
};

export default PostCreate;
