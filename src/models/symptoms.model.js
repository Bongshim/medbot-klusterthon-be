const sequelizePaginate = require('sequelize-paginate');
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Symptoms = sequelize.define(
  'symptoms',
  {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    keyword: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
    },
  },
  {
    paranoid: true,
  }
);

sequelizePaginate.paginate(Symptoms);

module.exports = {
  Symptoms,
};
