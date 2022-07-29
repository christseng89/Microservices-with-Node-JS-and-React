import { Subjects } from './subjects';

export interface OrderCancelledEvent {
  readonly subject: Subjects.OrderCancelled;
  data: {
    readonly id: string;
    readonly version: number; // Order version number
    ticket: {
      readonly id: string;
    };
  };
}
