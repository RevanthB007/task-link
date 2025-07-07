import express from "express";
import dotenv from "dotenv";
import todoRoutes from "./routes/todo.route.js";
import { connectToDatabase } from "./db/db.js";
import cors from "cors";
import {app,server} from "./lib/socket.js"
import aiRoutes from "./routes/ai.route.js";

dotenv.config()
const port = process.env.PORT;
app.use(express.json())
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));


app.use("/api/todos",todoRoutes);
app.use("/api/ai",aiRoutes);



server.listen(port, () => {
  connectToDatabase();
  console.log(`Example app listening on port ${port}`)
})
