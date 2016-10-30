'use strict'

const http = require('http');
const url = require('url');
const path = require('path');
const fs = require('fs');
const port = 3000;

/*Note these are not the entire list of mime types*/
/*We will be calling extname so .extension is their key*/
let mimes = {
	'.htm': 'text/html',
	'.css': 'text/css',
	'.js' : 'text/javascript',
	'.png' : 'image/png',
	'.jpg' : 'image/jpeg',
	'.gif' : 'image/gif'
}

function webServer(req, res) {

/*Use url to parse particular file*/
	let BASE_URL = url.parse(req.url);
	let filename = req.pathname === '/' ? 'index.htm' : BASE_URL.pathname

/*Use path to combine cwd with actual filename*/
	let fileDir = path.join(__dirname, filename)

/*Use fs to check if file is accessible R = readable | W = writeable */
	fs.access(fileDir, fs.constants.R_OK , err => {
		if(!err) {
			fs.readFile(fileDir, 'utf8', (err, doc) => {
				if(err) {
					res.writeHead(500);
					res.end('File could not be read!?')
				} else {
/*Getting the correct mime type from file*/
					let docTypes = mimes[path.extname(fileDir)];
					res.writeHead(200, {'Content-type': docTypes});
					res.end(doc);
				}
			})
		} else {
			res.writeHead(404);
			res.end('Content not available!?')
		}
	});
}

/*Create Server*/
http.createServer(webServer).listen(port, err => {
	err? console.error('err', err): console.log(`connected on ${port}`)
})