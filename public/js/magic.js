var magicCircle = function() {
    var width = 512, height = 512;

    var center = {
        x: 0.5 * width,
        y: 0.5 * height,
    };
    var radius = {
        center: 80,
        barDate: 150,
        barTime: 170,
        barUv: 250,
    };

    var color = {
        dark: {
            r: 106,
            g: 25,
            b: 62,
        },
        normal: {
            r: 145,
            g: 25,
            b: 84,
        },
    };

    var barDate = [
        { zh: '日', en: 'SUN' },
        { zh: '月', en: 'MON' },
        { zh: '水', en: 'TUE' },
        { zh: '火', en: 'WED' },
        { zh: '木', en: 'THU' },
        { zh: '金', en: 'FRI' },
        { zh: '土', en: 'SAT' },
    ];

    var makeLine = d3.svg.line()
        .x(function(d) { return d.x; })
        .y(function(d) { return d.y; })
        .interpolate('linear');
    var makePoint = function(r, d) {
        return {
            x: r * Math.cos(d - 0.5 * Math.PI),
            y: r * Math.sin(d - 0.5 * Math.PI),
        };
    };
    var makeRgb = function(c) {
        return 'rgb(' + c.r + ',' + c.g + ',' + c.b + ')';
    };
    var makeTranslate = function(t) {
        return 'translate(' + t.x + ',' + t.y + ')';
    };

    var that = {}
    that.init = function(target) {
        var svg = d3.select(target)
            .append('svg')
            .attr('width', width)
            .attr('height', height)
            .append('g');

        svg.append('circle')
            .attr('cx', center.x)
            .attr('cy', center.y)
            .attr('r', radius.center)
            .style('fill', makeRgb(color.dark))
            .style('stroke', 'none');

        var g = svg.append('g')
            .attr('transform', makeTranslate(center))
            .append('g');

        var deg = 2 * Math.PI / barDate.length;
        for(var i = 0; i < barDate.length; i++) {
            var st = deg * i,
                ed = deg * ((i + 3) % barDate.length);

            g.append('path')
                .attr('d', makeLine([
                    makePoint(radius.center, st),
                    makePoint(radius.center, ed),
                ]))
                .style('fill', 'none')
                .style('stroke', 'white')
                .style('stroke-width', '1.5px');

            g.append('path')
                .attr('d', makeLine([
                    makePoint(radius.center + 2, st),
                    makePoint(radius.barTime - 2, st),
                ]))
                .style('fill', 'none')
                .style('stroke', makeRgb(color.normal))
                .style('stroke-width', '3px');
        }
    };

    return that;
}
