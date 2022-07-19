import { Message } from 'node-nats-streaming';
import { Listener, OrderCreatedEvent, Subjects } from '@chinasystems/common';
import { queueGroupName } from './queue-group-name';

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName = queueGroupName;

  async onMessage(_data: OrderCreatedEvent['data'], _msg: Message) { 
    /* TODO document why this async method 'onMessage' is empty */ 
  }
}
