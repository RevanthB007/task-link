import express from "express";
import dotenv from "dotenv";
import todoRoutes from "./routes/todo.route.js";
import { connectToDatabase } from "./db/db.js";
import cors from "cors";
import {app,server} from "./lib/socket.js"
import aiRoutes from "./routes/ai.route.js";
import path from "path";

dotenv.config()
const port = process.env.PORT || 10000;
const __dirname = path.resolve();
app.use(express.json())
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

app.use("/api/todos",todoRoutes);
app.use("/api/ai",aiRoutes);


if(process.env.NODE_ENV === "production"){
  app.use(express.static(path.join(__dirname,"../frontend/dist")));
  app.get("*",(req,res) =>{
    res.sendFile(path.join(__dirname,"../frontend","dist","index.html"));
  });
}

server.keepAliveTimeout = 120000;
server.headersTimeout = 120000;

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});

process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
  process.exit(1);
});

process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

server.listen(port,"0.0.0.0", () => {
  connectToDatabase();
  console.log(`Example app listening on port ${port}`)
})
