import express, { Request, Response } from 'express';
import mongoose from 'mongoose';

import { requireAuth, NotFoundError, NotAuthorizedError, BadRequestError } from '@chinasystems/common';
import { Order } from '../models/order';

const router = express.Router();

router.get(
  '/api/orders/:id',
  requireAuth,
  async (req: Request, res: Response) => {
    if( !mongoose.Types.ObjectId.isValid(req.params.id) ) {
      throw new BadRequestError('Valid order ID required');
    }    
    const order = await Order.findById(req.params.id)
      .populate('ticket');

    if (!order) {
      throw new NotFoundError();
    }
    if (order.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    res.status(200).send(order);
});

export { router as showOrderRouter };
