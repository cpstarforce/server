import { exec } from 'child_process';
import { fileURLToPath } from 'url';
import express from 'express';
import path from 'path';
import routes from './api/main.js';
import { Server } from 'http';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const port = process.env.PORT || 3000;

const server = {
  status: "Starting"
}

app.use(express.static(path.join(__dirname, 'public')));
app.use('/api', routes);
app.listen(port, (err) => {
  if (err) {
    console.error(`[API] Failed to start server: ${err.message}`);
    process.exit(1);
  }
  console.log(`[API] Express server is running on port ${port}.`);
});

server.status = "Online";

exec('python ./discord_keep_alive/main.py', (error, stdout, stderr) => {
  if (error) {
    console.error(`[Main] Error executing Python script: ${error.message}`)
    return;
  }
  if (stderr) {
    console.error(`[DiscordKeepAlive] ${stderr}`);
    return;
  }
  console.log(`[DiscordKeepAlive] ${stdout}`);
});

export default server;