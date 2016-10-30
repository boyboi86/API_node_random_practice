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

/* Access File method */
function fileAccess(filepath){
	return new Promise((resolve, reject) => {
		fs.access(filepath, F_OK, err => {
			err? reject(err) : resolve(filepath)
		})
	})
}


/* Create Read Stream method */
/* Streams are also event emitters so they will listen to events */
function streamFile(filepath){
	return new Promise((resolve, reject) => {
		let fileStream = fs.createReadStream(filepath);

/* Open event will initialize streaming */
		fileStream.on('open', () => {
			resolve(filepath);
		})

/* Error event will render error and cause rejection */
		fileStream.on('error', err => {
			reject(err);
		})
	})
}

function webServer(req, res) {

/*Use url to parse particular file*/
	let BASE_URL = url.parse(req.url);
	let filename = req.pathname === '/' ? 'index.htm' : BASE_URL.pathname

/*Use path to combine cwd with actual filename*/
	let fileDir = path.join(__dirname, filename)
	let docTypes = mimes[path.extname(fileDir)];

/*Promise chaining all previous functions in sequential order
  and ensure a catch err at the end */

/*Take note chaining can only happens when function returns something*/

/* Stream is continuous process so res.end() is not required 
  plus event-based so instead of using random naming we use fileStream*/
	fileAccess(fileDir)
		.then(streamFile)
		.then(fileStream => {
			res.writeHead(200, {'Content-type': docTypes});
			fileStream.pipe(res);
		})
		.catch(err => {
			res.writeHead(500);
			res.end(JSON.stringify(err));
		})
}

/*Create Server*/
http.createServer(webServer).listen(port, err => {
	err? console.error('err', err): console.log(`connected on ${port}`)
})