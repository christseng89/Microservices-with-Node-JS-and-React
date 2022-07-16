import { Publisher, OrderCreatedEvent, Subjects } from '@chinasystems/common';

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
}
