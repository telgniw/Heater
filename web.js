var express = require('express');
var sqlite3 = require('sqlite3');

var base_url = '/heater/api';
var day_format = '%Y-%m-%d';
var hour_format = '%H';

var db = new sqlite3.Database('data/uv.sqlite3');

var app = express();

app.use(function(req, res, next) {
    res.charset = 'utf-8';
    next();
});

app.get(base_url, function(req, res) {
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

app.get(base_url + '/:location', function(req, res) {
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

app.get(base_url + '/:location/:date', function(req, res) {
    console.log(req.params);
    var sql = 'SELECT uv, strftime("' + hour_format + '", timestamp) AS hour ' +
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
