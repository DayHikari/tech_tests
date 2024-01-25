// // Imports
// Import mongodb
import { MongoClient } from "mongodb";

// set constant for connection uri
const uri = process.env.DB_URI;

// Variable for the database connection
export let db;
export let connection;

// Function to create database connection. Exported for server listening.
export const connectToDb = async (database) => {
  connection = await MongoClient.connect(uri);
  db = connection.db(database);
};

// Function to get all products
export const getProducts = async () => {
  // Declare variable to store product information
  const products = [];

  // Send Get request to Mongo database to find all products and push each to products array
  await db
    .collection("product_db")
    .find({}, { projection: {_id: 0} })
    .forEach((product) => products.push(product));

  // Return the product list
  return products.length !== 0 ? products : null;
};

// Function to get a product by stock number
export const getByStockNumber = async (stockNumber) => {
  // Send get request while finding the stock number
  const product = await db
    .collection("product_db")
    .findOne({ stock_number: stockNumber }, { projection: {_id: 0} });

  // Return the product or null
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

  // Return product details if confirmation true or return null
  return confirmation ? newProduct : null;;
};

// Function to update a product
export const updateProduct = async (stockNumber, requestDetails, addIfNew) => {
  //Send the post request and set to variable
  const response = await db
    .collection("product_db")
    .findOneAndUpdate(
      { stock_number: stockNumber },
      { $set: requestDetails },
      { upsert:addIfNew, projection: {_id: 0}, returnDocument : "after" }
    );

  // Return product details if confirmation true or return null
  return response;
};
