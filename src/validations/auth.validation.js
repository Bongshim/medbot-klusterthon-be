const Joi = require('joi');
const { password } = require('./custom.validation');

const register = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().custom(password),
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    userType: Joi.string().default('user'),
    role: Joi.string().default('user'),
  }),
};

const login = {
  body: Joi.object().keys({
    email: Joi.string(),
    username: Joi.string(),
    password: Joi.string().required(),
  }),
};

const logout = {
  body: Joi.object().keys({
    refreshToken: Joi.string().required(),
  }),
};

const refreshTokens = {
  body: Joi.object().keys({
    refreshToken: Joi.string().required(),
  }),
};

const forgotPassword = {
  body: Joi.object().keys({
    email: Joi.string().email().required(),
  }),
};

const resetPassword = {
  query: Joi.object().keys({
    token: Joi.string().required(),
  }),
  body: Joi.object().keys({
    password: Joi.string().required().custom(password),
  }),
};

const sendVerificationEmail = {
  query: Joi.object().keys({
    email: Joi.string().required(),
  }),
};

const verifyEmail = {
  query: Joi.object().keys({
    token: Joi.string().required(),
  }),
};

const microsoftUser = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    username: Joi.string(),
    role: Joi.string().required(),
    userType: Joi.string().valid('admin', 'user').default('user'),
    msId: Joi.string().required(),
    password: Joi.string().default('password1'),
  }),
};

module.exports = {
  register,
  login,
  logout,
  refreshTokens,
  forgotPassword,
  resetPassword,
  verifyEmail,
  sendVerificationEmail,
  microsoftUser,
};
