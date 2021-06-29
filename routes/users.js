const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs')
const passport = require('passport');


router.get('/register', (req, res) => {
  res.render('users/register', {
    message: req.flash('success')
  })
})


router.post('/register', (req, res, next) => {
  try {
    db.query('SELECT email FROM user WHERE email ="' + req.body.email + '"', async (err, result) => {
      if (err) return err;
      if (result.length === 0) {
        const redirectUrl = req.session.returnTo || '/notes';
        delete req.session.returnTo;
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(req.body.password, salt)
        const user = { username: req.body.username, email: req.body.email, password: hash }
        const sql = 'INSERT INTO user SET ?'
        await db.query(sql, user, (err, rows) => {
          if (err)
            res.send(err);
          else
            req.flash('success', 'Successfully registered!')
          return res.redirect(redirectUrl)
        });
      }
      else if (result[0].email.length > 0) {
        req.flash('error', 'The Entered email already exsists')
        return res.redirect('/register')
      }
    })
  } catch (e) {
    next(e)
  }
})


router.get('/login', (req, res) => {
  res.render('users/login')
})

router.post('/login', passport.authenticate('local', { failureRedirect: '/login' }), (req, res) => {
  const redirectUrl = req.session.returnTo || '/notes';
  delete req.session.returnTo;
  req.flash('success', 'Welcome Back!');
  res.redirect(redirectUrl)
})

router.get('/logout', (req, res) => {
  const redirectUrl = req.session.returnTo || '/notes';
  delete req.session.returnTo;
  req.logout();
  req.flash('success', 'Successfully LoggedOut!');
  res.redirect(redirectUrl);
})

module.exports = router;