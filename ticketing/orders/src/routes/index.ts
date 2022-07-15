import express, { Request, Response } from 'express';
import { requireAuth } from '@chinasystems/common';

import { Order } from '../models/order';

const router = express.Router();

// Index all active orders for the current user
router.get('/api/orders',
  requireAuth, 
  async (req: Request, res: Response) => {
    const orders = await Order.find({
      userId: req.currentUser!.id,
    }).populate('ticket');

    res.status(200).send(orders);
});

export { router as indexOrderRouter };
