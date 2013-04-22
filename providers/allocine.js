var abstract = require('./abstract.js'),
    allocine = require('allocine');


var Allocine = function Allocine() {};

Allocine.prototype.name = 'allocine';
Allocine.prototype.h_cache = {};

Allocine.prototype.api = function() {
    if(! this._api)
        this._api = new allocine.API();

    return this._api;
}


/**
 * retrieve movie name from id
 *
 * @param id
 * @param cb
 * @returns {*}
 */
Allocine.prototype.getName = function(id, cb) {
    // use cache if available
    if(this.h_cache[id])
        return cb(false, this.h_cache[id].originalTitle);

    ac = this;

    try {
        this.api().movie(id, function(r) {
            ac.h_cache[id] = r.movie;
            return cb(false, r.movie.originalTitle)
        });
    } catch (err) {
        cb(err);
    }
};


/**
 * retrieve movie year from id
 *
 * @param id
 * @param cb
 * @returns {*}
 */
Allocine.prototype.getYear = function(id, cb) {
    // use cache if available
    if(this.h_cache[id])
        return cb(false, this.h_cache[id].productionYear);

    ac = this;

    try {
        this.api().movie(id, function(r) {
            ac.h_cache[id] = r.movie;
            return cb(false, r.movie.productionYear)
        });
    } catch (err) {
        cb(err);
    }
};


/**
 * Identify from id in string
 * @param buf
 * @return false | id
 */
Allocine.prototype.identifyFromString = function(buf) {
	//http://www.allocine.fr/film/fichefilm_gen_cfilm=144809.html
	t = buf.match(/allocine\.[^\/]+\/film\/fichefilm_gen_cfilm=(\d+)/i);
	if(t) {
		return t[1];
	}
	return false;
};

/**
 * return URL to movie details
 */
Allocine.prototype.getLink = function(id) {
	return "http://www.allocine.fr/film/fichefilm_gen_cfilm="+id+".html";
};


Allocine.prototype.identifyFromFile = function(file) {
	console.log(" +"+this.name+" : @TODO trying to identify from file data: "+file);
	//this.emit('found', 'TODO-HASH-FILE');
};

Allocine.prototype.__proto__ = abstract.prototype;


//
module.exports = Allocine.prototype;