const { exec } = require('child_process');
const express = require('express');
const path = require('path');
const routes = require('./api/main');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));
app.use('/api', routes);
app.listen(port, (err) => {
  if (err) {
    console.error(`[API] Failed to start server: ${err.message}`);
    process.exit(1);
  }
  console.log(`[API] Express server is running on port ${port}.`);
});

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