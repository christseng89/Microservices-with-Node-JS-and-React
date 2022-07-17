import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

// An interface that describes the properties
// that are requried to create a new Ticket
interface TicketAttrs {
  title: string;
  price: number;
  userId: string;
}

// An interface that describes the properties
// that a Ticket Document has
interface TicketDoc extends mongoose.Document {
  title: string;
  price: number;
  userId: string;
  version: number;
}

// An interface that describes the properties
// that a Ticket Model has
interface TicketModel extends mongoose.Model<TicketDoc> {
  build(attrs: TicketAttrs): TicketDoc;
}

const ticketSchema = new mongoose.Schema({
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
ticketSchema.set('versionKey', 'version');
ticketSchema.plugin(updateIfCurrentPlugin);
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
