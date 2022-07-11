import { Message, Stan } from 'node-nats-streaming';
import { Subjects } from './subjects';

interface Event {
  subject: Subjects;
  data: any;
}

export abstract class Listener <T extends Event> {
  private client: Stan;               // 
  constructor(client: Stan) {
    this.client = client;
  }

  abstract subject: T['subject'];     // Channel name
  abstract queueGroupName: string;    // Queue group name
  abstract onMessage(data: T['data'], msg: Message): void;
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
      const parsedData = this.parseMessage(msg);
      console.log(`Message #${msg.getSequence()} received from subject ${this.subject}/${this.queueGroupName}, with data`, parsedData);

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
