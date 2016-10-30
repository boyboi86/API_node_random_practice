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


/* Read file method */
function fileRead(filepath){
	return new Promise((resolve, reject) => {
		fs.readFile(filepath, (err, doc) => {
			err? reject(err) : resolve(doc)
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

	fileAccess(fileDir)
		.then(fileRead)
		.then(doc => {
			res.writeHead(200, {'Content-type': docTypes});
			res.end(doc, 'utf-8');
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