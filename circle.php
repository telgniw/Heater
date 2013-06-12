<?php

$COL_PLACE = 'place';

if(array_key_exists($COL_PLACE, $_GET)) {
    $place = $_GET[$COL_PLACE];
}

?>
<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8">
        <title>Magic Circle</title>
        <link rel="stylesheet" type="text/css" href="circleStyle.css">
        <script type="text/javascript" src="http://d3js.org/d3.v3.min.js"></script>
    </head>
    <body>
        <div id="container"></div>
        <script type="text/javascript">
        (function() {
            var width = 640, height = 640, scaledHeight = 200;
            var margin = { top: 20, right: 20, bottom: 20, left: 20 };

            var centerX = width / 2, centerY = height / 2, innerCircleRadius = 60;
            var yRanges = [[0, scaledHeight], [scaledHeight, 0], [0, scaledHeight]];
            var fields = ['uv', 'hum', 'temp'];

            // Initialize x/y axes.
            var x = d3.time.scale()
                .range([0, width]);
            var y = yRanges.map(function(range) {
                return d3.scale.linear()
                    .range(range);
            });

            var svg = d3.select('div#container')
                .append('svg')
                .attr('width', margin.left + width + margin.right)
                .attr('height', margin.top + height + margin.bottom);

            var line = fields.map(function(field, i) {
                return d3.svg.line()
                    .x(function(d) {
                        return (y[i](d[field]) + innerCircleRadius) *
                            Math.cos(((x(d.time) - x.range()[0]) / (x.range()[1] - x.range()[0]) - 0.25) * Math.PI * 2);
                    })
                    .y(function(d) {
                        return (y[i](d[field]) + innerCircleRadius) *
                            Math.sin(((x(d.time) - x.range()[0]) / (x.range()[1] - x.range()[0]) - 0.25) * Math.PI * 2);
                    });
            });

            var g = svg.append('g');
            fields.forEach(function(field, i) {
                g.append('path')
                    .attr('class', 'line ' + field);
            });

            // Generate start date line.
            var linearLine = d3.svg.line()
                .x(function(d) { return d.x; })
                .y(function(d) { return d.y; })
                .interpolate('linear');

            g.append('path')
                .attr('class', 'line date-line')
                .attr('d', linearLine([
                    { x: 0, y: - innerCircleRadius - scaledHeight },
                    { x: 0, y: - innerCircleRadius }
                ]));

            // Generate inner line.
            svg.append('circle')
                .attr('class', 'line inner')
                .attr('cx', centerX)
                .attr('cy', centerY)
                .attr('r', innerCircleRadius);

            // Generate outer line.
            svg.append('circle')
                .attr('class', 'line outer')
                .attr('cx', centerX)
                .attr('cy', centerY)
                .attr('r', innerCircleRadius + scaledHeight);

            var parseDate = d3.time.format('%Y-%m-%d %H').parse;

            d3.json('api.php?place=<?= $place ?>', function(error, data) {
                var oneWeekBefore = new Date(new Date().setDate(new Date().getDate() - 7));

                // Set invalid data as zero.
                data = data
                    .map(function(d) {
                        d.time = parseDate(d.time_by_hour);
                        d.uv = d.uv? d.uv : 0;
                        d.hum = d.hum? d.hum : 0;
                        d.temp = d.temp? d.temp : 0;
                        return d;
                    })
                    .filter(function(d) {
                        return d.time.getTime() > oneWeekBefore.getTime(); 
                    });

                // Update x/y data.
                x.domain(d3.extent(data, function(d) { return d.time; }));

                fields.forEach(function(field, i) {
                    y[i].domain(d3.extent(data, function(d) { return d[field]; }));
                    g.select('path.line.' + field)
                        .datum(data)
                        .transition()
                        .duration(1000)
                        .attr('d', line[i]);
                });


                // Set timer for rotation.
                var centerRadius = Math.sqrt(centerX * centerX + centerY * centerY);
                var start = Date.now();

                d3.timer(function() {
                    var elapsed = Date.now() - start;
                    var degree = Math.floor(0.02 * elapsed);
                    var rotate = function(d) {
                        var dx = centerX - centerRadius * Math.cos(degree + Math.PI * 0.25),
                            dy = centerY - centerRadius * Math.sin(degree + Math.PI * 0.25);
                        return 'rotate(' + degree + ')';
                    };

                    g
                        .attr('transform', 'translate(' + centerX + ',' + centerY + ')')
                        .selectAll('path')
                        .attr('transform', rotate);
                });
            });
        })();
        </script>
    </body>
</html>
