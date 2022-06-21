import mongoose from 'mongoose';

// An interface that describes the properties
// that are requried to create a new User
interface UserAttrs {
  email: string;
  password: string;
}

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

const buildUser = (attrs: UserAttrs) => {
  return new User(attrs);
};

// Typescript to validate the input User (don't call )
buildUser({
  email: 'test',
  password: 'aaaa',
});

export { User, buildUser };

