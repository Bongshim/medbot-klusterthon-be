const sequelizePaginate = require('sequelize-paginate');
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Media = sequelize.define(
  'media',
  {
    url: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    publicId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    type: {
      type: DataTypes.STRING,
    },
    title: {
      type: DataTypes.STRING,
    },
  },
  {
    paranoid: true,
  }
);

sequelizePaginate.paginate(Media);

module.exports = { Media };
