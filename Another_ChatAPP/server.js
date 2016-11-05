'use strict';

const express = require('express');
const app = express();
/*index folder is the first folder to be called if non-specified*/
const chat = require('./app/index');
const passport = require('passport');
// const port = process.env.PORT || 3000
app.set('port', process.env.PORT || 3000);
app.set('view engine', 'ejs');

/*Session must before routes otherwise it will not initialize*/
/*Session must before passport otherwise it will not whenever you use any method that is passed into req it will be invalid*/
app.use('/', chat.session);
app.use(require('morgan')('combined', {
  stream: {
    write: message => {
      //write log
      chat.logger.log('info', message)
    }
  }
}))

app.use(passport.initialize());
app.use(passport.session());
/*Simple webserver that implements streams directs all assets towards public folder*/
app.use(express.static('public'))

app.use('/', chat.router);

const port = app.get('port')

chat.ioServer(app).listen(port, err => {
  err? console.error('err has occurred') : console.log(`server started on port ${port}`);
})
