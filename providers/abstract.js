/**
 * User: seb
 * Date: 01/10/12
 * Time: 17:12
 * To change this template use File | Settings | File Templates.
 */

var EventEmitter = require('events').EventEmitter;

var Provider = module.exports = function Provider() {
};

Provider.prototype.setLang = function(lang) {
	this.lang = lang;
};

Provider.prototype.getName = function(id) {
	console.log("returning name for id : "+id);
};

Provider.prototype.identifyFromString = function(buf) {
	console.log("trying to identify from description string : "+buf);
};


Provider.prototype.identifyFromFile = function(buf) {
	console.log("implement me trying to identify from file data : "+buf);
	//this.emit('found', 'TODO-HASH-FILE');
};

Provider.prototype.__proto__ = EventEmitter.prototype;



