require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const { randomBytes } = require('crypto');
const cors = require('cors');
const axios = require('axios');
const ebCIPHost = process.env.ebCIPHost || 'localhost';
// console.log(ebCIPHost);

const app = express();
app.use(bodyParser.json());
app.use(cors());

const commentsByPostId = {};

app.get('/posts/:id/comments', (req, res) => {
  res.send(commentsByPostId[req.params.id] || []);
});

app.get('/comments', (req, res) => {
  res.send(commentsByPostId || []);
});

app.post('/posts/:id/comments', async (req, res) => {
  const commentId = randomBytes(4).toString('hex');
  const { content } = req.body;

  const comments = commentsByPostId[req.params.id] || [];
  comments.push({ id: commentId, content, status: 'pending' });

  commentsByPostId[req.params.id] = comments;

  await axios.post(`http://${ebCIPHost}:4005/events`, {
    type: 'CommentCreated',
    data: {
      id: commentId,
      content,
      postId: req.params.id,
      status: 'pending'
    }
  });

  res.status(201).send(comments);
});

app.post("/events", async (req, res) => {
  const { type, data } = req.body;

  if (type === "CommentModerated") {
    const { postId, id, status, content } = data;
    const comments = commentsByPostId[postId];
    const comment = comments.find((comment) => {
      return comment.id === id;
    });
    comment.status = status;
    comment.type = type;

    await axios.post("http://localhost:4005/events", {
      type: "CommentUpdated",
      data: {
        id,
        status,
        postId,
        content,
      },
    });
  }

  console.log("Event Received by Comments Service:", req.body.type);
  res.send({});
});

app.listen(4001, () => {
  console.log('Listening on 4001');
});
