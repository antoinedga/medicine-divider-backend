
const { ManagementClient } = require('auth0');

// Auth0 Management API configuration
const auth0ManageClient = new ManagementClient({
    domain: process.env.AUTH0_DOMAIN,
    clientId: process.env.AUTH0_CLIENT_ID,
    clientSecret: process.env.AUTH0_SECRET,
});

module.exports = {auth0ManageClient}
