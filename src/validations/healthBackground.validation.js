const Joi = require('joi');

const updateHealthBackgroundByUserId = {
  body: Joi.object().keys({
    hasHighBloodPressure: Joi.boolean(),
    hasDiabetes: Joi.boolean(),
    isSmoker: Joi.boolean(),
  }),
};

module.exports = {
  updateHealthBackgroundByUserId,
};
