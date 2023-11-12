var randomBytes = require('crypto').randomBytes;

function Charset() {
  this.chars = '';
}

Charset.prototype.setType = function (type) {
  if (Array.isArray(type)) {
    for (var i = 0; i < type.length; i++) {
      this.chars += this.getCharacters(type[i]);
    }
  }
  else {
    this.chars = this.getCharacters(type);
  }
}

Charset.prototype.getCharacters = function (type) {
  var chars;

  var numbers = '0123456789';
  var charsLower = 'abcdefghijklmnopqrstuvwxyz';
  var charsUpper = charsLower.toUpperCase();
  var hexChars = 'abcdef';
  var binaryChars = '01';
  var octalChars = '01234567';

  if (type === 'alphanumeric') {
    chars = numbers + charsLower + charsUpper;
  }
  else if (type === 'numeric') {
    chars = numbers;
  }
  else if (type === 'alphabetic') {
    chars = charsLower + charsUpper;
  }
  else if (type === 'hex') {
    chars = numbers + hexChars;
  }
  else if (type === 'binary') {
    chars = binaryChars;
  }
  else if (type === 'octal') {
    chars = octalChars;
  }
  else {
    chars = type;
  }

  return chars;
}

Charset.prototype.removeUnreadable = function () {
  var unreadableChars = /[0OIl]/g;
  this.chars = this.chars.replace(unreadableChars, '');
}

Charset.prototype.setcapitalization = function (capitalization) {
  if (capitalization === 'uppercase') {
    this.chars = this.chars.toUpperCase();
  }
  else if (capitalization === 'lowercase') {
    this.chars = this.chars.toLowerCase();
  }
}

Charset.prototype.removeDuplicates = function () {
  var charMap = this.chars.split('');
  charMap = [...new Set(charMap)];
  this.chars = charMap.join('');
}

function unsafeRandomBytes(length) {
  var stack = [];
  for (var i = 0; i < length; i++) {
    stack.push(Math.floor(Math.random() * 255));
  }

  return {
    length,
    readUInt8: function (index) {
      return stack[index];
    }
  };
}

function safeRandomBytes(length) {
  try {
    return randomBytes(length);
  } catch (e) {
    /* React/React Native Fix + Eternal loop removed */
    return unsafeRandomBytes(length);
  }
}

function processString(buf, initialString, chars, reqLen, maxByte) {
  var string = initialString;
  for (var i = 0; i < buf.length && string.length < reqLen; i++) {
    var randomByte = buf.readUInt8(i);
    if (randomByte < maxByte) {
      string += chars.charAt(randomByte % chars.length);
    }
  }
  return string;
}

function getAsyncString(string, chars, length, maxByte, cb) {
  randomBytes(length, function (err, buf) {
    if (err) {
      // Since it is waiting for entropy, errors are legit and we shouldn't just keep retrying
      cb(err);
    }
    var generatedString = processString(buf, string, chars, length, maxByte);
    if (generatedString.length < length) {
      getAsyncString(generatedString, chars, length, maxByte, cb);
    } else {
      cb(null, generatedString);
    }
  })
}

module.exports = function (options, cb) {
  var charset = new Charset();

  var length, chars, capitalization, string = '';

  // Handle options
  if (typeof options === 'object') {
    length = typeof options.length === 'number' ? options.length : 32;

    if (options.charset) {
      charset.setType(options.charset);
    }
    else {
      charset.setType('alphanumeric');
    }

    if (options.capitalization) {
      charset.setcapitalization(options.capitalization);
    }

    if (options.readable) {
      charset.removeUnreadable();
    }

    charset.removeDuplicates();
  }
  else if (typeof options === 'number') {
    length = options;
    charset.setType('alphanumeric');
  }
  else {
    length = 32;
    charset.setType('alphanumeric');
  }

  // Generate the string
  var charsLen = charset.chars.length;
  var maxByte = 256 - (256 % charsLen);

  if (!cb) {
    while (string.length < length) {
      var buf = safeRandomBytes(Math.ceil(length * 256 / maxByte));
      string = processString(buf, string, charset.chars, length, maxByte);
    }

    return string;
  }

  getAsyncString(string, charset.chars, length, maxByte, cb);

};