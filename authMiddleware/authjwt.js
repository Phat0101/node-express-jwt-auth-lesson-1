const jwt = require('jsonwebtoken');
const User = require('../models/User');

const AuthMiddleWare = (req, res, next) => {
  const token = req.cookies.jwt

  if (token) {
    jwt.verify(token, 'Patrick is the best', (err, decodedToken) => {
      if (err) {
        console.log(err);
        res.redirect('/login');
      } else {
        next();
      }
    })
  } else {
    res.redirect('/login');
  }
}

const checkUser = (req, res, next) => {
  const token = req.cookies.jwt

  if (token) {
    jwt.verify(token, 'Patrick is the best', async (err, decodedToken) => {
      if (err) {
        console.log(err);
        res.locals.user = null;
        next();
      } else {
        let user = await User.findById(decodedToken.id);
        res.locals.user = user;
        next();
      }
    })
  } else {
    res.locals.user = null;
    next();
  }
}
module.exports = { AuthMiddleWare, checkUser };