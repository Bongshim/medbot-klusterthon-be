const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const pick = require('../utils/pick');
const { userSymptomsService } = require('../services');

const createUserSymptoms = catchAsync(async (req, res) => {
  const userSymptoms = await userSymptomsService.createUserSymptoms(req.body, req.user.id);

  res.status(httpStatus.CREATED).send({
    message: 'success',
    data: userSymptoms,
  });
});

const getAllUserSymptoms = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['userId', 'symptomId']);

  const result = await userSymptomsService.queryUserSymptoms(filter);
  res.status(httpStatus.OK).send({
    message: 'success',
    data: result,
  });
});

const getUserSymptomsById = catchAsync(async (req, res) => {
  const userSymptoms = await userSymptomsService.getUserSymptomsById(req.params.id);

  res.status(httpStatus.OK).send({
    message: 'success',
    data: userSymptoms,
  });
});

module.exports = {
  createUserSymptoms,
  getAllUserSymptoms,
  getUserSymptomsById,
};
