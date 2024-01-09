// // Imports
import app from "./app.js";

// Port constant using test requirement
const port = 3000;

// Set the server listening for the port
app.listen(port, () => {
    console.log(`Server is listening to http://localhost:${port}`);
})
