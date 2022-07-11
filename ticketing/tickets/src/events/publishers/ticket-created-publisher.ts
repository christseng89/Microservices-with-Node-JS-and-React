import { Publisher, Subjects, TicketCreatedEvent } from '@chinasystems/common';

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
}
