const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Review = sequelize.define('Review', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [2, 50],
      is: /^[a-zA-Z\s]+$/
    }
  },
  role: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [2, 30]
    }
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      len: [10, 500]
    }
  },
  rating: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 5,
    validate: {
      min: 1,
      max: 5
    }
  },
  avatar: {
    type: DataTypes.STRING,
    allowNull: false
  }
});

module.exports = { Review };