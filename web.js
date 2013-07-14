var express = require('express');
var sqlite3 = require('sqlite3');

////////////////////////////////////////
// Default settings.
////////////////////////////////////////
var base_url = '/heater';
var api_url = base_url + '/api';

var day_format = '%Y-%m-%d';

////////////////////////////////////////
// App initialization.
////////////////////////////////////////
var app = express();
var db = new sqlite3.Database('data/uv.sqlite3');

app.use(function(req, res, next) {
    res.charset = 'utf-8';
    next();
});

////////////////////////////////////////
// API: get location list
////////////////////////////////////////
app.get(api_url, function(req, res) {
    var sql = 'SELECT place AS location, ' + 
              '       MIN(strftime("' + day_format + '", timestamp)) AS first_date, ' +
              '       MAX(strftime("' + day_format + '", timestamp)) AS last_date ' +
              'FROM Data ' +
              'GROUP BY place ';
    db.serialize(function() {
        db.all(sql, function(err, rows) {
            res.json(rows);
        });
    });
});

////////////////////////////////////////
// API: get timespan for location
////////////////////////////////////////
app.get(api_url + '/:location', function(req, res) {
    var sql = 'SELECT place AS location, ' + 
              '       MIN(strftime("' + day_format + '", timestamp)) AS first_date, ' +
              '       MAX(strftime("' + day_format + '", timestamp)) AS last_date ' +
              'FROM Data ' +
              'WHERE place = $location ';
    db.serialize(function() {
        db.all(sql, { $location: req.params.location }, function(err, rows) {
            res.json(rows);
        });
    });
});

////////////////////////////////////////
// API: get uv list for each hour for
//      location and date
////////////////////////////////////////
app.get(api_url + '/:location/:date', function(req, res) {
    console.log(req.params);
    var sql = 'SELECT uv, strftime("%H", timestamp) AS hour ' +
              'FROM Data ' +
              'WHERE place = $location AND ' +
              '      strftime("' + day_format + '", timestamp) = $date '
              'ORDER BY timestamp ASC ';
    db.serialize(function() {
        db.all(sql, { $location: req.params.location, $date: req.params.date }, function(err, rows) {
            res.json(rows);
        });
    });
});

var port = process.env.PORT || 5000;
app.listen(port, function() {
    console.log('Listening on ' + port);
});
