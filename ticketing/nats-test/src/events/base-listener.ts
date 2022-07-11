import { Message, Stan } from 'node-nats-streaming';

export abstract class Listener {
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
