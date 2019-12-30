/* eslint-disable no-console */
const passport = require('passport');
const Sequelize = require('sequelize');
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
const crypto = require('crypto');
const jwtSecret = require('../config/jwtConfig');
const details = require('../config/details.json');
var User = require('../models/User');
var nodemailer = require('nodemailer');

const Op = Sequelize.Op;
const BCRYPT_SALT_ROUNDS = 12;

let registerUser = async (req, res, next) => {
    passport.authenticate('register', (err, user, info) => {
        if (err) {
          console.error(err);
        }
        if (info !== undefined) {
          console.error(info.message);
          res.status(403).send(info.message);
        } else {
          // eslint-disable-next-line no-unused-vars
          req.logIn(user, error => {
            console.log(user);
            const data = {
              first_name: req.body.first_name,
              last_name: req.body.last_name,
              email: req.body.email,
              username: user.username,
            };
            console.log(data);
            User.findOne({
              where: {
                username: data.username,
              },
            }).then(user => {
              console.log(user);
              user.update({
                  first_name: data.first_name,
                  last_name: data.last_name,
                  email: data.email,
                })
                .then(() => {
                  console.log('user created in db');
                  res.status(200).send({ message: 'user created' });
                });
            });
          });
        }
    })(req, res, next);
}

let loginUser = async (req, res, next) => {
    passport.authenticate('login', (err, users, info) => {
        if (err) {
          console.error(`error ${err}`);
        }
        if (info !== undefined) {
          console.error(info.message);
          if (info.message === 'bad username') {
            res.status(401).send(info.message);
          } else {
            res.status(403).send(info.message);
          }
        } else {
          req.logIn(users, () => {
            User.findOne({
              where: {
                username: req.body.username,
              },
            }).then(user => {
              const token = jwt.sign({ id: user.id }, jwtSecret.secret, {
                expiresIn: 60 * 60,
              });
              res.status(200).send({
                auth: true,
                token,
                message: 'user found & logged in',
              });
            });
          });
        }
    })(req, res, next);
}

let deleteUser = async (req, res, next) => {
    passport.authenticate('jwt', { session: false }, (err, user, info) => {
        if (err) {
          console.error(err);
        }
        if (info !== undefined) {
          console.error(info.message);
          res.status(403).send(info.message);
        } else {
          User.destroy({
            where: {
              username: req.query.username,
            },
          })
            .then((userInfo) => {
              if (userInfo === 1) {
                console.log('user deleted from db');
                res.status(200).send('user deleted from db');
              } else {
                console.error('user not found in db');
                res.status(404).send('no user with that username to delete');
              }
            })
            .catch((error) => {
              console.error('problem communicating with db');
              res.status(500).send(error);
            });
        }
    })(req, res, next);
}

let findUser = async (req, res, next) => {
    passport.authenticate('jwt', { session: false }, (err, user, info) => {
        if (err) {
          console.log(err);
        }
        if (info !== undefined) {
          console.log(info.message);
          res.status(401).send(info.message);
        } else if (user.username === req.query.username) {
          User.findOne({
            where: {
              username: req.query.username,
            },
          }).then((userInfo) => {
            if (userInfo != null) {
              console.log('user found in db from findUsers');
              res.status(200).send({
                auth: true,
                first_name: userInfo.first_name,
                last_name: userInfo.last_name,
                email: userInfo.email,
                username: userInfo.username,
                password: userInfo.password,
                message: 'user found in db',
              });
            } else {
              console.error('no user exists in db with that username');
              res.status(401).send('no user exists in db with that username');
            }
          });
        } else {
          console.error('jwt id and username do not match');
          res.status(403).send('username and jwt token do not match');
        }
    })(req, res, next);
}

