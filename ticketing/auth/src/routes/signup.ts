import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { DatabaseConnectionError } from '../errors/database-connection-error';
import { RequestValidationError } from '../errors/request-validation-error';

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
     throw new RequestValidationError(errors.array());
    }
    
    const { email, password } = req.body;
    // throw new Error('Test Error');
    throw new DatabaseConnectionError();
    // res.status(200).send({email, password});
  }
);

export { router as signupRouter };

