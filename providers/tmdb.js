var mdb = require('moviedb')('KEY'),
	abstract = require('./abstract.js');

var tmdb = module.exports = function Tmdb() {

	this.name = "tmdb";

	this.getName = function(id) {
		mdb.movieAlternativeTitles({id:id}, function(err, res) {
			if(!err) {
				for (i in res.titles) {
					if(res.titles[i].iso_3166_1 == this.lang)
						console.log(res.titles[i].title);
				}
			}
		}); // , country:"FR"
		mdb.movieInfo({id:id}, function(err, res) {
			if(!err) {
				if(res.release_date) {
					var year = res.release_date.split('-')[0];
					console.log(year);
				}
			}
		}); // , language:"FR"
		return false;
	};

	this.idFromImdbId = function(imdb_id) {
		mdb.searchMovie({query:imdb_id}, function(err, res) {
			if(!err) {
				console.log(this.name+" : id lookup from imdb id => "+ res.results[0].id);
			}
		});
	},

	this.getLink = function(id) {
		return "http://www.themoviedb.org/movie/"+id;
	};
};

tmdb.prototype.identifyFromString = function(buf) {
	t = buf.match(/themoviedb\.[^\/]+\/movie\/(\d+)-/i);
	if(t) {
		this.emit('found', t[1]);
	}
};

tmdb.prototype.__proto__ = abstract.prototype;

