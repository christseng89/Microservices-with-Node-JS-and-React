const express = require('express');
const bodyParser = require('body-parser');
const { randomBytes } = require('crypto');
const cors = require('cors');
const axios = require('axios');

let ebCIPHost =  'localhost';
let urlPath = '/posts';
if(process.env.NODE_ENV === 'production') {
  require('dotenv').config();
  ebCIPHost = process.env.ebCIPHost; 
  urlPath = '/posts/create';
}
console.log(ebCIPHost);

const app = express();
app.use(bodyParser.json());
app.use(cors());

const posts = {};

app.get(urlPath, (req, res) => {
  res.send(posts);
});

app.post(urlPath, async (req, res) => {
  const id = randomBytes(4).toString('hex');
  const { title } = req.body;

  posts[id] = {
    id,
    title
  };

  await axios.post(`http://${ebCIPHost}:4005/events`, {
    type: 'PostCreated',
    data: {
      id,
      title
    }
  });

  res.status(201).send(posts[id]);
});

app.post('/events', (req, res) => {
  console.log("Event Received by Posts Service:", req.body.type);
  res.send({});
});

app.listen(4000, () => {
  console.log('Listening on 4000');
});
