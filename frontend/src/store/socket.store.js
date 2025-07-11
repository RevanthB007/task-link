import io from "socket.io-client";
import { create } from "zustand";

const BASE_URL = import.meta.env.MODE === 'development' ? 'http://localhost:3000' : '/'

export const useSocketStore = create((set, get) => ({
  socket: null,
  notifications: [],

  connectSocket: (currentUser) => {
    console.log("🔄 connectSocket called for user:", currentUser?.uid);

    if (!currentUser) {
      console.log("❌ No user provided");
      return;
    }

    const currentSocket = get()?.socket;

    if (currentSocket?.connected) {
      console.log("✅ Socket already connected:", currentSocket.id);
      return;
    }

    if (currentSocket) {
      console.log("🔌 Disconnecting existing socket:", currentSocket.id);
      currentSocket.disconnect();
    }

    console.log("🆕 Creating new socket connection...");
    const socket = io(BASE_URL, { query: { userId: currentUser.uid } });

    socket.on("connect", () => {
      console.log("✅ Socket connected:", socket.id);
    });

    socket.on("taskAssigned", (data) => {
      console.log(data.message);
      set({ notifications: [...get().notifications, data.message] });
    });

    set({ socket });
  },

  disconnectSocket: () => {
    if (get()?.socket?.connected) get()?.socket?.disconnect();
    set({ socket: null });
  },

  deleteNotification: (idx) => set((state) => ({ notifications: state.notifications.filter((_, i) => i !== idx) }))

}));
