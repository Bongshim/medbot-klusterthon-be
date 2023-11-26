const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const {
  authService,
  userService,
  tokenService,
  emailService,
  roleService,
  healthBackgroundService,
} = require('../services');
const { extractPermissions } = require('../services/auth.service');
const pick = require('../utils/pick');

const register = catchAsync(async (req, res) => {
  const role = await roleService.getRolesByName(req.body.role);
  const user = await userService.createUser({ ...req.body, roleId: role.id });

  // Instantiate a new healthBackground
  await healthBackgroundService.createHealthBackground(user.id);

  // Send email verification
  const verification = await authService.handleSendEmailVerificationToken(user);

  res.status(httpStatus.CREATED).send(verification);
});

const login = catchAsync(async (req, res) => {
  const { password, ...others } = req.body;
  const user = await authService.loginUserWithEmailAndPassword(others, password);

  // Generate tokens
  const tokens = await tokenService.generateAuthTokens(user.dataValues.id);

  // Modify user object to bring permissions to the front
  const data = extractPermissions(user);

  // encrypt user data
  const encryptedUser = await userService.encryptData({ ...user.dataValues, ...data });

  res.send({ encryptedUser, tokens });
});

const logout = catchAsync(async (req, res) => {
  await authService.logout(req.body.refreshToken);
  res.status(httpStatus.NO_CONTENT).send();
});

const refreshTokens = catchAsync(async (req, res) => {
  const tokens = await authService.refreshAuth(req.body.refreshToken);
  res.send({ ...tokens });
});

const forgotPassword = catchAsync(async (req, res) => {
  const resetPasswordToken = await tokenService.generateResetPasswordToken(req.body.email);
  await emailService.sendResetPasswordEmail(req.body.email, resetPasswordToken);
  res.status(httpStatus.NO_CONTENT).send();
});

const resetPassword = catchAsync(async (req, res) => {
  await authService.resetPassword(req.query.token, req.body.password);
  res.status(httpStatus.NO_CONTENT).send();
});

const sendVerificationEmail = catchAsync(async (req, res) => {
  const { email } = pick(req.query, ['email']);
  const user = await userService.getUserByEmail(email);
  const verifyEmailToken = await tokenService.generateVerifyEmailToken(user);
  await emailService.sendVerificationEmail(email, verifyEmailToken);
  res.status(httpStatus.NO_CONTENT).send();
});

const verifyEmail = catchAsync(async (req, res) => {
  await authService.verifyEmail(req.query.token);
  res.status(httpStatus.NO_CONTENT).send();
});

const loginWithMicrosoft = catchAsync(async (req, res) => {
  const role = await roleService.getRolesByName(req.body.role);
  const user = await authService.signInWithMicrosoft({ ...req.body, roleId: role.id });

  // Generate tokens
  const tokens = await tokenService.generateAuthTokens(user.dataValues.id);

  // Modify user object to bring permissions to the front
  const data = extractPermissions(user);

  // encrypt user data
  const encryptedUser = await userService.encryptData({ ...user.dataValues, ...data });

  res.send({ encryptedUser, tokens });
});

module.exports = {
  register,
  login,
  logout,
  refreshTokens,
  forgotPassword,
  resetPassword,
  sendVerificationEmail,
  verifyEmail,
  loginWithMicrosoft,
};
