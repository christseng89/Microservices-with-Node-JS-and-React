import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';

import { RequestValidationError } from '../errors/request-validation-error';
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
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
     throw new RequestValidationError(errors.array());
    }
    
    const { email, password } = req.body;

    // 1. Check user exist or not
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log ('Email in use');
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
      'secret' // secret key
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

