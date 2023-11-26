const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const HealthBackground = sequelize.define(
  'HealthBackground',
  {
    hasHighBloodPressure: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    hasDiabetes: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    isSmoker: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    paranoid: true,
  }
);

module.exports = {
  HealthBackground,
};
