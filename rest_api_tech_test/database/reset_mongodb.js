// // Imports
// Connect to database and connection variable
import { connectToDb, dbConnection, mongoClient } from "../products/productsModel.js";

// Reset database function
import { resetMongo } from "./resetFunction.js";

connectToDb( async (err) => {
  if (!err) {
    try {
      await resetMongo(dbConnection, mongoClient);
    } catch (error) {
      console.error("Database reset failed: ", error);
    } finally {
      mongoClient.close();
    }
  }
})