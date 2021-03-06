var Provider = module.exports = function Provider() {
	this.name = "please define me";
	this.lang = "FR"; // default to french
};

Provider.prototype.get = function() {
	return this;
};

Provider.prototype.setLang = function(lang) {
	this.lang = lang;
};

Provider.prototype.registerCallback = function(cb) {
	var self = this;
	return function() { // anonymous function to keep track of the current provider
		this.name = self.name;
		self[cb].apply(self, arguments);
	}
};
Provider.prototype.getLink = function(id) {
	console.log(this.name+".getLink(id) => not implemented");
};

Provider.prototype.getName = function(id) {
	console.log(this.name+".getName(id) => not implemented");
};

Provider.prototype.getYear = function(id) {
	console.log(this.name+".getYear(id) => not implemented");
};

Provider.prototype.identifyFromString = function(buf) {
	console.log(this.name+".identifyFromString(bug) => not implemented");
	console.log("   you should return 'id' if string description is identified or false");
};

Provider.prototype.identifyFromFile = function(file) {
	console.log(this.name+".identifyFromFile(file) => not implemented");
	console.log("   you should emit a 'found' event with provider as 1st param and id as 2nd param if file is identified");
};
