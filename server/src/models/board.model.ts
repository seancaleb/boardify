import { Board } from "@/types";
import { generateUniqueId } from "@/utils";
import mongoose, { Schema } from "mongoose";

interface BoardDocument extends Board, Document {}

const boardSchema = new Schema<BoardDocument>(
  {
    boardId: {
      type: String,
      unique: true,
      default: () => generateUniqueId("board"),
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export default mongoose.model<BoardDocument>("Board", boardSchema);
