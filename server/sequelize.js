import Sequelize from 'sequelize';
import UserModel from './models/user';

// const sequelize = new Sequelize('users', 'test', 'test1234', {
//   host: 'db',
//   dialect: 'mysql',
// });
const sequelize = new Sequelize(
  'react-auth', // database name
  'root', // username
  'bharti123', // password
  {
      host: 'localhost',
      dialect: 'mysql',
      operatorsAliases: false,

      pool: {
          max: 5,
          min: 0,
          acquire: 30000,
          idle: 10000
        }
  }
);

const User = UserModel(sequelize, Sequelize);

sequelize.sync().then(() => {
  // eslint-disable-next-line no-console
  console.log('Users db and user table have been created');
});

module.exports = User;
