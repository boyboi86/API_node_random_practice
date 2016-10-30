'use strict';

const crypto = require('crypto');
const qr = require('qr-image');
const fs = require('fs');

/*For module.exports we are exporting entire object, it will require a new instance*/

module.exports = function(key) {
	this.key = key;
	return {
		encode: (str) => {
			let encoded = crypto.createCipher('aes-256-ctr', this.key);
			return encoded.update(str, 'utf8', 'hex');
		},
		decode: (str) => {
			let decoded = crypto.createDecipher('aes-256-ctr', this.key);
			return decoded.update(str, 'hex', 'utf8');
		},
		qrgen: (data, filepath) => {
			let dataToEncode = data || null
			let outImage = filepath || null
			if(dataToEncode !== null && outImage !== null){
				qr.image(dataToEncode, {
					type: 'png',
					size: 20
				})
				.pipe(fs.createWriteStream(outImage));
				return true
			} else {
				return false
			}
		}
	}
}


/*For exports we are exporting a method, it will require exports.methodName */

// For example
// 	exports.hello = function(user) {
// 		return console.log(`Hello ${user}`)
// 	}

/*For the above we can just use call methods straight after require them no need to start a new instance*/