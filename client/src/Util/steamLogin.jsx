import express from 'express';
import session from 'express-session';
import passport from 'passport';
import SteamStrategy from 'passport-steam';

const app = express();


// we need to generate a secret key and store it in an env file
app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true
  }));

  app.use(passport.initialize());
  app.use(passport.session());


// the current api key is set to our domain so it may not work on localhost
passport.use(new SteamStrategy({
    returnURL: 'http://localhost:3000/auth/steam/return',
    realm: 'http://localhost:3000/',
    apiKey: 'BD8648CD36AF3E87F648B24FF9B3A47B'
  }, 
  function(identifier, profile, done) {
    return done(null, profile);
  }
));

// Serialize / Deserialize 
passport.serializeUser((user, done) => {
    done(null, user);
  });

passport.deserializeUser((user, done) => {
    done(null, user);
  });

  // Auth Route
  app.get('/auth/steam', passport.authenticate('steam'));

  app.get('/auth/steam/return', 
    passport.authenticate('steam', { failureRedirect: '/' }),
    (req, res) => {
      res.redirect('/profile');
    }
  );

  // Display Profile Route
  app.get('/profile', (req, res) => {
    if (!req.isAuthenticated()) {
      return res.redirect('/');
    }
    res.send(req.user);
  });

  // Logout
  app.get('/logout', (req, res) => {
    req.logout(() => {
      res.redirect('/');
    });
  });

  // Backend Server
  app.listen(3000, () => {
    console.log('Server started on http://localhost:3000');
  });