import { Todo } from "../models/todo.model.js";
import { emitToUser } from "../lib/socket.js";
import { Organization } from "../models/organization.model.js";
import { db } from "../config/firebase.js";

export const addTodo = async (req, res) => {
  const userId = req.user.uid;
  const { title, description, priority, dueDate, dueTime } = req.body;
  // console.log(req.body);
  const newTodo = new Todo({
    title,
    description,
    userId,
    priority,
    dueDate,
    dueTime,
  });
  try {
    await newTodo.save();
    console.log(newTodo);
    res.status(201).json({ message: "Todo added successfully" });
  } catch (error) {
    console.log("error adding todo");
    console.log(error);
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
    query.$or = [{ assignedTo: req.user.uid }, { userId: req.user.uid }];
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
        res.status(200).json({ message: "Todo marked as finished",todo });
      } else {
        console.log(todo, " marked as not finished");
        res.status(200).json({ message: "Todo marked as not finished",todo });
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
    res.status(200).json({ message: "Task assigned successfully", todo });
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

export const createOrg = async (req, res) => {
  const { orgName, creator } = req.body;
  const user = await getUserByEmail(creator);

  if (!user) {
    return res.status(400).json({ message: "User not found" });
  }
  let members = [user];

  try {
    const response = await Organization.create({ orgName, members });
    res.status(200).json(response);
  } catch (error) {
    console.log("error creating org");
    res.status(400).json({ message: error.message });
  }
};

export const fetchOrgs = async (req, res) => {
  const userId = req.user.uid;
  // const email = req.query.email;
  const email = req.user.email;
  console.log(email, userId);
  try {
    console.log("initiating fetch orgs from db");
    const orgs = await Organization.find({
      members: { $elemMatch: { uid: userId } },
    });
    if (orgs) {
      console.log("orgs found");
      console.log(orgs);
      res.status(200).json(orgs);
    } else {
      console.log("orgs not found");
      res.status(200).json([]);
    }
  } catch (error) {
    console.log("error fetching orgs");
    res.status(400).json({ message: error.message });
  }
};

export const getUserByEmail = async (email) => {
  try {
    console.log("Searching for user with email:", email); // Add this
    const usersRef = db.collection("users");
    const snapshot = await usersRef.where("email", "==", email).get();
    console.log("Query snapshot empty?", snapshot.empty); // Add this
    console.log("Number of docs found:", snapshot.docs.length); // Add this
    if (!snapshot.empty) {
      const userDoc = snapshot.docs[0];
      const userData = { id: userDoc.id, ...userDoc.data() };
      console.log("User data found:", userData); // Add this
      return userData;
    }
    return null;
  } catch (error) {
    console.error("Error getting user by email:", error);
    throw error;
  }
};

export const addMemberToOrg = async (req, res) => {
  const orgId = req.params.id;
  const { email } = req.body;
  console.log("email", email);
  console.log("orgId", orgId);
  const user = await getUserByEmail(email);
  console.log("user", user);
  if (!user) {
    console.log("user not found");
    return res.status(400).json({ message: "User not found" });
  }
  try {
    const org = await Organization.findById(orgId);
    if (org) {
      org.members.push(user);
      await org.save();
      return res.status(200).json({ org, message: "Member added to org" });
    } else {
      return res.status(400).json({ message: "Org not found" });
    }
  } catch (error) {
    console.log("error adding member to org");
    return res.status(400).json({ message: "Error adding member to org" });
  }
};

export const createAndAssignTask = async (req, res) => {
  console.log(req.body);
  const { title, description, assignedTo, orgId, userId } = req.body;
  let members = [];
  assignedTo.map(async (member) => {
    members.push(member.uid);
  });
  try {
    const todo = await Todo.create({
      title,
      description,
      assignedTo: members,
      orgId,
      userId,
    });
    if (todo) {
      todo.save();
      const assignedBy = await getUserById(userId);
      console.log(todo);
      console.log(assignedBy);
      emitToUser(members, "taskAssigned", {
        taskId: todo.id,
        title: todo.title,
        description: todo.description,
        assignedBy: assignedBy,
        message: `You have been assigned a task ${todo.title} by ${assignedBy.email}`,
        timestamp: new Date(),
      });
      return res
        .status(200)
        .json({ todo, message: "Task created and assigned" });
    } else {
      return res.status(400).json({ message: "Error creating task" });
    }
  } catch (error) {
    console.log("error creating and assigning task");
    return res
      .status(400)
      .json({ message: "Error creating and assigning task" });
  }
};

export const getUserById = async (userId) => {
  try {
    console.log("Searching for user with ID:", userId);
    const userDoc = await db.collection("users").doc(userId).get();
    console.log("User document exists?", userDoc.exists);

    if (userDoc.exists) {
      const userData = { id: userDoc.id, ...userDoc.data() };
      console.log("User data found:", userData);
      return userData;
    }

    console.log("No user found with ID:", userId);
    return null;
  } catch (error) {
    console.error("Error getting user by ID:", error);
    throw error;
  }
};
