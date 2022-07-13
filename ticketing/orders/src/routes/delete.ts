import express, { Request, Response } from 'express';

import { NotFoundError, requireAuth, NotAuthorizedError } from '@chinasystems/common';
import { Order } from '../models/order';

// import { natsWrapper } from '../nats-wrapper';
// import { OrderUpdatedPublisher } from '../events/publishers/order-updated-publisher';

const router = express.Router();

router.delete(
  '/api/orders/:id',
  requireAuth,  
  async (req: Request, res: Response) => {
    const order = await Order.findById(req.params.id);

    if (!order) {
      throw new NotFoundError();
    }
    if (order.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    await order.remove();
    // await new OrderUpdatedPublisher(natsWrapper.client)
    //   .publish({
    //     id: order.id,
    //     title: order.title,
    //     price: order.price,
    //     userId: order.userId,
    //   });
        
    res.status(200).send(order);
  }
);

export { router as deleteOrderRouter };
