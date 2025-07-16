import { create } from "zustand";
import { axiosInstance } from "../api/axios";
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

const useStore = create((set, get) => ({
  todos: [],
  date: null,
  isLoading: false,
  error: null,
  assignedTasks: [],
  outsoucedTasks: [],

  setDate: (date) => set({ date }),

  fetchTodos: async () => {
    set({ isLoading: true });

    let startOfDay, endOfDay;
    let localDate = get().date;
    if (localDate !== null) {
      startOfDay = new Date(
        localDate.getFullYear(),
        localDate.getMonth(),
        localDate.getDate()
      );
      endOfDay = new Date(
        localDate.getFullYear(),
        localDate.getMonth(),
        localDate.getDate() + 1
      );
    } else {
      localDate = new Date();
      startOfDay = new Date(
        localDate.getFullYear(),
        localDate.getMonth(),
        localDate.getDate()
      );
      endOfDay = new Date(
        localDate.getFullYear(),
        localDate.getMonth(),
        localDate.getDate() + 1
      );
    }
    console.log(startOfDay, endOfDay, "in frontend");
    console.log("date is", localDate);
    try {
      const headers = await getAuthHeaders();
      const response = await axiosInstance.get("/todos/", {
        headers,
        params: {
          startOfDay: startOfDay,
          endOfDay: endOfDay,
        },
      });
      set({ todos: response.data, isLoading: false });
    } catch (error) {
      console.log(error);
      toast.error("Failed to load todos");
      set({ error: error.message, isLoading: false });
    }
  },

  addTodo: async (todo) => {
    const { todos } = get();
    set({ isLoading: true });

    try {
      const headers = await getAuthHeaders();
      console.log("todo", todo);
      const localDate = get().date;
      if (localDate !== null) {
        todo.date = new Date(
          localDate.getFullYear(),
          localDate.getMonth(),
          localDate.getDate()
        );
      } else {
        todo.date = null;
      }
      console.log(todo.date, "date in frontend");
      if (todo.priority === "") {
        todo.priority = "low";
      }
      const response = await axiosInstance.post("/todos/add", todo, {
        headers,
      });
      set({ todos: [...todos, response.data], isLoading: false });
      toast.success("Todo added successfully");
      await get().fetchTodos();
    } catch (error) {
      console.log("error adding todo");
      toast.error("Failed to add todo");
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
      toast.success("Todo deleted successfully");
      await get().fetchTodos();
    } catch (error) {
      console.log("error deleting todo");
      toast.error("Failed to delete todo");
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
      toast.success("Todo updated successfully");
      await get().fetchTodos();
    } catch (error) {
      console.log("error editing todo");
      toast.error("Failed to update todo");
      set({ isLoading: false });
    }
  },

  markFinished: async (id) => {
    set({ isLoading: true });

    try {
      console.log("marking todo as finished", id);
      const headers = await getAuthHeaders();
      const response = await axiosInstance.put(
        `/todos/finish/${id}`,
        {},
        { headers }
      );
      console.log(response.data);
      if (response.data.todo.isCompleted) {
        console.log("marked as finished");
        toast.success("Todo marked as completed");
      } else {
        console.log("marked as not finished");
        toast.success("Todo marked as not completed");
      }
      await get().fetchTodos();
    } catch (error) {
      console.log("error editing todo");
      console.log(error);
      toast.error("Failed to mark todo ");
      set({ isLoading: false });
    }
  },

  assignTask: async (todoId, assignedTo) => {
    set({ isLoading: true });
    try {
      const headers = await getAuthHeaders();
      const response = await axiosInstance.put(
        "/todos/org/assign/" + todoId,
        { assignedTo },
        {
          headers,
        }
      );
      console.log("task assigned", response.data);
      toast.success("Task assigned successfully");
      set({ isLoading: false });
    } catch (error) {
      console.log("error assigning task");
      toast.error("Failed to assign task");
      set({ isLoading: false });
    }
  },

  fetchAssignedTasks: async () => {
    set({ isLoading: true });
    try {
      const response = await axiosInstance.get("/todos/org/assigned");
      set({ assignedTasks: response.data, isLoading: false });
    } catch (error) {
      console.log("error fetching assigned tasks");
      toast.error("Failed to load assigned tasks");
      set({ isLoading: false });
    }
  },

  fetchOutsourcedTasks: async () => {
    set({ isLoading: true });
    try {
      const response = await axiosInstance.get("/todos/org/outsourced");
      set({ outsoucedTasks: response.data, isLoading: false });
    } catch (error) {
      console.log("error fetching outsourced tasks");
      toast.error("Failed to load outsourced tasks");
      set({ isLoading: false });
    }
  },

  createAndAssignTask: async (taskData) => {
    set({ isLoading: true });
    try {
      const headers = await getAuthHeaders();
      const response = await axiosInstance.post(
        "/todos/org/createAssign/",
        taskData,
        { headers }
      );
      console.log("task created", response.data);
      toast.success("Task created and assigned successfully");
      set({ isLoading: false });
    } catch (error) {
      console.log("error creating and assigning task");
      toast.error("Failed to create and assign task");
      set({ isLoading: false });
    }
  },

  userReview: async () => {
    let startOfDay, endOfDay;
    let localDate = get().date;
    if (localDate !== null) {
      startOfDay = new Date(
        localDate.getFullYear(),
        localDate.getMonth(),
        localDate.getDate()
      );
      endOfDay = new Date(
        localDate.getFullYear(),
        localDate.getMonth(),
        localDate.getDate() + 1
      );
    } else {
      localDate = new Date();
      startOfDay = new Date(
        localDate.getFullYear(),
        localDate.getMonth(),
        localDate.getDate()
      );
      endOfDay = new Date(
        localDate.getFullYear(),
        localDate.getMonth(),
        localDate.getDate() + 1
      );
    }
    try {
      set({ isLoading: true });

      const headers = await getAuthHeaders();
      console.log(headers);
      const response = await axiosInstance.get("/ai/userReview", {
        headers,
        params: {
          startOfDay,
          endOfDay,
        },
      });
      console.log(response.data);
      set({
        score: response.data.score,
        feedback: response.data.feedback,
        isLoading: false,
      });
    } catch (error) {
      console.log(error);

      set({  isLoading: false, error: "Server is currently busy please try again later" });
    }
  },
}));

export default useStore;
