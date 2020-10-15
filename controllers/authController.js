const User = require('../models/User');
const cookierParser = require('cookie-parser');
const jwt = require('jsonwebtoken');

const maxAge = 24 * 60 * 60;
const handleCreateUserError = (err) => {
  let errors = { email: '', password: '' };

  if (err.message === "Incorrect Email") {
    errors.email = "Email is not registered!";
  }
  if (err.message === "Incorrect Password") {
    errors.password = "Password is incorrect!"
  }
  //duplicate error code
  if (err.code === 11000) {
    errors.email = 'that email is already registered';
  } else {
    //validation errors
    if (err.message.includes('User validation failed')) {
      Object.values(err.errors).forEach(({ properties }) => {
        errors[properties['path']] = properties.message;
      })
    }
  }
  return errors;
}

// create webtoken 
const createWebToken = (id) => {
  return jwt.sign({ id }, "Patrick is the best", { expiresIn: maxAge });
}

module.exports.signup_get = (req, res) => {
  res.render('signup');
}

module.exports.login_get = (req, res) => {
  res.render('login');
}

module.exports.signup_post = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.create({ email, password });
    const token = createWebToken(user._id);
    res.cookie('jwt', token, { maxAge: maxAge * 1000, httpOnly: true });
    res.status(201).json({ user: user._id });
  }
  catch (err) {
    const errors = handleCreateUserError(err);
    res.status(400).json({ errors });
  }
}

module.exports.login_post = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.login(email, password);
    if (user) {
      const token = createWebToken(user._id);
      res.cookie('jwt', token, { maxAge: maxAge * 1000, httpOnly: true });
      res.status(200).json({ user: user });
    }
  }
  catch (err) {
    const errors = handleCreateUserError(err);
    console.log(errors);
    res.status(400).json({ errors });
  }
}

module.exports.logout_get = (req, res) => {
  res.cookie('jwt', '', { maxAge: 1 });
  res.redirect('/');
}