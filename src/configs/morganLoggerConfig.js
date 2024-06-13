const morgan = require('morgan');
const winston = require("./loggerWinston");


const customMorganFormat = (tokens, req, res, error) => {
    const remoteAddr = tokens['remote-addr'](req, res);
    const remoteUser = tokens['remote-user'](req, res);
    const date = tokens.date(req, res, 'clf');
    const method = tokens.method(req, res);
    const url = tokens.url(req, res);
    const status = tokens.status(req, res);
    const responseTime = tokens['response-time'](req, res);
    const userAgent = tokens['user-agent'](req, res);

    // Accessing auth payload sub from the request object
    const authPayloadSub = (req.auth !== undefined)
        ? req.auth.payload.sub : 'N/A'; // If auth payload sub is not available, default to 'N/A'
    const requestId = req.id || req.requestId || 'N/A';

    return `requestId:[${requestId}] - Address:[${remoteAddr}] remote-user:[${remoteUser}] [${date}] method:[${method}] url:[${url}] status:[${status}] response-time:${responseTime}ms agent:[${userAgent}] authId:[${authPayloadSub}]`;
};

const morganMiddleware = morgan(customMorganFormat, { stream: winston.stream });

module.exports.morganMiddleware = morganMiddleware;
