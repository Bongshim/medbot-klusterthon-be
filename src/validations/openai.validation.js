const Joi = require('joi');

const sendSymptomsToOpenAI = {
  body: Joi.object().keys({
    symptom: Joi.string().required(),
  }),
};

const getHealthQuestionsFromOpenAI = {
  query: Joi.object().keys({
    symptom: Joi.string().required(),
  }),
};

const getRecommendationsFromOpenAI = {
  body: Joi.object().keys({
    symptom: Joi.string().required(),
    questions: Joi.array()
      .items(
        Joi.object({
          question: Joi.string().required(),
          answer: Joi.string().required(),
        })
      )
      .required(),
  }),
};

const getReportFromOpenAI = {
  body: Joi.object().keys({
    symptom: Joi.string().required(),
    description: Joi.string().required(),
  }),
};

module.exports = {
  sendSymptomsToOpenAI,
  getHealthQuestionsFromOpenAI,
  getRecommendationsFromOpenAI,
  getReportFromOpenAI,
};
