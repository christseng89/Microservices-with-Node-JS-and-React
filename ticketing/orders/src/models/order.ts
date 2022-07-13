import mongoose from 'mongoose';

// An interface that describes the properties
// that are requried to create a new Order
interface OrderAttrs {
  title: string;
  price: number;
  userId: string;
}

// An interface that describes the properties
// that a Order Document has
interface OrderDoc extends mongoose.Document {
  title: string;
  price: number;
  userId: string;
}

// An interface that describes the properties
// that a Order Model has
interface OrderModel extends mongoose.Model<OrderDoc> {
  build(attrs: OrderAttrs): OrderDoc;
}

const orderSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  userId: {
    type: String,
    required: true
  }
},
{
  toJSON: {
    transform(_doc, ret) {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
    },
  },
});

orderSchema.pre('save', async function(done) {
  done();
});

orderSchema.statics.build = (attrs: OrderAttrs) => {
  return new Order(attrs);
};

const Order = mongoose.model<OrderDoc, OrderModel>('Order', orderSchema);

// New Order Example ...
// const Order = {
//   title: 'Test',
//   price: '11112',
//   userId: '5e9f8f8f8f8f8f8f8f8f8f8f'
// };

// console.log(Order.build(Order));
// console.log(new Order(Order));

export { Order };
