import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import { body } from 'express-validator';

import { requireAuth, validateRequest, NotFoundError, OrderStatus } from '@chinasystems/common';
import { Order } from '../models/order';
import { Ticket } from '../models/ticket';
import { natsWrapper } from '../nats-wrapper';

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

    // Find the ticket the user is trying to order in the database
    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
      throw new NotFoundError();
    }

    // Make sure that this ticket is not already reserved
    // Run query to look at all orders.  Find an order where the ticket
    // is the ticket we just found *and* the orders status is *not* cancelled.
    // If we find an order from that means the ticket *is* reserved
    const existingOrder = await Order.findOne({
      ticket: ticket,
      status: {
        $in: [
          OrderStatus.Created,
          OrderStatus.AwaitingPayment,
          OrderStatus.Complete,
        ],
      },
    });
    if (existingOrder) {
      throw new Error('Ticket is already reserved');
    }
    // Calculate an expiration date for this order
    // Build the order and save it to the database
    // await order.save();    
    // Publish an event saying that an order was created
    // await new OrderCreatedPublisher(natsWrapper.client)
    //   .publish({
    //     id: order.id,
    //     title: order.title,
    //     price: order.price,
    //     ticketId: ticket.id,
    //   });

    res.status(201).send();
  }
);

export { router as createOrderRouter };
// Language: typescript