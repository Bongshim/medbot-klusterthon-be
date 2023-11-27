const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const { buildWhereCondition } = require('../utils/FilterSort');
const { UserSymptoms } = require('../models/userSymptoms.model');
const { Symptoms } = require('../models/symptoms.model');

/**
 * @typedef {Object} UserSymptomsObject
 * @property {string} userId
 * @property {string} summary
 * @property {Array}  causes
 * @property {Array}  symptoms
 * @property {string} symptomId
 */

/**
 *  Create user symptoms
 * @param {UserSymptomsObject} userSymptomsBody // extends UserSymptomsObject
 * @returns {Promise<UserSymptomsObject>}
 */
const createUserSymptoms = async (userSymptomsBody, userId) => {
  // check if symptom already exists
  const symptom = await Symptoms.findOne({
    where: {
      title: userSymptomsBody.symptom,
    },
  });

  const userSymptoms = await UserSymptoms.create({
    ...userSymptomsBody,
    userId,
    ...(symptom && { symptomId: symptom.id }),
  });

  return userSymptoms;
};

/**
 * Get all user symptoms
 * @param {Object} filter
 * @param {string} filter.userId
 * @param {string} filter.symptomId
 * @returns {Promise<QueryResult>}
 */
const getAllUserSymptoms = async (filter) => {
  const whereCondition = buildWhereCondition(filter);
  const userSymptoms = await UserSymptoms.findAll(
    {
      where: whereCondition,
    },
    {
      include: [
        {
          model: Symptoms,
        },
      ],
    }
  );
  return userSymptoms;
};

/**
 * Get user symptoms by id
 * @param {string} id
 * @returns {Promise<UserSymptomsObject>}
 */
const getUserSymptomsById = async (id) => {
  const detail = UserSymptoms.findByPk(id, {
    include: [
      {
        model: Symptoms,
      },
    ],
  });

  if (!detail) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User symptoms not found');
  }

  return detail;
};

module.exports = {
  createUserSymptoms,
  getAllUserSymptoms,
  getUserSymptomsById,
};
