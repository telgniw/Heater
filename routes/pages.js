var uvQuery = require('../libs/uvQuery');

module.exports = function(app) {
    // Index: home page.
    app.get('/', function(req, res) {
        res.redirect('http://digitalartfestival.tw/daf13/kt13.php');
    });
};
