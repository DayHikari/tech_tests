// // Imports
import app from "./app.js";
import { connectToDb } from "./products/productsModel.js";

// Port constant using test requirement
const port = 8080;

connectToDb((err) => {
  if (!err) {
    // Set the server listening for the port
    app.listen(port, () => {
      console.log(`Server is listening to http://localhost:${port}`);
    });
  }
});
