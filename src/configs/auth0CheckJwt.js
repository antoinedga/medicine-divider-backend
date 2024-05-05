const { auth } = require('express-oauth2-jwt-bearer');

const jwtCheck = auth({
    audience: ["medicine-divider-api", "https://dev-j5vqckh2d2ymv53h.us.auth0.com/userinfo"],
    issuerBaseURL: 'https://dev-j5vqckh2d2ymv53h.us.auth0.com',
});

module.exports = jwtCheck;