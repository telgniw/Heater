var sqlite3 = require('sqlite3');

var db = new sqlite3.Database('data/uv.sqlite3');
var day_format = '%Y-%m-%d';

module.exports = function(app) {

var api_url = app.get('base_url') + '/api';

// API: get location list
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

// API: get timespan for location
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

// API: get uv list for each hour for location and date
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

};
