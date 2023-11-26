const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { openaiService } = require('../services');

const sendSymptomsToOpenAI = catchAsync(async (req, res) => {
  const response = await openaiService.sendSymptomsToOpenAI(req.body.symptom);
  res.status(httpStatus.OK).send({
    message: 'success',
    data: response,
  });
});

const getHealthQuestionsFromOpenAI = catchAsync(async (req, res) => {
  const response = await openaiService.getHealthQuestionsFromOpenAI(req.query.symptom);
  res.status(httpStatus.OK).send({
    message: 'success',
    data: response,
  });
});

const getRecommendationsFromOpenAI = catchAsync(async (req, res) => {
  const response = await openaiService.getRecommendationsFromOpenAI(req.body);
  res.status(httpStatus.OK).send({
    message: 'success',
    data: response,
  });
});

module.exports = {
  sendSymptomsToOpenAI,
  getHealthQuestionsFromOpenAI,
  getRecommendationsFromOpenAI,
};
