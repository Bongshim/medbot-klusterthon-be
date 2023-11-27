const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const SymptomCause = sequelize.define('symptomCause', {
  overview: {
    type: DataTypes.STRING,
  },
  risks: {
    type: DataTypes.JSON,
  },
  symptoms: {
    type: DataTypes.JSON,
  },
  diagnosis: {
    type: DataTypes.JSON,
  },
  treatment: {
    type: DataTypes.JSON,
  },
  prevention: {
    type: DataTypes.JSON,
  },
});

module.exports = { SymptomCause };
