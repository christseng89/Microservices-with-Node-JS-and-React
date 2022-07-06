import express, { Request, Response } from 'express';
import { body } from 'express-validator';

import { requireAuth, validateRequest } from '@chinasystems/common';

const router = express.Router();
router.post(
  '/api/tickets',
  requireAuth, 
  [
    body('title').not().isEmpty().withMessage('Title is required'),
    body('price')
      .isFloat({ gt: 0 })
      .withMessage('Price must be greater than 0'),
  ],
  validateRequest,  
  async (_req: Request, res: Response) => {
    res.status(201).send({});
  }
);

export { router as createTicketRouter };
// Language: typescript