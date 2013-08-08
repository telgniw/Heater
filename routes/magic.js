var uvQuery = require('../libs/uvQuery');

module.exports = function(app) {
    var baseUrl = app.get('base url');
    var magicUrl = baseUrl + '/magic';

    // Magic circle.
    app.get(magicUrl + '/:location/:date', function(req, res) {
        uvQuery.getWeekUvList(req.params.location, req.params.date, function(rows) {
            res.render('magic', {
                data: rows
            });
        });
    });
};
