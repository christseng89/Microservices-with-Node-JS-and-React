import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../app';

declare global {
  var signup: () => Promise<string[]>;
}

let mongo: any;

// Connect to mongo
beforeAll(async () => {
  process.env.JWT_KEY = 'abcdef';
  mongo = await MongoMemoryServer.create();
  const mongoUri = mongo.getUri();

  await mongoose.connect(mongoUri, {});
});

// Cleanup database before each test
beforeEach(async () => {
  const collections = await mongoose.connection.db.collections();

  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

// Stop mongo server after all tests
afterAll(async () => {
  await mongoose.connection.close();
  await mongo.stop();
});

global.signup = async () => {
  const email = 'test@test.com';
  const password = 'password';

  const response = await request(app)
    .post('/api/users/signup')
    .send({
      email,
      password,
    })
    .expect(201);

  return response.get('Set-Cookie');
}