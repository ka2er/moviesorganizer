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

Provider.prototype.getName = function(self, id) {
	console.log(self.name+".getName(id) => not implemented");
};

Provider.prototype.identifyFromString = function(self,buf) {
	console.log(self.name+".identifyFromString(bug) => not implemented");
	console.log("   you should emit a 'found' event with id as 1st param if string description is identified");
};

Provider.prototype.identifyFromFile = function(self, file) {
	console.log(self);
	console.log(self.name+".identifyFromFile(file) => not implemented");
	console.log("   you should emit a 'found' event with id as 1st param if file is identified");
};

Provider.prototype.__proto__ = EventEmitter.prototype;