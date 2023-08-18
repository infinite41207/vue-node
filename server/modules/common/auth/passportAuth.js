var LocalStrategy = require('passport-local').Strategy
const BCrypt = require('bcrypt')
const HttpStatusCode = require('http-status-codes')
const User = require('@catalogs/users/models')
const logger = require('@logging/logger')

const checkPermissions = (req, res, done) => {
  if (req.user.isFullRight === true) {
    done()
  } else {
    console.log('User doesnt have necessary permission to access this.')
    return res.status(HttpStatusCode.StatusCodes.FORBIDDEN).send('Permission denied for the user. User doesnt have necessary permission to access this')
  }
}

module.exports = {
  initializePassport(passport) {
    // Configure Passport authenticated session persistence.
    //
    // In order to restore authentication state across HTTP requests, Passport needs
    // to serialize users into and deserialize users out of the session.  The
    // typical implementation of this is as simple as supplying the user ID when
    // serializing, and querying the user record by ID from the database when
    // deserializing.

    // Passport needs to be able to serialize and deserialize users to support persistent login sessions
    passport.serializeUser(function (user, done) {
      done(null, user.id)
    })

    passport.deserializeUser(async function (id, done) {
      const user = await User.findByPk(id)
      if (user && user.isActive === true) {
        done(null, user)
      } else {
        done('User is not found', false)
      }
    })

    // Configure the local strategy for use by Passport.
    //
    // The local strategy require a `verify` function which receives the credentials
    // (`username` and `password`) submitted by the user.  The function must verify
    // that the password is correct and then invoke `cb` with a user object, which
    // will be set at `req.user` in route handlers after authentication.
    passport.use(
      'login',
      new LocalStrategy(
        {
          usernameField: 'email',
          passwordField: 'password',
        },
        async function (username, password, done) {
          const user = await User.findOne({
            where: {
              login: username,
              isActive: true,
            },
          }).catch((err) => {
            console.error(err)
            logger.error('Bad request for user', username)
            return done(null, false)
          })

          if (!user) {
            logger.error('User Not Found with username', username)
            return done(null, false)
          }
          // User exists but wrong password, log the error
          if (!isValidPassword(user, password)) {
            logger.error('Invalid Password', username)
            return done(null, false) // redirect back to login page
          }
          //logger.info("returning user", username);
          return done(null, user)
        }
      )
    )

    var isValidPassword = (user, password) => {
      return BCrypt.compareSync(password, user.password)
    }
  },

  isAuthenticated(req, res, done) {
    // Passport adds the isAuthenticated function in req body when successfully authenticated, removes when session expired or user logs out
    if (req.isAuthenticated()) {
      done()
    } else {
      return res.status(HttpStatusCode.StatusCodes.UNAUTHORIZED).send('only for logged in users')
    }
  },

  isSuperAdmin(req, res, done) {
    // Validate if admin is a superadmin, otherwise return a 401
    return checkPermissions(req, res, done)
  },
}
