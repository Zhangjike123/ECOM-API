
import { getDB } from "../../config/mongodb.js";

import { ApplicationError } from "../../Error-Handler/ApplicationError.js";

class ProductRepository {
  constructor() {
    this.collection = "products";
  }

  async checkExistingProduct(name) {
    try {
      // 1. Get the database
      const db = getDB();
      // 2. Get the collection
      const collection = db.collection(this.collection);

      const existingProduct = await collection.findOne({ name });

      console.log("checking the existing user", existingProduct);

      if (existingProduct) {
        return true;
      } else {
        return false;
      }
    } catch (err) {
      console.log(err);
      throw new ApplicationError("Something went wrong with database", 500);
    }
  }

  async getProductCount() {
    try {
      // Get the database
      const db = getDB();
      // Get the collection
      const collection = db.collection(this.collection);

      // Count the total number of products in the collection
      const count = await collection.countDocuments(); // Count all products

      return count; // Return the total count
    } catch (error) {
      console.error("Error counting products:", error);
      throw new ApplicationError("Something went wrong with getting product count", 500);
    }
  }

  async add(newProduct) {
    try {
      // 1. Get the database
      const db = getDB();
      // 2. Get the collection
      const collection = db.collection(this.collection);
        
      console.log(newProduct);
      // 3. Insert the document.
      await collection.insertOne(newProduct);
     
      return newProduct;
    } catch (err) {
      console.log(err);
      throw new ApplicationError("Something went wrong with database", 500);
    }
  }

  async getAll() {
    try {
        // Get the database
        const db = getDB();
        // Get the collection
        const collection = db.collection(this.collection);

        // Fetch all documents from the collection
        const products = await collection.find({}).toArray();  // .toArray() converts cursor to an array

        return products;
    } catch (err) {
        console.log("Error fetching products: ", err);
        throw new ApplicationError("Something went wrong with database", 500);
    }
}

  async get(id) {
    try {
      // 1. Get the database
      const db = getDB();
      // 2. Get the collection
      const collection = db.collection(this.collection);

     
      return await collection.findOne({id: parseInt(id)});
      // 4. Query with ObjectId (ensure it's an ObjectId instance)
   
    } catch (err) {
      console.log(err);
      throw new ApplicationError("Something went wrong with database", 500);
    }
  }
  
  async filterProduct(minPrice, maxPrice, category) {
    try {
        // 1. Get the database
        const db = getDB();
        // 2. Get the collection
        const collection = db.collection(this.collection);

        // Build the filter query object based on provided parameters
        let filterQuery = {};

        // Add price conditions to the filter query
        if (minPrice && maxPrice) {
            filterQuery.price = { $gte: parseFloat(minPrice), $lte: parseFloat(maxPrice) }; // Between minPrice and maxPrice
        } else if (minPrice) {
            filterQuery.price = { $gte: parseFloat(minPrice) }; // Greater than or equal to minPrice
        } else if (maxPrice) {
            filterQuery.price = { $lte: parseFloat(maxPrice) }; // Less than or equal to maxPrice
        }

        // Add category condition to the filter query
        if (category) {
            filterQuery.category = category; // Match the given category
        }

        // Execute the query with the constructed filter
        const result = await collection.find(filterQuery).toArray(); // Convert cursor to array

        return result;
    } catch (err) {
        console.log(err);
        throw new ApplicationError("Something went wrong with the database", 500);
    }
}

async rateProduct(productID, userID, rating) {
  try {
      const db = getDB();
      const collection = db.collection(this.collection);
      let updatedProduct;
       updatedProduct = await collection.findOneAndUpdate(
        { id: productID, "ratings.id": userID },
        { $set: { "ratings.$.rating": rating } }, // Update the existing rating
        { returnDocument: 'after' }
      );
      if (!updatedProduct) {
        // If the rating doesn't exist, add a new rating
        updatedProduct = await collection.findOneAndUpdate( 
          { id: productID},
          { $push: { ratings: { id: userID, rating: rating } } }, // Add new rating
          { returnDocument: 'after' }
        );}
  
      if (!updatedProduct) {
          // Handle the case where the product is not found
          throw new ApplicationError("Product not found", 404); // Or another appropriate status code
      }
      console.log("Updated Product", updatedProduct);
      return updatedProduct; // Return the updated product

  } catch (err) {
      console.error("Error in rateProduct:", err); // Log the full error for debugging
      if (err instanceof ApplicationError) {
        throw err; // Re-throw application errors
      }
      throw new ApplicationError("Something went wrong with the database", 500);
  }
}


  }


export default ProductRepository;
