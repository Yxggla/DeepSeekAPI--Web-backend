const express = require("express");
const jwt = require("jsonwebtoken");
const { Chat, User } = require("../models"); // 确保路径正确
const secretKey = process.env.SECRET_KEY;
const router = express.Router();

// 获取用户信息
router.get("/user", async (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).send("未提供令牌");
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, secretKey);
    console.log("Decoded token:", decoded); // 添加日志

    if (!decoded || !decoded.tel) {
      return res.status(404).send("用户不存在1");
    }
    const user = await User.findOne({ where: { tel: decoded.tel } });
    if (!user) {
      return res.status(404).send("用户不存在2");
    }
    res.json({
      username: decoded.username,
      tel: decoded.tel,
      userId: decoded.id,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("获取用户信息失败");
  }
});

// 点击标题获取对应数据
router.get("/chats", async (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).send("未提供令牌");
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, secretKey);
    const user = await User.findOne({ where: { tel: decoded.tel } });

    if (!user) {
      return res.status(404).send("用户不存在");
    }
    const { title } = req.query;

    if (!title) {
      return res.status(400).send("标题是必填项");
    }

    const chats = await Chat.findAll({
      where: {
        userId: user.id,
        title: title,
      },
      attributes: ["message", "response"], // 只选择 message 和 response 字段
    });

    res.json(chats);
  } catch (error) {
    res.status(500).send("获取标题对应的聊天记录失败");
  }
});

// 每次的对应一组的数据存储
router.post("/saveChats", async (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).send("未提供令牌");
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, secretKey);
    const user = await User.findOne({ where: { tel: decoded.tel } });

    if (!user) {
      return res.status(404).send("用户不存在");
    }

    const { title, message, response } = req.body;
    const chat = await Chat.create({
      userId: user.id,
      title,
      message,
      response,
    });
    res.status(201).json(chat);
  } catch (error) {
    res.status(500).send("创建聊天记录失败");
  }
});

// 获取标题们
router.get("/titles", async (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).send("未提供令牌");
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, secretKey);
    const user = await User.findOne({ where: { tel: decoded.tel } });

    if (!user) {
      return res.status(404).send("用户不存在");
    }

    const titles = await Chat.findAll({
      where: { userId: user.id },
      attributes: ["title"], // 只选择 title 字段
    });
    res.json(titles);
  } catch (error) {
    res.status(500).send("获取标题们失败");
  }
});
module.exports = router;
