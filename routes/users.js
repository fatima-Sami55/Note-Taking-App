const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');

// Show registration form
router.get('/register', (req, res) => {
  res.render('users/register', {
    message: req.flash('success'),
    error: req.flash('error')
  });
});

// Handle user registration
router.post('/register', (req, res, next) => {
  const { username, email, password } = req.body;

  db.query('SELECT email FROM user WHERE email = ?', [email], (err, result) => {
    if (err) {
      console.error("❌ Error checking email:", err);
      return next(err);
    }

    if (result.length === 0) {
      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(password, salt);

      const user = { username, email, password: hash };
      const sql = 'INSERT INTO user SET ?';

      db.query(sql, user, (err, rows) => {
        if (err) {
          console.error("❌ Error inserting user:", err);
          return next(err);
        }

        req.flash('success', 'Successfully registered!');
        const redirectUrl = req.session.returnTo || '/notes';
        delete req.session.returnTo;
        return res.redirect(redirectUrl);
      });
    } else {
      req.flash('error', 'The entered email already exists.');
      return res.redirect('/register');
    }
  });
});

// Show login form
router.get('/login', (req, res) => {
  res.render('users/login', {
    error: req.flash('error')
  });
});

// Handle login
router.post('/login', passport.authenticate('local', {
  failureRedirect: '/login',
  failureFlash: true
}), (req, res) => {
  const redirectUrl = req.session.returnTo || '/notes';
  delete req.session.returnTo;
  req.flash('success', 'Welcome Back!');
  res.redirect(redirectUrl);
});

// Handle logout
router.get('/logout', (req, res) => {
  const redirectUrl = req.session.returnTo || '/';
  delete req.session.returnTo;
  try {
    req.logout();
    req.flash('success', 'Successfully Logged Out!');
    res.redirect(redirectUrl);
  } catch (err) {
    console.error("Logout error:", err);
    res.redirect('/');
  }
});

module.exports = router;
