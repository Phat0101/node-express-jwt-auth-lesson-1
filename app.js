const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
require('dotenv').config();
const cookierParser = require('cookie-parser');
const {AuthMiddleWare, checkUser} = require('./authMiddleware/authjwt');


const app = express();

// middleware
app.use(express.static('public'));
app.use(express.json());
app.use(cookierParser());

// view engine
app.set('view engine', 'ejs');

// database connection
let port = process.env.PORT || 3000;
const dbURI = process.env.DBURI;
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
  .then((result) => app.listen(port))
  .catch((err) => console.log(err));

// // routes
app.get('*', checkUser);
app.get('/', (req, res) => res.render('home'));
app.get('/smoothies', AuthMiddleWare, (req, res) => res.render('smoothies'));
app.use(authRoutes);
