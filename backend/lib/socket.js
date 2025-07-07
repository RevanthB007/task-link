import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

const io = new Server(server,{
    cors: {
        origin: ["http://localhost:5173"],
    }
});

const userSocketMap = {};

export function getRecieverSocketId (userId){
    return userSocketMap[userId];
}

io.on("connection", (socket) => {
    console.log("a user connected", socket.id);
    const userId = socket.handshake.query.userId;
    if(userId) userSocketMap[userId] = socket.id;

    socket.on("disconnect", () => {
        console.log("a user disconnected", socket.id);
        delete userSocketMap[userId];
    });


});

export const emitToUser =(userIds,event,data)=>{
    userIds.forEach((userId) =>{
    const recieverSocketId = getRecieverSocketId(userId);
    if(recieverSocketId) {
        io.to(recieverSocketId).emit(event, data);
        }
    console.log("emitting to", recieverSocketId);
})
}

export {app,server,io};