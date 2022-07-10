import nats, { Message } from 'node-nats-streaming';
import { randomBytes } from 'crypto';

console.clear();
const stan = nats.connect(
  'ticketing', 
  randomBytes(4).toString('hex'), {
    url: 'http://localhost:4222',
  }
);

stan.on('connect', () => {
  console.log('Listener connected to NATS');

  stan.on('close', () => {
    console.log('NATS connection closed');
    process.exit();
  });

  const options = stan.subscriptionOptions()
    .setManualAckMode(true)
    .setDeliverAllAvailable()   // listener will receive all messages in the queue (if there are any)
    .setDurableName('ticket-service'); // breakpoint resume
  const subscription = stan.subscribe(
    'ticket:created', 
    'ticket-listener-queue-group', // breakpoint resume
    options
  );

  subscription.on(
    'message', 
    (msg: Message) => {
      console.log(`Received event: #${msg.getSequence()}, with data ${msg.getData()}`);

      msg.ack();
    }
  );
});

process.on('SIGINT', () => stan.close());
process.on('SIGTERM', () => stan.close());
