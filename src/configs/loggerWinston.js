const winston = require('winston');
const { combine, timestamp, printf } = winston.format;

// Define a custom log format
const customFormat = printf(({ level, message, requestId, timestamp, method }) => {
    return `[${timestamp}] [${level}] ${message}\n`;
});

const logger = winston.createLogger({
    level: 'info',
    format: combine(timestamp(),
        customFormat,
        winston.format.json(),),
    transports: [
        // Console transport with colorized output
        new winston.transports.Console({
            format: combine(customFormat)
        }),
        new winston.transports.File({
            filename: 'combined.log',
            format: combine(
                customFormat
            )
        }),
        // File transport for error logs only
        new winston.transports.File({
            filename: 'error.log',
            level: 'error', // Log only errors to this file
            format: combine()
        })
    ],
});

// Create a stream object for Morgan to write logs to the Winston logger
const stream = {
    write: function(message, encoding) {
        logger.info(message.trim()); // Trim the message to remove trailing newline
    }
};

const info = (req, message) => {
    logger.info(`requestId:[${req.id}] - ${message}`);
}
const error = (req, message) => {
    logger.error(`requestId:[${req.id}] - ${message}`)
}
const debug = (req, message) => {
    logger.debug(`requestId:[${req.id}] - ${message}`)
}
const warn = (req, message) => {
    logger.warn(`requestId:[${req.id}] - ${message}`)
}

module.exports = {stream, info, error, debug, warn}
