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
  console.log(products);
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

  // Write the new array to the data file
  await fs.writeFile(filePath, JSON.stringify(updatedProducts));

  // Return the new product information
  return newProduct;
};

// Function to update a product
export const updateProduct = async (stockNumber, updatedProduct) => {
  // Fetch the data file array as a JSON
  const productsJSON = await fs.readFile(filePath);

  // Parse the JSON data array
  const products = JSON.parse(productsJSON);

  // Constant for target product to be updated
  const targetProduct = products.filter(productObj => productObj.stock_number === stockNumber);

  // Error handling if not product with matching stock number found
  if (targetProduct.length === 0) {
    return null;
  };

  // Update the target product details
  const newProductDetails = {
    stock_number: updatedProduct.stock_number ?? targetProduct.stock_number,
    name: updatedProduct.name ?? targetProduct.name,
    Description: updatedProduct.Description ?? targetProduct.Description,
    Price: updatedProduct.Price ?? targetProduct.Price,
  }

  // Create the new product list object and set any new values or default to old value
  const updatedProductList = products.map((productObj) =>
    productObj.stock_number !== stockNumber
      ? productObj
      : newProductDetails
  );

  console.log(updatedProductList);
  // Write the new updated product list to the data file
  await fs.writeFile(filePath, JSON.stringify(updatedProductList));
  
  // Return the new product details
  return newProductDetails;
};
// const testObj = {
//   stock_number: "98765",
//   name: 'Excel Pro PC',
//   Description: 'Desktop Computer',
//   Price: '£2999.99'
// }
// getProducts();
// updateProduct("98765", testObj)
