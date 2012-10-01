/**
 * Created with JetBrains PhpStorm.
 * User: seb
 * Date: 26/09/12
 * Time: 20:25
 * To change this template use File | Settings | File Templates.
 */

var file = require("./file.js"),
	async = require("async");

/**
 * TODO :
 * + list files
 * + found if nfo are present
 * - query imdb for file name + year
 * - rename
 * - package it
 *
 * - add cache layer
 * - add config layer
 *
 *
 * ls files > find nfo (a)                          > check imdb | allocine url > grab site for title + year > if rename does it
 *          > hash movie  > check opensub for imdb  >
 *
 *
 *  find movies > launch resolvers
 *
 *  when resolved > grab data
 *
 * organize by :
 *
 * - info providers (imdb, allocine)
 * - resolvers (nfo, hash)
 *      nfo parser (imdb,allocine)
 *      opensub hash (imdb)
 *
 *
 *  TODO :
 *
 *  fork : worr / node-imdb-api
 *  add support for request by id
 *
 */

var path = '/home/seb/dev';

file.getMovies(path, function(movie) {

	var x = new Movie(movie);
	x.on('identified', function(provider, id) {
		var name = provider.getName(id);
		x.writeNfo(provider.getUrl(id));

		if(1) {
			x.rename(name);
		}
	});
	x.process();

	// try NFO way
	async.waterfall([
		function(callback) {
			file.getNfo(movie, callback);
		},
		function(nfo, callback) {
			file.findImdbId(nfo, callback);
		}

	], function(err, imdb){

		// sync call for opensub hashing

		if(!err) {
			console.log(movie+" : "+imdb);
		}
	});

	// opensub way...


	console.log("END");


	/*
	file.getNfo(movie, function(nfo){
		console.log("NFO found :"+nfo);



		file.findImdbId(nfo, function(err, imdb_id){

			if(err) {
				console.log("Oops it seem we need to hash movie file...");
				return;
			} else {
				file.emit('imdb-found', imdb_id);
			}
// commen gerer imdb from nfo or opensub...
			//console.log("ImdbId found : "+imdb_id);
		});
	});
	*/
});

var Movie = require("./movie.js");
var movie = new Movie();