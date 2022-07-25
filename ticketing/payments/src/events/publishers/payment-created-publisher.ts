import { Subjects, Publisher, PaymentCreatedEvent } from '@chinasystems/common';

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  readonly subject = Subjects.PaymentCreated;
}
