var http = require('http');
var _ = require('lodash');

var html = '<h1>NoData!</h1>';

http.createServer(function (req,res) {
	res.writeHead(200, {'Content-Type': 'text/html'});
	res.end(html);
}).listen(80, '127.0.0.1');

console.log('Server running at http://127.0.0.1:80/');

var booksUrl = 'http://metadata.helmet-kirjasto.fi/search/author.json?query=Campbell';

console.log("Getting a list of books");

http.get(booksUrl, function(res) {

	var body = "";


	res.on("data", function(chunk) {
		body += chunk;
	});

	res.on("end", function() {
		var bookList = _.map(JSON.parse(body).records, function(d) {
			return {
				displayName: d.title,
				year: d.year
			};
		});
		console.log("Got list of books:", bookList);
		console.log("Totally " + bookList.length + " books!");

		html = "<html><body>\n";
		html += "<ol>\n";

		_.map(bookList, function(d) {
			html += "<li>"+ d.displayName + " (" + d.year + ")</li>\n";
		});

		html += "</ol>\n";

		html += "</body></html>\n";

	});

}).on("error", function(e) {
	console.log("Error: ", e);
});