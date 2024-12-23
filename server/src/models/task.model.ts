import { defaultPriorites, defaultStatuses } from "@/schemas/task.schema";
import { Task } from "@/types";
import { generateUniqueId } from "@/utils";
import mongoose, { Schema } from "mongoose";

interface TaskDocument extends Task, Document {}

const taskSchema = new Schema<TaskDocument>(
  {
    taskId: {
      type: String,
      unique: true,
      default: () => generateUniqueId("task"),
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    status: {
      type: String,
      enum: defaultStatuses,
      default: "pending",
    },
    priority: {
      type: String,
      enum: defaultPriorites,
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    boardId: {
      type: Schema.Types.ObjectId,
      ref: "Board",
    },
  },
  { timestamps: true }
);

export default mongoose.model<TaskDocument>("Task", taskSchema);
