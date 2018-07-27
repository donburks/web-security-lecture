const express = require('express');
const router = express.Router();

function index(db) {
  router.get('/', (req, res, next) => {
    const admin = (req.cookies.user) ? JSON.parse(req.cookies.user).admin : false;
    const loggedIn = Boolean(req.cookies.user);
    const title = "NSekyoor";

    res.render('index', { title, admin, loggedIn });
  });

  router.get('/login', (req, res, next) => {
    res.render('login');
  });

  router.post('/login', (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;

    db.query(`SELECT * FROM users WHERE username='${username}' AND password='${password}' LIMIT 1`, (err, result) => {
      if (err) {
        res.status(500);
        console.error(err);
        res.send("ERROR!" + JSON.stringify(err));
        return false;
      }

      const user = result.rows[0];
      res.cookie('user', JSON.stringify(user));
      res.redirect('/');
    });
  });

  router.get('/posts', (req, res, next) => {
    db.query("SELECT * FROM posts", (err, results) => {
      if (err) {
        res.status(500);
        console.error(err);
        res.send("ERROR!" + JSON.stringify(err));
        return false;
      }

      res.render('posts', {posts: results.rows});
    });
  });

  router.get('/posts/new', (req, res, next) => {
    res.render('newpost');
  });

  router.post('/posts', (req, res, next) => {
    const title = req.body.title;
    const body = req.body.body;
    const userId = JSON.parse(req.cookies.user).id;

    db.query(`INSERT INTO posts (title, body, user_id) VALUES ('${title}', '${body}', ${userId})`);

    res.redirect('/posts');
  });

  router.get('/posts/:id', (req, res, next) => {
    db.query("SELECT * FROM posts WHERE id=" + req.params.id, (err, results) => {
      if (err) {
        res.status(500);
        console.error(err);
        res.send("ERROR!" + JSON.stringify(err));
        return false;
      }

      const post = results.rows[0];
      res.render('post', {post});
    });
  });

  router.get('/logout', (req, res, next) => {
    res.clearCookie('user', null);
    res.redirect('/');
  });

  return router;
}

module.exports = index;
