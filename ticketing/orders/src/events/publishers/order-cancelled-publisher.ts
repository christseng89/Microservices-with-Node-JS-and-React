import { Subjects, Publisher, OrderCancelledEvent } from '@chinasystems/common';

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
}
