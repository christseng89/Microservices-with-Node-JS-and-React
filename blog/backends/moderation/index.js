const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

let ebCIPHost =  'localhost';
if(process.env.NODE_ENV === 'production' + ' ') {
  require('dotenv').config();
  ebCIPHost =process.env.ebCIPHost 
}
// console.log(ebCIPHost);

const app = express();
app.use(bodyParser.json());

app.post('/events', async(req, res) => {
  const { type, data } = req.body;

  if (type === 'CommentCreated') {
    const status = data.content.includes('orange') ? 'rejected' : 'approved';

    await axios.post(`http://${ebCIPHost}:4005/events`, {
      type: 'CommentModerated',
      data: {
        id: data.id,
        postId: data.postId,
        status,
        content: data.content
      }
    });
  }

  console.log("Event Received by Moderation Service:", req.body.type);
  res.send({});
});

app.listen(4003, () => {
  console.log('Listening on 4003');
});
