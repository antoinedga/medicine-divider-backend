
const config = {
    authRequired: false,
    auth0Logout: true,
    clientSecret: process.env.AUTH0_SECRET,
    secret: process.env.AUTH0_SECRET,
    baseURL: process.env.AUTH0_BASE_URL,
    clientID: process.env.AUTH0_CLIENT_ID,
    issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL,
    authorizationParams: {
        response_type: 'code',
        scope: 'openid profile email',
    },
    routes: {
        login: false
    },
    afterCallback: (req, res, next) => {
        // Extract tokens from req.oidc
        const accessToken = req.oidc.accessToken;
        const idToken = req.oidc.idToken;
        console.log("hello")
        // Send tokens back as a response
        return { accessToken, idToken }
    }
};

module.exports = config