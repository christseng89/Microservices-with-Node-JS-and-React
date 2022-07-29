import { Subjects } from './subjects';
import { OrderStatus } from './types/order-status';

export interface OrderCreatedEvent {
  readonly subject: Subjects.OrderCreated;
  data: {
    readonly id: string;
    readonly version: number; // Order version number
    readonly status: OrderStatus;
    readonly userId: string;
    readonly expiresAt: string;
    ticket: {
      readonly id: string;
      readonly price: number;
    };
  };
}
