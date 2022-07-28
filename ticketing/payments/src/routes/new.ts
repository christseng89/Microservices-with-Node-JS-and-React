import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { requireAuth, validateRequest, BadRequestError, NotFoundError, NotAuthorizedError, OrderStatus,} from '@chinasystems/common';

import { Order } from '../models/order';
import { Payment } from '../models/payment';
import { natsWrapper } from '../nats-wrapper';
import { stripe } from '../stripe';
import { PaymentCreatedPublisher } from '../events/publishers/payment-created-publisher';

const router = express.Router();
router.post(
  '/api/payments',
  requireAuth, [
    body('token').not().isEmpty(), 
    body('orderId').not().isEmpty()
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { token, orderId } = req.body;
    const order = await Order.findById(orderId);

    if (!order) {
      throw new NotFoundError();
    }
    if (order.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }
    if (order.status === OrderStatus.Cancelled) {
      throw new BadRequestError('Cannot pay for a cancelled order');
    }
    if (order.status === OrderStatus.Complete) {
      throw new BadRequestError('Cannot pay for a completed order');
    }

    const amount = Math.round(order.price * 100);
    // Charge the customer
    const charge = await stripe.charges.create({
      currency: 'usd',
      amount,
      source: token,
      description: 'Charge for order #' + order.id
    });
    // Create a payment
    const payment = Payment.build({
      orderId,
      stripeId: charge.id,
      price: order.price
    });
    await payment.save();    

    // Update the Order Status to Complete
    order.status = OrderStatus.Complete;
    await order.save();

    // Publish an event to payments-service
    await new PaymentCreatedPublisher(natsWrapper.client).publish({
      id: payment.id,
      orderId: payment.orderId,
      stripeId: payment.stripeId,
    });    
    res.status(201).send({ id: payment.id, success: true });
  }
);

export { router as createPaymentRouter };
