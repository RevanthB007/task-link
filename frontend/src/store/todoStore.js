import { create } from "zustand";
import { axiosInstance } from "../api/axios";
import { auth } from "../firebase/firebase.js";
import { getAuth } from "firebase/auth";

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

const useStore = create((set, get) => ({
  todos: [],
  date: null,
  isLoading: false,
  error: null,
  assignedTasks:[],
  outsoucedTasks:[],

  setDate: (date) => set({ date }),

  fetchTodos: async (date) => {
    set({ isLoading: true });
    console.log("date", date);
    let startOfDay, endOfDay;
    if (date) {
      const inputDate = new Date(date);
      startOfDay = new Date(
        inputDate.getFullYear(),
        inputDate.getMonth(),
        inputDate.getDate()
      );
      endOfDay = new Date(
        inputDate.getFullYear(),
        inputDate.getMonth(),
        inputDate.getDate() + 1
      );
    } else {
      const today = new Date();
      startOfDay = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate()
      );
      endOfDay = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate() + 1
      );
    }
    try {
      const headers = await getAuthHeaders();
      const response = await axiosInstance.get("/todos/", {
        headers,
        params: {
          startOfDay: startOfDay.toISOString(),
          endOfDay: endOfDay.toISOString(),
        },
      });
      set({ todos: response.data, isLoading: false });
    } catch (error) {
      console.log(error);
      set({ error: error.message, isLoading: false });
    }
  },

  addTodo: async (todo) => {
    const { todos } = get();
    set({ isLoading: true });

    try {
      const headers = await getAuthHeaders();
      console.log("headers", headers);
      const response = await axiosInstance.post("/todos/add", todo, {
        headers,
      });
      set({ todos: [...todos, response.data], isLoading: false });
      await get().fetchTodos();
    } catch (error) {
      console.log("error adding todo");
      set({ isLoading: false });
    }
  },

  deleteTodo: async (id) => {
    set({ isLoading: true });
    try {
      const headers = await getAuthHeaders();
      const response = await axiosInstance.delete(`/todos/delete/${id}`, {
        headers,
      });
      await get().fetchTodos();
    } catch (error) {
      console.log("error deleting todo");
      set({ isLoading: false });
    }
  },

  editTodo: async (todo) => {
    set({ isLoading: true });
    const { todos } = get();
    try {
      const headers = await getAuthHeaders();
      const response = await axiosInstance.put(`/todos/edit/${todo.id}`, todo, {
        headers,
      });
      await get().fetchTodos();
    } catch (error) {
      console.log("error editing todo");
      set({ isLoading: false });
    }
  },

  markFinished: async (id) => {
    set({ isLoading: true });

    try {
      console.log("marking todo as finished",id);
      const headers = await getAuthHeaders();
      const response = await axiosInstance.put(
        `/todos/finish/${id}`,
        {},
        { headers }
      );
      console.log(response.data);
      console.log("marked as finished");
      await get().fetchTodos();
    } catch (error) {
      console.log("error editing todo");
      console.log(error);
      set({ isLoading: false });
    }
  },

  assignTask: async (todoId,assignedTo) => {
    set({ isLoading: true });
    try {
      const headers = await getAuthHeaders();
      const response = await axiosInstance.put("/todos/org/assign/" + todoId, {assignedTo}, {
        headers,
      });
      console.log("task assigned",response.data);
      set({ isLoading: false });
    } catch (error) {
       console.log("error assigning task");
       set({ isLoading: false });
    }
  },

  fetchAssignedTasks: async()=>{
    set({isLoading:true})
    try {
      const response = await axiosInstance.get("/todos/org/assigned");
      set({assignedTasks:response.data,isLoading:false})

    } catch (error) {
      console.log("error fetching assigned tasks");
      set({ isLoading: false });
    }
  },

  fetchOutsourcedTasks: async()=>{
    set({isLoading:true})
    try {
      const response = await axiosInstance.get("/todos/org/outsourced");
      set({outsoucedTasks:response.data,isLoading:false})
    } catch (error) {
      console.log("error fetching outsourced tasks");
      set({ isLoading: false });
      
    }
  },

createAndAssignTask: async(taskData)=>{
  set({isLoading:true})
  try {
    const headers = await getAuthHeaders();
    const response = await axiosInstance.post("/todos/org/createAssign/",taskData,{headers});
    console.log("task created",response.data);
    set({isLoading:false})

  } catch (error) {
    console.log("error creating and assigning task");
    set({ isLoading: false });
    
  }
},



}));



export default useStore;
