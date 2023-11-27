const validator = require('validator');
const sequelizePaginate = require('sequelize-paginate');
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const User = sequelize.define(
  'user',
  {
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    username: {
      type: DataTypes.STRING,
      unique: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error('Invalid email');
        }
      },
    },
    gender: {
      type: DataTypes.ENUM('male', 'female'),
    },
    dateOfBirth: {
      type: DataTypes.DATE,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      minlength: 8,
      validate(value) {
        if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
          throw new Error('Password must contain at least one letter and one number');
        }
      },
    },
    profileImage: {
      type: DataTypes.STRING,
    },
    isVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    userType: {
      type: DataTypes.STRING,
    },
    phoneNumber: {
      type: DataTypes.STRING,
    },
    lastLogin: {
      type: DataTypes.DATE,
    },
    bodyHeight: {
      type: DataTypes.FLOAT,
    },
    bodyWeight: {
      type: DataTypes.FLOAT,
    },
  },
  {
    paranoid: true,
  }
);

sequelizePaginate.paginate(User);

module.exports = { User };
