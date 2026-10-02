const express = require('express');
const router = express.Router();
const { askChatbot } = require('../controllers/chatbotController');

// POST /api/chatbot/ask
router.post('/ask', askChatbot);

module.exports = router;
