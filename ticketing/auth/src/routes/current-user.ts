import express, { Request, Response} from 'express';

import { currentUser } from '../middlewares/current-user';

const router = express.Router();
router.get('/api/users/currentuser', 
currentUser,
async (req: Request, res: Response) => {
  if (!req.currentUser) {
    return res.status(400).send({ currentUser: null });
  }

  res.status(200).send({ currentUser: req.currentUser });
});

export { router as currentUserRouter };
//