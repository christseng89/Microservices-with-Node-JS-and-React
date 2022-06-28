import request from 'supertest';
import { app } from '../../app';

it('clears the cookie after signing out', async () => {
  await global.signup();
  const authRes = await request(app)
  .post('/api/users/signin')
  .send({
    email: 'test@test.com',
    password: 'password'
  })
  .expect(200);

  const cookie = authRes.get('Set-Cookie');    
  const response = await request(app)
    .post('/api/users/signout')
    .set('Cookie', cookie)    
    .send({})
    .expect(200);

  expect(!response.get('Set-Cookie')).toBeDefined();
});
