import mongoose, { Schema, SchemaTypes } from "mongoose";
import autoPopulate from "mongoose-autopopulate";
import { TodoDocument, TodoModel } from "./todo.types";
import { PASTEL_COLORS } from "@shared/config";

const todoSchema = new Schema<TodoDocument, TodoModel>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      trim: true,
    },
    color: {
      type: String,
      trim: true,
      required: true,
      default: PASTEL_COLORS[0],
    },
    completed: {
      type: Boolean,
      default: false,
      required: true,
    },
    tags: {
      type: [SchemaTypes.ObjectId],
      required: true,
      ref: "Tag",
      default: [],
      autopopulate: true,
    } as any,
    creatorUserId: {
      type: String,
      trim: true,
      required: true,
    },
    createdAt: {
      type: Date,
      immutable: true,
      required: true,
      default: () => new Date(),
    },
    updatedAt: {
      type: Date,
      required: true,
      default: () => new Date(),
    },
  },
  {
    timestamps: {
      createdAt: "createdAt",
      updatedAt: "updatedAt",
    },
  }
);

// Plugins
todoSchema.plugin(autoPopulate);

// Indexes
todoSchema.index({ title: "text", content: "text" });

/// Extensions
todoSchema.set("toJSON", {
  transform: (_doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
  },
});

todoSchema.methods.toggleComplete = function (
  this: TodoDocument
): Promise<TodoDocument> {
  this.completed = !this.completed;
  return this.save();
};

// prettier-ignore
const Todo = mongoose.models.Todo as TodoModel || mongoose.model<TodoDocument, TodoModel>("Todo", todoSchema);
export default Todo;
