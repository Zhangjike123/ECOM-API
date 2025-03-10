import { ApplicationError } from "../../Error-Handler/ApplicationError.js";
import UserModel from "./user.model.js";
import jwt from "jsonwebtoken";
import UserRepository from "./user.repository.js";
import bcrypt from "bcrypt";

const userepository = new UserRepository();

export default class UserController {

  // SignUp method to register a new user
  async SignUp(req, res) {
    try {
      const { name, email, password, type } = req.body;
      let checkExistingUser = await userepository.checkExistingUser(email);
      if(checkExistingUser){
        return res.status(400).send("user  with already Exists");
      }
      // Hash the password before saving it to the database
      const hashedPassword = await bcrypt.hash(password, 12);

      const newUser = new UserModel(name, email, hashedPassword, type);

      const SignUpUser = await userepository.signUp(newUser);

      // Send the newly created user data in the response
      return res.status(200).send(SignUpUser);
    } catch (err) {
      // Handle known application errors
      if (err instanceof ApplicationError) {
        return res.status(err.code).json({ message: err.message });
      }

      // For unexpected errors
      console.error("Unexpected error:", err); // Log the error for debugging
      return res.status(500).json({ message: "Something went wrong" });
    }
  }

  async signIn(req, res) {
    try {
      // 1. Find user by email.
      const user = await userepository.findByEmail(req.body.email);
  
      if (!user) {
        return res.status(400).send('Incorrect credentials');
      } else {
        // 2. Compare the entered password with the hashed password stored in the database.
        const isPasswordCorrect = await bcrypt.compare(req.body.password, user.password);
        
        if (isPasswordCorrect) {

          console.log("User ID for JWT:", user._id.toString()); // Debugging the userID


          // 3. Create a JWT token for the user if passwords match.
          const token = jwt.sign(
            {
              userID: user._id.toString(),  // Use user object for ID and email
              email: user.email,
           
            },
            process.env.JWT_SECRET,  // Use an environment variable for the secret
            { expiresIn: '1h' }
          );
  
          // 4. Send the JWT token in the response.
          return res.status(200).json({ token });
        } else {
          return res.status(400).send('Incorrect credentials');
        }
      }
    } catch (err) {
      // Log and return a 500 error for unexpected issues
      console.error("Unexpected error:", err);
      return res.status(500).send("Something went wrong");
    }
  }
  
}
