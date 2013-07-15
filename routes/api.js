var uvQuery = require('../libs/uvQuery');

module.exports = function(app) {
    var api_url = app.get('base_url') + '/api';

    // API: get location list
    app.get(api_url, function(req, res) {
        uvQuery.getLocations(function(rows) {
            res.json(rows);
        });
    });

    // API: get timespan for location
    app.get(api_url + '/:location', function(req, res) {
        uvQuery.getLocationInfo(req.params.location, function(rows) {
            res.json(rows);
        });
    });

    // API: get uv list for each hour for location and date
    app.get(api_url + '/:location/:date', function(req, res) {
        uvQuery.getUvInfo(req.params.location, req.params.date, function(rows) {
            res.json(rows);
        });
    });
};
