import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/ticket';
import { natsWrapper } from '../../nats-wrapper';

it('has a route handler listening to /api/tickets for post requests', 
  async () => {
    const response = await request(app)
      .post('/api/tickets')
      .send({});

    expect(response.status).not.toEqual(404);
  });

it('can only be accessed if the user is signed in', 
  async () => {
    await request(app)
      .post('/api/tickets')
      .send({})
      .expect(401);

  });

it('returns a status 201 if the user is signed in', 
  async () => {
    const response = await request(app)
      .post('/api/tickets')
      .set('Cookie', global.fakeSignup())
      .send({
        title: 'Test title',
        price: 10,
      });
  
    expect(response.status).toEqual(201);
  });

it('returns an error if an invalid title is provided', 
  async () => {
    await request(app)
      .post('/api/tickets')
      .set('Cookie', global.fakeSignup())
      .send({
        title: '',
        price: 10,
      })
      .expect(400);

    await request(app)
      .post('/api/tickets')
      .set('Cookie', global.fakeSignup())
      .send({
        price: 10,
      })
      .expect(400);
  });

it('returns an error if an invalid price is provided', 
  async () => {
    await request(app)
      .post('/api/tickets')
      .set('Cookie', global.fakeSignup())
      .send({
        title: 'Test title',
        price: -10,
      })
      .expect(400);

    await request(app)
      .post('/api/tickets')
      .set('Cookie', global.fakeSignup())
      .send({
        title: 'Test title',
      })
      .expect(400);
  });

it('creates a ticket with valid inputs', 
  async () => {
    // add in a check to make sure a ticket was created
    let tickets = await Ticket.find({});
    expect(tickets.length).toEqual(0);
    await request(app)
      .post('/api/tickets')
      .set('Cookie', global.fakeSignup())
      .send({
        title: 'Test title',
        price: 10,
      })
      .expect(201);
  
    tickets = await Ticket.find({});
    expect(tickets.length).toEqual(1); 
    expect(tickets[0].title).toEqual('Test title');
    expect(tickets[0].price).toEqual(10);
       
  });

  it('publishes an event', async () => {
    const title = 'Ticket Title - New';
  
    await request(app)
      .post('/api/tickets')
      .set('Cookie', global.fakeSignup())
      .send({
        title,
        price: 20,
      })
      .expect(201);
  
    expect(natsWrapper.client.publish).toHaveBeenCalled();
  });
  
// Language: typescript