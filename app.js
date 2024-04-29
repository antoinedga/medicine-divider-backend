require('./src/configs/configPropertyValidator')
const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const helmet = require('helmet')
const bodyParser = require('body-parser')
const connectDB = require('./src/configs/mongodb.connection');
const limiter= require('./src/configs/rate.limiter')
const indexRouter = require('./src/routes/index');
const app = express();

app.use(helmet());
app.disable('x-powered-by');
app.use(limiter);
app.use(logger('common'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

connectDB();

app.use('/',indexRouter);

const port = process.env.PORT || 8080; // process.env.port is Heroku's port if you choose to deploy the app there
app.listen(port, () => console.log(`Server up and running on port ${port} !`));

module.exports = app;
