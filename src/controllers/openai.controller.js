const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { openaiService, symptomsService, userSymptomsService } = require('../services');

const sendSymptomsToOpenAI = catchAsync(async (req, res) => {
  // check if symptom already exists by searching with keyword
  const existingSymptoms = await symptomsService.getAllSymptoms({ keyword: req.body.symptom });
  if (existingSymptoms.length > 0) {
    res.status(httpStatus.OK).send({
      message: 'success',
      data: existingSymptoms,
    });

    return;
  }

  const response = await openaiService.sendSymptomsToOpenAI(req.body.symptom);

  // create symptoms in database
  const createdSymptoms = await response.map(async (symptom) => {
    await symptomsService.createSymptom(symptom);
  });

  await Promise.all(createdSymptoms);

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

  // save user symptoms to database
  const createdUserSymptoms = await userSymptomsService.createUserSymptoms(response, req.user.id);

  res.status(httpStatus.OK).send({
    message: 'success',
    data: createdUserSymptoms,
  });
});

const getReportFromOpenAI = catchAsync(async (req, res) => {
  const response = await openaiService.getReportFromOpenAI(req.body);
  res.status(httpStatus.OK).send({
    message: 'success',
    data: response,
  });
});

module.exports = {
  sendSymptomsToOpenAI,
  getHealthQuestionsFromOpenAI,
  getRecommendationsFromOpenAI,
  getReportFromOpenAI,
};
