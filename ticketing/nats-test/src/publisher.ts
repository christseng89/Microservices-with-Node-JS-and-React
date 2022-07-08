import nats from 'node-nats-streaming';

const stan = nats.connect('ticketing', 'abc', { // stan = client
  url: 'http://localhost:4222',
});

stan.on('connect', () => {
  console.log('Publisher connected to NATS');
});
