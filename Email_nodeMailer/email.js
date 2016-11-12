module.exports = function(mailer, app, config){
	
/*You can send email regardless of whether you own an DN, but bear in mind it is illegal*/
	var email = {
	    to: [config.EMAIL_1, config.EMAIL_2],
	    from: config.EMAIL_1,
	    subject: 'nodemailer',
	    text: 'Awesome sauce',
	    html: '<div>This is an email sent using nodemailer using sendgrid as a service.</div>'
	};
 
 app.get('/send', (req, res, next) => {
		mailer.sendMail(email, function(err, res) {
			err? console.log('err occurred', err) : console.log(res);
		});
		res.send('refresh this page to send mail')
	})
}