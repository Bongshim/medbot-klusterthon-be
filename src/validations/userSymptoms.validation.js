const Joi = require('joi');

const getAllUserSymptoms = {
  query: Joi.object().keys({
    userId: Joi.string(),
    symptomId: Joi.string(),
  }),
};

const getUserSymptomsById = {
  params: Joi.object().keys({
    id: Joi.string().required(),
  }),
};

module.exports = {
  getAllUserSymptoms,
  getUserSymptomsById,
};
