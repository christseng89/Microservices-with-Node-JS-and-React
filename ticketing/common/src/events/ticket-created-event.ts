import { Subjects } from './subjects';

export interface TicketCreatedEvent {
  readonly subject: Subjects.TicketCreated;
  data: {
    readonly id: string;
    readonly version: number; // Ticket version number
    readonly title: string;
    readonly price: number;
    readonly userId: string;
  };
}
