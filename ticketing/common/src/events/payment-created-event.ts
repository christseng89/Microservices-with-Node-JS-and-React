import { Subjects } from './subjects';

export interface PaymentCreatedEvent {
  readonly subject: Subjects.PaymentCreated;
  readonly data: {
    readonly id: string;
    readonly orderId: string;
    readonly stripeId: string;
  };
}
