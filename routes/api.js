var uvQuery = require('../libs/uvQuery');

module.exports = function(app) {
    var apiUrl = '/api';

    // API: get magic circle visualization
    app.get(apiUrl + '/draw/magic', function(req, res) {
        res.render('api/magic');
    });

    // API: get location list
    app.get(apiUrl, function(req, res) {
        uvQuery.getAllInfo(function(rows) {
            res.json(rows);
        });
    });

    // API: get timespan for location
    app.get(apiUrl + '/:location', function(req, res) {
        uvQuery.getLocationInfo(req.params.location, function(row) {
            res.json(row);
        });
    });

    // API: get uv list for each hour for location and date
    app.get(apiUrl + '/:location/:date', function(req, res) {
        uvQuery.getUvList(req.params.location, req.params.date, function(rows) {
            res.json(rows);
        });
    });

    // API: get uv list for each hour for location and week ends with date
    app.get(apiUrl + '/7/:location/:date', function(req, res) {
        uvQuery.getWeekUvList(req.params.location, req.params.date, function(rows) {
            res.json(rows);
        });
    });
};
