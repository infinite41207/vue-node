const winston = require('winston');
const config = require('config');

// Winston needs to be told about color coding, but it only takes effect on loggers where the format parameter has a colorize called
winston.addColors({
  error: 'bold red',
  warn: 'yellow',
  info: 'green',
  verbose: 'dim white',
  debug: 'gray',
  silly: 'magenta',
});

// The filepath is from the root of the project since that's where this file is executed within app.js
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.timestamp(),
    winston.format.align(),
    winston.format.printf((info) => `${info.timestamp} ${info.level}: ${info.message} ${info.meta ? info.meta : ''}`)
  ),
  transports: [
    new winston.transports.File({
      level: 'error',
      filename: 'logging/logs/' + config.get('logging.errorLogFileName'),
    }),
    new winston.transports.File({
      filename: 'logging/logs/' + config.get('logging.combinedLogFileName'),
    }),

    new winston.transports.Console({}),
  ],
  exceptionHandlers: [new winston.transports.File({ filename: 'logging/logs/' + config.get('logging.exceptionLogFileName') })],
});

module.exports = logger;
