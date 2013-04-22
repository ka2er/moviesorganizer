/**
 * Created with JetBrains PhpStorm.
 * User: seb
 * Date: 26/09/12
 * Time: 21:41
 * To change this template use File | Settings | File Templates.
 */

var findit = require("findit"),
	fs = require("fs"),
	path = require("path"),
    glob = require("glob");

// video files common extension
// http://trac.opensubtitles.org/projects/opensubtitles/wiki/
var t_movie_ext = [
        'asf', 'avi', 'divx', 'h264',
		'mkv', 'mov', 'movhd', 'ogm',
		'vob', 'wmv', 'x264','xvid'
];

// extra video files (subtitles, info, etc...)
var t_movie_dep_ext = [
        'idx', 'sub', 'srt', 'nfo'
];

/**
 * find all movies recursively into a path
 *
 * @param aPath
 * @param callback cb(file)
 */
getMovies = function(aPath, callback) {
	findit.find(aPath, function(file) {
		fs.stat(file, function(err, stat) {
			if(! err && stat.isFile()) {
				if(file.indexOf('.') != -1) { // file has extension
                    file = path.normalize(file);
					ext = getExtension(file);
					if(t_movie_ext.indexOf(ext.toLowerCase()) != -1) {
						//console.log("Movie found : "+file);

                        // movie has part ... @TODO handle it
                        if(file.toLowerCase().indexOf('cd1') == -1 &&
                           file.toLowerCase().indexOf('cd2') == -1
                            ) {

                            callback(file);
                        }
					}
				}
			}
		});
	});
};

/**
 * check if a dir contains movies
 * @param dir
 * @param cb
 */
remainMovies = function(dir, cb) {
    glob(dir+path.sep+"*.{"+t_movie_ext.join(',')+"}", function(err, files) {
        if(!err) {
            return cb(files.length > 0);
        }
        cb(true); // in case of doubt...
    });
};


/**
 * search for dependant files relative to a movie file
 *
 * @param aMovie
 * @param cb
 */
getDependantMovieFiles = function(aMovie, cb) {
    var file_base = path.normalize(path.dirname(aMovie)+path.sep+path.basename(aMovie, path.extname(aMovie)));
    glob(file_base+".{"+t_movie_dep_ext.join(',')+"}", function(err, files) {
        if(!err) {
            cb(files);
        }
    });
};

/**
 * return file extension without the .
 * @param file
 * @returns {string}
 */
getExtension = function(file) {
	return path.extname(file).substr(1);
};

/**
 * return NFO object if found
 * @param file
 * @param callback(err, file)
 */
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

/**
 * create or Update movie NFO file
 * @param movie_file
 * @param string to append
 */
createOrUpdateNfo = function(movie_file, string) {
	var ext = getExtension(movie_file);
	var nfo = movie_file.substr(0, movie_file.length-ext.length)+'nfo';
	
	var ret = fs.appendFileSync(nfo, string);
	if(ret) console.log('	err while creatingOrUpdatingNfo for '+movie_file, ret);
};

/**
 * cleanup file name from irrevelant informations
 */
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
exports.remainMovies = remainMovies;
exports.getNfo = getNfo;
exports.createOrUpdateNfo = createOrUpdateNfo;
exports.cleanupName = cleanupName;
exports.getDependantMovieFiles = getDependantMovieFiles;
