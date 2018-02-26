const passport = require('passport');
var GoogleStrategy = require('passport-google-oauth20').Strategy;

const User = require('./models/user');

// set up passport configs
<<<<<<< HEAD
passport.use(new fbp.Strategy({
  clientID: '1783717201933159',
  clientSecret: '9ed4fe148172cd10d034bf8008d2fe23',
  callbackURL: '/auth/facebook/callback'
=======
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID, // config variables
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: '/auth/google/callback'
>>>>>>> advanced
}, function(accessToken, refreshToken, profile, done) {
  User.findOne({
    'fbid': profile.id
  }, function(err, user) {
    if (err) return done(err);

    if (!user) {
      const user = new User({
        name: profile.displayName,
        fbid: profile.id
      });

      user.save(function(err) {
        if (err) console.log(err);

        return done(err, user);
      });
    } else {
      return done(err, user);
    }
  });
}));

passport.serializeUser(function(user, done) {
  done(null, user);
});
passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

module.exports = passport;