let forgotPassword = async (req, res) => {
    if (req.body.email === '') {
        res.status(400).send('email required');
      }
      console.error(req.body.email);
      User.findOne({
        where: {
          email: req.body.email,
        },
      }).then((user) => {
        if (user === null) {
          console.error('email not in database');
          res.status(403).send('email not in db');
        } else {
          const token = crypto.randomBytes(20).toString('hex');
          user.update({
            resetPasswordToken: token,
            resetPasswordExpires: Date.now() + 3600000,
          });
  
          const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: details.email,
              pass: details.password,
            },
          });
  
          const mailOptions = {
            from: 'mySqlDemoEmail@gmail.com',
            to: `${user.email}`,
            subject: 'Link To Reset Password',
            text:
              'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n'
              + 'Please click on the following link, or paste this into your browser to complete the process within one hour of receiving it:\n\n'
              + `http://localhost:3000/reset/${token}\n\n`
              + 'If you did not request this, please ignore this email and your password will remain unchanged.\n',
          };
  
          console.log('sending mail');
  
          transporter.sendMail(mailOptions, (err, response) => {
            if (err) {
              console.error('there was an error: ', err);
            } else {
              console.log('here is the res: ', response);
              res.status(200).json('recovery email sent');
            }
          });
        }
    });
}

let resetPassword = async (req, res) => {
    User.findOne({
        where: {
          resetPasswordToken: req.query.resetPasswordToken,
          resetPasswordExpires: {
            [Op.gt]: Date.now(),
          },
        },
      }).then((user) => {
        if (user == null) {
          console.error('password reset link is invalid or has expired');
          res.status(403).send('password reset link is invalid or has expired');
        } else {
          res.status(200).send({
            username: user.username,
            message: 'password reset link a-ok',
          });
        }
    });
}

let updatePassword = async (req, res, next) => {
    passport.authenticate('jwt', { session: false }, (err, user, info) => {
        if (err) {
          console.error(err);
        }
        if (info !== undefined) {
          console.error(info.message);
          res.status(403).send(info.message);
        } else {
          User.findOne({
            where: {
              username: req.body.username,
            },
          }).then((userInfo) => {
            if (userInfo != null) {
              console.log('user found in db');
              bcrypt.hash(req.body.password, BCRYPT_SALT_ROUNDS)
                .then((hashedPassword) => {
                  userInfo.update({
                    password: hashedPassword,
                  });
                })
                .then(() => {
                  console.log('password updated');
                  res
                    .status(200)
                    .send({ auth: true, message: 'password updated' });
                });
            } else {
              console.error('no user exists in db to update');
              res.status(404).json('no user exists in db to update');
            }
          });
        }
    })(req, res, next);
}

let updatePasswordViaEmail = async (req, res) => {
    User.findOne({
        where: {
          username: req.body.username,
          resetPasswordToken: req.body.resetPasswordToken,
          resetPasswordExpires: {
            [Op.gt]: Date.now(),
          },
        },
      }).then(user => {
        if (user == null) {
          console.error('password reset link is invalid or has expired');
          res.status(403).send('password reset link is invalid or has expired');
        } else if (user != null) {
          console.log('user exists in db');
          bcrypt
            .hash(req.body.password, BCRYPT_SALT_ROUNDS)
            .then(hashedPassword => {
              user.update({
                password: hashedPassword,
                resetPasswordToken: null,
                resetPasswordExpires: null,
              });
            })
            .then(() => {
              console.log('password updated');
              res.status(200).send({ message: 'password updated' });
            });
        } else {
          console.error('no user exists in db to update');
          res.status(401).json('no user exists in db to update');
        }
    });
}

let updateUser = async (req, res, next) => {
    passport.authenticate('jwt', { session: false }, (err, user, info) => {
        if (err) {
          console.error(err);
        }
        if (info !== undefined) {
          console.error(info.message);
          res.status(403).send(info.message);
        } else {
          User.findOne({
            where: {
              username: req.body.username,
            },
          }).then((userInfo) => {
            if (userInfo != null) {
              console.log('user found in db');
              userInfo
                .update({
                  first_name: req.body.first_name,
                  last_name: req.body.last_name,
                  email: req.body.email,
                })
                .then(() => {
                  console.log('user updated');
                  res.status(200).send({ auth: true, message: 'user updated' });
                });
            } else {
              console.error('no user exists in db to update');
              res.status(401).send('no user exists in db to update');
            }
          });
        }
    })(req, res, next);
}

module.exports = {
  registerUser: registerUser,
  loginUser: loginUser,
  updatePassword: updatePassword,
  forgotPassword: forgotPassword,
  resetPassword: resetPassword,
  updatePasswordViaEmail: updatePasswordViaEmail,
  updateUser: updateUser,
  findUser: findUser,
  deleteUser: deleteUser
};
