var Tmdb = require(__dirname+'/../providers/tmdb.js');


var tmdb = new Tmdb();
var str = "dsfsfa\n" +
	"dfsfshttp://www.themoviedb.org/movie/11238-aladdin-and-the-king-of-thieves" +
	"dfsfffs\nsdffsfd";
console.log(str);
tmdb.identifyFromString(str);
tmdb.idFromImdbId("tt0936501");
tmdb.getName();