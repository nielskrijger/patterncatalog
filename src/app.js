'use strict';

var restify = require('restify');
var config = require('./lib/config');
var mongodb = require('./lib/mongodb');
var patterns = require('./app/patterns');
var log = require('./lib/logger');
var error = require('./lib/error');

// Create restify server
var server = restify.createServer({
    formatters: {
        // Parse json manually to allow custom error format
        'application/json': function customizedFormatJSON(req, res, body) {
            if (body instanceof Error) {
                res.statusCode = body.status || 500;
                body = body;
            } else if (Buffer.isBuffer(body)) {
                body = body.toString('base64');
            }
            var data = JSON.stringify(body);
            res.setHeader('Content-Length', Buffer.byteLength(data));
            return data;
        }
    }
});

server.use(restify.acceptParser(server.acceptable));
server.use(restify.bodyParser());
server.use(restify.queryParser());
server.use(restify.gzipResponse());

// Log startup information
log.info('Server run mode: ' + config.get('env'));
log.info('Server port: ' + config.get('port'));
log.info('Server pid: ' + process.pid);
log.info('Server process title: ' + process.title);
log.info('Server node.js version: ' + process.version);
log.info('Server architecture: ' + process.platform);

// Routes
server.get('/', function(req, res) {
    res.send('Hello World!');
});

server.post('/patterns', patterns.postPattern);

// Page not found (404)
server.on('NotFound', function(req, res) {
    if (req.accepts('json')) {
        res.send(new error.ResourceNotFoundError('Resource not found'));
    } else {
        res.contentType = 'text/html';
        res.send('404: Resource not found');
    }
});

function initApplication() {
    return mongodb.connect(config.get('mongodb:url'))
        .then(function() {
            return server.listen(3000, function() {
                var host = server.address().address;
                var port = server.address().port;

                log.info('Application listening on http://%s:%s', host, port);
            });
        })
        .catch(function(e) {
            log.fatal(e);
        });
}

module.exports = initApplication();
