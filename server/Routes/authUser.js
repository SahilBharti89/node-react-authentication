const express = require('express');

const userService = require('../Services/UserService');
const router = express.Router();

router.post('/registerUser', userService.registerUser);
router.post('/loginUser', userService.loginUser);
router.post('/forgotPassword', userService.forgotPassword);
router.delete('/deleteUser', userService.deleteUser);
router.get('/findUser', userService.findUser);
router.get('/reset', userService.resetPassword);
router.put('/updatePassword', userService.updatePassword);
router.put('/updatePasswordViaEmail', userService.updatePasswordViaEmail);
router.put('/updateUser', userService.updateUser);

module.exports = router;

