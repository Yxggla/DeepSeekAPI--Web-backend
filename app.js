const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const sequelize = require('./config/database');
const authRouter = require('./routes/auth');
const userRouter = require('./routes/user');

const app = express();

app.use(cors());
// 中间件
app.use(bodyParser.json());

// 路由
app.use('/api', authRouter);
app.use('/api', userRouter);

// 同步数据库并启动服务器
sequelize.sync().then(() => {
  console.log('Database synced');
}).catch(err => {
  console.error('Unable to sync database:', err);
});

module.exports = app;