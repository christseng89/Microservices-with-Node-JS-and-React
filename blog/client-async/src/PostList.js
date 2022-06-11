import axios from "axios";
import { useEffect, useState } from "react";
import CommentCreate from "./CommentCreate";
import CommentList from "./CommentList";

let server_url = 'localhost:4002';
if (process.env.REACT_APP_HOST === 'k8s') {
  server_url = 'posts.com';
}

const PostList = () => {
  const [posts, setPosts] = useState({});

  const fetchPosts = async () => {
    const res = await axios.get(`http://${{server_url}}/posts`);
    console.log('Query Service:', res.data);
    setPosts(res.data);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const renderedPosts = Object.values(posts).map((post) => {
    return (
      <div
        className="card"
        style={{ width: "30%", marginBottom: "20px" }}
        key={post.id}
      >
        <div className="card-body">
          <h3>{post.title}</h3>
          <CommentList comments={post.comments} />
          <CommentCreate postId={post.id} />
        </div>
      </div>
    );
  });

  return (
    <div className="d-flex flex-row flex-wrap justify-content-between">
      {renderedPosts}
    </div>
  );
};

export default PostList;
