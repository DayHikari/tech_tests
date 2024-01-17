// // Imports
// Reset database function
import resetMongo from "./resetFunction.js";

try {
  await resetMongo("main");
} catch (error) {
  console.error("Database reset failed: ", error);
};
