import passport from 'passport';
import { Strategy } from 'passport-local';

const options = {
  usernameField: 'usernameOrEmail',
  passwordField: 'password',
}

passport.use(
  new Strategy(options, async (username, password, done) => {
    /** */
  })
);
