const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const pick = require('../utils/pick');
const { symptomsService } = require('../services');

const getAllSymptoms = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['title', 'keyword']);

  const result = await symptomsService.getAllSymptoms(filter);
  res.status(httpStatus.OK).send({
    message: 'success',
    data: result,
  });
});

module.exports = {
  getAllSymptoms,
};
