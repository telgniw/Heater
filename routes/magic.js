module.exports = function(app) {
    var baseUrl = app.get('base url');
    var magicUrl = baseUrl + '/magic';

    // Magic circle.
    app.get(magicUrl + '/:location/:date', function(req, res) {
        res.render('magic', {
            location: req.params.location,
            date: req.params.date,
        });
    });
};
