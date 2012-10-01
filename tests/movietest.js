var Movie = require(__dirname+'/../movie.js');


var path = "/home/seb/dev/moviesorganizer/films/a.avi";
var mov = new Movie(path);


mov.on('found', function(provider, id){
	console.log('Movie '+path+ "identified as "+id+" on "+provider);
});

mov.process();
