import { Schema } from "mongoose";

export type Role = "user" | "admin";
export type Status = "pending" | "in progress" | "completed";
export type Priority = "low" | "high" | "medium" | "critical";

export type User = {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: Role;
  avatar: string;
};

export type Board = {
  boardId: string;
  title: string;
  description: string;
  userId: Schema.Types.ObjectId;
};

export type Task = {
  taskId: string;
  title: string;
  description: string;
  status: Status;
  priority: Priority;
  userId: Schema.Types.ObjectId;
  boardId: Schema.Types.ObjectId;
};
