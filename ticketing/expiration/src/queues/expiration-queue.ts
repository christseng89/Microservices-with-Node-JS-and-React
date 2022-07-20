import Queue from 'bull';

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
  console.log(
    'I want to publish an expiration:complete event for orderId',
    job.data.orderId
  );
  // Publish an expiration:complete event
  // await expirationQueue.add({ orderId: job.data.orderId });
});

export { expirationQueue };
