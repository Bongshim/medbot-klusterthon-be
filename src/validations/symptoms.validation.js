const Joi = require('joi');

const querySymptoms = {
  query: Joi.object().keys({
    title: Joi.string(),
    keyword: Joi.string(),
  }),
};

module.exports = {
  querySymptoms,
};
