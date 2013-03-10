var	imdb = require('imdb-api'),
	fs = require('fs'),
	path = require('path'),
	file = require('../file.js'),
	abstract = require('./abstract.js');

var Imdb = module.exports = function Imdb() {
	var prov = this;
	this.name = "imdb";
	this.h_cache = {};

	this.getName = function(id) {
		// use cache if available
		if(prov.h_cache[id])
			return prov.h_cache[id].title;

		return imdb.getById(id, function(err,data){

			if(!err) {
				prov.h_cache[id] = data;
				return prov.h_cache[id].title;
			}
	        	console.log(prov.name+'::err::'+err+" "+err.stack);
			return false;
		});
	};

	this.getYear = function(id) {
		// use cache if available
		if(prov.h_cache[id])
			return prov.h_cache[id].year;

		return imdb.getById(id, function(err,data){

			if(!err) {
				prov.h_cache[id] = data;
				return prov.h_cache[id].year;
			}
	        	console.log(prov.name+'::err::'+err+" "+err.stack);
			return false;
		});
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

/**
 * try to find movie based on movie file name
 */
Imdb.prototype.identifyFromFile = function(aFile) {
	//var imdb = this;
	var prov = this;	
	// get onlye filename without extension
	var base_file = path.basename(aFile, path.extname(aFile));
	// discard weird characters
	var movie_name  = file.cleanupName(base_file);
	console.log(this.name +":: trying to identify from file data: "+movie_name);
	imdb.get(movie_name, function(err, movie) {
		if(!err) {
			//console.log(movie);
			// add to cache...
			prov.h_cache[movie.imdbid] = movie;
			prov.emit('found', movie.imdbid);
			return;
		}
		console.log(prov.name+'::error::'+err);
	});
};

Imdb.prototype.__proto__ = abstract.prototype;

