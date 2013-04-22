var EventEmitter = require('events').EventEmitter,
	fs = require('fs'),
	file = require('./file.js'),
	path = require('path'),
	async = require("async")
;


var Movie = module.exports = function Movie(path) {
	this.path = path;
	this.nfo = false; // presence of NFO

   //// this.name = '';
  //  this.year = '';
};

Movie.prototype.__proto__ = EventEmitter.prototype;

/**
 * set the movie name
 * @param name
 */
/*
Movie.prototype.setName = function(name) {
    this.name = name;
    if(this.name && this.year)
        this.emit('identified');
}
*/
/**
 * set the movie year
 * @param year
 */
/*
Movie.prototype.setYear = function(year) {
    this.year = year;
    if(this.name && this.year)
        this.emit('identified');
}
*/

/**
 * retrieve NFOs file content (same dir + nfo dir)
 *
 * @param alt_nfo_path
 * @param cb  cb(nfo_buf)
 * @returns {*}
 */
Movie.prototype.getNFOsContent = function(alt_nfo_path, cb) {

	// cache layer
	if(this.nfo) return cb(this.nfo);

	var self = this;
	var nfo = this.path;

	var t_nfo = [nfo];

    // if extra NFO path we use it
    if(alt_nfo_path) {
        var alt_nfo = alt_nfo_path + path.sep + path.basename(this.path);
        t_nfo.push(alt_nfo);
    }

	var nfo_buf = '';
	var nb_get = 0;
	for(var i in t_nfo) {
		file.getNfo(t_nfo[i], function(err, nfo) { // try to get NFO
			if(!err) {
				buf = fs.readFileSync(nfo);
				nfo_buf += buf.toString();
			}
			// on final read we could send back nfo_buf
			nb_get++;
			if(nb_get == t_nfo.length) {
				self.nfo = nfo_buf; // cache nfo content
				cb(nfo_buf);
			}
		});
	}
};

/**
 * @param string
 */
Movie.prototype.updateNfo = function(string) {
	//if(this.nfo) {
	//	fs.appendFileSync(filename, data);
	//}
	console.log("TODO: implement updateNFO with string"+string);

	// 1 - write or update nfo
};

/**
 * process movie identification
 *
 * @param t_providers
 * @param alt_nfo_dir
 */
Movie.prototype.process = function(t_providers, alt_nfo_dir){

	var self = this;

	this.getNFOsContent(alt_nfo_dir, function(nfo_buf) {
		for(var i in t_providers) {
			var aProvider = t_providers[i];
			//var aProvider = new provider(); // instance a provider
//		this.on('nfo-found', aProvider.registerCallback('identifyFromString'));
//		this.on('nfo-not-found', aProvider.registerCallback('identifyFromFile'));

			var score = -1;
	 		try {
				
				// 1 - NFO content : string passed is NFOs content + file name...
				id = aProvider.identifyFromString(nfo_buf+" file: "+self.path);
				if(id) {
					score = 100; // identification against id is very strong
					throw 'found';
				}

				// 2 - file hash

				// 3 - file name search

				//console.log('try next method for'+self.path+" ("+aProvider.name+")");
                /**
                 * 1,2 - NFO content + file name has ID
                 * 3 - file hash
                 * 4 - file name search
                 */


                throw 'not-found';
			} catch(exc) {
				if(exc == 'found') {
					//console.log(self.path +" identified as "+id+" by "+aProvider.name);
					self.emit('found', aProvider, id, score);
				} else {
                    self.emit('not-found', aProvider);
                    //console.log("No identification for "+self.path+' by '+aProvider.name);
				}
			}
		}

	});
};