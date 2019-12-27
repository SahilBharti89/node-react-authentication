import express from 'express';
const app = express();

require('./registerUser')(app);
require('./loginUser')(app);
require('./forgotPassword')(app);
require('./resetPassword')(app);
require('./updatePassword')(app);
require('./updatePasswordViaEmail')(app);
require('./findUsers')(app);
require('./deleteUser')(app);
require('./updateUser')(app);

module.exports = app;