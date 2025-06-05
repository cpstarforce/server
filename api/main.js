const express = require('express');
const fs = require('fs');
const router = express.Router();
const path = require('path');
const rawKeys = fs.readFileSync(path.join(__dirname, 'keys.json'), 'utf-8');
const keys = JSON.parse(rawKeys);

function verify(key) {
  return keys.includes(key);
}

router.use(async (req, res, next) => {
  const apiKey = req.query.key;
  if (!apiKey) {
    return res.status(403).json({
      message: "API key not provided in query"
    });
  }
  if (!verify(apiKey)) {
    return res.status(403).json({
      message: "Invalid API key"
    });
  }
  next();
});

router.get('/ping', (req, res) => {
  const start = req.header("start") || req.query.start || Date.now();
  setImmediate(() => {
    const ping = Date.now() - start;
    res.json({
      message: 'Pong!',
      ping: ping,
      start: start
    });
  });
});

router.get('/status', (req, res) => {
  res.json({
    status: 'Online',
    uptime: process.uptime()
  });
});

module.exports = router;