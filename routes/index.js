var fs = require('fs');
var uvQuery = require('../libs/uvQuery');

module.exports = function(app) {
    var baseUrl = app.get('base url');

    // Index: home page.
    app.get(baseUrl, function(req, res) {
        uvQuery.getAllInfo(function(rows) {
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

            res.render('index', {
                title: 'UV Visualization',
                locations: locations,
            });
        });
    });
};
