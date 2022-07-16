import { Subjects, Publisher, OrderCancelledEvent } from '@chinasystems/common';

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}
