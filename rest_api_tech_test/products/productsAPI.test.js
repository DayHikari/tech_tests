// // Imports
// Import the reset function for use before each test
import resetMongo from "../database/resetFunction.js";
// Import Mongodb connection function for use before each test
import { connection, connectToDb, db } from "./productsModel.js";
// Import app
import app from "../app.js";
// Import SuperTest
import request from "supertest";

// // Testing
describe("API Testing", () => {
  // Before starting tests: Reset the database and then connect to the database
  beforeEach(async () => {
    // Reset the database
    await resetMongo("test");

    // Connect to the database
    await connectToDb("test");
  });

  // After all tests: Disconnect from the database
  afterEach(async () => {
    // Disconnect from the database
    await connection.close();
  });

  // // API testing
  it("should GET all data from the database using the API", async () => {
    // Constant for the expected result
    const expectedResult = [
      {
        stock_number: "98765",
        name: "Excel Pro PC",
        Description: "Desktop Computer",
        Price: "£2999.99",
      },
      {
        stock_number: "98766",
        name: "Legend Pro PC",
        Description: "Desktop Computer",
        Price: "£3999.99",
      },
    ];

    // Call the get function and set the return to a constant
    const response = await request(app) /* Send request to app */
      .get("/products") /* Send to GET route */
      .expect("Content-Type", /json/) /* Expect the response to be json */
      .expect(200); /* Expect the status to be 200 */

    // Expect the status to be 'Success'
    expect(response.body.status).toBe("Success");

    // Compare the data to the expected result
    expect(response.body.data).toEqual(expectedResult);
  });

  it("should respond with 500 when no data found", async () => {
    // Deletes all data in test collection
    const result = await db.collection("product_db").deleteMany({});

    // Confirmation that the data was deleted
    expect(result.deletedCount).toBe(2);

    // Send get request to the Mongodb
    const response = await request(app)
      .get("/products") /* Send to GET route */
      .expect("Content-Type", /json/) /* Expect the response to be json */
      .expect(500); /* Expect the status to be 500 */

    // Expect the status to be 'Failed'
    expect(response.body.status).toBe("Failed");

    // Compare the data to the expected result
    expect(response.body.data).toBe("Unable to retrieve data from database");
  });

  it("should GET a product using the stock number using the API", async () => {
    // Constant for the expected result from the database
    const expectedResult = {
      stock_number: "98765",
      name: "Excel Pro PC",
      Description: "Desktop Computer",
      Price: "£2999.99",
    };

    // Call the GET by stock number function and set return to a variable
    const response = await request(app) /* Send request to app */
      .get("/products/98765") /* Send to GET route with sotck number */
      .expect("Content-Type", /json/) /* Expect the response to be json */
      .expect(200); /* Expect the status to be 200 */

    // Expect the status to be 'Success'
    expect(response.body.status).toBe("Success");

    // Compare the data to the expected result
    expect(response.body.data).toEqual(expectedResult);
  });

  it("should respond with 404 when incorrect stock number used", async () => {
    // Call the GET with non-existant stock number function and set return to a variable
    const response = await request(app) /* Send request to app */
      .get("/products/00000") /* Send to GET route with stock number */
      .expect("Content-Type", /json/) /* Expect the response to be json */
      .expect(404); /* Expect the status to be 404 */

    // Expect the status to be 'Failed'
    expect(response.body.status).toBe("Failed");

    // Compare the data to the expected result
    expect(response.body.data).toBe(
      "Stock number not found, please confirm the stock number"
    );
  });

  it("should ADD a new product to the database using the API", async () => {
    // Constant for the new product
    const newProduct = {
      stock_number: "12345",
      name: "Pro Batteries",
      Description: "Batteries",
      Price: "£1.99",
    };

    // Send the new product
    await request(app) /* Send request to app */
      .post("/products") /* Send to POST route */
      .send(newProduct) /* Send the new product info*/
      .expect("Content-Type", /json/) /* Expect the response to be json */
      .expect(201) /* Expect the status to be 201 */
      .then((res) => {
        expect(res.body.status).toBe("Success");
        expect(res.body.data).toEqual(newProduct);
      });
  });

  it("should respond with a 400 during ADD request when content is not JSON", async () => {
    // Constant for the new product
    const newProduct = {
      stock_number: "12345",
      name: "Pro Batteries",
      Description: "Batteries",
      Price: "£1.99",
    };

    // Send the new product
    await request(app) /* Send request to app */
      .post("/products") /* Send to POST route */
      .send(JSON.stringify(newProduct)) /* Send the new product info*/
      .expect("Content-Type", /json/) /* Expect the response to be json */
      .expect(400) /* Expect the status to be 400 */
      .then((res) => {
        // Expect the status to be 'Failed'
        expect(res.body.status).toBe("Failed");
        // Compare the response and expected result
        expect(res.body.data).toBe("Please submit data as JSON. Data will be returned as JSON.");
      });
  });

  it("should respond with a 400 when content is incomplete", async () => {
    // Constant for the new product
    const newProduct = {
      stock_number: "12345",
      name: "Pro Batteries",
      Price: "£1.99",
    };

    // Send the new product
    await request(app) /* Send request to app */
      .post("/products") /* Send to POST route */
      .send(newProduct) /* Send the new product info*/
      .expect("Content-Type", /json/) /* Expect the response to be json */
      .expect(400) /* Expect the status to be 400 */
      .then((res) => {
        // Expect the status to be 'Failed'
        expect(res.body.status).toBe("Failed");
        // Compare the response and expected result
        expect(res.body.data).toBe("Missing product parameters. Ensure stock_number, name, Description and Price are submitted as written here.");
      });
  });

  it("should UPDATE the product with the new information using the model function", async () => {
    // Constant for the new product information
    const newInfo = { Price: "£5999.99" };

    // Constant for the stock number
    const stockNumber = "98765";

    // Constant for the expected result
    const expectedResult = {
      stock_number: "98765",
      name: "Excel Pro PC",
      Description: "Desktop Computer",
      Price: "£5999.99",
    };

    // Send the new info with the associated stock number
    await request(app) /* Send request to app */
      .put(`/products/${stockNumber}`) /* Send to PUT route */
      .send(newInfo) /* Send the new product info*/
      .expect("Content-Type", /json/) /* Expect the response to be json */
      .expect(200) /* Expect the status to be 200 */
      .then((res) => {
        // Expect the status to be 'Success'
        expect(res.body.status).toBe("Success");
        // Compare the response and expected result
        expect(res.body.data).toEqual(expectedResult);
      });
  });

  it("should respond with 400 during UPDATE if content is not json", async () => {
    // Constant for the new product information
    const newInfo = { Price: "£5999.99" };

    // Constant for the stock number
    const stockNumber = "98765";

    // Send the new info with the associated stock number
    await request(app) /* Send request to app */
      .put(`/products/${stockNumber}`) /* Send to PUT route */
      .send(JSON.stringify(newInfo)) /* Send the new product info*/
      .expect("Content-Type", /json/) /* Expect the response to be json */
      .expect(400) /* Expect the status to be 400 */
      .then((res) => {
        // Expect the status to be 'Failed'
        expect(res.body.status).toBe("Failed");
        // Compare the response and expected result
        expect(res.body.data).toBe("Please submit data as JSON. Data will be returned as JSON.");
      });
  });

  it("should respond with 404 during UPDATE if stock number doesn't exist", async () => {
    // Constant for the new product information
    const newInfo = { Price: "£5999.99" };

    // Constant for the stock number
    const stockNumber = "00000";

    // Send the new info with the associated stock number and set the return to a variable
    await request(app) /* Send request to app */
      .put(`/products/${stockNumber}`) /* Send to PUT route */
      .send(newInfo) /* Send the new product info*/
      .expect("Content-Type", /json/) /* Expect the response to be json */
      .expect(404) /* Expect the status to be 404 */
      .then((res) => {
        // Expect the status to be 'Failed'
        expect(res.body.status).toBe("Failed");
        // Compare the response and expected result
        expect(res.body.data).toBe("Stock number not found, please confirm stock number");
      });
  });
});
