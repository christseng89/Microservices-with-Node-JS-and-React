import { Listener, OrderCreatedEvent, Subjects } from '@chinasystems/common';
import { Message } from 'node-nats-streaming';
import { queueGroupName } from './queue-group-name';

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
    // Do something with the data
    console.log('Event data!', data);

    // Ack the message
    msg.ack();
  }
}
