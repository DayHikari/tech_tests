// // Imports
import * as productModels from "./productsModel.js";

// Add functionality to confirm that the stock number only contains alpha-numeric values and exactly 10 of them
// confirm both individually for the stock number used in params and in body
// make it a separate function
// confirm the length
// split, confirm array length === 10
// confirm only alphanumeric
// Regex 0-9 and a-z A-Z, check if there is shorthand for alphanumeric
// Return true or false, parent function then makes decision using this value (400 error)

const checkForAlphaNumericStockNumber = (stockNumber) => {
  // // Not needed as later step checks if 10
  // if (stockNumber.length !== 10) {
  //   return false;
  // }

  const regexp = /\w/g;

  const regArray = stockNumber.matchAll(regexp);
  let count = 0;
  for (const match of regArray) {
    count++
  }
  console.log(count)
  if (count !== 10) {
    return false;
  } else {
    return true;
  }
};
// console.log(checkForAlphaNumericStockNumber("0123456789"));

// Answer discussed with Andy
const checkStockNumber = (stockNumber) => {
  return /\w{10}/g.test(stockNumber)
}
// console.log(checkStockNumber("0123456789"))
// console.log(checkStockNumber("012345689"))

const checkObjectFormatCorrect = (obj) => {
  const missingParameter = !obj.stock_number
    ? true
    : !obj.name
    ? true
    : !obj.Description
    ? true
    : !obj.Price
    ? true
    : false;

  return missingParameter;
};

// Controller function to get all products
export const getProducts = async (req, res) => {
  // Call the model function to get all products
  const products = await productModels.getProducts();

  // Error handling
  if (!products) {
    res.status(500).json({
      status: "Failed",
      data: "Unable to retrieve data from database",
    });
  } else {
    // Return the array of product objects
    res.status(200).json({ status: "Success", data: products });
  }
};

// Controller function for the get product by stock number request
export const getByStockNumber = async (req, res) => {
  // Set the stock number to a constant
  const stockNumber = req.params.stockNumber;

  // Call model function to get
  const product = await productModels.getByStockNumber(stockNumber);

  // Error handling if stock number not found
  if (!product) {
    // Return a 404 not found with as Fail and a message regarding issue
    return res.status(404).json({
      status: "Failed",
      data: "Stock number not found, please confirm the stock number",
    });
  } else {
    // Return the product object and successful status 200
    return res.status(200).json({ status: "Success", data: product });
  }
};

// Controller function to add a new product
export const addNewProduct = async (req, res) => {
  // Enforce Application/JSON
  if (req.headers["content-type"] !== "application/json") {
    return res.status(400).json({
      status: "Failed",
      data: "Please submit data as JSON. Data will be returned as JSON.",
    });
  }

  // Constant for the new product details
  const newProduct = req.body;

  // Confirm object given is complete
  const missingParameter = checkObjectFormatCorrect(newProduct);

  // End function is a paramter is missing
  if (missingParameter) {
    return res.status(400).json({
      status: "Failed",
      data: "Missing product parameters. Ensure stock_number, name, Description and Price are submitted as written here.",
    });
  }

  // Await the completion of the add model function
  const product = await productModels.addNewProduct(newProduct);

  // Create the response object
  const response = {
    status: "Success",
    data: product,
  };

  // Return the response object with a 201 status
  return res.status(201).json(response);
};

// Controller function to update a product
export const updateProduct = async (req, res) => {
  // Enforce Application/JSON
  if (req.headers["content-type"] !== "application/json") {
    return res.status(400).json({
      status: "Failed",
      data: "Please submit data as JSON. Data will be returned as JSON.",
    });
  }

  // Set constant for stock number
  const stockNumber = req.params.stockNumber;

  // Set constant for new product details
  const requestDetails = req.body;

  const missingParameter = checkObjectFormatCorrect(requestDetails);
  console.log("missing parameter: ", missingParameter)
  // Call updated product model function with stockNumber and newProductDetails
  const updatedProductDetails = await productModels.updateProduct(
    stockNumber,
    requestDetails,
    !missingParameter
  );

  // Error handling if stock number not found
  if (!updatedProductDetails) {
    return res.status(404).json({
      status: "Failed",
      data: "Stock number not found and item could not be added due to missing parameters. Product should contain 'stock_number', 'name', 'Description' and 'Price' to be added.",
    });
  }

  // Send response if successful
  res.status(200).json({ status: "Success", data: updatedProductDetails });
};
