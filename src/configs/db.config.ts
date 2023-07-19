import mongoose, { ConnectOptions } from "mongoose";

export const connectDB = async () => {
  const db_options: ConnectOptions = {};
  try {
    const conn = await mongoose.connect(
      process.env.DB_URI as string,
      db_options
    );

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error: any) {
    console.log(`Error: ${error.message}`);
    process.exit();
  }
};
