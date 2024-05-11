const winston = require('winston');
const { combine, timestamp, json, colorize, simple } = winston.format;

const logger = winston.createLogger({
    level: 'info',
    format: combine(
        timestamp(),
        json(),
        colorize({ all: true }),
        simple()),
    transports: [new winston.transports.Console()],
});

module.exports.logger = logger;