// // Imports
// Connect to database and connection variable
import { connectToDb, db, connection } from "../products/productsModel.js";

// Function to reset Mongodb
const resetMongo = async (database) => {
  // Connect to Mongodb
  await connectToDb(database)

  // Try, catch, finally statement
  try {
    // Run the drop command for the collection "product_db"
    await db.collection("product_db").drop((err) => {
      if (err) {
        console.error("Database not deleted: ", err);
      }
    });

    // Run the create command for the collection "product_db"
    await db.createCollection("product_db", (err) => {
      if (err) {
        console.error("Database not created: ", err);
      }
    });

    // Create constants for the data to add
    const firstProduct = {
      stock_number: "98765",
      name: "Excel Pro PC",
      Description: "Desktop Computer",
      Price: "£2999.99",
    };

    const secondProduct = {
      stock_number: "98766",
      name: "Legend Pro PC",
      Description: "Desktop Computer",
      Price: "£3999.99",
    };

    // Run the command to add both products to the database
    await db.collection("product_db").insertMany([firstProduct, secondProduct]);

    console.log("Database reset");
  } catch (error) {
    console.error("Database reset failed: ", error);
  } finally {
    // End the connection
    connection.close();
  }
};

export default resetMongo;
