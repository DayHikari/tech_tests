// // Imports
// Import express function from express
import express from "express";

// Import the product routes
import { productsRoutes } from "./products/productsRouter.js";

// App constant for express
const app = express();

app.use(express.json());

// Health check to confirm server and app working
app.get("/", (req, res) => {
    res.json({
        status: "success",
        data: "The route works!"
    });
});

// Set requests to "products" to follow productRoutes
app.use("/products", productsRoutes);


// Export the app constant
export default app;
