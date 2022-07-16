import { Publisher, OrderCreatedEvent, Subjects } from '@chinasystems/common';

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
}
