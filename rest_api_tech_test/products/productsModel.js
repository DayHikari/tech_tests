// // Imports
import fs from "node:fs/promises";

// Constant for the file path
const filePath = "database/data.json";

// Function to get all products
export const getProducts = async () => {
  // Fetch the data file array as a JSON
  const productsJSON = await fs.readFile(filePath);

  // Parse the JSON data array
  const products = JSON.parse(productsJSON);

  // return the products
  return products;
};

// Function to get a product by stock number from the JSON data file
export const getByStockNumber = async (stockNumber) => {
  // Fetch the data file array as a JSON
  const productsJSON = await fs.readFile(filePath);

  // Parse the JSON data array
  const products = JSON.parse(productsJSON);

  // Filter the array to find matching product
  const matchedProduct = products.filter(
    (obj) => obj.stock_number === stockNumber
  );

  // Return either the product object or null
  return matchedProduct.length > 0 ? matchedProduct[0] : null;
};

// Function to add a new product
export const addNewProduct = async (newProduct) => {
  // Fetch the data file array as a JSON
  const productsJSON = await fs.readFile(filePath);

  // Parse the JSON data array
  const products = JSON.parse(productsJSON);

  // Add the new product to the products data
  const updatedProducts = [...products, newProduct];

  await fs.writeFile(filePath, JSON.stringify(updatedProducts));

  return newProduct;
};

