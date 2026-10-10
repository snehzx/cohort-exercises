import mongoose, { Schema } from "mongoose";

const attendanceModel = new Schema(
  {
    classId: {
      type: Schema.Types.ObjectId,
      ref: "Class",
    },
    studentId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    status: {
      type: String,
      enum: ["present", "absent"],
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

export const Attendance = mongoose.model("Attendance", attendanceModel);
