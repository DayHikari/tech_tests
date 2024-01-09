// // Imports
import * as productModels from "./products.model.js";

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