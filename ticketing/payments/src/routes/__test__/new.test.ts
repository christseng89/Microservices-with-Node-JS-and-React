import mongoose from 'mongoose';
import request from 'supertest';
import Stripe from 'stripe';

import { OrderStatus } from '@chinasystems/common';
import { app } from '../../app';
import { Order } from '../../models/order';
import { Payment } from '../../models/payment';

import { stripe } from '../../stripe';

let stripeTestDescription = 'returns a 201 with valid inputs';
if (process.env.STRIPE_KEY) {
  stripeTestDescription = stripeTestDescription + ' REAL STRIPE TEST';
} else {
  stripeTestDescription = stripeTestDescription + ' MOCK STRIPE TEST';
}
it('returns a 404 when purchasing an order that does not exist', async () => {
  await request(app)
    .post('/api/payments')
    .set('Cookie', global.fakeSignup())
    .send({
      token: 'token...',
      orderId: new mongoose.Types.ObjectId().toHexString(),
    })
    .expect(404);
});

it('returns a 401 when purchasing an order that does not belong to the user', async () => {
  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    userId: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    price: 20,
    status: OrderStatus.Created,
  });
  await order.save();

  // fakeSignup a new user
  await request(app)
    .post('/api/payments')
    .set('Cookie', global.fakeSignup())
    .send({
      token: 'token...',
      orderId: order.id,
    })
    .expect(401);
});

it('returns a 400 when purchasing a cancelled order', async () => {
  const userId = new mongoose.Types.ObjectId().toHexString();
  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    userId,
    version: 0,
    price: 20,
    status: OrderStatus.Cancelled,
  });
  await order.save();

  await request(app)
    .post('/api/payments')
    .set('Cookie', global.fakeSignup(userId))
    .send({
      orderId: order.id,
      token: 'token...',
    })
    .expect(400);
});

it(stripeTestDescription, async () => {
  const userId = new mongoose.Types.ObjectId().toHexString();
  const price = Math.floor(Math.random() * 100000);
  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    userId,
    version: 0,
    price,
    status: OrderStatus.Created,
  });
  await order.save();

  await request(app)
    .post('/api/payments')
    .set('Cookie', global.fakeSignup(userId))
    .send({
      token: 'tok_visa',
      orderId: order.id,
    })
    .expect(201);
   
  let returnCharge: Stripe.Charge | undefined;
  if (process.env.STRIPE_KEY) {
    // REAL STRIPE TEST
    const stripeCharges = await stripe.charges.list({ limit: 10, });
    const stripeCharge = stripeCharges['data'].find((charge) => {
      return charge.amount === price * 100;
    });
    
    returnCharge = stripeCharge;
    expect(stripeCharge).toBeDefined();
    expect(stripeCharge!.currency).toEqual('usd');
    expect(stripeCharge!.amount).toEqual(price * 100);  
  } else  {
    // FAKE STRIPE TEST
    const chargeOptions = (stripe.charges.create as jest.Mock).mock.calls[0][0];
    returnCharge = chargeOptions;
    expect(chargeOptions.source).toEqual('tok_visa');
    expect(chargeOptions.amount).toEqual(price * 100);
    expect(chargeOptions.currency).toEqual('usd');  
  }

  // Check payment ....
  const payment = await Payment.findOne({
    orderId: order.id,
    stripeId: returnCharge!.id,
  });
  expect(payment).not.toBeNull();  
  expect(payment!.orderId).toEqual(order.id);
  expect(payment!.stripeId).toEqual(returnCharge!.id);
});
