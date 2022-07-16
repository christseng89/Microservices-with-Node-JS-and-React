import mongoose from 'mongoose';
import request from 'supertest';

import { Order, OrderStatus } from '../../models/order';
import { Ticket } from '../../models/ticket';
import { app } from '../../app';
import { natsWrapper } from '../../nats-wrapper';

it('returns an error if the ticket does not exist', async () => {
  const ticketId = new mongoose.Types.ObjectId();

  await request(app)
    .post('/api/orders')
    .set('Cookie', global.fakeSignup())
    .send({ ticketId })
    .expect(404);
});

it('returns an error if the ticket is already reserved', async () => {
  // Create a ticket
  const ticket = Ticket.build({
    title: 'concert',
    price: 20,
  });
  await ticket.save();

  // Create order for ticket and change the Order status to reserved
  const order = Order.build({
    ticket,
    userId: new mongoose.Types.ObjectId().toHexString(),
    status: OrderStatus.Created,
    expiresAt: new Date(),
  });
  await order.save();

  // Order the ticket again
  await request(app)
    .post('/api/orders')
    .set('Cookie', global.fakeSignup())
    .send({ ticketId: ticket.id })
    .expect(400);
});

it('reserves a ticket', async () => {
  // Create a ticket
  const ticket = Ticket.build({
    title: 'concert',
    price: 20,
  });
  await ticket.save();

  // Order the ticket
  await request(app)
    .post('/api/orders')
    .set('Cookie', global.fakeSignup())
    .send({ ticketId: ticket.id })
    .expect(201);
});

it('publishes an order created event', async () => {
  const ticket = Ticket.build({
    title: 'concert',
    price: 20,
  });
  await ticket.save();

  await request(app)
    .post('/api/orders')
    .set('Cookie', global.fakeSignup())
    .send({
      ticketId: ticket.id,
    })
    .expect(201);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
