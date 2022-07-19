import { Message } from 'node-nats-streaming';
import mongoose from 'mongoose';

import { OrderCreatedEvent, OrderStatus } from '@chinasystems/common';
import { OrderCreatedListener } from '../order-created-listener';
import { natsWrapper } from '../../../nats-wrapper';
import { Ticket } from '../../../models/ticket';

const setup = async () => {
  // Create an instance of the listener
  const listener = new OrderCreatedListener(natsWrapper.client);

  // Create and save a ticket
  const ticket = Ticket.build({
    title: 'concert',
    price: 99,
    userId: new mongoose.Types.ObjectId().toHexString(),
  });
  await ticket.save();

  // Create the fake data event
  const data: OrderCreatedEvent['data'] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    status: OrderStatus.Created,
    userId: new mongoose.Types.ObjectId().toHexString(),
    expiresAt: new Date().toISOString(),
    ticket: {
      id: ticket.id,
      price: ticket.price,
    },
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, ticket, data, msg };
};

it('sets the userId of the ticket', async () => {
  console.info('Sets the userId of the Ticket, Process NODE env:', process.env.NODE_ENV);
  const { listener, ticket, data, msg } = await setup();
  await listener.onMessage(data, msg);
  const updatedTicket = await Ticket.findById(ticket.id);

  expect(updatedTicket!.orderId).toEqual(data.id);

});

it('ack the message', async () => {
  console.info('Ack the Message, Process NODE env:', process.env.NODE_ENV);
  const { listener, data, msg } = await setup();
  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});

it('publishes a ticket updated event', async () => {
  console.info('Publishes a Ticket Updated Event, Process NODE env:', process.env.NODE_ENV);
  const { listener, data, msg } = await setup();
  await listener.onMessage(data, msg);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
  // console.log((natsWrapper.client.publish as jest.Mock).mock.calls[0]);
  // [
  //   'ticket:updated',
  //   '{"id":"62d68c30f2014a3989905ee7","version":1,"title":"concert","price":99,"userId":"62d68c30f2014a3989905ee6","orderId":"62d68c30f2014a3989905ee9"}',
  // ];
  const ticketUpdatedSubject = (natsWrapper.client.publish as jest.Mock).mock.calls[0][0];
  const ticketUpdatedData = JSON.parse(
    (natsWrapper.client.publish as jest.Mock).mock.calls[0][1]
  );

  expect(ticketUpdatedSubject).toEqual('ticket:updated');
  expect(data.id).toEqual(ticketUpdatedData.orderId);
});
