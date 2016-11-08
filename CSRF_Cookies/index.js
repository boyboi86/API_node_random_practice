const csrf = require('csurf');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const express = require('express');
const http = require('http');


const app = express();

/*This is to ensure we parse cookies for all request it is required when we use csrf*/
/*Cookie parser has to be initialized before csrf && if signed is true for cookie, a secret key is required*/
app.use(cookieParser());

/*This will disable session and use cookie instead*/
const csrfProtection = csrf({ cookie: true })

app.set('port', process.env.PORT || 3000);
app.use(bodyParser.json({ type: '*/*' }));

port = app.get('port');

app.get('/form', csrfProtection, function(req, res) {
  /* For angular 2 the XSRF-strategy will pick up this name and value then set them to header X-XSRF-TOKEN */
  /* In actual production, cookie option domain must be set appropriately  */
  let token = req.csrfToken()
  res.cookie('XSRF-TOKEN', token, { maxAge: 900000 }).send('token set');
  console.log('token sent', token);
})
 
 /*angular will then set X-XSRF-TOKEN as header with the correct value which will pass the cookie-test! */
app.post('/process', csrfProtection, function(req, res) {
  res.send('data is being processed')
})

http.createServer(app).listen(port, err => {
	err? console.log(err): console.log('server connected')
})