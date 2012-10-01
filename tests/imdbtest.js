var Imdb = require(__dirname+'/../providers/imdb.js');


var imdb = new Imdb();
var str = "dsfsfa\n" +
	"dfsfswww.imdb.com/title/tt0936501/fsfds" +
	"dfsfffs\nsdffsfd";
console.log(str);
console.log(imdb.identifyFromString(str));
imdb.getName("0936501");