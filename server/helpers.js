const axios = require('axios');
const bcrypt = require('bcrypt');
const db = require('../db/mysql.js');
const key = require('../config.js');

const createSession = (req, res, user) => {
  req.session.regenerate(() => {
    req.session.user = user;
  });
};

const createUser = (req, res, salt) => {
  bcrypt.hash(req.query.pw, salt, (err, hash) => {
    if (err || !hash) {
      res.send('create user error', err);
    } else {
      db.createUser({ username: req.query.name, password: hash }, (error) => {
        if (error) {
          res.send(error);
        } else {
          createSession(req, res, req.query.name);
          res.end();
        }
      });
    }
  });
};

// const createPassword = (req, res, salt) => {
//   bcrypt.hash(req.query.pw, salt, (err, hash) => {
//     if (err || !hash) {
//       res.sendStatus(500).send('signuperror');
//       console.log(err);
//     } else {
//       const q = 'insert into users(username, pw) values(?, ?)';
//       const args = [req.query.name, hash];
//       db.connection.query(q, args, (error, results) => {
//         if (error) {
//           res.send(500);
//         } else {
//           createSession(req, res, req.query.name);
//           console.log(req.session);
//           res.end();
//           console.log('user added to db');
//         }
//       });
//     }
//   });
// };
const checkPassword = (req, res) => {
  const { name, pw } = req.query;
  db.checkPassword({ username: name }, (err, result) => {
    if (err) {
      res.send(err);
    } else {
      bcrypt.compare(pw, (error, data) => {
        if (data === true) {
          console.log('user is good');
          createSession(req, res, name);
          res.sendStatus(200);
        } else {
          res.sendStatus(404);
        }
      })
    }
  });
};
// const checkPassword = (req, res) => {
//   const q = 'select * from users where username=?';
//   const args = [req.query.name];
//   db.connection.query(q, args, (err, results) => {
//     if (err || !results) {
//       res.send(err);
//     } else {
//       bcrypt.compare(req.query.pw, results[0].pw, (error, result) => {
//         if (result === true) {
//           console.log('passwords match');
//           createSession(req, res, req.query.name);
//           res.send(200);
//         } else {
//           console.log('passwords don\'t match');
//           res.send(404);
//           res.end();
//         }
//       });
//     }
//   });
// };


const getSongs = () => {
  const options = {
    params: {
      part: 'snippet',
      chart: 'mostPopular',
      type: 'video',
      key: key.youtube,
      channelId: 'UCXosPWESPuLZoG66YuHKX9Q',
      maxResults: 50,
    },
  };
  axios.get('https://www.googleapis.com/youtube/v3/search', options)
    .then((data) => {
      data.data.items.forEach((song) => {
        db.save(song);
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

module.exports = {
  getSongs,
  createSession,
  checkPassword,
  // createPassword,
  createUser,
};
