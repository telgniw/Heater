var express = require('express');
var fs = require('fs');

// App initialization.
var app = express();

app.set('base_url', '/heater');

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.use(app.get('base_url'), express.static(__dirname + '/public'));

app.use(function(req, res, next) {
    res.charset = 'utf-8';
    next();
});

// Import all routes.
// Reference: http://stackoverflow.com/a/9030181/881930
fs.readdirSync('./routes/').forEach(function(file) {
    var route = './routes/' + file.substr(0, file.indexOf('.'));

    console.log('Dynamically loading ' + route);
    require(route)(app);
});

// Start app.
var port = process.env.PORT || 5000;
app.listen(port, function() {
    console.log('Listening on ' + port);
});
