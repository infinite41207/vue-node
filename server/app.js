require('dotenv').config()
require('module-alias/register')
const morgan = require('morgan')

// Standard Express and Node Server imports
const express = require('express')
const path = require('path')
const createError = require('http-errors')
const compression = require('compression')
const _ = require('lodash')
const config = require('config')

// Imports for session management
const uuidlib = require('uuid')
const RateLimitRedis = require('rate-limit-redis')

// Imports for authentication
const passport = require('passport')
const passportAuth = require('@common/auth/passportAuth')

const session = require('express-session')
const cookieParser = require('cookie-parser')
// const logger = require('morgan');

const helmet = require('helmet')
const cors = require('cors')

const redis = require('redis')
var RedisStore = require('connect-redis')(session)

// Imports for Rate Limiting (DDos attacks prevention)
const RateLimit = require('express-rate-limit')

process.on('unhandledRejection', (reason, promise) => {
  console.error(reason)
})
process.on('uncaughtException', (reason) => {
  console.error(reason)
})

process.on('warning', (e) => console.warn(e.stack))

// Router import
const mapRoutes = require('./routes/mapRoutes')

// Establish database connection
const sequelize = require('./database/dbConnection')

var rfs = require('rotating-file-stream') // version 2.x

const app = express()

// create a write stream (in append mode)
var accessLogStream = rfs.createStream('access.log', {
  interval: '1d', // rotate daily
  path: path.join(__dirname, 'access_log'),
})

// setup the logger
app.use(
  morgan(
    function (tokens, req, res) {
      const currentUser = {}
      if (req.user) {
        currentUser.id = req.user.id
        currentUser.login = req.user.login
        currentUser.name = req.user.name
      }

      let reqBody = {}
      if (req.body) {
        reqBody = _.cloneDeep(req.body)
        if (req.body.password) {
          delete reqBody.password
        }
      }

      const curDate = new Date()
      const logRecord = {
        date: curDate,
        ip: req.socket.remoteAddress,
        user: currentUser,
        method: tokens.method(req, res),
        url: tokens.url(req, res),
        query: req.query,
        params: req.params,
        body: reqBody,
        status: tokens.status(req, res),
        statusMessage: res.statusMessage,
        length: tokens.res(req, res, 'content-length'),
        time: tokens['response-time'](req, res),
      }
      return JSON.stringify(logRecord)
    },
    { stream: accessLogStream }
  )
)

// parse application/x-www-form-urlencoded
// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'jade')

// app.use(logger('dev'));
app.use(express.json({ limit: '100mb' }))
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))
app.use(helmet())
app.use(compression())
/************************************************************* */
// Redis client
var redisClient = null

redisClient = redis.createClient({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  password: process.env.REDIS_PASSWORD,
  db: Number(process.env.REDIS_DB_NUMBER),
})

redisClient.on('error', (err) => {
  console.error('Redis encountered an error --> ', err)
})

// Configure sessions
app.use(
  session({
    genid: (req) => {
      return uuidlib.v4() // Use UUIDs for session IDs
    },
    store: new RedisStore({
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
      pass: process.env.REDIS_PASSWORD,
      db: Number(process.env.REDIS_DB_NUMBER),
      client: redisClient,
    }),
    secret: process.env.SESSION_SECRET_KEY,
    resave: false, // setting true forces a resave in store even if session not changed
    rolling: true, // setting true updates expiration with maxAge after every user request
    saveUninitialized: true, // setting true saves even unmodified sessions
    proxy: true,
    cookie: {
      httpOnly: true,
      maxAge: config.get('session.max_age'),
      // secure: process.env.NODE_ENV === 'development' ? false : true, // Set this to true only after veniqa has a ssl enabled site
      secure: false,
    },
  })
)

/************************************************************* */
// Configure Request Rate Limiter
// var limiter = new RateLimit({
//   store: new RateLimitRedis({
//     client: redisClient,
//     expiry: 60 * 15, // How long each rate limiting window exists for in seconds
//   }),
//   windowMs: 60 * 1000, // 1 minute window in milliseconds
//   max: 200, // limit each IP to 200 requests per windowMs
//   delayMs: 0, // disable delaying - full speed until the max limit is reached
//   statusCode: 429,
// })

// app.use(limiter)

/************************************************************* */
// Configure authentication

passportAuth.initializePassport(passport)

app.use(passport.initialize())
app.use(passport.session())

// To Allow cross origin requests originating from selected origins
const corsOptions = {
  origin: config.get('allowedOrigins'),
  methods: ['OPTIONS, GET, POST, PUT, PATCH, DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-access-token', 'x-api-key', 'device_uuid', 'Access-Control-Allow-Origin', 'Access-Control-Allow-Credentials'],
  credentials: true,
}

app.use(cors(corsOptions))

/************************************************************* */

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

// use Routers
mapRoutes(app)

// catch 404 and forward to error handler
// app.use(function (req, res, next) {
//   next(createError(404));
// });

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error
  console.error(err)
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

/************************************************************* */
console.log('Initializing server ...')
sequelize
  .authenticate()
  .then(async () => {
    console.log('Connection to database has been established successfully.')
  })
  .catch((err) => {
    console.error('Unable to connect to the database:', err)
  })

app.listen(process.env.SERVER_PORT, () => {
  console.log(`Server works on http://localhost:${process.env.SERVER_PORT}`)
})

/**
 * Exchange with erp service.
 */

// require('@common/exchange/erpSync/syncServiceFull')();

/**
 * Exchange with oknoERP service.
 */
// require('@common/exchange/oknoERPSync/syncServiceFull')();

/**
 * Exchange with Enova365
 */
// require('@common/exchange/enova/syncServiceFull')();

// for first sync
// require('@services/incomingEmailSync')();

const getFullDataFrom1C = process.env.getFullDataFrom1C
if (getFullDataFrom1C && getFullDataFrom1C === 'true') {
  require('@common/exchange/hes1CSync/controllers/index.js')(true)
}

const fillDispositionsStatusId = process.env.fillDispositionsStatusId
if (fillDispositionsStatusId && fillDispositionsStatusId === 'true') {
  require('@common/exchange/hes1CSync/controllers/fillDispositionsStatusId.js')()
}
