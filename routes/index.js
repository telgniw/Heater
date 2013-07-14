module.exports = function(app) {
    var base_url = app.get('base_url');

    // Index: home page.
    app.get(base_url, function(req, res) {
        res.render('index', {
            title: 'UV Visualization',
        });
    });
};
