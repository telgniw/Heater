module.exports = function(app) {
    app.get(app.get('base_url'), function(req, res) {
        res.send('hello world');
    });
};
