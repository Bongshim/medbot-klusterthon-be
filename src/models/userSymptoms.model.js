const sequelizePaginate = require('sequelize-paginate');
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const UserSymptoms = sequelize.define(
  'userSymptoms',
  {
    title: {
      type: DataTypes.STRING,
    },
    summary: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    causes: {
      type: DataTypes.JSON,
      allowNull: false,
    },
    symptoms: {
      type: DataTypes.JSON,
      allowNull: false,
    },
  },
  {
    paranoid: true,
  }
);

sequelizePaginate.paginate(UserSymptoms);

module.exports = {
  UserSymptoms,
};
