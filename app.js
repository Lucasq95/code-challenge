const express = require('express');

const path = require('path');
const logger = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
mongoose.Promise = Promise;

let mongoAuth = '';
if (process.env.MONGODB_USER && process.env.MONGODB_PASSWORD) {
  mongoAuth = `${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@`;
}
const mongourl = `${`mongodb://${mongoAuth}${process.env.MONGODB_HOST}:`}${process.env.MONGODB_PORT}/${process.env.MONGODB_DB}`;

mongoose.connect(mongourl, { useNewUrlParser: true, useUnifiedTopology: true  })
  .catch((error) => {
    console.error('Error mongoose connection: ', error);
  });

app.use(logger('dev'));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use((err, req, res) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
