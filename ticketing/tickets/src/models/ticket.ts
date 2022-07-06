import mongoose from 'mongoose';

// An interface that describes the properties
// that are requried to create a new Ticket
interface TicketAttrs {
  title: string;
  price: string;
  userId: string;
}

// An interface that describes the properties
// that a Ticket Model has
interface TicketModel extends mongoose.Model<TicketDoc> {
  build(attrs: TicketAttrs): TicketDoc;
}

// An interface that describes the properties
// that a Ticket Document has
interface TicketDoc extends mongoose.Document {
  title: string;
  price: string;
  userId: string;
}

const ticketSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  price: {
    type: String,
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
      delete ret.price;
      delete ret.__v;
    },
  },
});

ticketSchema.pre('save', async function(done) {
  done();
});

ticketSchema.statics.build = (attrs: TicketAttrs) => {
  return new Ticket(attrs);
};

const Ticket = mongoose.model<TicketDoc, TicketModel>('Ticket', ticketSchema);

// New Ticket Example ...
// const ticket = {
//   title: 'Test',
//   price: '11112',
//   userId: '5e9f8f8f8f8f8f8f8f8f8f8f'
// };

// console.log(Ticket.build(ticket));
// console.log(new Ticket(ticket));

export { Ticket };
