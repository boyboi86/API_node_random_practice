'use strict';

const express = require('express');
const app = express();
// const port = process.env.PORT || 3000
app.set('port', process.env.PORT || 3000);
app.set('view engine', 'ejs');
/*Simple webserver that implements streams directs all assets towards public folder*/
app.use(express.static('public'));
const port = app.get('port')

app.get('/', (req, res , next) => {
  // res.sendFile(__dirname + '/views/login.htm');
  res.render('login');
});

app.listen(port, err => {
  err? console.error('err has occurred') : console.log(`server started on port ${port}`);
})
