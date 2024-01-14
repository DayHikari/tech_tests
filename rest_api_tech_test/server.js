// // Imports
import app from "./app.js";
import { connectToDb } from "./products/productsModel.js";

// Port constant using test requirement
const port = 8080;


app.listen(port, () => {
  connectToDb();
  console.log(`Server is listening to http://localhost:${port}`);
});
