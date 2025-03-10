import { getDB } from "../../config/mongodb.js";
import { ApplicationError } from "../../Error-Handler/ApplicationError.js";

class UserRepository {
  async signUp(newUser) {
    try {
      // 1. Get the database
      const db = getDB();
      // 2. Get the collection
      const collection = db.collection("users");
      
      // 3. Insert the document.
      await collection.insertOne(newUser);
      return newUser;
    } catch (err) {
      console.log(err);
      throw new ApplicationError("Something went wrong with database", 500);
    }
  }

  async getUserCount() {
    try {
      // 1. Get the database
      const db = getDB();
      // 2. Get the collection
      const collection = db.collection("users");

      // Count the total number of products in the collection
      const count = await collection.countDocuments(); // Count all products

      return count; // Return the total count
    } catch (error) {
      console.error("Error counting products:", error);
      throw new ApplicationError("Something went wrong with getting product count", 500);
    }
  }

  async checkExistingUser(email){
       // 1. Get the database
       const db = getDB();
       // 2. Get the collection
       const collection = db.collection("users");

       const existingUser = await collection.findOne({email});

       console.log("checkig the existing user" ,existingUser);

       if(existingUser){
        return true;
       }else {
        return false;
       }
       
  }


  async findByEmail(email) {
    try {
      // 1. Get the database
      const db = getDB();
      // 2. Get the collection
      const collection = db.collection("users");

      // 3. Insert the document.
      const signedUser = await collection.findOne({ email });
      console.log(signedUser);
      return signedUser;
    } catch (err) {
      console.log(err);
      throw new ApplicationError("Something went wrong with database", 500);
    }
  }
}

export default UserRepository;
