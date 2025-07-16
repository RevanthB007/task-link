import { create } from "zustand";
import { axiosInstance } from "../api/axios.js";
import { auth } from "../firebase/firebase.js";
import toast from "react-hot-toast";
const getAuthToken = async () => {
  const user = auth.currentUser;

  if (user) {
    return await user.getIdToken();
  }
  return null;
};

const getAuthHeaders = async () => {
  const token = await getAuthToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const useAIStore = create((set, get) => ({
  score: null,
  feedback: null,
  date: null,
  isLoading: false,
  userReview: async () => {
    try {
      set({ isLoading: true });
      const headers = await getAuthHeaders();
      console.log(headers);
      const response = await axiosInstance.get("/ai/userReview", { headers });
      console.log(response.data);
      set({
        score: response.data.score,
        feedback: response.data.feedback,
        isLoading: false,
      });
    } catch (error) {
      console.log(error);
    }
  },

  generateSchedule: async (globalSettings, date) => {
    set({ isLoading: true });
    try {
      const headers = await getAuthHeaders();
      console.log(headers);
      const response = await axiosInstance.get("ai/generate", {
        headers,
        params: {
          date: date,
          globalSettings,
        },
      });
      console.log(response.data, "generated schedule");
      set({ isLoading: false });
    } catch (error) {
      console.log(error);
      set({ isLoading: false });
    }
  },

  saveSettings: async (settings) => {
    set({ isLoading: true });
    console.log("Sending settings:", settings);

    const headers = await getAuthHeaders();
    try {
      const response = await axiosInstance.post("/ai/saveSettings", settings, {
        headers,
      });
      console.log("Success:", response.data);
      set({ settings: response.data, isLoading: false });
    } catch (error) {
      console.error("Error saving settings:", error);
      console.error("Response data:", error.response?.data);
      console.error("Response status:", error.response?.status);

      toast.error(error.response?.data?.message || "Failed to save settings");
      set({ isLoading: false });
    }
  },
}));

export default useAIStore;
