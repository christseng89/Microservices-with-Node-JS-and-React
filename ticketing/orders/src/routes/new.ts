import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import { body } from 'express-validator';

import { requireAuth, validateRequest, NotFoundError } from '@chinasystems/common';
import { Order, OrderStatus } from '../models/order';
import { Ticket } from '../models/ticket';
import { natsWrapper } from '../nats-wrapper';

const EXPIRATION_WINDOW_SECONDS = 15 * 60;
const router = express.Router();
router.post(
  '/api/orders',
  requireAuth, 
  [
    body('ticketId')
      .not()
      .isEmpty()
      .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
      .withMessage('TicketId is required'),
  ],
  validateRequest,  
  async (req: Request, res: Response) => {
    const { ticketId } = req.body;

    // Find the ticket the user is trying to order in the Ticket database
    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
      throw new NotFoundError();
    }

    // Make sure that this ticket is not reserved in the Order database
    const isReserved = await ticket.isReserved();
    if (isReserved) {
      throw new Error('Ticket is already reserved');
    }

    // Calculate an expiration date for this order
    const expiration = new Date();
    expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS);

    // Build the order and save it to the database
    const order = Order.build({
      userId: req.currentUser!.id,
      status: OrderStatus.Created,
      expiresAt: expiration,
      ticket,
    });
    await order.save();

    // Publish an event saying that an order was created
    // await new OrderCreatedPublisher(natsWrapper.client)
    //   .publish({
    //     id: order.id,
    //     title: order.title,
    //     price: order.price,
    //     ticketId: ticket.id,
    //   });    

    res.status(201).send(order);
  }
);

export { router as createOrderRouter };
// Language: typescript