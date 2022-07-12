import { Message } from 'node-nats-streaming';

import { Listener } from './base-listener';
import { Subjects } from './subjects';
import { TicketCreatedEvent } from './ticket-created-event';

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
  queueGroupName = 'payments-service';

  onMessage(_data: TicketCreatedEvent['data'], msg: Message) {
    // console.log(`Event #${msg.getSequence()},`, 'with data', data);
    // Business log here...
    // console.log('Name :', data.title, ', Price :', data.price);

    msg.ack();
  }
}  
