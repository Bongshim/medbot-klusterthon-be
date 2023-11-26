const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const { HealthBackground } = require('../models/healthBackground.model');

/**
 * @typedef {Object} HealthBackground
 * @property {string} id
 * @property {boolean} hasHighBloodPressure
 * @property {boolean} hasDiabetes
 * @property {boolean} isSmoker
 */

/**
 * Instantiate a new healthBackground
 * @param {number} userId
 * @returns {Promise<HealthBackground>}
 */
const createHealthBackground = async (userId) => {
  const healthBackground = await HealthBackground.create({ userId });
  return healthBackground;
};

/**
 * Get healthBackground by userId
 * @param {string} userId
 * @returns {Promise<HealthBackground>}
 */
const getHealthBackgroundByUserId = async (userId) => {
  const healthBackground = await HealthBackground.findOne({ where: { userId } });
  return healthBackground;
};

/**
 * Update healthBackground by userId
 * @param {string} userId
 * @param {HealthBackground} updateBody
 */
const updateHealthBackgroundByUserId = async (userId, updateBody) => {
  const healthBackground = await getHealthBackgroundByUserId(userId);
  if (!healthBackground) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Health Background not found');
  }

  Object.assign(healthBackground, updateBody);
  await healthBackground.save();
  return healthBackground;
};

module.exports = {
  createHealthBackground,
  getHealthBackgroundByUserId,
  updateHealthBackgroundByUserId,
};
