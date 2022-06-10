const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");

let postsCIPHost = 'localhost';
let commentsCIPHost = 'localhost';
let queryCIPHost = 'localhost';
let moderationCIPHost = 'localhost';

if(process.env.NODE_ENV === 'production' + ' ') {
  require('dotenv').config();
  postsCIPHost = process.env.postsCIPHost;
  commentsCIPHost = process.env.commentsCIPHost;
  queryCIPHost = process.env.queryCIPHost;
  moderationCIPHost = process.env.moderationCIPHost;
}
// console.log(postsCIPHost, commentsCIPHost, queryCIPHost, moderationCIPHost);

const app = express();
app.use(bodyParser.json());
const events = [];

app.get("/events", (req, res) => {
  res.send(events);
});

app.post("/events", (req, res) => {
  const event = req.body;
  events.push(event);

  // Posts service
  axios.post(`http://${postsCIPHost}:4000/events`, event).catch((err) => {
    console.log(err.message);
  });
  // Comments service
  axios.post(`http://${commentsCIPHost}:4001/events`, event).catch((err) => {
    console.log(err.message);
  });
  // Query service
  axios.post(`http://${queryCIPHost}:4002/events`, event).catch((err) => {
    console.log(err.message);
  });
  // Moderate service
  axios.post(`http://${moderationCIPHost}:4003/events`, event).catch((err) => {
    console.log(err.message);
  });
  res.send({ status: "OK" });
});

app.listen(4005, () => {
  console.log("Listening on 4005");
});
