// // Imports
// Import the reset function for use before each test
import resetMongo from "../database/resetFunction.js";
// Import Mongodb connection function for use before each test
import { connection, connectToDb } from "./productsModel.js";
// Import app
import app from "../app.js";
// Import SuperTest
import request from "supertest";

// // Testing
describe("API Testing", () => {
  // Before starting tests: Reset the database and then connect to the database
  beforeEach(async () => {
    // Reset the database
    await resetMongo();

    // Connect to the database
    await connectToDb();
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

  it("should ADD a new product to the database using the API", async () => {
    // Constant for the new product
    const newProduct = {
      stock_number: "12345",
      name: "Pro Batteries",
      Description: "Batteries",
      Price: "£1.99",
    };

    // Send the new product and set the return to a variable
    await request(app) /* Send request to app */
      .post("/products") /* Send to GET route */
      .send(newProduct) /* Send the new product info*/
      .set("Accept", "application/json") /* Send the new product info*/
      .expect("Content-Type", /json/) /* Expect the response to be json */
      .expect(201) /* Expect the status to be 200 */
      .then((res) => {
        expect(res.body.status).toBe("Success");
        expect(res.body.data).toEqual(newProduct);
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

    // Send the new info with the associated stock number and set the return to a variable
    const response = await request(app) /* Send request to app */
      .patch(`/products/${stockNumber}`) /* Send to GET route */
      .send(JSON.stringify(newInfo)) /* Send the new product info*/
      .set("Accept", "application/json") /* Send the new product info*/
      .expect("Content-Type", /json/) /* Expect the response to be json */
      .expect(200) /* Expect the status to be 200 */
      .then((res) => {
        // Expect the status to be 'Success'
        expect(res.body.status).toBe("Success");
        // Compare the response and expected result
        expect(res.body.data).toEqual(expectedResult);
      });
  });
});
