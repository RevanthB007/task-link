import express from 'express';
import { addTodo,deleteTodo,editTodo,fetchTodos,markFinished,assignTask,getAssignedTasks,getOutsourcedTasks,createOrg ,fetchOrgs,fetchTodo,addMemberToOrg, createAndAssignTask} from '../controllers/todo.controller.js';
import {verifyToken} from "../middleware/auth.middleware.js";
import { reviewUser,test } from '../controllers/ai.controller.js';
const router = express.Router()

router.get("/",verifyToken,fetchTodos);
router.post("/add",verifyToken,addTodo);
router.delete("/delete/:id",verifyToken,deleteTodo);
router.put("/edit/:id",verifyToken,editTodo);
router.put("/finish/:id",verifyToken,markFinished);
router.get("/:id",verifyToken,fetchTodo);

//for organizations
router.put("/org/assign/:id",verifyToken,assignTask);
router.get("/org/assigned",verifyToken,getAssignedTasks);
router.get("/org/outsourced",verifyToken,getOutsourcedTasks);
router.post("/org/create/",verifyToken,createOrg);
router.get("/org/fetch/",verifyToken,fetchOrgs);
router.put("/org/add/:id",verifyToken,addMemberToOrg);
router.post("/org/createAssign/",verifyToken,createAndAssignTask);

//ai routes



export default router;