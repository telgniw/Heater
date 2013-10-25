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
        res.render('vis', {
        });
    });

    // API page.
    // TODO
};
