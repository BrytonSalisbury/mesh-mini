﻿/**
* @description MeshCentral Common Library
* @author Ylian Saint-Hilaire
* @copyright Intel Corporation 2018
* @license Apache-2.0
* @version v0.0.1
*/

// Binary encoding and decoding functions
module.exports.ReadShort = function(v, p) { return (v.charCodeAt(p) << 8) + v.charCodeAt(p + 1); }
module.exports.ReadShortX = function(v, p) { return (v.charCodeAt(p + 1) << 8) + v.charCodeAt(p); }
module.exports.ReadInt = function(v, p) { return (v.charCodeAt(p) * 0x1000000) + (v.charCodeAt(p + 1) << 16) + (v.charCodeAt(p + 2) << 8) + v.charCodeAt(p + 3); } // We use "*0x1000000" instead of "<<24" because the shift converts the number to signed int32.
module.exports.ReadIntX = function(v, p) { return (v.charCodeAt(p + 3) * 0x1000000) + (v.charCodeAt(p + 2) << 16) + (v.charCodeAt(p + 1) << 8) + v.charCodeAt(p); }
module.exports.ShortToStr = function(v) { return String.fromCharCode((v >> 8) & 0xFF, v & 0xFF); }
module.exports.ShortToStrX = function(v) { return String.fromCharCode(v & 0xFF, (v >> 8) & 0xFF); }
module.exports.IntToStr = function(v) { return String.fromCharCode((v >> 24) & 0xFF, (v >> 16) & 0xFF, (v >> 8) & 0xFF, v & 0xFF); }
module.exports.IntToStrX = function(v) { return String.fromCharCode(v & 0xFF, (v >> 8) & 0xFF, (v >> 16) & 0xFF, (v >> 24) & 0xFF); }
module.exports.MakeToArray = function(v) { if (!v || v == null || typeof v == 'object') return v; return [v]; }
module.exports.SplitArray = function(v) { return v.split(','); }
module.exports.Clone = function(v) { return JSON.parse(JSON.stringify(v)); }

// Move an element from one position in an array to a new position
module.exports.ArrayElementMove = function(arr, from, to) { arr.splice(to, 0, arr.splice(from, 1)[0]); };

// Print object for HTML
module.exports.ObjectToStringEx = function(x, c) {
    var r = "";
    if (x != 0 && (!x || x == null)) return "(Null)";
    if (x instanceof Array) { for (var i in x) { r += '<br />' + gap(c) + "Item #" + i + ": " + module.exports.ObjectToStringEx(x[i], c + 1); } }
    else if (x instanceof Object) { for (var i in x) { r += '<br />' + gap(c) + i + " = " + module.exports.ObjectToStringEx(x[i], c + 1); } }
    else { r += x; }
    return r;
}

// Print object for console
module.exports.ObjectToStringEx2 = function(x, c) {
    var r = "";
    if (x != 0 && (!x || x == null)) return "(Null)";
    if (x instanceof Array) { for (var i in x) { r += '\r\n' + gap2(c) + "Item #" + i + ": " + module.exports.ObjectToStringEx2(x[i], c + 1); } }
    else if (x instanceof Object) { for (var i in x) { r += '\r\n' + gap2(c) + i + " = " + module.exports.ObjectToStringEx2(x[i], c + 1); } }
    else { r += x; }
    return r;
}

// Create an ident gap
module.exports.gap = function(c) { var x = ''; for (var i = 0; i < (c * 4) ; i++) { x += '&nbsp;'; } return x; }
module.exports.gap2 = function(c) { var x = ''; for (var i = 0; i < (c * 4) ; i++) { x += ' '; } return x; }

// Print an object in html
module.exports.ObjectToString = function(x) { return module.exports.ObjectToStringEx(x, 0); }
module.exports.ObjectToString2 = function(x) { return module.exports.ObjectToStringEx2(x, 0); }

// Convert a hex string to a raw string
module.exports.hex2rstr = function(d) {
    var r = '', m = ('' + d).match(/../g), t;
    while (t = m.shift()) r += String.fromCharCode('0x' + t);
    return r
}

// Convert decimal to hex
module.exports.char2hex = function(i) { return (i + 0x100).toString(16).substr(-2).toUpperCase(); }

// Convert a raw string to a hex string
module.exports.rstr2hex = function(input) {
    var r = '', i;
    for (i = 0; i < input.length; i++) { r += module.exports.char2hex(input.charCodeAt(i)); }
    return r;
}

// UTF-8 encoding & decoding functions
module.exports.encode_utf8 = function(s) { return unescape(encodeURIComponent(s)); }
module.exports.decode_utf8 = function(s) { return decodeURIComponent(escape(s)); }

// Convert a string into a blob
module.exports.data2blob = function(data) {
    var bytes = new Array(data.length);
    for (var i = 0; i < data.length; i++) bytes[i] = data.charCodeAt(i);
    var blob = new Blob([new Uint8Array(bytes)]);
    return blob;
}

// Generate random numbers
module.exports.random = function(max) { return Math.floor(Math.random() * max); }