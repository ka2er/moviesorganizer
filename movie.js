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

	self = this;

	var ext = file.getExtension(this.path);
	var nfo = this.path.substr(0, this.path.length-ext.length)+'nfo';

	fs.stat(nfo, function (err, stats) {
		if(err) {
			self.emit('nfo-not-found', self.path);
			return;
		}

		fs.readFile(nfo, function(err, buf) {
			if(!err) {
				self.nfo = nfo;
				self.emit('nfo-found', buf);
			}
		});
	});
};

Movie.prototype.updateNfo = function(string) {
	if(this.nfo) {
		fs.appendFileSync(filename, data);
	}
	console.log("TODO: implement updateNFO with string"+string);

	// 1 - write or update nfo
};

Movie.prototype.process = function(){

	self = this;

	var providers = [i, ac];
	//var providers = [i];
	for(i in providers) {
		var provider = providers[i];
		var aProvider = new provider(); // instance a provider
		this.on('nfo-found', aProvider.registerCallback('identifyFromString'));
		this.on('nfo-not-found', aProvider.registerCallback('identifyFromFile'));

		aProvider.on('found', function(id) { // chain events
			console.log(this.name+" found something id="+id);
			// update NFO...

			self.updateNfo(this.getLink(id));


			self.emit('found', this.name, id);
			// TODO : cancel all remaining callback... ???
		});
	}

	// 1er test : il y a t il un nfo ?
	this.hasNfo();
};
