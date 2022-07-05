import express, { Request, Response} from 'express';

import { currentUser, requireAuth } from '@chinasystems/common';

const router = express.Router();
router.get('/api/users/currentuser', 
  currentUser,
  requireAuth,
  async (req: Request, res: Response) => {
    if (!req.currentUser) {
      return res.status(400).send({ currentUser: null });
    }

    res.status(200).send({ currentUser: req.currentUser });
  });

export { router as currentUserRouter };
//