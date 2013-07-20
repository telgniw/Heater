var uvQuery = require('../libs/uvQuery');

module.exports = function(app) {
    var apiUrl = app.get('base url') + '/api';

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
};
