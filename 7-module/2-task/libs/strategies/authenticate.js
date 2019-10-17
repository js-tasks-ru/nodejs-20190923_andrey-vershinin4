const User = require('../../models/User');

module.exports = async function authenticate(strategy, email, displayName, done) {

  if (!email) {
    return done(null, false, 'Не указан email');
  }

  let user = await User.findOne({email});

  if (!user) {
    const _user = {email, displayName};
    try {
      user = new User(_user);
      await user.save();
    } catch (err) {
      return done(err, false);
    }
  }

  done(null, user);
};
