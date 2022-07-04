import express, { Request, Response } from 'express';

const router = express.Router();
router.post(
  '/api/tickets',
  async (_req: Request, res: Response) => {
    res.status(201).send({});
  }
);

export { router as createTicketRouter };
// Language: typescript