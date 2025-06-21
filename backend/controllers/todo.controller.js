import { Todo } from "../models/todo.model.js";
import { emitToUser } from "../lib/socket.js";

export const addTodo = async (req, res) => {
  const userId = req.user.uid;
  const { title, description } = req.body;
  console.log(title, description, userId);
  const newTodo = new Todo({
    title,
    description,
    userId,
  });
  try {
    await newTodo.save();
    console.log(newTodo);
    res.status(201).json({ message: "Todo added successfully" });
  } catch (error) {
    console.log("error adding todo");
    res.status(400).json({ message: error.message });
  }
};

export const deleteTodo = async (req, res) => {
  const userId = req.user.uid;
  const id = req.params.id;
  try {
    const todo = await Todo.findOneAndDelete({ id, userId });
    if (todo) {
      console.log(todo, " deleted succcesfully");
      res.status(201).json({ message: "Deleted Todo successfully" });
    } else {
      console.log("Todo not found");
      res.status(404).json({ message: "Todo not found" });
    }
  } catch (error) {
    console.log("error deleting todo");
    res.status(400).json({ message: error.message });
  }
};

export const editTodo = async (req, res) => {
  const userId = req.user.uid;
  const id = req.params.id;
  const { title, description } = req.body;
  try {
    const todo = await Todo.findOne({ id, userId });
    if (todo) {
      console.log("todo found");
      todo.title = title;
      todo.description = description;
      await todo.save();
      console.log(todo, " updated successfully");
      res.status(201).json({ message: "Todo edited successfully" });
    } else {
      console.log("todo not found");
      res.status(400).json({ message: "Todo not found" });
    }
  } catch (error) {
    console.log("error editing todo");
    res.status(400).json({ message: error.message });
  }
};

export const fetchTodos = async (req, res) => {
  const { startOfDay, endOfDay } = req.query;
  let query = {};
  if (startOfDay && endOfDay) {
    query.createdAt = { $gte: new Date(startOfDay), $lte: new Date(endOfDay) };
    query.userId = req.user.uid;
  }
  try {
    console.log("fetching todos from db");
    const todos = await Todo.find(query).sort({ createdAt: -1 });
    res.status(200).json(todos);
  } catch (error) {
    console.log("error fetching todos");
    res.status(500).json({ message: error.message });
  }
};

export const fetchTodo = async (req, res) => {
  const id = req.params.id;
  const userId = req.user.uid;
  try {
    console.log("fetching todo from db");
    const todo = await Todo.findOne({ id, userId });
    if (todo) {
      console.log("todo found");
      res.status(201).json(todo);
    } else {
      console.log("todo not found");
      res.status(400).json({ message: "Todo not found" });
    }
  } catch (error) {
    console.log("error fetching todo");
    res.status(400).json({ message: error.message });
  }
};

export const markFinished = async (req, res) => {
  const userId = req.user.uid;
  const id = req.params.id;
  try {
    console.log("marking todo as finished");
    const todo = await Todo.findOne({ id, userId });
    if (todo) {
      console.log("todo found");
      todo.isCompleted = !todo.isCompleted;
      await todo.save();
      if (todo.isCompleted) {
        console.log(todo, " marked as finished");
        res.status(200).json({ message: "Todo marked as finished" });
      } else {
        console.log(todo, " marked as not finished");
        res.status(200).json({ message: "Todo marked as not finished" });
      }
    } else {
      console.log("todo not found");
      res.status(400).json({ message: "Todo not found" });
    }
  } catch (error) {
    console.log("error marking todo finished");
    res.status(400).json({ message: error.message });
  }
};

export const assignTask = async (req, res) => {
  const assignedBy = req.user.uid;
  const taskId = req.params.id;
  console.log(req);
  const { assignedTo } = req.body;
  try {
    console.log(
      `initiating task assignment for taskId ${taskId} by ${assignedBy} to ${assignedTo}`
    );
    const todo = await Todo.findOne({ id: taskId });

    if (!todo) {
      console.log("todo not found");
      return res.status(400).json({ message: "Todo not found" });
    }

    if (todo.userId !== assignedBy && todo.assignedTo !== assignedBy) {
      return res
        .status(403)
        .json({ message: "You are not authorized to assign this task" });
    }
    todo.assignedTo = assignedTo;
    todo.assignedAt = new Date();

    await todo.save();

    emitToUser(assignedTo, "taskAssigned", {
      taskId: todo.id,
      title: todo.title,
      description: todo.description,
      assignedBy,
      message: `You have been assigned a task ${todo.title} by ${assignedBy}`,
      timestamp: new Date(),
    });

    console.log(`task assigned successfully to ${assignedTo}`);
    res.status(200).json({ message: "Task assigned successfully" , todo});
  } catch (error) {
    console.log("error assigning task");
    res.status(400).json({ message: error.message });
  }
};

export const getAssignedTasks = async (req, res) => {
  const userId = req.user.uid;

  try {
    const assignedTasks = await Todo.find({ assignedTo: userId }).sort({
      assignedAt: -1,
    });
    res.status(200).json(assignedTasks);
  } catch (error) {
    console.log("error fetching assigned tasks");
    res.status(400).json({ message: error.message });
  }
};

export const getOutsourcedTasks = async (req, res) => {
  const userId = req.user.uid;
  try {
    const outSourcedTasks = await Todo.find({
      userId,
      assignedTo: { $ne: null },
    }).sort({ assignedAt: -1 });
    res.status(200).json(outSourcedTasks);
  } catch (error) {
    console.log("error fetching outsourced tasks");
    res.status(400).json({ message: error.message });
  }
};
