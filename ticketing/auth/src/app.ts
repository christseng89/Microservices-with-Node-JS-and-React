import { json } from "body-parser";
import express from "express";
import 'express-async-errors';
import mongoose from 'mongoose';
import cookieSession from 'cookie-session';

import { NotFoundError } from "./errors/not-found-error";
import { currentUserRouter } from './routes/current-user';
import { signinRouter } from './routes/signin';
import { signoutRouter } from './routes/signout';
import { signupRouter } from './routes/signup';

// Error Handler Middleware
import { errorHandler } from "./middlewares/error-handler";

const app = express();
app.set('trust proxy', true);
app.use(json());
app.use(cookieSession({
  signed: false,
  secure: true
}));

app.use(currentUserRouter);
app.use(signupRouter);
app.use(signinRouter);
app.use(signoutRouter);

app.all("*", async () => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };