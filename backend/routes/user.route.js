const express = require('express');

const router = express.Router();
const { registerUser,authUser,allUsers,updateUserProfile } = require('../controllers/user.controller');

const Protect=require('../middleware/auth.middleware')
router.route('/login').post(authUser)
router.route('/').post(registerUser)
router.route('/').get(Protect,allUsers)
router.route('/').put(Protect,updateUserProfile)
module.exports =router;