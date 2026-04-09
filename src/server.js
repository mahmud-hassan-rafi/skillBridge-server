// Vercel নিজেই port handle করে
// Serverless function এ নিজে server চালানো নিষেধ

import app from "./app.js";
import http from "http";
import { Server } from "socket.io";

const server = http.createServer(app);

// const io = new Server(server, {
//   cors: { origin: "https://localhost:5173" },
// });

// io.on("connection", (socket) => {
//   console.log("user connected");

//   socket.on("disconnect", () => {
//     console.log("User", socket.id, "is disconnected");
//   });
// });

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
