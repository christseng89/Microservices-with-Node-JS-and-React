import { Ticket } from '../ticket';

it('implements optimistic concurrency control', async () => {
  console.info('Info: Test OCC here ...');
  // Create an instance of a ticket
  const ticket = Ticket.build({
    title: 'concert',
    price: 5,
    userId: '123',
  });

  // Save the ticket to the database
  await ticket.save();

  // fetch the ticket twice (at the same time)
  let instance1 = await Ticket.findById(ticket.id);
  const instance2 = await Ticket.findById(ticket.id);

  // make two separate changes to the tickets we fetched
  instance1!.set({ price: 10 });
  instance2!.set({ price: 15 });

  // save the first fetched ticket
  await instance1!.save();

  // update and save the first fetched ticket again
  instance1!.set({ price: 12 });
  await instance1!.save();

  // fetch instance1 the ticket after updates and update again
  instance1 = await Ticket.findById(ticket.id);
  instance1!.set({ price: 17 });
  await instance1!.save();

  // save the second fetched ticket and expect an error
  try {
    await instance2!.save();
  } catch (err) {
    console.log("Error :",JSON.stringify(err));
    return;
  }

  throw new Error('Should not reach this point');
});
