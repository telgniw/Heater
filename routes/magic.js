module.exports = function(app) {
    var baseUrl = app.get('base url');
    var magicUrl = baseUrl + '/magic';

    // Magic circle.
    app.get(magicUrl, function(req, res) {
        res.render('magic_older');
    });
};
