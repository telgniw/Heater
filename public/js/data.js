var drawLineChart = function(parent, data, field) {
    var margin = { top: 10, right: 30, bottom: 30, left: 30 };
    var width = (parseInt(d3.select(parent).style('width')) - (margin.left + margin.right)) || 800,
        height = 320;
    var x = d3.time.scale()
        .range([0, width]);
    var y = d3.scale.linear()
        .domain([0, 14])
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

    var svg = d3.select(parent).select('svg');
    if(svg.empty()) {
        svg = d3.select(parent).append('svg')
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
    var $place = $('.location');
    var $datepicker = $('#date-picker');

    var updateVisualization = function() {
        var place = $place.text();
        var date = $('input', $datepicker).val();

        new api(place).getForDate(date, function(data) {
            drawLineChart('#chart-day', data, 'uv');
        });
        new api(place).getForWeek(date, function(data) {
            drawLineChart('#chart-week', data, 'uv');
        });
    };
    var onLocationSelected = function() {
        place = $(this).text();
        $place.text(place);

        $.getJSON('api/' + place, function(data) {
            $datepicker.show()
                .datepicker('update', data.last_date)
                .datepicker('setStartDate', data.first_date)
                .datepicker('setEndDate', data.last_date);

            updateVisualization();
        });
    };

    $('#navbar-data').addClass('active');

    $('.menu-item > a')
        .click(onLocationSelected)
        .first()
        .click();

    $datepicker
        .datepicker({
            format: 'yyyy-mm-dd',
            todayHighlight: true,
        })
        .on('changeDate', updateVisualization);

    $(window).resize(updateVisualization);
});
