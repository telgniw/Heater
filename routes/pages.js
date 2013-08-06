var uvQuery = require('../libs/uvQuery');

module.exports = function(app) {
    var baseUrl = app.get('base url');

    // Index: home page.
    app.get(baseUrl, function(req, res) {
        uvQuery.getSortedLocationList(function(locations) {
            res.render('index', {
                locations: locations,
            });
        });
    });
};
