const express = require('express');
const router = express.Router();
const readController = require('../../controllers/readController');

router.route('/:dir')
    .get(readController.read);

module.exports = router;