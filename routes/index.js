const express = require('express');
const router = express.Router();

function index(db) {
  router.get('/', (req, res, next) => {
    //Cookie can get manipulated
    const admin = (req.cookies.user) ? JSON.parse(req.cookies.user).admin : false;
    //This is terrible. Never do this.
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

    //Never interpolate directly into queries. Always use parameterized queries instead
    //db.query("SELECT * FROM users WHERE username='$1::text', [username], (err, result) => {
    //Note, the above query doesn't have the password in it, because pws should not be stored in plain text. EVER.
    db.query(`SELECT * FROM users WHERE username='${username}' AND password='${password}' LIMIT 1`, (err, result) => {
      if (err) {
        res.status(500);
        console.error(err);
        //potentially exposes sensitive system information
        res.send("ERROR!" + JSON.stringify(err));
        return false;
      }

      const user = result.rows[0];
      //This is terrible! This sends password and SIN number and other PII (personally-identifiable information) to the client
      //Use session cookies!
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

    //Again, interpolated directly. Also, no stripping of HTML on title/body means XSS is possible
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
