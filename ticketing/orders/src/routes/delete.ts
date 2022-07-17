import express, { Request, Response } from 'express';
import mongoose from 'mongoose';

import { NotFoundError, requireAuth, NotAuthorizedError, BadRequestError } from '@chinasystems/common';
import { Order, OrderStatus } from '../models/order';
import { natsWrapper } from '../nats-wrapper';
import { OrderCancelledPublisher } from '../events/publishers/order-cancelled-publisher';

const router = express.Router();

router.delete(
  '/api/orders/:id',
  requireAuth,
  async (req: Request, res: Response) => {
    if( !mongoose.Types.ObjectId.isValid(req.params.id) ) {
      throw new BadRequestError('Valid order ID required');
    }
    const order = await Order.findById(req.params.id).populate('ticket');

    if (!order) {
      throw new NotFoundError();
    }
    if (order.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }
    if (order.status === OrderStatus.Cancelled) {
      throw new BadRequestError('Ticket is already cancelled');
    }  

    order.status = OrderStatus.Cancelled;
    await order.save();

    // Publish an event saying that an order was cancelled
    await new OrderCancelledPublisher(natsWrapper.client)
    .publish({
      id: order.id,
      ticket: {
          id: order.ticket.id,
      }, 
    });    
  
    res.status(204).send(order);
  }
);

export { router as deleteOrderRouter };
