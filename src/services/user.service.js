const httpStatus = require('http-status');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');
const ApiError = require('../utils/ApiError');
const { User } = require('../models/user.model');
const { Role } = require('../models/role.model');
const { Permission } = require('../models/permission.model');
const logger = require('../config/logger');
const { sendEmail } = require('./email.service');
const { getMessageTemplateByTitle, convertTemplateToMessage } = require('./message_template.service');
const config = require('../config/config');
const { deleteUploadedFile } = require('./upload.service');
const { sequelize } = require('../config/database');

/**
 * @typedef {Object} UserObject
 * @property {string} firstName
 * @property {string} lastName
 * @property {string} username
 * @property {string} email
 * @property {string} password
 * @property {string} profileImage
 * @property {boolean} isVerified
 * @property {string} userType
 * @property {string} phoneNumber
 * @property {Date} lastLogin
 */

/**
 * Check if email is taken
 * @param {string} email - The user's email
 * @returns {Promise<boolean>}
 */
const isEmailTaken = async function (email) {
  const user = await User.findOne({ where: { email } });
  return !!user;
};

/**
 * Check if username is taken
 * @param {string} username
 * @returns {Promise<boolean>}
 */
const isUsernameTaken = async function (username, userId = null) {
  const user = await User.findOne({
    where: {
      username,
      // if userId is passed in, then check for username except the user with userId
      ...(userId && { id: { [Op.ne]: userId } }),
    },
  });
  return !!user;
};

/**
 * Check if password matches the user's password
 * @param {string} password
 * @returns {Promise<boolean>}
 */
const isPasswordMatch = async function (password, user) {
  const comp = bcrypt.compareSync(password, user.password);
  logger.info(comp);
  return comp;
};

/**
 * Get user by id
 * @param {ObjectId} id
 * @returns {Promise<User>}
 */
const getUserById = async (id) => {
  const user = await User.findByPk(id, {
    include: [
      {
        association: 'userRole',
        attributes: ['name'],
        include: [
          {
            model: Permission,
            attributes: { exclude: ['createdAt', 'updatedAt'] },
            through: { attributes: [] },
          },
        ],
      },
    ],
  });
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  return user;
};

const sendUserWelcomeEmail = async (user) => {
  // get user email and first name
  const { email, firstName } = user.dataValues;
  // get message template
  const {
    dataValues: { emailSubject, emailBody },
  } = await getMessageTemplateByTitle('Welcome_Email');

  const text = await convertTemplateToMessage(emailBody, {
    firstName,
  });

  await sendEmail(email, emailSubject, text);
};

/**
 * Create a user
 * @param {Object} userBody
 * @param {string} userBody.email
 * @param {string} userBody.password
 * @param {string} userBody.firstName
 * @param {string} userBody.lastName
 * @param {string} userBody.username
 * @param {string} userBody.userType
 * @param {number} userBody.roleId
 * @param {number} createdBy
 * @returns {Promise<User>}
 */
const createUser = async (userBody, createdBy = null) => {
  try {
    // check if email is taken
    if (await isEmailTaken(userBody.email)) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
    }

    // check if username is taken
    if (!!userBody.username && (await isUsernameTaken(userBody.username))) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Username already taken');
    }

    // eslint-disable-next-line no-param-reassign
    if (userBody.password) {
      Object.assign(userBody, { password: bcrypt.hashSync(userBody.password, 8) });
    }

    const user = await User.create({ ...userBody, createdBy });

    // send welcome email
    await sendUserWelcomeEmail(user);

    // return user object with role
    return getUserById(user.id);
  } catch (error) {
    logger.info(error);
  }
};

/**
 * Query for users
 * @param {Object} filter - filter
 * @param {Object} options - Query options
 * @param {number} [filter.firstName] - filter firstname
 * @param {number} [filter.gradeId] - filter gradeId
 * @param {number} [current.paginate] - Maximum number of results per page (default = 25)
 * @param {number} [current.page] - The row to start from (default = 0)
 * @returns {Promise<QueryResult>}
 */
const queryUsers = async (filter, current) => {
  // get user and include their roles
  const options = {
    attributes: { exclude: ['password'] },
    page: current.page, // Default 1
    paginate: current.paginate, // Default 25
    where: {
      firstName: {
        [Op.like]: `%${filter.firstName || ''}%`,
      },
      ...(filter.roleId && { roleId: filter.roleId }),
      ...(filter.createdBy && { createdBy: filter.createdBy }),
    },
    include: [
      {
        association: 'userRole',
        attributes: ['name'],
      },
    ],
  };
  const { docs, pages, total } = await User.paginate(options);

  return {
    users: docs,
    pagination: {
      ...options,
      total,
      pages,
    },
  };
};

