import { test, expect, beforeEach, afterEach } from "vitest";
import request from "supertest";
import resetMongo from "../database/resetFunction";
import app from "../app.js";
import {
  connectToDb,
  getProducts,
  mongoClient,
  dbConnection
} from "../products/productsModel.js";
import { MongoClient } from "mongodb";

const uri =
  "mongodb+srv://davidmason:Password123@firstmongodb.exiwpxq.mongodb.net/?retryWrites=true&w=majority";


test("Test test", () => {});

test("Model GET request", async () => {
  await resetMongo();

  let products= []
  expect(async () => {
    const client = new MongoClient(uri);
    try{
      const db = client.db();
      await db.command({ping: 1})
      console.log(await getProducts())
    } finally {
      await client.close()
    }
  }).not.toThrow()

});
