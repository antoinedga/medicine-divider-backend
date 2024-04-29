const auth0 = require("auth0");

let managementClient = new auth0.ManagementClient({
    domain: process.env.AUTH0_DOMAIN,
    clientId: process.env.AUTH0_CLIENT_ID,
    clientSecret: process.env.AUTH0_SECRET,
})

let authenticationClient = new auth0.AuthenticationClient({
    domain: process.env.AUTH0_DOMAIN,
    clientId: process.env.AUTH0_CLIENT_ID,
    clientSecret: process.env.AUTH0_SECRET,
})


module.exports = {
    authenticationClient: authenticationClient,
    managementClient: managementClient};