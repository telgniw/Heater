var fs = require('fs');
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

var getSortedLocationList = function(callback) {
    getAllInfo(function(rows) {
        var mainLocations = JSON.parse(
            fs.readFileSync('./data/mainLocations.json')
        );

        var locations = [];
        for(var i in rows) {
            locations.push(rows[i].location);
        }

        locations.sort(function(a, b) {
            var idxA = mainLocations.indexOf(a);
            var idxB = mainLocations.indexOf(b);

            if(idxA < 0 && idxB < 0)
                return a <= b? -1 : 1;

            idxA = idxA < 0? mainLocations.length : idxA;
            idxB = idxB < 0? mainLocations.length : idxB;
            return idxA - idxB;
        });

        callback(locations);
    });
};

var getUvList = function(location, date, callback) {
    var sql = 'SELECT uv, strftime("%H", timestamp) AS hour ' +
              'FROM Data ' +
              'WHERE place = $location AND ' +
              '      strftime("' + dayFormat + '", timestamp) = $date ' +
              'ORDER BY timestamp ASC ';
    db.serialize(function() {
        db.all(sql, { $location: location, $date: date }, function(err, rows) {
            callback(rows);
        });
    });
};

var getWeekUvList = function(location, date, callback) {
    var sql = 'SELECT uv, strftime("' + dayFormat + ' %H", timestamp) AS timestamp ' +
              'FROM Data ' +
              'WHERE place = $location AND ' +
              '      julianday($date) - julianday(timestamp) > -1 AND ' +
              '      julianday($date) - julianday(timestamp) <= 6 ' +
              'ORDER BY timestamp ASC ';
    db.serialize(function() {
        db.all(sql, { $location: location, $date: date }, function(err, rows) {
            callback(rows);
        });
    });
};

module.exports.getAllInfo = getAllInfo;
module.exports.getLocationInfo = getLocationInfo;
module.exports.getSortedLocationList = getSortedLocationList;
module.exports.getUvList = getUvList;
module.exports.getWeekUvList = getWeekUvList;
