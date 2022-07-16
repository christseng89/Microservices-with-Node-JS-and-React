import express, { Request, Response } from 'express';

import { NotFoundError, requireAuth, NotAuthorizedError } from '@chinasystems/common';
import { Order, OrderStatus } from '../models/order';
import { natsWrapper } from '../nats-wrapper';
import { OrderCancelledPublisher } from '../events/publishers/order-cancelled-publisher';

const router = express.Router();

router.delete(
  '/api/orders/:id',
  requireAuth,
  async (req: Request, res: Response) => {
    const order = await Order.findById(req.params.id).populate('ticket');

    if (!order) {
      throw new NotFoundError();
    }
    if (order.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
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
