import { Message } from 'node-nats-streaming';

import { Listener, OrderCreatedEvent, Subjects } from '@chinasystems/common';
import { queueGroupName } from './queue-group-name';
import { Order } from '../../models/order';

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
    const order = Order.build({
      ...data,
      price: data.ticket.price,
    });
    await order.save();

    msg.ack();
  }
}
