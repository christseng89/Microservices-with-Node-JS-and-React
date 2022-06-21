import mongoose from 'mongoose';

// An interface that describes the properties
// that are requried to create a new User
interface UserAttrs {
  email: string;
  password: string;
}

// An interface that describes the properties
// that a User Model has
interface UserModel extends mongoose.Model<UserDoc> {
  build(attrs: UserAttrs): UserDoc;
}

// An interface that describes the properties
// that a User Document has
interface UserDoc extends mongoose.Document {
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

const User = mongoose.model<UserDoc, UserModel>('User', userSchema);
userSchema.statics.build = (attrs: UserAttrs) => {
  return new User(attrs);
};

// New User Example ...
// const user = {
//   email: 'Test',
//   password: '11112',
// };

// console.log(User.build(user));
// console.log(new User(user));

export { User };

