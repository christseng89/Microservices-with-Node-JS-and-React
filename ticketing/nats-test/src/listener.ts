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
  const options = stan.subscriptionOptions()
    .setManualAckMode(true);
  const subscription = stan.subscribe(
    'ticket:created', 
    'orders-listener-queue-group',
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
