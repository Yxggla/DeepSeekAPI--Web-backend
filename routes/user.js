const express = require('express');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const secretKey = process.env.SECRET_KEY ;
const router = express.Router();

router.get('/user', async (req, res) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).send('未提供令牌');
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, secretKey);
        console.log('Decoded token:', decoded); // 添加日志

        if (!decoded) {
            return res.status(404).send('用户不存在');
        }

        res.json({ username: decoded.username, tel: decoded.tel });
    } catch (error) {
        console.error(error);
        res.status(500).send('获取用户信息失败');
    }
});

module.exports = router;
