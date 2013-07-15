var sqlite3 = require('sqlite3');

var db = new sqlite3.Database('data/uv.sqlite3');
var day_format = '%Y-%m-%d';

var getLocations = function(callback) {
    var sql = 'SELECT place AS location, ' + 
              '       MIN(strftime("' + day_format + '", timestamp)) AS first_date, ' +
              '       MAX(strftime("' + day_format + '", timestamp)) AS last_date ' +
              'FROM Data ' +
              'GROUP BY place ';
    db.serialize(function() {
        db.all(sql, function(err, rows) {
            callback(rows);
        });
    });
};

var getLocationInfo = function(location, callback) {
    var sql = 'SELECT place AS location, ' + 
              '       MIN(strftime("' + day_format + '", timestamp)) AS first_date, ' +
              '       MAX(strftime("' + day_format + '", timestamp)) AS last_date ' +
              'FROM Data ' +
              'WHERE place = $location ';
    db.serialize(function() {
        db.all(sql, { $location: location }, function(err, rows) {
            callback(rows);
        });
    });
};

var getUvInfo = function(location, date, callback) {
    var sql = 'SELECT uv, strftime("%H", timestamp) AS hour ' +
              'FROM Data ' +
              'WHERE place = $location AND ' +
              '      strftime("' + day_format + '", timestamp) = $date '
              'ORDER BY timestamp ASC ';
    db.serialize(function() {
        db.all(sql, { $location: location, $date: date }, function(err, rows) {
            callback(rows);
        });
    });
};

module.exports.getLocations = getLocations;
module.exports.getLocationInfo = getLocationInfo;
module.exports.getUvInfo = getUvInfo;
