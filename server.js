// 1. Import express
import "./env.js";
import fs from "fs";
import path from "path";
import express from "express";
import bodyParser from "body-parser";
import productRouter from "./src/features/product/product.routes.js";
import userRouter from "./src/features/user/user.routes.js";
import cartRouter from "./src/features/cart/cartItem.routes.js";
// import basicAuthorizer from './src/middlewares/basicAuth.middlewere.js'
import loggerMiddleware from "./src/middlewares/logger.middlewer.js";
import jwtAuth from "./src/middlewares/JWT.middlewere.js";
import swagger from "swagger-ui-express";
import cors from "cors";
import { ApplicationError } from "./src/Error-Handler/ApplicationError.js";
import { connectToMongoDB } from "./src/config/mongodb.js";

//import apiDocs from './swagger.json' assert { type: 'json' };

// Load the swagger.json file using fs (File System)
const apiDocs = JSON.parse(
  fs.readFileSync(path.resolve("./swagger.json"), "utf8")
);

// 2. Create Server
const server = express();



// there is on client 5500 fetching the api wanted to consume the product.
// CORS policy configuration
// http://localhost:5500/11.%20JS_Client/index.html

// server.use((req, res, next)=>{
//     res.header('Access-Control-Allow-Origin','http://localhost:5500');
//     res.header('Access-Control-Allow-Headers','*');
//     res.header('Access-Control-Allow-Methods','*');
//     // return ok for preflight request.
//     if(req.method=="OPTIONS"){
//       return res.sendStatus(200);
//     }
//     next();
//   })

var corOptions = {
  origin: "http://localhost:5500",
};

server.use(cors(corOptions));

// Logger middlewere
server.use(loggerMiddleware);

//server.use(bodyParser.json());
// for all requests related to product, redirect to product routes.
// localhost:3200/api/products
server.use(express.json());

server.use("/api-docs", swagger.serve, swagger.setup(apiDocs));

server.use(
  "/api/products",
  //basicAuthorizer,
  //jwtAuth,
  productRouter
);

server.use("/api/users", loggerMiddleware, userRouter);

server.use("/api/cartItem", cartRouter);

// 3. Default request handler
server.get("/", (req, res) => {
  res.send("Welcome to Ecommerce APIs");
});

// 5. Middleware to handle 404 request
// server.use((req, res)=>{
//     res.status(404).send("404 API not found.");
// });

// Error handler middleware
server.use((err, req, res, next) => {
  console.log(err);
  if (err instanceof ApplicationError) {
    res.status(err.code).send(err.message);
  }
  // server erros
  res.status(500).send("Something went wrong, please try later");
});

// server.use((req, res) => {
//   res.status(404).send("404 API not found.");
// });

// 4. Specify port.
server.listen(3200, () => {
  console.log("Server is running at 3200");
  connectToMongoDB();
});
