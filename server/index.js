/* eslint-disable no-console */
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
const session = require('express-session');
const db = require('../db/mysql.js');
const util = require('./helpers.js');

// const io = require('socket.io')();

const saltRounds = 10;
const app = express();
// io.on('connection', (client) => {
//   client.on('subcribeToTimer', (interval) => {
//     console.log('client on', interval);
//     setInterval(() => {
//       client.emit('timer', new Date());
//     }, interval);
//   });
// });
app.use(cors());
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, '../dist')));
app.use(express.static(path.join(__dirname, '../images')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
  secret: 'supersecret',
  resave: false,
  saveUninitialized: true,
}));

// app.get('/songs', (req, res) => {
//   db.connection.query('select * from songs', (err, results) => {
//     if (err) {
//       console.log(err);
//     } else {
//       res.send(results);
//     }
//   });
// });

app.post('/songs', (req, res) => {
  util.getSongs(req, res);
  res.sendStatus(200);
});

app.post('/signup', (req, res) => {
  util.createUser(req, res, saltRounds);
});

app.get('/login', (req, res) => {
  util.checkPassword(req, res);
});

const port = 8080;
// io.listen(8080);
app.listen(process.env.PORT || port, () => {
  console.log(`listening on port ${process.env.PORT || port}`);
});
