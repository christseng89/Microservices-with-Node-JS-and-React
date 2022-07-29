import { Subjects } from './subjects';

export interface TicketUpdatedEvent {
  readonly subject: Subjects.TicketUpdated;
  data: {
    readonly id: string;
    readonly version: number; // Ticket version number
    readonly title: string;
    readonly price: number;
    readonly userId: string;
    readonly orderId?: string;
  };
}
