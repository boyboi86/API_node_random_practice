const config = require('./config');
const express = require('express');
const app = express();
const http = require('http');


app.set('port', process.env.PORT | 8080);

let port = app.get('port');

app.get('/', (req, res, next) => {
	res.send('Sending email with nodemailer!!')
})

let nodemailer = require('nodemailer');
let sgTransport = require('nodemailer-sendgrid-transport');
 
// api key https://sendgrid.com/docs/Classroom/Send/api_keys.html 
let options = {
    auth: {
        api_key: config.SENDGRID_PASSWORD
    }
}
 
const mailer = nodemailer.createTransport(sgTransport(options));
const server = http.createServer(app);

require('./email')(mailer, app, config);

server.listen(port, err => {
	err? console.log(err): console.log(`listening to port ${port}`);
})
