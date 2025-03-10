// import { getDB } from "../../config/mongodb.js";
// import { ApplicationError } from "../../Error-Handler/ApplicationError.js";

export default class UserModel {
  constructor(name, email, password, type) {
    //this.id = id;
    this.name = name;
    this.email = email;
    this.password = password;
    this.type = type;
  }

  // static async SignUp(name, email, password, type) {
  //     try {
  //         // 1. Get the database

  
  //         const db = getDB();

  //         // 2. Get the collection
  //         const collection = await db.collection("users");

  //         // Check if email already exists
  //         const existingUser = await collection.findOne({ email });
  //         if (existingUser) {
  //             throw new ApplicationError("Email already exists", 400);
  //         }

  //         const newUser = new UserModel(name, email, password, type);

  //         // 3. Insert the document and await the result
  //         await collection.insertOne(newUser);

  //         return newUser;
  //     } catch (err) {
  //         console.error("Error during sign-up:", err);
  //         throw new ApplicationError("Something Went Wrong", 500);
  //     }
  // }

  static getAll() {
    return users;
  }

  // static SignIn(email, password) {
  //     const user = users.find(
  //         (u) => u.email == email && u.password == password
  //     );
  //     return user;
  // }
}

// let users = [
//   {
//     id: 1,
//     name: "Admin User",
//     email: "admin@ecom.com",
//     password: "Password1",
//     type: "seller",
//   },
//   {
//     id: 2,
//     name: "Customer User",
//     email: "customer@ecom.com",
//     password: "Password1",
//     type: "customer",
//   },
// ];
