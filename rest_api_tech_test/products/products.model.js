// // Imports
import fs from "node:fs/promises";

// Constant for the file path
const filePath = "./rest_api_tech_test/database/data.json";

// Function to get a product by stock number from the JSON data file
export const getByStockNumber = async (stockNumber) => {
    // Fetch the data file array as a JSON
    const productsJSON = await fs.readFile(filePath);

    // Parse the JSON data array
    const products = JSON.parse(productsJSON);

    // Filter the array to find matching product
    const matchedProduct = products.filter(obj => obj.stock_number === stockNumber);

    // Return either the product object or null
    return matchedProduct.length > 0 ? matchedProduct[0] : null;
};