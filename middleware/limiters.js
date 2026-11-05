const rateLimit = require('express-rate-limit');

const spaceLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    limit: 10,           // 10 lookups per minute, per visitor
    message: { error: 'Too many space lookups. Please wait a minute.' }
});

// Rate limiter - blocks an IP with a 429 response if it sends too many
// requests within the time window
const limiter = rateLimit({
    windowMs: 10 * 100, // 10 second window
    limit: 1000,          // max requests per window, per IP
    message: '<h1>429 Too Many Requests</h1><p>Please wait 10 seconds.</p>'
});
// app.use(limiter);

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 10,
    message: { error: 'Too many login attempts. Please wait 15 minutes and try again.' }
});

module.exports = { limiter, authLimiter, spaceLimiter };