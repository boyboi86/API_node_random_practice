'use strict';

const http = require('http');
const url = require('url');
const qs = require('querystring');
const port = 3000;

/*Pure nodejs way of routing, an obj to provide methods as main key then routes with deep clone*/

let routes = {
	'GET': {
		'/': (req, res) => {
			res.writeHead(200, {'Content-type': 'text/html'});
			res.end('<h1>This is a Home Route</h1><h3>You can try some of the below routes by changing URL</h3><ul><li>/about</li><li>/api/getinfo</li></ul><h4>For <strong>/api/getinfo</strong> route you can add query for example "/api/getinfo?color=red&color=blue"</h4>')
		},
		'/about': (req, res) => {
			res.writeHead(200, {'Content-type': 'text/html'});
			res.end('<h1>This is a About Route</h1>')
		},
		'/api/getinfo': (req, res) => {
			res.writeHead(200, {'Content-type': 'application/json'});
			res.end(JSON.stringify(req.queryParams));
		}
	},

	/*  For POST Methods, you require POSTMAN
  set form-urlencoded then set key & value as
  username & password in the body*/

	'POST': {
		'/api/login': (req, res) => {

	/*Body is to mimic a simple body-parser*/
			let body = '';
			req.on('data', data => {
				body += data;
	
	/*For image in binary form upload that exceeds 2mb 
	 destroy connections to stop file trfs*/
				if(body.length > 2000000) {
					res.writeHead(413, {'Content-type': 'text/html'});
					res.end('<h3>Error: uploaded file size exceeds 2MB</h3>', 
						() => req.connection.destroy());
				}
			});

	/*Allow query string to serialize the body*/
			req.on('end', () => {
				let params = qs.parse(body);
				console.log('username: ',params['username']);
				console.log('password: ',params['password']);
				res.end();
			});
		}

	},
	'NA': (req, res) => {
		res.writeHead(404);
		res.end('Content not found!?')
	}
}

/*Similar to how express.router() 
 there will always be a METHOD follow by pathname*/

function router(req, res) {
	let BASE_URL = url.parse(req.url, true);
	console.log(req.params);
	let resolveRoute = routes[req.method][BASE_URL.pathname];
	if(resolveRoute != undefined){
		req.queryParams = BASE_URL.query;
		resolveRoute(req, res);
	} else {
		routes['NA'](req, res);
	}
}

/*create Server*/
http.createServer(router).listen(port, () => {
	console.log(`listening on ${port}`);
});