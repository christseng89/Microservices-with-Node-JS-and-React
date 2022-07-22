import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { requireAuth, validateRequest, BadRequestError, NotFoundError, } from '@chinasystems/common';

import { Order } from '../models/order';

const router = express.Router();

try {
  router.post(
    '/api/payments',
    requireAuth, [
      body('token').not().isEmpty(), 
      body('orderId').not().isEmpty()
    ],
    validateRequest,
    async (_req: Request, res: Response) => {
      res.send({ success: true });
    }
  );
} catch (err) {
  console.log(err);
  throw new BadRequestError('Invalid request parameters');
}


export { router as createChargeRouter };
