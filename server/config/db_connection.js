import mongoose from "mongoose";
import dotenv from "dotenv";

const connectDb = async () => {
  try {
    const connect = await mongoose.connect(
      "mongodb+srv://Punit:8Ea6mviMsOWm3cE0@cluster0.mgcifbf.mongodb.net/?retryWrites=true&w=majority"
    );
    console.log("database connected");
  } catch (error) {
    console.log("sorry database not connected", error);
    process.exit(1);
  }
};
export default connectDb;
