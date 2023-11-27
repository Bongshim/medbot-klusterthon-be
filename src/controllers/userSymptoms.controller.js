const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const pick = require('../utils/pick');
const { userSymptomsService } = require('../services');

const getAllUserSymptoms = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['userId', 'symptomId']);

  const result = await userSymptomsService.getAllUserSymptoms(filter);
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
  getAllUserSymptoms,
  getUserSymptomsById,
};
