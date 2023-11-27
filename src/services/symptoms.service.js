const { buildWhereCondition } = require('../utils/FilterSort');
const { Symptoms } = require('../models/symptoms.model');

/**
 * @typedef {Object} SymptomObject
 * @property {string} title
 * @property {string} keyword
 * @property {string} name
 * @property {string} description
 */

/**
 * Create a symptom
 * @param {SymptomObject} symptomBody
 * @returns {Promise<SymptomObject>}
 */
const createSymptom = async (symptomBody) => {
  // check if symptom already exists
  const symptom = await Symptoms.findOne({
    where: {
      title: symptomBody.title,
    },
  });

  if (symptom) {
    return null;
  }

  const createdSymptom = await Symptoms.create(symptomBody);
  return createdSymptom;
};

/**
 * Get all symptoms
 * @param {Object} filter
 * @param {string} filter.title
 * @param {string} filter.keyword
 * @returns {Promise<QueryResult>}
 */
const getAllSymptoms = async (filter) => {
  const whereCondition = buildWhereCondition(filter);
  const symptoms = await Symptoms.findAll({
    where: whereCondition,
  });
  return symptoms;
};

module.exports = {
  createSymptom,
  getAllSymptoms,
};
