const express = require('express');
const router = express.Router();
const { sendMessage , allMessages} = require('../controllers/message.controller');
const Protect = require('../middleware/auth.middleware');

router.route('/:chatId').get(Protect,allMessages);
router.route('/').post(Protect, sendMessage);

module.exports = router;