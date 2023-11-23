const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { messageTemplateService } = require('../services');
const pick = require('../utils/pick');

const createMessageTemplate = catchAsync(async (req, res) => {
  await messageTemplateService.createMessageTemplate(req.body);
  res.status(httpStatus.CREATED).send({
    success: true,
    message: 'Message Template created successfully',
  });
});

const getMessageTemplates = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['title']);
  const options = pick(req.query, ['page', 'paginate']);
  const messageTemplates = await messageTemplateService.getAllMessageTemplates(filter, options);
  res.status(httpStatus.OK).send({
    success: true,
    message: 'Message Templates fetched successfully',
    data: messageTemplates,
  });
});

const getMessageTemplateById = catchAsync(async (req, res) => {
  const messageTemplate = await messageTemplateService.getMessageTemplateById(req.params.messageTemplateId);
  if (!messageTemplate) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Message Template not found');
  }
  res.status(httpStatus.OK).send({
    success: true,
    message: 'Message Template fetched successfully',
    data: messageTemplate,
  });
});

const updateMessageTemplateById = catchAsync(async (req, res) => {
  await messageTemplateService.updateMessageTemplateById(req.params.messageTemplateId, req.body);
  res.status(httpStatus.OK).send({
    success: true,
    message: 'Message Template updated successfully',
  });
});

const deleteMessageTemplateById = catchAsync(async (req, res) => {
  await messageTemplateService.deleteMessageTemplateById(req.params.messageTemplateId);
  res.status(httpStatus.OK).send({
    success: true,
    message: 'Message Template deleted successfully',
  });
});

module.exports = {
  createMessageTemplate,
  getMessageTemplates,
  getMessageTemplateById,
  updateMessageTemplateById,
  deleteMessageTemplateById,
};
