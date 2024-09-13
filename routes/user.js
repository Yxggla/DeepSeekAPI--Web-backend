const express = require("express");
const jwt = require("jsonwebtoken");
const { Conversation, Message, User } = require("../models"); // 确保路径正确
const secretKey = process.env.SECRET_KEY;
const router = express.Router();

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

    const conversations = await Conversation.findAll({
      where: { userId: user.id },
    });
    res.json({ username: decoded.username, tel: decoded.tel, conversations });
  } catch (error) {
    console.error(error);
    res.status(500).send("获取用户信息失败");
  }
});
// 创建新对话
router.post("/conversations", async (req, res) => {
  const { userId, title } = req.body;

  try {
    const conversation = await Conversation.create({ userId, title });
    res.status(201).json(conversation);
  } catch (error) {
    res.status(500).send("创建对话失败");
  }
});

// 获取对话的所有消息
router.get("/conversations/:id/messages", async (req, res) => {
  const { id } = req.params;

  try {
    const messages = await Message.findAll({ where: { conversationId: id } });
    res.json(messages);
  } catch (error) {
    res.status(500).send("获取消息失败");
  }
});

module.exports = router;
