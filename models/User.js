const mongoose = require('mongoose');
const { isEmail } = require('validator');
const bcryt = require('bcrypt');
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Please enter your email!'],
    unique: true,
    lowercase: true,
    validate: [isEmail, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Please enter your password'],
    minlength: [6, 'Minimum password length is 6']
  },
});

userSchema.pre('save', async function (next) {
  const salt = await bcryt.genSalt();
  this.password = await bcryt.hash(this.password, salt);
  next();
})

userSchema.statics.login = async function (email, password) {
  const user = await this.findOne({ email });
  if (user) {
    const check = await bcryt.compare(password, user.password);
    if (check) {
      return user;
    }
    throw Error("Incorrect Password");
  }
  throw Error("Incorrect Email");
}

const User = mongoose.model("User", userSchema, 'users');
module.exports = User;