import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';

import { TicketUpdatedEvent } from '@chinasystems/common';
import { TicketUpdatedListener } from '../ticket-updated-listener';
import { natsWrapper } from '../../../nats-wrapper';
import { Ticket } from '../../../models/ticket';

const setup = async () => {
  // Create a listener
  const listener = new TicketUpdatedListener(natsWrapper.client);

  // Create and save a ticket
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'concert',
    price: 20,
  });
  await ticket.save();

  // Create a fake TicketUpdatedEvent data object
  const data: TicketUpdatedEvent['data'] = {
    id: ticket.id,
    version: ticket.version + 1,
    title: 'new concert',
    price: 20.1,
    userId: new mongoose.Types.ObjectId().toHexString(),
  };

  // Create a fake msg object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  // return all of this stuff
  return { msg, ticket, data, listener };
};

it('finds, updates, and saves a ticket', async () => {
  console.info('Finds, Updates, and Saves a ticket, Process NODE env:', process.env.NODE_ENV);
  // create a listener
  const { msg, ticket, data, listener } = await setup();
  await listener.onMessage(data, msg);

  const updatedTicket = await Ticket.findById(ticket.id);

  expect(updatedTicket!.title).toEqual(data.title);
  expect(updatedTicket!.price).toEqual(data.price);
  expect(updatedTicket!.version).toEqual(data.version);
});

it('acks the message', async () => {
  console.info('Ack Message, Process NODE env:', process.env.NODE_ENV);

  // create a listener
  const { msg, data, listener } = await setup();  
  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});
