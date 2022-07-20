import { Listener, OrderCreatedEvent, Subjects } from '@chinasystems/common';
import { Message } from 'node-nats-streaming';
import { queueGroupName } from './queue-group-name';
import { expirationQueue } from '../../queues/expiration-queue';

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
    // Do something with the data
    await expirationQueue.add({ orderId: data.id });
    // Ack the message
    msg.ack();
  }
}
