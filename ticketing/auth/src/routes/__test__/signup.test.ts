import request from 'supertest';
import { app } from '../../app';

it('returns a 201 on successful signup', async () => {
  await signup();
});

it('disallow duplicate email to signup', async () => {
  await signup();
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'password'
    })
    .expect(400);
});

it('returns a 400 with an invalid email', async () => {
  return request(app)
    .post('/api/users/signup')
    .send({
      email: 'alskdflaskjfd',
      password: 'password'
    })
    .expect(400);
});

it('returns a 400 with an invalid password', async () => {
  return request(app)
    .post('/api/users/signup')
    .send({
      email: 'alskdflaskjfd',
      password: 'p'
    })
    .expect(400);
});

it('returns a 400 with missing email and password', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com'
    })
    .expect(400);

  await request(app)
    .post('/api/users/signup')
    .send({
      password: 'alskjdf'
    })
    .expect(400);
});

it('sets a cookie after successful signup', async () => {
  const cookie = await signup();
  expect(cookie).toBeDefined();
});

it('delete cookie after unsuccessful signup', async () => {
  const response = await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test',
      password: 'password'
    })
    .expect(400);

  expect(!response.get('Set-Cookie')).toBeDefined();
});