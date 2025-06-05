const express = require('express');
const router = express.Router();

router.get('/ping', (req, res) => {
  const start = Date.now();
  setImmediate(() => {
    const ping = Date.now() - start;
    res.json({
      message: 'Pong!',
      ping: ping
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