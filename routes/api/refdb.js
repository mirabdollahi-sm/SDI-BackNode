const express = require('express');
const router = express.Router();
const ROLES_LIST = require('../../config/roles_list');
const verifyRoles = require('../../middleware/verifyRoles');
const dbController = require('../../controllers/filesDBcontroller');

router.route('/').get(verifyRoles(ROLES_LIST.Admin), dbController);

module.exports = router;