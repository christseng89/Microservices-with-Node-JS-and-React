import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import request from 'supertest';
import jwt from 'jsonwebtoken';

import { app } from '../app';

// @ts-ignore
declare global {
  var signup: () => Promise<string[]>; // cannot be used here...
  var fakeSignup: () => string[];
}

jest.mock('../nats-wrapper');
let mongo: any;
let processEnv = process.env;

// Connect to mongo https://jestjs.io/docs/api#beforeallfn-timeout
beforeAll(async () => {
  process.env.JWT_KEY = 'abcdef';
  process.env.NODE_ENV = 'test';
  mongo = await MongoMemoryServer.create();
  const mongoUri = mongo.getUri();

  await mongoose.connect(mongoUri, {});
}, 1000000);

// Cleanup database before each test https://jestjs.io/docs/api#beforeeachfn-timeout
beforeEach(async () => {
  jest.clearAllMocks();
  const collections = await mongoose.connection.db.collections();

  for (let collection of collections) {
    await collection.deleteMany({});
  }
}, 500000);

// Stop mongo server after all tests https://jestjs.io/docs/api#afterallfn-timeout
afterAll(async () => {
  await mongoose.connection.close();
  process.env = processEnv;
  try {
    await mongo.stop();
  } catch (error) {
   console.log(error); 
  }
}, 500000);

global.signup = async () => {
  const email = 'test@test.com';
  const password = 'password';

  const response = await request(app)
    .post('/auth/users/signup')
    .send({
      email,
      password,
    })
    .expect(201);

  return response.get('Set-Cookie');
}

global.fakeSignup = () => {
  // 1 Build a JWT payload.  { id, email }
  const payload = {
    id: new mongoose.Types.ObjectId().toHexString(),
    email: 'test@test.com',
  };

  // 2 Create the JWT!
  const token = jwt.sign(payload, process.env.JWT_KEY!);

  // 3 Build session Object. { jwt: MY_JWT }
  const session = { jwt: token };

  // 4 Turn that session into JSON
  const sessionJSON = JSON.stringify(session);

  // 5 Take JSON and encode it as base64
  const base64 = Buffer.from(sessionJSON).toString('base64');

  // return a string thats the cookie with the encoded data
  return [`session=${base64}`];

};
