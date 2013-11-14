var uvQuery = require('../libs/uvQuery');

module.exports = function(app) {
    // Index: home page.
    app.get('/', function(req, res) {
        res.redirect('http://j.mp/uvmeals-at-kt');
    });
};
