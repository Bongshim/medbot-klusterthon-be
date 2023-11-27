const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const { userSymptomsValidation } = require('../../validations');
const { userSymptomsController } = require('../../controllers');

const router = express.Router();


module.exports = router;
