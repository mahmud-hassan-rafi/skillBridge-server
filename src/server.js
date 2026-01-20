// Vercel নিজেই port handle করে
// Serverless function এ নিজে server চালানো নিষেধ

import app from "./app.js";
import http from "http";

const server = http.createServer(app);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// I just change the start script command. wish, it's will work :<)
