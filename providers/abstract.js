/**
 * User: seb
 * Date: 01/10/12
 * Time: 17:12
 * To change this template use File | Settings | File Templates.
 */

var EventEmitter = require('events').EventEmitter;

var Provider = module.exports = function Provider() {
	this.name = "please define me";
};

Provider.prototype.setLang = function(lang) {
	this.lang = lang;
};

Provider.prototype.registerCallback = function(cb) {
	var self = this;
	return function() { // anonymous function to keep track of the current provider
		this.name = self.name;
		self[cb].apply(self, arguments);
	}
};
Provider.prototype.getLink = function(id) {
	console.log(this.name+".getLink(id) => not implemented");
};

Provider.prototype.getName = function(id) {
	console.log(this.name+".getName(id) => not implemented");
};

Provider.prototype.identifyFromString = function(buf) {
	console.log(this.name+".identifyFromString(bug) => not implemented");
	console.log("   you should emit a 'found' event with id as 1st param if string description is identified");
};

Provider.prototype.identifyFromFile = function(file) {
	console.log(this.name+".identifyFromFile(file) => not implemented");
	console.log("   you should emit a 'found' event with id as 1st param if file is identified");
};

Provider.prototype.__proto__ = EventEmitter.prototype;