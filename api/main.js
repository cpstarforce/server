import { fileURLToPath } from 'url';
import server from '../index.js';
import express from 'express';
import fs from 'fs';
import path from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const router = express.Router();
const rawKeys = fs.readFileSync(path.join("/etc/secrets", 'api-keys.json'), 'utf-8');
const keys = JSON.parse(rawKeys);

function verify(key) {
  return keys.includes(key);
}

function logUsage(key, endpoint) {
  const fileName = path.join(__dirname, 'usage.log');
  const entry = `[${new Date().toISOString()}] [${key}] ${endpoint}\n`;
  fs.appendFile(fileName, entry, (err) => {
    if (err) console.error(`Error logging endpoint usage:`, err);
  });
}

router.use(async (req, res, next) => {
  const apiKey = req.query.key;
  if (!apiKey) {
    return res.status(403).json({
      message: "Missing API key"
    });
  }
  if (!verify(apiKey)) {
    return res.status(403).json({
      message: "Invalid API key"
    });
  }
  logUsage(apiKey, req.originalUrl);
  next();
});

console.log("[API] Routers are being created.");

router.get('/ping', (req, res) => {
  const start = req.header("start") || req.query.start || Date.now();
  setImmediate(() => {
    const ping = Date.now() - start;
    res.status(200).json({
      message: 'Pong!',
      ping: ping,
      start: start
    });
  });
});

router.get('/status', (req, res) => {
  res.status(200).json({
    status: server.status,
    memoryUsage: (process.memoryUsage().heapUsed / 1000 / 1000).toFixed(2) + ' MB',
    cpuUsage: (process.cpuUsage().system / 1000).toFixed(2) + '%',
    uptime: (process.uptime() * 1000).toFixed() + ' ms',
  });
});

console.log("[API] Routers are set up.");

export default router;