const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { userService, authService, healthBackgroundService } = require('../services');
const { extractPermissions } = require('../services/auth.service');

const createUser = catchAsync(async (req, res) => {
  const user = await userService.createUser(req.body, req.user.id);

  // Instantiate a new healthBackground
  await healthBackgroundService.createHealthBackground(user.id);

  res.status(httpStatus.CREATED).send({
    status: true,
    message: 'User created successfully',
    data: user,
  });
});

const getUsers = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['firstName', 'roleId', 'isVerified', 'createdBy']);
  const options = pick(req.query, ['paginate', 'page']);
  const result = await userService.queryUsers(filter, options);
  res.send({
    status: true,
    message: 'Users fetched successfully',
    data: result,
  });
});

const getUser = catchAsync(async (req, res) => {
  const user = await userService.getUserById(req.params.userId);

  res.send({
    status: true,
    message: 'User fetched successfully',
    data: user,
  });
});

const updateUser = catchAsync(async (req, res) => {
  const user = await userService.updateUserById(req.params.userId, req.body);

  // Modify user object to bring permissions to the front
  const data = extractPermissions(user);
  // encrypt user data
  const encryptedUser = await userService.encryptData({ ...user.dataValues, ...data });

  res.send({
    status: 'success',
    message: 'User updated successfully',
    data: encryptedUser,
  });
});

const deleteUser = catchAsync(async (req, res) => {
  await userService.deleteUserById(req.params.userId);
  res.status(httpStatus.NO_CONTENT).send();
});

const validateEmail = catchAsync(async (req, res) => {
  const obj = pick(req.query, ['email']);
  const result = await userService.isEmailTaken(obj.email);
  if (result) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Email is taken');
  }
  res.json({
    success: true,
    message: 'Email is not taken',
  });
});

const validateUsername = catchAsync(async (req, res) => {
  const obj = pick(req.query, ['username']);
  const result = await userService.isUsernameTaken(obj.username);
  if (result) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Username is taken');
  }
  res.json({
    success: true,
    message: 'Username is not taken',
  });
});

const updateUserPassword = catchAsync(async (req, res) => {
  const password = await userService.updateUserPassword(req.user.dataValues.id, req.body);
  res.send(password);
});

const getMe = catchAsync(async (req, res) => {
  const user = await userService.getUserById(req.user.dataValues.id);

  delete user.dataValues.password;
  // transform permissions
  const userPermissions = await authService.extractPermissions(user);
  res.send({
    status: 'success',
    data: { ...user.dataValues, ...userPermissions },
  });
});

module.exports = {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  validateEmail,
  validateUsername,
  updateUserPassword,
  getMe,
};
