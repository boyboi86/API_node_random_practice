'use strict';

const express = require('express');
const app = express();
/*index folder is the first folder to be called if non-specified*/
const chat = require('./app/index');
// const port = process.env.PORT || 3000
app.set('port', process.env.PORT || 3000);
app.set('view engine', 'ejs');

/*Simple webserver that implements streams directs all assets towards public folder*/
app.use(express.static('public'))
app.use('/', chat.session);
app.use('/', chat.router);

const port = app.get('port')

app.listen(port, err => {
  err? console.error('err has occurred') : console.log(`server started on port ${port}`);
})
