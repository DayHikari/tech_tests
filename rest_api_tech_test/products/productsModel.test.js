// // Imports
// Import the reset function for use before each test
import resetMongo from "../database/resetFunction.js";
// Import Mongodb connection function for use before each test and Model functions
import { addNewProduct, connection, connectToDb, getByStockNumber, getProducts, updateProduct } from "./productsModel.js";

// // Testing 
describe("Model unit testing", () => {
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

  // // Model Functions
  it("should GET the database data using model function", async () => {
    // Constant for the expected result from database
    const expectedResult = [
      {
        stock_number: '98765',
        name: 'Excel Pro PC',
        Description: 'Desktop Computer',
        Price: '£2999.99'
      },
      {
        stock_number: '98766',
        name: 'Legend Pro PC',
        Description: 'Desktop Computer',
        Price: '£3999.99'
      }
    ];
    
    // Call GET model function and set return to a variable
    const response = await getProducts();

    // Compare the expected and the response
    expect(response).toEqual(expectedResult);
  });

  it("should GET a product using the stock number using model function", async () => {
    // Constant for the expected result from the database
    const expectedResult = {
      stock_number: '98765',
      name: 'Excel Pro PC',
      Description: 'Desktop Computer',
      Price: '£2999.99'
    };

    // Call the GET by stock number function and set return to a variable
    const response = await getByStockNumber("98765");
    
    // Compare the expected and the response
    expect(response).toEqual(expectedResult);
  });

  it("should ADD a new product to the database using the model function", async () => {
    // Constant for the new product
    const newProduct = {
      stock_number: "12345",
      name: "Pro Batteries",
      Description: "Batteries",
      Price: "£1.99"
     };

     // Constant for the expected result as newProduct will be modified by usage
     const expectedResult = {...newProduct};

     // Send the new product and set the return to a variable
     const response = await addNewProduct(newProduct);

     // Compare the response to the expected result.
     expect(response).toEqual(expectedResult);
  });

  it("should UPDATE the product with the new information using the model function", async () => {
    // Constant for the new product information
    const newInfo = {Price: '£5999.99'};

    // Constant for the stock number
    const stockNumber = '98765';

    // Constant for the expected result
    const expectedResult = {
      stock_number: '98765',
      name: 'Excel Pro PC',
      Description: 'Desktop Computer',
      Price: '£5999.99'
    };

    // Send the new info with the associated stock number and set the return to a variable
    const response = await updateProduct(stockNumber, newInfo);

    // Compare the response and expected result
    expect(response).toEqual(expectedResult);
  });
});