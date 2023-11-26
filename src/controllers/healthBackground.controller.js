const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { healthBackgroundService } = require('../services');

const getHealthBackgroundByUserId = catchAsync(async (req, res) => {
  const healthBackground = await healthBackgroundService.getHealthBackgroundByUserId(req.user.id);
  res.status(httpStatus.OK).send({
    message: 'Success',
    data: healthBackground,
  });
});

const updateHealthBackgroundByUserId = catchAsync(async (req, res) => {
  const healthBackground = await healthBackgroundService.updateHealthBackgroundByUserId(req.user.id, req.body);
  res.status(httpStatus.OK).send({
    message: 'Success',
    data: healthBackground,
  });
});

module.exports = {
  getHealthBackgroundByUserId,
  updateHealthBackgroundByUserId,
};
