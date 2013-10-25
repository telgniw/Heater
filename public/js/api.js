var api = function(place) {
    var that = {
        place: place
    };
    var parseDate = d3.time.format('%Y-%m-%d %H').parse;

    that.getForDate = function(date, callback) {
        $.getJSON('/api/' + that.place + '/' + date, function(data) {
            callback(data.map(function(d) {
                d.time = parseDate(date + ' ' + d.hour);
                return d;
            }))
        });
    };

    that.getForWeek = function(date, callback) {
        $.getJSON('/api/7/' + that.place + '/' + date, function(data) {
            callback(data.map(function(d) {
                d.time = parseDate(d.timestamp);
                return d;
            }))
        });
    };
    
    return that;
};
