require('./src/configs/configPropertyValidator')
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet')
const hpp = require('hpp');
const bodyParser = require('body-parser')
const connectDB = require('./src/configs/mongodb.connection');
const limiter= require('./src/configs/rate.limiter')
const indexRouter = require('./src/routes/medical');

const app = express();

//app.use(helmet());
app.disable('x-powered-by');
app.use(limiter);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(hpp());

const morganMiddleware = morgan(
    ':remote-addr - :remote-user [:date[clf]] ":method :url status::status res-length::res[content-length] - res-time::response-time ms" ":referrer" ":user-agent"'
);

app.use(morganMiddleware);

connectDB();

app.use('/',indexRouter);

const port = process.env.PORT || 8080; // process.env.port is Heroku's port if you choose to deploy the app there
app.listen(port, () => console.log(`Server up and running on port ${port} !`));

module.exports = app;
