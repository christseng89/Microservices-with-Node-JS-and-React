import request from 'supertest';
import { app } from '../../app';

it('fails when a email that does not exist is supplied', async () => {
  await request(app)
    .post('/api/users/signin')
    .send({
      email: 'test@test.com',
      password: 'password'
    })
    .expect(400);
});

it('fails when an incorrect password is supplied', async () => {
  const cookie = await global.signup();
  await request(app)
    .post('/api/users/signin')
    .send({
      email: 'test@test.com',
      password: 'aslkdfjalskdfj'
    })
    .expect(400);
});

it('responds with a cookie when given valid credentials', async () => {
  const cookie = await global.signup();
  const response = await request(app)
    .post('/api/users/signin')
    .send({
      email: 'test@test.com',
      password: 'password'
    })
    .expect(400);

  expect(response.get('Set-Cookie')).toBeDefined();
});

it('responds no cookie when given invalid credentials', async () => {
  await global.signup();
  const response = await request(app)
    .post('/api/users/signin')
    .send({
      email: 'test@test.com',
      password: 'pas11sword'
    })
    .expect(400);

  expect(!response.get('Set-Cookie')).toBeDefined();
});
