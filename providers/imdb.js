var	imdb = require('imdb-api'),
	fs = require('fs'),
	abstract = require('./abstract.js');

var Imdb = module.exports = function Imdb() {

	this.name = "imdb";

	this.getName = function(id) {
		imdb.getById(id, function(err,data){
	        console.log(data.title);
			// data.year
	        if(err) console.log(err+" "+err.stack);
		});
		return false;
	};

	this.getLink = function(id) {
		return "http://www.imdb.com/title/tt/"+id;
	};
};

Imdb.prototype.identifyFromString = function(buf) {
	t = buf.match(/imdb\.[^\/]+\/title\/tt(\d+)/i);
	if(t) {
		this.emit('found', t[1]);
	}
};

Imdb.prototype.identifyFromFile = function(file) {
console.log('to');
	fs.stat(file, function(err, stats) {
		console.log(err);
		if(!err)
			console.log(stats.size);
	});


	console.log(this.name +" : trying to identify from file data: "+file);
	this.emit('found', 'TODO-HASH-FILE');
};

Imdb.prototype.__proto__ = abstract.prototype;

