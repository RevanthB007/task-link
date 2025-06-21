import io from "socket.io-client";
import { create } from "zustand";
import { useAuth } from "./auth.store.jsx";

const BASE_URL = "http://localhost:3000";
export const useSocketStore = create((set, get) => ({
    socket:null,

    connectSocket:(currentUser)=>{
        
        if(!currentUser || get()?.socket?.connected) return;
        const socket = io(BASE_URL,{query:{userId:currentUser.uid}});
        // socket.connect()
        set({socket});
    } ,
    disconnectSocket:()=>{
        if(get()?.socket?.connected) get()?.socket?.disconnect();
        set({socket:null});
    }
}));