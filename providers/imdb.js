var EventEmitter = require('events').EventEmitter,
	imdb = require('node-imdb-api');

var Imdb = module.exports = function Imdb() {

	// useless ??
	this.setLang = function(lang) {
		this.lang = lang;
	};

	this.getName = function(id) {
		imdb.getById(id, function(err,data){
	        console.log(data.title);
			// data.year
	        if(err) console.log(err+" "+err.stack);
		});
		return false;
	};

	this.identifyFromFile = function(file) {
		console.log("trying to identify from file data"+file);
		this.emit('found', 'TODO-HASH-FILE');
		// TODO hash file
	};
};

Imdb.prototype.identifyFromString = function(buf) {
	t = buf.match(/imdb\.[^\/]+\/title\/tt(\d+)/i);
	if(t) {
		this.emit('found', t[1]);
	}
}

Imdb.prototype.__proto__ = EventEmitter.prototype;
