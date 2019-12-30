const express = require('express');
const Cors = require('cors');
const bodyParser = require('body-parser');
const logger = require('morgan');
const passport = require('passport');
const helmet = require('helmet');
const app = express();

const API_PORT = process.env.API_PORT || 5000;

const db = require('./sequelize');
// const routes = require('./routes1/index');
const authUserRoute = require('./Routes/authUser');
const employeeRoute = require('./Routes/authEmployee');
require('./config/passport');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// Middlewares
app.use(express.json());
app.use(logger('dev'));
app.use(helmet());
app.use(passport.initialize());
app.use((req,res,next)=>{
    console.log(req.originalUrl);
    console.log('req body ', req.body);
    next();
})

// Configure headers and cors
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});

// force: true will drop the table if it already exists
// db.sync({force: true}).then(() => {
//   console.log('Drop and Resync with { force: true }');
// });
db.sync().then(() => {
    console.log('Database Connected and Syncing start');
});

app.use('/users', authUserRoute);
app.use('/employee', employeeRoute);
app.use(express.static("public"));
app.listen(API_PORT, () => console.log(`Listening on port ${API_PORT}`));

module.exports = app;
