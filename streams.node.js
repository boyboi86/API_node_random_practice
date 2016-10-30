const fs = require('fs');
const zlib = require('zlib');
const path = require('path');

const sentence = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla egestas nibh quis posuere sollicitudin.'

fs.writeFile('randomScript.js', sentence, err => {
	err? console.error(err) : console.log('piping done!!') 
});

/*if encoding is not specified it will turn out to be binary when you console.log() but in the dest it will still be utf8 default*/

// const readable = fs.createReadStream('randomScript.js', { encoding: 'utf8' });
const readable = fs.createReadStream(path.join(__dirname,'randomScript.js'));

const writeable = fs.createWriteStream(path.join(__dirname, 'copy.js'));


/*gzip is readable but you still need to output with writeStream*/
const gzip = zlib.createGzip();
const compress = fs.createWriteStream(path.join(__dirname, 'copy.js.gz'));

/*There should be 3 new files copy.js && randomScript.js && cop.js.gz (zip file containing copy.js)
  all with same content */
// readable.on('data', chunk => {
// 	console.log(chunk);
// 	writeable.write(chunk);
// })

/*Pipe only from readable*/
readable.pipe(writeable);

readable.pipe(gzip).pipe(compress);








