import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';

const router = express.Router();
const minLen = 4;
const maxLen = 20;

router.post(
  '/api/users/signup',
  [
    body('email')
      .isEmail()
      .withMessage('Email must be valid'),
    body('password')
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage(`Password must be between ${minLen} and ${maxLen} characters`),
  ],
  (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // return res.status(400).json({ errors: errors.array() });
      throw new Error('Invalid email and/or password')
    }
    
    const { email, password } = req.body;
    // new User({ email, password });
    // throw new Error('Error connection to Database');
    res.status(200).send({email, password});
  }
);

export { router as signupRouter };

