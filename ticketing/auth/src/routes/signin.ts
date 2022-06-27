import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';

import { User } from '../models/user';
import { Password } from '../services/password';
import { validateRequest } from '../middlewares/validate-request';

const router = express.Router();

router.post('/api/users/signin', 
[
  body('email')
    .isEmail()
    .withMessage('Email must be valid'),
  body('password')
    .trim()
    .notEmpty()
    .withMessage('Password is required')
],
validateRequest,
async (req: Request, res: Response) => {
  const { email, password } = req.body;

  // 1. Check user exist
  const existingUser = await User.findOne({ email });
  if (!existingUser) {
    console.log ('Invalid credentials');
    throw new Error ('Invalid credentials');
  }

  // 2. Compare password as part of the models/user.ts
  const result = await Password.compare(existingUser.password, password);
  if (!result) {
    console.log ('Invalid credentials');
    throw new Error ('Invalid credentials');
  }
  
  // 3. Generate JWT
  const user = User.build({ email, password });
  const userJwt = jwt.sign(
    {
      id: user.id,
      email: user.email
    },
    // 'secret' // secret key
    process.env.JWT_KEY! // secret key
  );

  // Store JWT on session object
  req.session = {
    jwt: userJwt
  };    

  // 4. Return token    
  res.status(200).send(user);  

});

export { router as signinRouter };
// Language: typescript