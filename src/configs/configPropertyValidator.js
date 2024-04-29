/**
 *  This is where we will put our required environment variables and if these are not set, the code will exit
 *
 * */
const dotenv = require('dotenv');
dotenv.config(); // Load environment variables from .env file
const propertiesToCheck = ['MONGO_DB_URL', 'JWT_SECRET_OR_KEY', 'AUTH0_SECRET', 'AUTH0_BASE_URL', 'AUTH0_CLIENT_ID', 'AUTH0_ISSUER_BASE_URL', "AUTH0_DOMAIN"];
function validateEnvProperty(property) {
    if (!process.env[property]) {
        console.error(`Error: ${property} is not set in the .env file`);
        return false;
    }
    console.debug(`\"${property}\" is set to: ${process.env[property]}`);
    return true;
}

propertiesToCheck.forEach(property => {
    if(!validateEnvProperty(property)) {
        process.exit(1);
    }
});
