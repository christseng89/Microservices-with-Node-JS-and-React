import express, { Request, Response} from 'express';

import { currentUser, requireAuth } from '@chinasystems/common';
import { User } from '../models/user';

const router = express.Router();
router.get('/api/users/currentuser', 
  currentUser,
  requireAuth,
  async (req: Request, res: Response) => {
    if (!req.currentUser) {
      return res.status(400).send({ currentUser: null });
    }

    // Check if user exists in DB
    const { email } = req.currentUser;
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      req.session = null;
      return res.status(400).send({ currentUser: null });
    }

    res.status(200).send({ currentUser: req.currentUser });
  });

export { router as currentUserRouter };
//