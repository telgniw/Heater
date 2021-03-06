var express = require('express');
var fs = require('fs');

// App initialization.
var app = express();

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.use(express.static(__dirname + '/public'));

app.use(function(req, res, next) {
    res.charset = 'utf-8';
    next();
});

// Import all routes.
// Reference: http://stackoverflow.com/a/9030181/881930
fs.readdirSync('./routes/').forEach(function(file) {
    var dotIndex = file.indexOf('.');
    if(file.substr(dotIndex, file.length - dotIndex) != '.js')
        return;

    var route = './routes/' + file.substr(0, dotIndex);

    console.log('Dynamically loading ' + route);
    require(route)(app);
});

// Start app.
var port = process.env.PORT || 5000;
app.listen(port, function() {
    console.log('Listening on ' + port);
});
