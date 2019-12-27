import express from 'express';
import Cors from 'cors';
import bodyParser from 'body-parser';
import logger from 'morgan';
import passport from 'passport';
import helmet from 'helmet';

const app = express();

const API_PORT = process.env.API_PORT || 3000;

const routes = require('./routes/index');
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
    console.log(req.body);
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

app.use('/api', routes)
app.use(express.static("public"));
app.listen(API_PORT, () => console.log(`Listening on port ${API_PORT}`));

module.exports = app;
