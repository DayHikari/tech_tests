// // Imports
import * as productModels from "./productsModel.js";

// Controller function to get all products
export const getProducts = async (req, res) => {
    // Call the model function to get all products
    const products = await productModels.getProducts() ?? "error returning products";

    // Error handling
    if (!products) {
        res.status(500).json({status: "failed", data: "Unable to retrieve data from database"})
    }

    // Return the array of product objects
    res.status(200).json({status: "success", data: products});
};


// Controller function for the get product by stock number request
export const getByStockNumber = async (req, res) => {
    // Set the stock number to a constant
    const stockNumber =  req.params.stockNumber;

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

// Controller function to update a product
export const updateProduct = async (req, res) => {
    // Set constant for stock number
    const stockNumber = req.params.stockNumber;

    // Set constant for new product details
    const requestDetails = req.body;
    
    // No longer needed for Mongodb
    // // Set constant for formatted product object
    // // const newProductDetails = {
    // //     stock_number: requestDetails.stock_number ?? null,
    // //     name: requestDetails.name ?? null,
    // //     Description: requestDetails.Description ?? null,
    // //     Price: requestDetails.Price ?? null
    // // }; 

    // Call updated product model function with stockNumber and newProductDetails
    const updatedProductDetails = await productModels.updateProduct(stockNumber, requestDetails);

    // Error handling if stock number not found
    if (!updatedProductDetails) {
        res.status(404).json("Stock number not found, please confirm stock number");
    };
    
    // Send response if successful
    res.status(200).json(updatedProductDetails);
};