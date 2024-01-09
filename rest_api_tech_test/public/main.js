// // Imports
// Import child to run the curl command
import * as child from "child_process";
// Import util to promisify the child.exec function
import * as util from "util";

// Create constant for the promisified child exec
const exec = util.promisify(child.exec);

// Constant for the API endpoint
const apiEndpoint = "http://localhost:8080/products";

// Function to fetch from API using cURL.
const getProductByStockNumberWithCURL = async () => {
  // Send the curl request
  const { error, stdout, stderr } = await exec(
    `curl -s -H "Content-Type: application/json" ${apiEndpoint}/98765`
  );

  // Error handling
  if (error) {
    console.error(`Error: ${error}`);
    return;
  };

  // Error handling
  if (stderr) {
    console.error(`Error: ${stderr}`);
    return;
  };

  // Parse the json response
  const response = JSON.parse(stdout);
  console.log("Response from curl", response);
};

const newProductObj = {
  "stock_number":"12345",
  "name":"Pro Batteriers",
  "Description":"Batteries",
  "Price":"£1.99"
}

// Function to add a new product to the database
const addNewProduct = async (productObj) => {
  // Send the curl post request with the product object
  const { error, stdout, stderr } = await exec(
    `curl -s -X POST -H "Content-Type: application/json" -d ${newProductObj} ${apiEndpoint}`
  );

  // Error handling
  if (error) {
    console.error(`Error: ${error}`);
    return;
  };

  // Error handling
  if (stderr) {
    console.error(`Error: ${stderr}`);
    return;
  };

  // Parse the response
  const response = JSON.parse(stdout);
  console.log("Add response: ", response)
}

getProductByStockNumberWithCURL();
addNewProduct(newProductObj);
