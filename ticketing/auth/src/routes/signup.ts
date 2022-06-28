import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';

import { validateRequest } from '../middlewares/validate-request';
import { User } from '../models/user';

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
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    // 1. Check user exist or not
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      req.session = null;
      throw new Error ('Email in use');
    }

    // 2. Hash password as part of the models/user.ts
    
    // 3. Save user to DB
    const user = User.build({ email, password });
    await user.save();

    // Generate JWT
    const userJwt = jwt.sign(
      {
        id: user.id,
        email: user.email
      },
      // 'secret' // secret key
      process.env.JWT_KEY! // secret key
    );

    // Store it on session object
    req.session = {
      jwt: userJwt
    };    

    // 4. Return token    
    res.status(201).send(user);
  }
);

export { router as signupRouter };
// Language: typescript