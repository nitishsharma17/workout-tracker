const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Workout = sequelize.define('Workout', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'user_id'
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Please add a workout title' }
    }
  },
  type: {
    type: DataTypes.ENUM('strength', 'cardio', 'hiit', 'flexibility'),
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Please add a workout type' }
    }
  },
  duration: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Please add workout duration in minutes' }
    }
  },
  calories: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  difficulty: {
    type: DataTypes.ENUM('beginner', 'intermediate', 'advanced'),
    defaultValue: 'intermediate'
  }
}, {
  timestamps: true,
  underscored: true
});

module.exports = Workout;
