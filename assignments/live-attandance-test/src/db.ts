import mongoose from "mongoose";
const connectDb = async () => {
  try {
    await mongoose.connect(`${process.env.MONGODB_URI}`);
  } catch (error) {
    console.log("mongodb connection failed!!");
    process.exit(1);
  }
};

export default connectDb;
