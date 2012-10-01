var EventEmitter = require('events').EventEmitter,
	fs = require('fs'),
	file = require('./file.js'),
	ac = require('./providers/allocine.js'),
	i = require('./providers/imdb.js');


var Movie = module.exports = function Movie(path) {
	this.path = path;
	this.nfo = false;
};


Movie.prototype.__proto__ = EventEmitter.prototype;


Movie.prototype.hasNfo = function() {

	var ext = file.getExtension(this.path);
	var nfo = this.path.substr(0, this.path.length-ext.length)+'nfo';

	fs.stat(nfo, function (err, stats) {
		if(err) {
			this.emit('nfo-not-found');
			return;
		}

		fs.readFile(nfo, function(err, buf) {
			if(!err) {
				this.nfo = nfo;
				this.emit('nfo-found', buf);
			}
		});
	});
};



Movie.prototype.process = function(){

	var providers = [i, ac];
	for(i in providers) {
		var provider = providers[i];
		console.log(provider);
		console.log(provider.identifyFromString);
		this.on('nfo-found', provider.identifyFromString);
		this.on('nfo-not-found', provider.identifyFromFile);
		provider.on('found', function(id) {
			this.emit('found', provider, id);
		});
	}

	// 1 - il y a t il un nfo ?
	this.hasNfo();

	// pour chaque providers :

	// un provider doit pouvoir emettre found !!

	//

};
