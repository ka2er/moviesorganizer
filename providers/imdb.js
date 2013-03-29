var	imdb = require('imdb-api'),
	fs = require('fs'),
	path = require('path'),
	file = require('../file.js'),
	abstract = require('./abstract.js');

var Imdb = function Imdb() {
	var prov = this;

	this.getLink = function(id) {
		return "http://www.imdb.com/title/tt/"+id;
	};
};

Imdb.prototype.name = 'imdb';
Imdb.prototype.h_cache = {};

/**
 * retrieve movie year from id
 *
 * @param id
 * @param cb
 * @returns {*}
 */
Imdb.prototype.getYear = function(id, cb) {
	// use cache if available
	if(this.h_cache[id])
		return cb(false, this.h_cache[id].year);

	var aImdb = this;

	imdb.getById(id, function(err, data){

		if(!err) {
			aImdb.h_cache[id] = data;
			return cb(false, aImdb.h_cache[id].year);
		}
		//console.log(" +"+aImdb.name+'::err::', err, err.stack);
		cb(err);
	});
};


/**
 * retrieve movie name from id
 *
 * @param id
 * @param cb
 * @returns {*}
 */
Imdb.prototype.getName = function(id, cb) {
	// use cache if available
	if(this.h_cache[id])
		return cb(false, this.h_cache[id].title);

	var aImdb = this;

	imdb.getById(id, function(err,data){

		if(!err) {
			aImdb.h_cache[id] = data;
			return cb(false, aImdb.h_cache[id].title);
		}
        //console.log(" +"+aImdb.name+'::err::', err, err.stack);
		cb(err);
	});
};


/**
 * try to find an imdb id from a string
 * @param buf
 * @return false | id
 */
Imdb.prototype.identifyFromString = function(buf) {
	//t = buf.match(/imdb\.[^\/]+\/title\/tt(\d+)/i);
	t = buf.match(/tt(\d+)/i);
	if(t) {
		return t[1];
	}
	return false;
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
	console.log(" +"+this.name +": trying to identify from file data: "+movie_name);
	imdb.get(movie_name, function(err, movie) {
		if(!err) {
			//console.log(movie);
			// add to cache...
			prov.h_cache[movie.imdbid] = movie;
			return movie.imdbid;
		}
		console.log(" +"+prov.name+'::error::'+err);
		return false;
	});
};

Imdb.prototype.__proto__ = abstract.prototype;

module.exports = Imdb.prototype;