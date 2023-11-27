const Joi = require('joi');
const { password } = require('./custom.validation');

const createUser = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().custom(password),
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    gradeId: Joi.number().required(),
    phoneNumber: Joi.string(),
    username: Joi.string().required(),
    roleId: Joi.number().required(),
    userType: Joi.string().valid('admin', 'user').default('user'),
  }),
};

const getUsers = {
  query: Joi.object().keys({
    firstName: Joi.string(),
    roleId: Joi.string(),
    paginate: Joi.number().integer(),
    gradeId: Joi.number().integer(),
    page: Joi.number().integer(),
    isVerified: Joi.boolean().valid(true, false).default(true),
    createdBy: Joi.number(),
  }),
};

const getUser = {
  params: Joi.object().keys({
    userId: Joi.string(),
  }),
};

const updateUser = {
  params: Joi.object().keys({
    userId: Joi.required(),
  }),
  body: Joi.object()
    .keys({
      email: Joi.string().email(),
      password: Joi.string().custom(password),
      username: Joi.string(),
      firstName: Joi.string(),
      lastName: Joi.string(),
      gender: Joi.string(),
      phoneNumber: Joi.string(),
      profileImage: Joi.string(),
      dateOfBirth: Joi.date(),
      bodyHeight: Joi.number(),
      bodyWeight: Joi.number(),
    })
    .min(1),
};

const deleteUser = {
  params: Joi.object().keys({
    userId: Joi.string(),
  }),
};

const validateEmail = {
  query: Joi.object().keys({
    email: Joi.string(),
  }),
};

const validateUsername = {
  query: Joi.object().keys({
    username: Joi.string(),
  }),
};

const updatePassword = {
  body: Joi.object().keys({
    oldPassword: Joi.string().required().custom(password),
    newPassword: Joi.string().required().custom(password),
  }),
};

module.exports = {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  validateEmail,
  validateUsername,
  updatePassword,
};
