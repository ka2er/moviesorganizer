var async = require("async"),
    path = require("path"),
    fs = require("fs")

	file = require("./file.js"),
	Movie = require("./movie.js"),
	allocine = require('./providers/allocine.js'),
	imdb = require('./providers/imdb.js');

/**
 * TODO :
 * + list files
 * + found if nfo are present
 * + query imdb for file name + year
 * + provider as singleton ...
 * + move file.findImdbId => provider.imdb
 * + rename when found
 * + global stats of efficienty
 * + NPM : package it
 * + add cache layer
 * + add command line arguments layer
 * + dry run mode...
 * + handle scoring
 * + cd1 / cd2 ... (just skip it for the moment)
 * + update NFO with ID found (or create it)
	
 * - file hasing identification
 * - name search identification
 * - implements all providers (tmdb)
 * - add command line switching for providers...
 * - verbose ????
	
 * minor :
 * =======
 * - only update NFO if not allready contains ID....
 */

var argv = require("optimist")
    .usage('Identify, rename and move your movies files.\nUsage: $0 --path movie_dir --dest destination_dir [--nfo extra_nfo_dir] [--dry-run]')
    .demand(['p', 'd'])
    .alias('p', 'path')
    .describe('p', 'path where movies files are')
    .alias('d', 'dest')
    .describe('d', 'path where movies files should go')
    .describe('nfo', 'path where extra NFO movies files are')
    .alias('u', 'update-nfo')
    .describe('update-nfo', 'Update NFO to keep track of id/provider found')
    .alias('n', 'dry-run')
    .describe('n', "don't change any files, just show what would have happen")
    .argv
;


var dry_run = argv.n ? true : false;
var aPath = argv.p;
var dPath = argv.d;
var update_nfo = argv.u ? true : false;
var nfo_path = argv.nfo;


// references all providers that we want to use ...
var t_providers = [
	allocine,
	imdb
];

// references to all identified movies
var h_identified_movies = {};

/**
 * return best normalized name if possible or false (based on score)
 *
 * @param oMovie
 * @returns {*}
 */
var getNormalizedName = function(oMovie) {
	var old_score = 0;
	var ret = false;
    for(var prov in oMovie) {
        if(oMovie[prov]['name'] && oMovie[prov]['year']) {
			if(oMovie[prov]['score'] > old_score) {
	            ret = oMovie[prov]['name']+' ('+oMovie[prov]['year']+')';
				old_score = oMovie[prov]['score'];
			}
        }
    }
    return ret;
};

/**
 * callback which do renaming and removing when scrapping is done
 *
 * @param movie
 */
var postScrappingTrigger = function(movie) {

    console.log("Scrapping finished for "+ path.basename(movie));

	/**
	 * update NFO with provider link
	 */
	if(update_nfo && !dry_run) {
		nfo_string = '';
		for(var prov in h_identified_movies[movie]) {
			if(h_identified_movies[movie][prov]['link'])
				nfo_string += "\n" + h_identified_movies[movie][prov]['link'] + "\n";
		}
		if(nfo_string != '')
			file.createOrUpdateNfo(movie, nfo_string);
	}

    /**
     * 0 - do we have a final name ???
     * 1 - find subsequent files (sub, nfo, srt, idx ...)
     * 2 - move them
     * 3 - cleanup old place
     */
    var normalized_name = getNormalizedName(h_identified_movies[movie]);
	console.log(h_identified_movies[movie]);
    if(normalized_name) {
        file.getDependantMovieFiles(movie, function(files) {
            files.push(movie);

            for (var i_file in files) {
                var new_name = path.normalize(dPath + path.sep + normalized_name + path.extname(files[i_file]));
                console.log('  renaming ',files[i_file], new_name);
                if(!dry_run) {
                    fs.renameSync(files[i_file], new_name);
                }
            }

            /**
             * 1 - get parent dir...
             * 2 - check if no more video files presents => delete it ...
             */
            file.remainMovies(path.dirname(files[i_file]), function(remain) {
                if(!remain) {
                    console.log('@TODO: delete dir '+path.dirname(files[i_file]));
                }
            });
        });
    }
};

/**
 * callback to collect infos found .. or not found
 *
 * @param err
 * @param movie
 * @param prov_name
 * @param type
 * @param val
 */
var collectInfos = function(err, movie, prov_name, type, val) {

    h_identified_movies[movie]['count']--;

    if(! h_identified_movies[movie][prov_name]) {
        h_identified_movies[movie][prov_name] = {};
    }

    if(!err) {
        // store value
        h_identified_movies[movie][prov_name][type] = val;
    } else {
        if(err == 'not-found') { // in case of not-found only one call so we decrament a second time to simulate name&year calls
            h_identified_movies[movie]['count'] = h_identified_movies[movie]['count'] - 3;
        }
        h_identified_movies[movie][prov_name]['err'] = err;
    }

	// call post process only when all data are collected
    if(h_identified_movies[movie]['count'] == 0) {
		postScrappingTrigger(movie);
	}
	//console.log(h_identified_movies[movie]['count'], movie);
};

// lookup for all movie
file.getMovies(aPath, function(movie_file) {

	var aMovie = new Movie(movie_file);

    // keep a ref to it
    h_identified_movies[aMovie.path] = {
        count: t_providers.length*4 // nb prov * (name+year+link+score)
    };

	// callback when a movie is identified
	aMovie.on('found', function(provider, id, score) {
		//console.log("  +"+provider.name+" found something id="+id);

        var current_movie = this.path;

		provider.getName(id, function(err, name) {
            collectInfos(err, current_movie, provider.name, 'name', name);
        });

		provider.getYear(id, function(err, year) {
            collectInfos(err, current_movie, provider.name, 'year', year);
        });
		
		// keep track of link and score
		collectInfos(false, current_movie, provider.name, 'link', provider.getLink(id));
        collectInfos(false, current_movie, provider.name, 'score', score);
	});

    aMovie.on('not-found', function(provider) {
        collectInfos('not-found', this.path, provider.name);
    });

	// try to identify a movie ...
	aMovie.process(t_providers, nfo_path);
});


/**
 * some statistics on what have happen...
 */
process.on('exit', function() {
    console.log("============================");
    console.log("Nb movies found : ", Object.keys(h_identified_movies).length);

    var h_movies_ok = {};
    var h_prov_ok = {};
    for(var mov in h_identified_movies) {
        var ok = getNormalizedName(h_identified_movies[mov])
        if(ok) {
            h_movies_ok[mov] = ok;
        }
        for(var prov in h_identified_movies[mov]) {
            if(prov == 'count') continue;
            if(h_identified_movies[mov][prov].err) {
                continue;
            }
            if(! h_prov_ok[prov]) h_prov_ok[prov] = 0;
            h_prov_ok[prov]++;
        }
    }
    console.log("Nb movies identified : ", Object.keys(h_movies_ok).length);
    console.log(h_movies_ok);
    console.log(h_prov_ok);

});
