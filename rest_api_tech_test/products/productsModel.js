// // Imports
// import fs from "node:fs/promises";
// Import mongodb
import { MongoClient } from "mongodb";

// set constant for connection uri
const uri =
  "mongodb+srv://davidmason:Password123@firstmongodb.exiwpxq.mongodb.net/?retryWrites=true&w=majority";

// Variable for the database connection
export let db;
export let connection;

// Function to create database connection. Exported for server listening.
export const connectToDb = async () => {
    connection = await MongoClient.connect(uri)
    db = connection.db();
};

// Function to remove MongoDB id when returning object
const objectFixer = (products) => {
  // Declare the empty variable
  let productList;

  // Check if the products is an array
  if (Array.isArray(products)) {
    // Map through products to remove the id number
    productList = products.map((obj) => {
      // Create the new obj with no id
      const newObj = {
        stock_number: obj.stock_number,
        name: obj.name,
        Description: obj.Description,
        Price: obj.Price,
      };

      // Return the new obj to set to variable
      return newObj;
    });
  } else {
    productList = {
      stock_number: products.stock_number,
      name: products.name,
      Description: products.Description,
      Price: products.Price,
    };
  }

  // Return product list
  return productList;
};

// Function to get all products
export const getProducts = async () => {
  // Declare variable to store product information
  const products = [];

  // Send Get request to Mongo database to find all products and push each to products array
  await db
    .collection("product_db")
    .find()
    .forEach((product) => products.push(product));

  // Error handling
  if (products.length === 0) {
    return null;
  }

  // Map through products to remove the id number
  const productList = objectFixer(products);

  // Return the product list
  return productList;
};

// Function to get a product by stock number
export const getByStockNumber = async (stockNumber) => {
  // Declare variable to store product info
  let mongoProduct;

  // Send get request while finding the stock number
  await db
    .collection("product_db")
    .findOne({ stock_number: stockNumber })
    .then((product) => {
      mongoProduct = product;
    })
    .catch((err) => {
      return null;
    });

  // Correct the object format
  const product = objectFixer(mongoProduct);

  // Return the corrected product
  return product;
};

// Function to add a new product
export const addNewProduct = async (newProduct) => {
  // Confirm acknowledged
  let confirmation;
  //Send the post request
  await db
    .collection("product_db")
    .insertOne(newProduct)
    .then((result) => {
      confirmation = result.acknowledged;
    });

  // Remove newProduct id after post request
  const addedProduct = confirmation ? objectFixer(newProduct) : null;

  // Return product details if confirmation true or return null
  return addedProduct;
};

// Function to update a product
export const updateProduct = async (stockNumber, requestDetails) => {
  // Confirmation of request
  let confirmation;

  //Send the post request
  await db
    .collection("product_db")
    .updateOne({ stock_number: stockNumber }, { $set: requestDetails })
    .then((result) => {
      confirmation = result.acknowledged;
    });

  // Request new product details
  const mongoProduct =
    confirmation &&
    (await getByStockNumber(requestDetails.stock_number ?? stockNumber));

  // Remove newProduct id after post request
  const updatedProduct = mongoProduct ? objectFixer(mongoProduct) : null;

  // Return product details if confirmation true or return null
  return updatedProduct;
};
