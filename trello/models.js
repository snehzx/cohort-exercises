const mongoose = require("mongoose");
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

const orgSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    admin: {
      type: mongoose.Schema.Types.ObjectId,
    },
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
      },
    ],
  },
  { timestamps: true },
);

const userModel = mongoose.model("userModel", userSchema);
const orgModel = mongoose.model("orgModel", orgSchema);

module.exports = {
  userModel,
  orgModel,
};
