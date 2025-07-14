import mongoose from "mongoose";

import { Schema } from "mongoose";
import { v4 as uuidv4 } from "uuid";
const now = new Date();
const endOfDay = new Date(
  now.getFullYear(),
  now.getMonth(),
  now.getDate(),
  23,
  59,
  59,
  999
);
const TodoSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: [true, "user id is required"],
    },
    id: {
      type: String,
      default: uuidv4,
      unique: true,
    },
    title: {
      type: String,
      required: [true, "todo text is reuired"],
      minlength: [2, "min length is 2"],
    },
    description: {
      type: String,
      required: false,
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
    assignedTo: {
      type: Schema.Types.Mixed,
      default: [],
    },
    assignedAt: {
      type: Date,
      default: null,
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "low",
    },
    orgId: {
      type: String,
      default: null,
    },
    dueDate: {
      type: Date,
      default: null,
    },
    dueTime: {
      type: String,
      default: now,
    },
    status: {
      type: String,
      enum: ["pending", "scheduled", "completed", "cancelled"],
      default: "pending",
      index: true,
    },
      scheduledSlot: {
    date: {
      type: Date,
      default: null
    },
    startTime: {
      type: String, // "HH:MM" format
      default: null
    },
    endTime: {
      type: String, // "HH:MM" format
      default: null
    },
    duration: {
      type: Number, // Actual scheduled duration in minutes
      default: null
    },
    reason: {
      type: String, // AI reasoning for this slot
      default: null
    }
  },
  category:{
    type: String,
    default: null
  }
  },

  { timestamps: true }
);

export const Todo = mongoose.model("Todo", TodoSchema);
