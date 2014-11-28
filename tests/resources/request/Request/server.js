var http = require('http');
var fs = require('fs');
var path = require('path');

var server = http.createServer(function ( request, response ) {
    switch ( request.url ) {
        case '/':
            display_form(request, response);
            break;
        case '/upload':
            upload_file(request, response);
            break;
        default:
            show_404(request, response);
            break;
    }
});
server.listen(3001);

function display_form ( request, response ) {
    response.writeHead(200, {'Content-Type': 'text/html'});
    response.write('<form action="/upload" method="post" enctype="multipart/form-data">' + '<input type="file" name="upload-file">' + '<input type="submit" value="Upload">' + '</form>');
    response.end();
}

function upload_file ( request, response ) {
    console.log('starting upload');
    var filePath = path.join(__dirname, 'uploadFile');
    var file = fs.createWriteStream(filePath);
    request.pipe(file);
    var total = {
        b: request.headers['content-length'],
        mb: (request.headers['content-length'] / (1024 * 1024)).toFixed(2)
    };
    var uploaded = {
        b: 0,
        mb: 0
    };
    var body = '';

    request.on('data', function ( data ) {
        body += data;
        uploaded.b += data.length;
        uploaded.mb = (uploaded.b / (1024 * 1024)).toFixed(2);
        var progress = ((uploaded.b / total.b) * 100).toFixed(2);
        var result = 'Uploaded ' + uploaded.mb + 'mb of ' + total.mb + 'mb (' + progress + '%)\n';
        console.log(result);
    });

    request.on('end', function () {
        var result = 'Upload complete';
        console.log(result);
        send_file(filePath, response);
    });
}

function send_file ( filePath, response ) {
    var stat = fs.statSync(filePath);

    response.writeHead(200, {
        'Content-Type': 'text/html',
        'Content-Length': stat.size
    });

    var readStream = fs.createReadStream(filePath);

    var total = {
        b: stat.size,
        mb: (stat.size / (1024 * 1024)).toFixed(2)
    };
    var downloaded = {
        b: 0,
        mb: 0
    };

    readStream.on('data', function ( data ) {
        response.write(data);
        downloaded.b += data.length;
        downloaded.mb = (downloaded.b / (1024 * 1024)).toFixed(2);
        var progress = ((downloaded.b / total.b) * 100).toFixed(2);
        var result = 'Downloaded ' + downloaded.mb + 'mb of ' + total.mb + 'mb (' + progress + '%)\n';
        console.log(result);
    });

    readStream.on('end', function () {
        response.end();
        var result = 'Download complete';
        console.log(result);
    });
}

function show_404 ( request, response ) {
    response.writeHead(404, {'Content-Type': 'text/plain'});
    response.write('You are doing it wrong!');
    response.end();
}