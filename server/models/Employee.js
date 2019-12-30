//import sequelize
const Sequelize = require('sequelize');

// importing database connection
var sequelize = require('../sequelize');

// import model for Foreign Key roleID
var Role = require('./Role');

var Employee = sequelize.define('employee', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: Sequelize.STRING,
    email: Sequelize.STRING,
    address: Sequelize.STRING,
    phone: Sequelize.BIGINT,
    // setting foreign key
    roleID: {
        type: Sequelize.INTEGER,
        // This is the reference to another model
        references: {
            model: Role,
            key: 'id'
        }
    }
});

Employee.belongsTo(Role, { foreignKey: 'roleID' });

module.exports = Employee;