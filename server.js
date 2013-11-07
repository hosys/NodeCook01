var http = require('http');
var path = require('path');
var fs = require('fs');

http.createServer(function(request,response) {

	var lookup = path.basename(decodeURI(request.url)) || 'index.html';
	f = 'content/' + lookup;
	fs.exists(f, function(exists) {
		console.log(exists ? lookup + "は存在します" : lookup + "は存在しません" );
	});

}).listen(8080);