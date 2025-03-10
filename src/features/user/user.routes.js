// Manage routes/paths to UserController

// {
//     "name" : "john doe",
//     "email" : "john.doe@gmail.com",
//     "password" : "Password1",
//     "type" : "Seller"

// }

//  http://localhost:3200/api/users/signup

// 1. Import express.
import express from "express";
import UserController from "./user.Controller.js";

// 2. Initialize Express router.
const userRouter = express.Router();
const userController = new UserController();

// we are sending id from the DB so and sending in 200OK

userRouter.post("/signup", (req, res) => {
  userController.SignUp(req, res);
});

userRouter.post("/signin", (req, res) => {
  userController.signIn(req, res);
});

export default userRouter;
