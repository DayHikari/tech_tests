// // Imports
// Reset database function
import resetMongo from "./resetFunction.js";

try {
  await resetMongo();
} catch (error) {
  console.error("Database reset failed: ", error);
};
