import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

import { OrderStatus } from '@chinasystems/common';

export { OrderStatus };
// An interface that describes the properties
// that are required to create a new Order
interface OrderAttrs {
  id: string; // order.id
  version: number; // order.version
  userId: string;
  status: OrderStatus;
  price: number;
}

// An interface that describes the properties
// that a Order Document has
interface OrderDoc extends mongoose.Document {
  version: number;  
  userId: string;
  status: OrderStatus;
  price: number;
}

// An interface that describes the properties
// that a Order Model has
interface OrderModel extends mongoose.Model<OrderDoc> {
  build(attrs: OrderAttrs): OrderDoc;
}

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: Object.values(OrderStatus),
    },
    price: {
      type: Number,
      required: true,
    },
  },
  {
    toJSON: {
      transform(_doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      },
    },
  }
);

orderSchema.set('versionKey', 'version');
orderSchema.plugin(updateIfCurrentPlugin);
orderSchema.pre('save', async function(done) {
  done();
});

orderSchema.statics.build = (attrs: OrderAttrs) => {
  return new Order({
    ...attrs,
    _id: attrs.id,
  });
};

const Order = mongoose.model<OrderDoc, OrderModel>('Order', orderSchema);
export { Order };
