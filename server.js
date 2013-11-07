var http = require('http');
var path = require('path');
var fs = require('fs');

var mimeTypes = {
	'.js': 'text/javascript',
	'.html': 'text/html',
	'.css': 'text/css'
};

var cache = {};

function cacheAndDeliver(f, cb) {
	if(!cache[f]) {
		fs.readFile(f, function(err, data) {
			if(!err) {
				cache[f] = {content: data};
			}
			cb(err, data);
		});
		return;
	}
	console.log(f + '　をキャッシュから読み込みます');
	cb(null, cache[f].content);
}

http.createServer(function(request,response) {

	var lookup = path.basename(decodeURI(request.url)) || 'index.html';
	f = 'content/' + lookup;
	fs.exists(f, function(exists) {
		if(exists) {
			cacheAndDeliver(f, function(err, data) {
				if (err) {
					response.writeHead(500);
					response.end('ServerError!');
					return;
				};
				var headers = {'Content-Type': mimeTypes[path.extname(f)]};
				response.writeHead(200, headers);
				response.end(data);
			});
			return;
		}
		response.writeHead(404);
		response.end('ページが見つかりません');

		// console.log(exists ? lookup + "は存在します" : lookup + "は存在しません" );
	});

}).listen(8080);