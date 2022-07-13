import request from 'supertest';
import { app } from '../../app';

const createOrder = () => {
  return request(app)
    .post('/api/orders')
    .set('Cookie', global.fakeSignup())
    .send({
      title: 'Create Order',
      price: 20,
  });
};

it('can fetch a list of orders', async () => {
  await createOrder();
  await createOrder();
  await createOrder();

  const response = await request(app)
    .get('/api/orders')
    .send()
    .expect(200);

  expect(response.body.length).toEqual(3);
});
