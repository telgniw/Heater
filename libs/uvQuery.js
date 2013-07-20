var sqlite3 = require('sqlite3');

var db = new sqlite3.Database('data/uv.sqlite3');
var dayFormat = '%Y-%m-%d';

var getAllInfo = function(callback) {
    var sql = 'SELECT place AS location, ' + 
              '       MIN(strftime("' + dayFormat + '", timestamp)) AS first_date, ' +
              '       MAX(strftime("' + dayFormat + '", timestamp)) AS last_date ' +
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
              '       MIN(strftime("' + dayFormat + '", timestamp)) AS first_date, ' +
              '       MAX(strftime("' + dayFormat + '", timestamp)) AS last_date ' +
              'FROM Data ' +
              'WHERE place = $location ';
    db.serialize(function() {
        db.get(sql, { $location: location }, function(err, row) {
            callback(row);
        });
    });
};

var getUvList = function(location, date, callback) {
    var sql = 'SELECT uv, strftime("%H", timestamp) AS hour ' +
              'FROM Data ' +
              'WHERE place = $location AND ' +
              '      strftime("' + dayFormat + '", timestamp) = $date '
              'ORDER BY timestamp ASC ';
    db.serialize(function() {
        db.all(sql, { $location: location, $date: date }, function(err, rows) {
            callback(rows);
        });
    });
};

module.exports.getAllInfo = getAllInfo;
module.exports.getLocationInfo = getLocationInfo;
module.exports.getUvList = getUvList;
