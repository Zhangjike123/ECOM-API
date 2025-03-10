import ProductModel from "../product/product.model.js";
import ProductRepository from "./product.repository.js";

const productrepository = new ProductRepository();

export default class ProductController {

    async getAllProducts(req, res) {
        try {
            // Fetch all products using the repository method
            const products = await productrepository.getAll();
    
            // If no products are found, return a 404
            if (!products || products.length === 0) {
                return res.status(404).send("No products found.");
            }
    
        const productsWithoutId = [];
        products.forEach(product => {
            const { _id, ...productWithoutId } = product;  // Remove _id
            productsWithoutId.push(productWithoutId);
        });

        // Send the response
        return res.status(200).send(productsWithoutId);
        } catch (error) {
            console.error(error);
            res.status(500).send("An error occurred while retrieving products.");
        }
    }
    

  async addProduct(req, res) {
    try {
      const { name, price, sizes  } = req.body;
    
      let checkExistingProduct = await productrepository.checkExistingProduct(name);
      if (checkExistingProduct) {
        return res.status(400).send("Product with this name already exists.");
      }

      const productCount = await productrepository.getProductCount();
      //const productCount = 0;
      const newProductId = productCount + 1;

      const newProduct = new ProductModel(
        name,
        null, 
        parseFloat(price),
        req.file.filename, 
        null, 
        sizes.split(','),
        [],  // Empty ratings array by default
        newProductId  // Use generated product ID
    );
     

      const databaseRecord = await productrepository.add(newProduct);
      const { _id, ...productWithoutId } = databaseRecord;
    

      res.status(201).send(productWithoutId);
    } catch (error) {
      console.error(error);
      res.status(500).send("An error occurred while adding the product.");
    }
  }

  async rateProduct(req, res, next) {
    try {
      const productId = parseInt(req.query.productID, 10); // Convert to number (base 10)

      
      console.log(productId);

        if (isNaN(productId)) {
            return res.status(400).json({message: "Invalid product ID"})
        }

        const userId = req.userID;

        const { rating } = req.body;
        
      const updatedProduct = await productrepository.rateProduct(productId, userId, rating);
      res.status(200).json(updatedProduct); // Send the updated product in the response
    } catch (err) {
      res.status(500).send("An error occurred while adding the product.");
    }
  }

  async getOneProduct(req, res) {
    try {
      const id = req.params.id;
      const product = await productrepository.get(id);

      if (!product) {
        return res.status(404).send("Product not found");
      }

       const { _id, ...productWithoutId } = product;
       return res.status(200).send(productWithoutId);

    } catch (error) {
      console.error(error);
      res.status(500).send("An error occurred while retrieving the product.");
    }
  }

  async filterProducts(req, res) {
    try {
      const minPrice = req.query.minPrice;
      const maxPrice = req.query.maxPrice;
      const category = req.query.category;

      const result = await productrepository.filterProduct(minPrice, maxPrice, category);
      res.status(200).send(result);
    } catch (error) {
      console.error(error);
      res.status(500).send("An error occurred while filtering products.");
    }
  }
}
