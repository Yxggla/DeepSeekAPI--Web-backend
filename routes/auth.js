const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models').User;

const router = express.Router();
const secretKey = process.env.SECRET_KEY ;
console.log(secretKey);

// 注册路由
router.post('/register', async (req, res) => {
    const { username, tel, password } = req.body;

    try {
        const user = await User.findOne({ where: { tel } });
        if (user) {
            return res.status(400).send('电话号码已存在');
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await User.create({ username:username, password: hashedPassword, tel:tel });
        res.send('注册成功');
    } catch (error) {
        res.status(500).send('注册失败');
    }
});

// 登录路由
router.post('/login', async (req, res) => {
    const { tel, password } = req.body;

    if (!tel || !password) {
        return res.status(400).send('电话号码和密码都是必填项');
    }

    try {
        const user = await User.findOne({ where: { tel } });
        if (!user) {
            return res.status(400).send('用户不存在');
        }
        if (!(await bcrypt.compare(password, user.password))) {
            return res.status(400).send('电话号码或密码错误');
        }

        // 生成JWT令牌
        const token = jwt.sign({ tel: user.tel, username: user.username }, secretKey, { expiresIn: '1h' });
        await User.update({ token }, { where: { tel: user.tel } });

        res.json({ message: '登录成功', token: token, username: user.username, tel: user.tel });
    } catch (error) {
        res.status(500).send('登录失败');
    }
});

module.exports = router;
