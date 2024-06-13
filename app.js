require('./src/configs/configPropertyValidator')
const express = require('express');
const morganMiddleware = require('./src/configs/morganLoggerConfig');
const { v4: uuidv4 } = require('uuid');
const cors = require('cors');  // Import the cors package
const helmet = require('helmet')
const hpp = require('hpp');
const bodyParser = require('body-parser')
const connectDB = require('./src/configs/mongodb.connection');
const limiter= require('./src/configs/rate.limiter')
const indexRouter = require('./src/routes/medical');

const app = express();

const corsOptions = {
    origin: 'http://localhost:3000', // Replace with your React app URL
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204
};

app.use(cors(corsOptions));
//app.use(helmet());
app.disable('x-powered-by');
app.use(limiter);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(hpp());






app.use((req, res, next) => {
    req.id = uuidv4(); // Assign a unique ID to the request object
    next(); // Call the next middleware
});

app.use(morganMiddleware.morganMiddleware);

connectDB();

app.use('/',indexRouter);

const port = process.env.PORT || 8080; // process.env.port is Heroku's port if you choose to deploy the app there
app.listen(port, () => console.log(`Server up and running on port ${port} !`));

module.exports = app;
