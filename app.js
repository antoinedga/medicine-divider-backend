require('dotenv').config()
var express = require('express');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const helmet = require('helmet')
const connectDB = require('./src/configs/mongodb.connection');
var limiter= require('./src/configs/rate.limiter')
var indexRouter = require('./src/routes/index');
var usersRouter = require('./src/routes/users');
var medicineRoutineRouter = require("./src/routes/medicineRoutine/medicineRoutine")
var app = express();
const passport    = require('passport');

console.log(process.env.RATE_LIMIT_WINDOW_MIN)
require('./src/utils/passportJwt').jwtStrategy(passport);

app.use(helmet())
app.disable('x-powered-by')
app.use(limiter)
app.use(logger('common'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
connectDB();

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/medicine/routine',
    passport.authenticate("jwt", { session: false }), medicineRoutineRouter);

const port = process.env.PORT || 8080; // process.env.port is Heroku's port if you choose to deploy the app there
app.listen(port, () => console.log(`Server up and running on port ${port} !`));

module.exports = app;
