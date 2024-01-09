// // Imports
import * as productModels from "./productsModel.js";

// Controller function to get all products
export const getProducts = async (req, res) => {
    // Call the model function to get all products
    const products = await productModels.getProducts();

    // Return the array of product objects
    res.status(200).json({status: "success", data: products});
};


// Controller function for the get product by stock number request
export const getByStockNumber = async (req, res) => {
    // Set the stock number to a constant
    const stockNumber =  req.params.id;

    // Call model function to get 
    const product = await productModels.getByStockNumber(stockNumber);

    // Error handling if stock number not found
    if(!product) {
        // Return a 404 not found with as Fail and a message regarding issue
        return res.status(404).json({status: "Fail", data: "Stock number not found, please confirm the stock number"});
    };

    // Return the product object and successful status 200
    return res.status(200).json({status: "Success", data: product});
};

// Controller function to add a new product
export const addNewProduct = async (req, res) => {
    // Constant for the new product details
    const newProduct = req.body;

    // Await the completion of the add model function
    const product = await productModels.addNewProduct(newProduct);

    // Create the response object
    const response = {
        status: "Successfully added",
        data: product
    }

    // Return the response object with a 201 status
    return res.status(201).json(response);
};
