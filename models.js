const { DataTypes } = require('sequelize');
const sequelize = require('./config/database');

// 用户模型
const User = sequelize.define('User', {
    tel: { type: DataTypes.STRING, allowNull: false, unique: true },
    username: { type: DataTypes.STRING, allowNull: false },
    password: { type: DataTypes.STRING, allowNull: false },
    token: { type: DataTypes.STRING }
});


module.exports = { User };
