import Queue from 'bull';

import { natsWrapper } from '../nats-wrapper';
import { ExpirationCompletePublisher } from '../events/publishers/expiration-complete-publisher';

interface Payload {
  orderId: string;
}

const queueName = 'order:expiration';
const expirationQueue = new Queue<Payload>(queueName, {
  redis: {
    host: process.env.REDIS_HOST,
  },
});

expirationQueue.process(async (job) => {
  // Publish an expiration:complete event
  await new ExpirationCompletePublisher(natsWrapper.client).publish({
      orderId: job.data.orderId,
  });
});

export { expirationQueue };
