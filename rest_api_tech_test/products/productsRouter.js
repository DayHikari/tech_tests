// // Imports
// Express to create router
import express from "express";

// Controller functions for product
import * as productControllers from "./productsController.js";

// Create the route constant using express Router
export const productsRoutes = express.Router();

// // Product routes
// Get all products
productsRoutes.get("/", productControllers.getProducts);

// Get by stock number
productsRoutes.get("/:id", productControllers.getByStockNumber);

