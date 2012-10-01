var abstract = require('./abstract.js');


var Allocine = module.exports = function Allocine() {

	this.name = "allocine";

	this.getName = function(id) {
		console.log('TODO: search '+this.name+" for "+id);
		return false;
	};
};

Allocine.prototype.identifyFromString = function(buf) {
	//http://www.allocine.fr/film/fichefilm_gen_cfilm=144809.html
	t = buf.match(/allocine\.[^\/]+\/film\/fichefilm_gen_cfilm=(\d+)/i);
	if(t) {
		this.emit('found', t[1]);
	}
};

/*
Allocine.prototype.identifyFromFile = function(file) {
	console.log(this.name+" : trying to identify from file data: "+file);
	this.emit('found', 'TODO-HASH-FILE');
};
*/

Allocine.prototype.__proto__ = abstract.prototype;
