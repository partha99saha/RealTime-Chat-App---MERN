const {createLogger, format, transports} = require('winston');
const {combine, timestamp, printf} = format;

const logFormat = printf(({level, message, timestamp, stack}) => {
  return `${timestamp} ${level}: ${stack || message}`;
});

const logger = createLogger({
  level: 'info',
  defaultMeta: {service: 'blog-service'},
  format: combine(timestamp({format: 'YYYY-MM-DD HH:mm:ss'}), logFormat),
  transports: [
    new transports.File({filename: './logs/error.log', level: 'error'}),
    new transports.File({filename: './logs/combined.log'}),
  ],
});

module.exports = logger;