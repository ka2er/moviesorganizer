/**
 * Created with JetBrains PhpStorm.
 * User: seb
 * Date: 26/09/12
 * Time: 21:41
 * To change this template use File | Settings | File Templates.
 */

var findit = require("findit"),
	fs = require("fs");

// video files common extension
// http://trac.opensubtitles.org/projects/opensubtitles/wiki/
var t_movie_ext = [
        'asf', 'avi', 'divx', 'h264',
		'mkv', 'mov', 'movhd', 'ogm',
		'vob', 'wmv', 'x264','xvid'
];
getMovies = function(path, callback) {
	findit.find(path, function(file) {
		fs.stat(file, function(err, stat) {
			if(! err && stat.isFile()) {
				if(file.indexOf('.') != -1) { // file has extension
					ext = getExtension(file);
					if(t_movie_ext.indexOf(ext.toLowerCase()) != -1) {
						console.log("Movie found : "+file);
						callback(file);
					}
				}
			}
		});
	});
};


getExtension = function(file) {
	return file.split('.').pop();
};

getNfo = function(file, callback) {
	var ext = getExtension(file);
	var nfo = file.substr(0, file.length-ext.length)+'nfo';

	fs.stat(nfo, function (err, stats) {
		if(err) {
			callback(err);
			return;
		}
		callback(null, nfo);
	});
};

findImdbId = function(file, callback) {

	fs.readFile(file, function(err, buf) {
		if(err) {
			callback(err);
			return;
		}

		t = buf.toString().match(/imdb\.[^\/]+\/title\/tt(\d+)/i);
		if(t) callback(null, t[1]);
		else callback("IMDB url not found in "+file);
	});

};

cleanupName = function(file) {
	var t_search = [
		'720p',
		'bluray',
		'x264',
		'french',
		'frehd',
		'[^a-z0-9]',
		'[0-9]{4}'
	];

	for(i in t_search) {
		var regex = new RegExp(t_search[i], "gi");
		file = file.replace(regex, ' ');
	}

	// trim spaces
	return file.replace(/^\s+|\s+$/, '');
};

// exports
exports.getExtension = getExtension;
exports.getMovies = getMovies;
exports.getNfo = getNfo;
exports.findImdbId = findImdbId;
exports.cleanupName = cleanupName;
