

module.exports = function Allocine() {

	this.setLang = function(lang) {
		this.lang = lang;
	};

	this.getName = function(id) {

		return false;
	};

	this.identifyFromString = function(buf) {
		//http://www.allocine.fr/film/fichefilm_gen_cfilm=144809.html
		t = buf.match(/allocine\.[^\/]+\/film\/fichefilm_gen_cfilm=(\d+)/i);
		if(t) return t[1];
		return false;
	};
};