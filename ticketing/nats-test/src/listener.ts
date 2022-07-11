import nats, { Message, Stan } from 'node-nats-streaming';
import { randomBytes } from 'crypto';

console.clear();
const stan = nats.connect(      // connect to the nats server STAN
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

  const options = stan
    .subscriptionOptions()
    .setManualAckMode(true)
    .setDeliverAllAvailable()   // listener will receive all messages in the queue (if there are any)
    .setDurableName('ticket-listener-queue-group'); // breakpoint resume
  const subscription = stan
    .subscribe(
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

abstract class Listener {
  private client: Stan;               // 
  constructor(client: Stan) {
    this.client = client;
  }

  abstract subject: string;           // Channel name
  abstract queueGroupName: string;    // Queue group name
  abstract onMessage(data: any, msg: Message): void;
                                      // Function to run when a message is received
  protected ackWait = 5 * 1000;       // 5 seconds wait for ack

  subscriptionOptions() {
    return this.client
      .subscriptionOptions()
      .setDeliverAllAvailable()
      .setManualAckMode(true)
      .setAckWait(this.ackWait)
      .setDurableName(this.queueGroupName);
  }

  listen() {
    const subscription = this.client
    .subscribe(
      this.subject,
      this.queueGroupName,
      this.subscriptionOptions()
    );

    subscription.on('message', (msg: Message) => {
      console.log(`Message received: ${this.subject} / ${this.queueGroupName}`);

      const parsedData = this.parseMessage(msg);
      this.onMessage(parsedData, msg);
    });
  }

  parseMessage(msg: Message) {
    const data = msg.getData();
    return typeof data === 'string'
      ? JSON.parse(data)
      : JSON.parse(data.toString('utf8')); // convert Buffer to string
  }
}
