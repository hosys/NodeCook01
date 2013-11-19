var http = require('http');
var path = require('path');
var fs = require('fs');

var mimeTypes = {
	'.js': 'text/javascript',
	'.html': 'text/html',
	'.css': 'text/css'
};

var cache = {};

http.createServer(function (request,response) {

	var lookup = path.basename(decodeURI(request.url)) || 'index.html',
		f = 'content/' + lookup;
		// console.log(f);
	fs.exists(f, function (exists) {
		if (exists) {
			var headers = {'Content-Type': mimeTypes[path.extname(f)]+ ';charset=utf-8'};
			if (cache[f]) {
				response.writeHead(200, headers);
				response.end(cache[f].content);
				return;
			};

			var s = fs.createReadStream(f).once('open', function () {
				response.writeHead(200, headers);
				this.pipe(response);

			}).once('error', function (e) {
				console.log(e);
				response.writeHead(500);
				response.end('サーバエラー');
			});

			fs.Stats(f, function (err, stats) {
				var bufferOffset = 0;
				cache[f] = {content: new Buffer(stats.size)};
				s.on('data', function (data) {
					data.copy(cache[f].content, bufferOffset);
					bufferOffset += data.length;
				});
			});
			return;
		}

		response.writeHead(404);
		response.end('ページが見つかりません');

		// console.log(exists ? lookup + "は存在します" : lookup + "は存在しません" );
	});

}).listen(8080);