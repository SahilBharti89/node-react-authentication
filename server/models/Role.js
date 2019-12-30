//import sequelize
const Sequelize = require('sequelize');

// importing database connection
var sequelize = require('../sequelize');

var Role = sequelize.define('role', {
    role: Sequelize.STRING
},
{
    // remove created at update
    timestamps: false
});

module.exports = Role;