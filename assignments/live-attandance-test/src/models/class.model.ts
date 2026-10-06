import mongoose, { Schema } from "mongoose";

const classSchema = new Schema(
  {
    className: {
      type: String,
      required: true,
    },
    teacherId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    studentIds: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true },
);

export const Class = mongoose.model("Class", classSchema);
