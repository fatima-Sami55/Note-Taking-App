if (process.env.NODE_ENV !== "production") {
  require('dotenv').config()
}

const express = require('express');
const app = express();
const path = require('path');
const mysql = require('mysql2');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const flash = require('connect-flash');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');
const passport = require('passport');
const bcrypt = require('bcryptjs');
const cookieParser = require('cookie-parser');
const LocalStrategy = require('passport-local').Strategy;
global.db = require('./database/db');
const note = require('./routes/note');
const user = require('./routes/users');
const port = process.env.PORT || 8080;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));


app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));

app.use(cookieParser())

// const sessionStore = new MySQLStore(db);
const sessionStore = new MySQLStore({
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
  expiration: 60 * 2000
});

const sessionConfig = {
  name: 'session',
  store: sessionStore,
  secret:  process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7
  },
};

app.use(session(sessionConfig));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());


passport.use('local', new LocalStrategy({
  usernameField: 'username',
  passwordField: 'password',
  passReqToCallback: true
},
  function (req, username, password, done) {
    // parameterized query to avoid SQL injection
    db.query("SELECT * FROM user WHERE username = ?", [username], function (err, rows) {
      if (err) return done(err);

      if (!rows.length) {
        return done(null, false, req.flash('error', 'No user found.'));
      }

      const user = rows[0];

      // Use bcrypt.compare (async) instead of compareSync for better performance
      bcrypt.compare(password, user.password, function (err, isMatch) {
        if (err) return done(err);

        if (!isMatch) {
          return done(null, false, req.flash('error', 'Oops! Wrong password.'));
        }

        // Auth success
        return done(null, user);
      });
    });
  }
));

// Serialize the user's ID into the session
passport.serializeUser(function (user, done) {
  done(null, user.userid);
});

// Deserialize user from ID stored in session
passport.deserializeUser(function (user_id, done) {
  db.query('SELECT * FROM user WHERE userid = ?', [user_id], function (err, rows) {
    if (err) return done(err);
    done(null, rows[0]);
  });
});


app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  next()
})

app.use('/notes', note)
app.use('/', user)

app.get('/', (req, res) => {
  res.render('home')
})

app.listen(port, () => {
  console.log(`on port ${port}`)
})
