var uvQuery = require('../libs/uvQuery');

module.exports = function(app) {
    var baseUrl = app.get('base url');

    // Index: home page.
    app.get(baseUrl, function(req, res) {
        res.render('index', {
        });
    });

    // Data page.
    app.get(baseUrl + '/data', function(req, res) {
        uvQuery.getSortedLocationList(function(locations) {
            res.render('data', {
                locations: locations,
            });
        });
    });

    // Visualization page.
    app.get(baseUrl + '/vis', function(req, res) {
        res.render('vis', {
        });
    });

    // API page.
    // TODO
};
