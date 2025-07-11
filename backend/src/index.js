import express from "express";
import dotenv from "dotenv";
import todoRoutes from "./routes/todo.route.js";
import { connectToDatabase } from "./db/db.js";
import cors from "cors";
import {app,server} from "./lib/socket.js"
import aiRoutes from "./routes/ai.route.js";
import path from "path";

dotenv.config()

const __dirname = path.resolve();

const port = process.env.PORT;
app.use(express.json())
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));


app.use("/api/todos",todoRoutes);
app.use("/api/ai",aiRoutes);

if(process.env.NODE_ENV === "production"){
  app.use(express.static(path.join(__dirname, "../frontend/dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../frontend", "dist", "index.html"));
  });
}

server.listen(port, () => {
  connectToDatabase();
  console.log(`Example app listening on port ${port}`)
})
