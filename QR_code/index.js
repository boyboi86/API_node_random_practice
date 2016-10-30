'use strict';

const qr = require('qr-image');
const fs = require('fs');

/* process.argv[0] is always be node.exe 
  while process.argv[1] will always be your path and existing file
  the remaining list 2 - 4 is free for new path store*/

let dataToEncode = process.argv[2] || null
let outImage = process.argv[3] || null

/*Create QR image with png format and 20 pixels*/
if(dataToEncode !== null && outImage !== null) {
	qr.image(dataToEncode, {
		type: 'png',
		size: 20
	})
	.pipe(fs.createWriteStream(outImage));

	console.log('QR image generated');
} else {
	console.log('Error has occurred!')
}

/* You need to run node index.js follow by 2 other args for this to work in commandline*/

/*For example
  $ node index.js "https://www.npmjs.com" "imageName.png"
  If you run the above command, you will get a new QR png call imageName.png
  Try scanning it with your mobile phone */

