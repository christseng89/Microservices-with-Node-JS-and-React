import nats from 'node-nats-streaming';
import { TicketCreatedPublisher } from './events/ticket-created-publisher';

console.clear();
const stan = nats.connect('ticketing', 'abc', {
  url: 'http://localhost:4222',
});

stan.on('connect', () => {
  console.log('Publisher connected to NATS');

  const publish = new TicketCreatedPublisher(stan);
  publish.publish({
    id: '1234',
    title: 'Concert',
    price: 23.99,
  });
});
