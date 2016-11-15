/*
 * It's a JS file with "node.js" that can simulate iframeTab in server. You can direkt run it, if you have installed node.
 * When you need to compile and compress JS and CSS file, you should install webpack.js and run that.
 */

var http = require('http'),
    fs = require('fs'),
    path = require('path'),
    server;

function contentType(file) {
    var extname = path.extname(file).toLowerCase(),
        type;
    switch(extname){
        case '.html':
            type = 'text/html';
            break;
        case '.js':
            type = 'text/javascript';
            break;
        case '.css':
            type = 'text/css';
            break;
        case '.jpg':
            type = 'image/jpg';
            break;
        default:
            type = 'text/plain';
    }
    return type;
}

server = http.createServer(function (request, response) {
    var url = request.url,
        file = url.substr(1);

    fs.readFile(file, function (err, data) {
        if (err) {
            console.error(err);
            response.writeHead(404, {'Content-Type': 'text/html; charset = "utf-8"'});
            response.end('404錯誤')
        } else {
            response.writeHead(200, {'Content-Type': contentType(file)});
            response.end(data);
        }
    });

}).listen(8888);
