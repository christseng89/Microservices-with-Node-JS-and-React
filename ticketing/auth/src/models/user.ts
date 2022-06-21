import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  }
});

const User = mongoose.model('User', userSchema);

// Not typescript check for the new User
// new User({
//   email: 'test',
//   password: 123,
//   test: 'aaa'
// });

export { User };

