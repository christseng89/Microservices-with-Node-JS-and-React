import express, { Request, Response } from 'express';
import { requireAuth } from '@chinasystems/common';

import { Payment } from '../models/payment';

const router = express.Router();

// Index all payments for the current user
router.get('/api/payments',
  requireAuth, 
  async (req: Request, res: Response) => {
    const payments = await Payment.find({
      userId: req.currentUser!.id,
    }).populate('order');

    res.status(200).send(payments);
});

export { router as indexPaymentRouter };
