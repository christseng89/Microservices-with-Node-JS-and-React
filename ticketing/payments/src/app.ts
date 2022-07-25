import { json } from "body-parser";
import express from "express";
import 'express-async-errors';
import cookieSession from 'cookie-session';
import { errorHandler, NotFoundError, currentUser } from '@chinasystems/common';

import { createPaymentRouter } from './routes/new';
import { indexPaymentRouter } from './routes/index';

const app = express();
app.set('trust proxy', true);
app.use(json());
app.use(cookieSession({
  signed: false,
  secure: process.env.NODE_ENV !== 'test'
}));

app.use(currentUser);
app.use(createPaymentRouter);
app.use(indexPaymentRouter);

app.all("*", async () => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
