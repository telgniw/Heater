var uvQuery = require('../libs/uvQuery');

module.exports = function(app) {
    // Index: home page.
    app.get('/', function(req, res) {
        res.render('index', {
        });
    });

    // Data page.
    app.get('/data', function(req, res) {
        uvQuery.getSortedLocationList(function(locations) {
            res.render('data', {
                locations: locations,
            });
        });
    });

    // Visualization page.
    app.get('/vis', function(req, res) {
        uvQuery.getSortedLocationList(function(locations) {
            res.render('vis', {
                locations: locations,
            });
        });
    });

    // API page.
    app.get('/api_doc', function(req, res) {
        res.render('api_doc', {
        });
    });
};
