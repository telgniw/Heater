var drawLineChart = function(data, field) {
    var width = 800, height = 320;
    var margin = { top: 10, right: 30, bottom: 30, left: 30 };
    var x = d3.time.scale()
        .range([0, width]);
    var y = d3.scale.linear()
        .range([height, 0]);
    var xAxis = d3.svg.axis()
        .scale(x)
        .orient('bottom');
    var yAxis = d3.svg.axis()
        .scale(y)
        .orient('left');
    var line = d3.svg.line()
        .x(function(d) { return x(d.time); })
        .y(function(d) { return y(d[field]); });

    var svg = d3.select('#container').select('svg');
    if(svg.empty()) {
        svg = d3.select('#container').append('svg')
            .attr('width', margin.left + width + margin.right)
            .attr('height', margin.top + height + margin.bottom)
            .append('g')
            .attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')');

        svg.append('g')
            .attr('class', 'x axis')
            .attr('transform', 'translate(0, ' + height + ')');
        svg.append('g')
            .attr('class', 'y axis');

        svg.append('path')
            .attr('class', 'line');
    }

    x.domain(d3.extent(data, function(d) { return d.time; }));
    svg.select('g.x.axis')
        .transition()
        .duration(1000)
        .call(xAxis);

    y.domain(d3.extent(data, function(d) { return d[field]; }));
    svg.select('g.y.axis')
        .transition()
        .duration(1000)
        .call(yAxis);

    svg.select('path.line')
        .datum(data)
        .transition()
        .duration(1000)
        .attr('d', line);
};

$(function() {
    var onLocationSelected = function() {
        var location = $(this).text();

        $('#nav-location-menu').children('a').children('.text').text(location);

        $.getJSON('api/' + location, function(data) {
            var $datePicker = $('#nav-datepicker')
                .show()
                .datepicker('update', data.last_date)
                .datepicker('setStartDate', data.first_date)
                .datepicker('setEndDate', data.last_date);

            updateVisualization();
        });
    };
    var updateVisualization = function() {
        var location = $('#nav-location-menu').children('a').children('.text').text()
        var date = $('#nav-datepicker').children('input').val();

        $.getJSON('api/' + location + '/' + date, function(data) {
            var parseDate = d3.time.format('%Y-%m-%d %H').parse;
            data.map(function(d) {
                d.time = parseDate(date + ' ' + d.hour);
                return d;
            });

            drawLineChart(data, 'uv');
        });
    };

    $('.menu-item > a').click(onLocationSelected);

    $('#nav-datepicker')
        .datepicker({
            autoclose: true,
            format: 'yyyy-mm-dd',
        })
        .on('changeDate', updateVisualization);
});
