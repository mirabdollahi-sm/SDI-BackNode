const express = require('express');
const router = express.Router();
const readController = require('../controllers/readController');

router.get('/', readController.read);

module.exports = router;