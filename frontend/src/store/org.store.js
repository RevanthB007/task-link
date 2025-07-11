import { create } from "zustand";
import { axiosInstance } from "../api/axios";
import { getAuth } from "firebase/auth";
import { auth } from "../firebase/firebase.js";

const getAuthToken = async () => {
  const user = auth.currentUser;
  console.log("Current user in getAuthToken:", user?.email);

  if (user) {
    try {
      const token = await user.getIdToken(true);
      console.log("Token obtained:", token ? "YES" : "NO");
      console.log("Token preview:", token?.substring(0, 50) + "...");
      return token;
    } catch (error) {
      console.error("Error getting token:", error);
      return null;
    }
  }
  console.log("No current user found");
  return null;
};

const getAuthHeaders = async () => {
  const token = await getAuthToken();
  const headers = token ? { Authorization: `Bearer ${token}` } : {};
  console.log("Headers being sent:", headers);
  return headers;
};

export const useOrgStore = create((set, get) => ({
  orgs: [],
  isLoading: false,
  setOrg: (org) => set({ org: org }),

  // fetchOrgs: async (email) => {
  //   set({ isLoading: true });
  //   const headers = await getAuthHeaders();
  //   try {
  //     const response = await axiosInstance.get("/todos/org/fetch/", {
  //       headers
  //     });

  //     set({ orgs: response.data, isLoading: false });
  //   } catch (error) {
  //     console.log("error fetching orgs");
  //     console.log(error);
  //     set({ isLoading: false });
  //   }
  // },

  fetchOrgs: async (email) => {
    set({ isLoading: true });
    const headers = await getAuthHeaders();

    console.log("About to make request with:");
    console.log("- Email:", email);
    console.log("- Headers:", headers);
    console.log("- Auth current user:", auth.currentUser?.email);

    try {
      const response = await axiosInstance.get("/todos/org/fetch", {
        headers,
      });
      set({ orgs: response.data, isLoading: false });
    } catch (error) {
      console.log("Request failed:", error.response?.data);
      console.log(error);
      set({ isLoading: false });
    }
  },

  createOrg: async (org) => {
    set({ isLoading: true });
    const headers = await getAuthHeaders();

    try {
      const response = await axiosInstance.post("/todos/org/create/", org, {
        headers,
      });
      console.log(response.data);
      get().fetchOrgs();
    } catch (error) {
      console.log("error creating org");
    }
  },

  addMemberToOrg: async (orgId, memberData) => {
    set({ isLoading: true });
    const headers = await getAuthHeaders();
    try {
      const response = await axiosInstance.put(
        "/todos/org/add/" + orgId,
        memberData,
        { headers }
      );
      console.log(response.data);
    } catch (error) {
      console.log("error adding member to org");
      console.log(error);
    }
  },
}));
