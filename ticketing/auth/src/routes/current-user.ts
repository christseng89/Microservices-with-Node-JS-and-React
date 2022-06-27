import express, { Request, Response} from 'express';
import jwt from 'jsonwebtoken';

const router = express.Router();
router.get('/api/users/currentuser', 
async (req: Request, res: Response) => {
  // 1. Check if there is a JWT in the session object
  if (!req.session?.jwt) {
    return res.status(400).send({ currentUser: null });
  }

  // 2. Verify the JWT
  try {
    const payload = jwt.verify(req.session.jwt, process.env.JWT_KEY!);
    res.status(200).send({ currentUser: payload });
  } catch (err) {
    res.status(400).send({ currentUser: null });
  }
});

export { router as currentUserRouter };
//