/**
 * Get user by email
 * @param {string} email
 * @returns {Promise<User>}
 */
const getUserByEmail = async (email) => {
  return User.findOne({
    where: { email },
    include: [
      {
        association: 'userRole',
        attributes: ['name'],
        include: [
          {
            model: Permission,
            attributes: { exclude: ['createdAt', 'updatedAt'] },
            through: { attributes: [] },
          },
        ],
      },
    ],
  });
};

/**
 * Get user by email or username
 * @param {Object} emailOrUsername
 * @param {string} emailOrUsername.email - optional
 * @param {string} emailOrUsername.username - optional
 * @returns {Promise<User>}
 */
const getUserByEmailOrUsername = async (emailOrUsername) => {
  return User.findOne({
    where: {
      ...emailOrUsername,
    },
    include: [
      {
        association: 'userRole',
        attributes: ['name'],
        include: [
          {
            model: Permission,
            attributes: { exclude: ['createdAt', 'updatedAt'] },
            through: { attributes: [] },
          },
        ],
      },
    ],
  });
};

/**
 * Update user by id
 * @param {ObjectId} userId
 * @param {Object} updateBody
 * @param {Object} currentUser
 * @returns {Promise<User>}
 */
const updateUserById = async (userId, updateBody, currentUser) => {
  if (currentUser && userId !== currentUser.id && currentUser.userType !== 'admin') {
    throw new ApiError(httpStatus.FORBIDDEN, 'Cannot update other users');
  }
  const { roleId, ...userProfile } = updateBody;
  const user = await getUserById(userId);

  if (userProfile.email && userProfile.email !== user.email && (await isEmailTaken(userProfile.email, userId))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }

  // check if username is taken
  if (
    userProfile.username &&
    userProfile.username !== user.username &&
    (await isUsernameTaken(userProfile.username, userId))
  ) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Username already taken');
  }

  // if password is updated, hash it
  if (userProfile.password && userProfile.password !== user.password) {
    // eslint-disable-next-line no-param-reassign
    userProfile.password = bcrypt.hashSync(userProfile.password, 8);
  }

  // if profile image is updated, delete the old one
  if (userProfile.profileImage && userProfile.profileImage !== user.profileImage) {
    await deleteUploadedFile(user.profileImage);
  }

  // Use a transaction to ensure atomicity
  const transaction = await sequelize.transaction();
  try {
    // If role is updated, get the role
    if (roleId) {
      const userRole = await Role.findByPk(roleId, { transaction });

      if (!userRole) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid role');
      }

      // Update user role
      await user.setUserRole(userRole, { transaction });
    }

    Object.assign(user, { ...userProfile });

    await user.save({ transaction });

    // Commit the transaction
    await transaction.commit();

    return getUserById(userId);
  } catch (error) {
    // Rollback the transaction in case of errors
    await transaction.rollback();
    throw error;
  }
};

/**
 * Delete user by id
 * @param {ObjectId} userId
 * @returns {Promise<User>}
 */
const deleteUserById = async (userId) => {
  const user = await getUserById(userId);

  await user.destroy();
  return user;
};

/**
 * Update user password
 * @param {ObjectId} userId
 * @param {Object} updateBody
 * @param {String} updateBody.oldPassword
 * @param {String} updateBody.newPassword
 * @returns {Promise<User>}
 */
const updateUserPassword = async (userId, updateBody) => {
  const user = await getUserById(userId);

  if (!(await isPasswordMatch(updateBody.oldPassword, user.dataValues))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Incorrect password');
  }

  // eslint-disable-next-line no-param-reassign
  updateBody.password = bcrypt.hashSync(updateBody.newPassword, 8);

  Object.assign(user, updateBody);
  await user.save();

  return {
    success: true,
    message: 'Password updated successfully',
  };
};

/**
 * Encrypt user data
 * @param {Object} userData
 * @returns {Promise<string>}
 */
const encryptData = async (userData) => {
  const encryptedData = await jwt.sign(userData, config.jwt.secret);
  // append secret and delimiter
  return encryptedData + config.userSecret;
};

module.exports = {
  createUser,
  queryUsers,
  getUserById,
  getUserByEmail,
  updateUserById,
  deleteUserById,
  isPasswordMatch,
  getUserByEmailOrUsername,
  isEmailTaken,
  isUsernameTaken,
  encryptData,
  updateUserPassword,
  sendUserWelcomeEmail,
};
