let { rateLimit } = require('express-rate-limit')

const limiter = rateLimit({
    windowMs: process.env.RATE_LIMIT_WINDOW_MIN * 60 * 1000 || 5 * 60 * 1000, // 15 minutes
    limit: process.env.RATE_LIMIT_PER_WINDOW || 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
    standardHeaders: 'draft-7', // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
})

module.exports = limiter;