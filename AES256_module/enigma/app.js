'use strict';

const Enigma = require('./index');
const eng = new Enigma('mystic');

let encodedString = eng.encode("Don't panic! Encryption is simple!");
let decodedString = eng.decode(encodedString);


console.log("Encoded: ", encodedString);
console.log("Decoded: ", decodedString);

let qr = eng.qrgen("http://www.npm.js", "QRmodule.png");

/*In our index.js if generated code is true it will reply QR Code generated*/
qr? console.log("QR Code generated!!") : console.error("Something went wrong")