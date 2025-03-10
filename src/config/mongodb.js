import { MongoClient } from "mongodb";
//import dotenv from "dotenv";

// dotenv.config();

// const url = process.env.DB_URL;
//console.log(url);
let client;

export const connectToMongoDB = async () => {
  try {
    client = await MongoClient.connect(process.env.DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB is connected");
  } catch (err) {
    console.error("Error connecting to MongoDB:", err.message);
  }
};

export const getDB = () => {
  if (!client) {
    throw new Error("MongoDB client is not connected.");
  }
  return client.db();
};
