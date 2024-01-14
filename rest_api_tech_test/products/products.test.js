import resetMongo from "../database/resetFunction.js";
import { connection, connectToDb, getProducts } from "./productsModel.js";

describe("insert", () => {
  // let connection;
  // let dbConnection;

  beforeAll(async () => {
    await resetMongo();

    await connectToDb();
  });

  afterAll(async () => {
    await connection.close();
  });

  it("should GET the database data", async () => {
    const response = await getProducts();
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

    expect(response).toEqual(expectedResult);
  });


  
});
