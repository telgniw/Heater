var preprocess = function(date, data) {
    var parseDate = d3.time.format('%Y-%m-%d %H').parse;
    return data.map(function(d) {
        d.time = parseDate(date + ' ' + d.hour);
        return d;
    });
};

var api = function(target, place) {
    var that = {};

    that.data = [];
    that.target = target;
    that.place = place;
    
    that.start = function(date, n) {
        if(n == 0) {
            drawLineChart(target, that.data, 'uv');
            console.log(that.data);
        }
        else {
            $.getJSON('api/' + that.place + '/' + date, function(data) {
                that.data = [].concat(preprocess(date, data), that.data);

                var format = d3.time.format('%Y-%m-%d');
                var currentDate = new Date(format.parse(date));
                currentDate.setDate(currentDate.getDate() - 1);

                that.start(format(currentDate), n - 1);
            });
        }
    };

    return that;
};
