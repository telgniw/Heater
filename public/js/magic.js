var POSITION = {
    LEFT: 0,
    RIGHT: 1,
};

var COLOR = {
    DARK: {
        r: 106,
        g: 25,
        b: 62,
    },
    NORMAL: {
        r: 145,
        g: 25,
        b: 84,
    },
    LIGHT: {
        r: 179,
        g: 81,
        b: 126,
    },
};

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
var makeRotate = function(d) {
    return 'rotate(' + (180 * d / Math.PI) + ')';
};
var makeTranslate = function(t) {
    return 'translate(' + t.x + ',' + t.y + ')';
};

var magicCircle = function(target, position) {
    var width = 512, height = 512;

    var center = {
        x: 0.5 * width,
        y: 0.5 * height,
    };
    var radius = {
        center: 80,
        barDate: 150,
        barTime: 180,
        barUv: 255,
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

    var that = {};
    that._ = {
        position: position || POSITION.LEFT,
    };

    that.init = function(target) {
        var svg = d3.select(target)
            .append('g')
            .attr('width', width)
            .attr('height', height)
            .append('g');

        svg.append('circle')
            .attr('cx', center.x)
            .attr('cy', center.y)
            .attr('r', radius.center)
            .style('fill', makeRgb(COLOR.DARK))
            .style('stroke', 'none');

        svg.append('circle')
            .attr('cx', center.x)
            .attr('cy', center.y)
            .attr('r', radius.barTime - 10)
            .style('fill', 'none')
            .style('stroke', makeRgb(COLOR.LIGHT))
            .style('stroke-width', 25);

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
                .style('stroke-width', 1.5);

            g.append('path')
                .attr('d', makeLine([
                    makePoint(radius.center + 2, st),
                    makePoint(radius.barTime - 2, st),
                ]))
                .style('fill', 'none')
                .style('stroke', makeRgb(COLOR.NORMAL))
                .style('stroke-width', 3.5);
        }

        var deg = 2 * Math.PI / barDate.length;
        if(this._.position == POSITION.RIGHT) {
            deg = -deg;
        }
        for(var i = 0; i < barDate.length; i++) {
            var st = deg * i,
                ed = deg * ((i + 3) % barDate.length);

            g.append('text')
                .attr('x', -16)
                .attr('y', -radius.barDate + 32)
                .attr('transform', makeRotate(st + 0.5 * deg))
                .style('fill', makeRgb(COLOR.NORMAL))
                .style('font-family', '"Apple Gothic", "SimHei", monospace')
                .style('font-size', 32)
                .style('font-weight', 200)
                .text(barDate[i].zh);

            g.append('text')
                .attr('x', -16)
                .attr('y', -radius.center - 12)
                .attr('transform', makeRotate(st + 0.5 * deg))
                .style('fill', makeRgb(COLOR.NORMAL))
                .style('font-family', '"Helvetica Neue", "Helvetica", "SimHei", monospace')
                .style('font-size', 16)
                .style('font-weight', 200)
                .text(barDate[i].en);

            g.append('text')
                .attr('x', -3)
                .attr('y', -radius.barTime + 10)
                .attr('transform', makeRotate(st + 0.1 * deg))
                .style('fill', 'white')
                .style('font-family', '"Helvetica Neue", "Helvetica", "SimHei", monospace')
                .style('font-size', 14)
                .style('font-weight', 100)
                .text('6')

            g.append('text')
                .attr('x', -8)
                .attr('y', -radius.barTime + 20)
                .attr('transform', makeRotate(st + 0.1 * deg))
                .style('fill', 'white')
                .style('font-family', '"Helvetica Neue", "Helvetica", "SimHei", monospace')
                .style('font-size', 10)
                .style('font-weight', 100)
                .text('AM')

            g.append('text')
                .attr('x', -9)
                .attr('y', -radius.barTime + 10)
                .attr('transform', makeRotate(st + 0.5 * deg))
                .style('fill', 'white')
                .style('font-family', '"Helvetica Neue", "Helvetica", "SimHei", monospace')
                .style('font-size', 14)
                .style('font-weight', 100)
                .text('12')

            g.append('text')
                .attr('x', -8)
                .attr('y', -radius.barTime + 20)
                .attr('transform', makeRotate(st + 0.5 * deg))
                .style('fill', 'white')
                .style('font-family', '"Helvetica Neue", "Helvetica", "SimHei", monospace')
                .style('font-size', 10)
                .style('font-weight', 100)
                .text('PM')

            g.append('text')
                .attr('x', -3)
                .attr('y', -radius.barTime + 10)
                .attr('transform', makeRotate(st + 0.9 * deg))
                .style('fill', 'white')
                .style('font-family', '"Helvetica Neue", "Helvetica", "SimHei", monospace')
                .style('font-size', 14)
                .style('font-weight', 100)
                .text('6')

            g.append('text')
                .attr('x', -8)
                .attr('y', -radius.barTime + 20)
                .attr('transform', makeRotate(st + 0.9 * deg))
                .style('fill', 'white')
                .style('font-family', '"Helvetica Neue", "Helvetica", "SimHei", monospace')
                .style('font-size', 10)
                .style('font-weight', 100)
                .text('PM')
        }
    };

    that.init(target);
    return that;
}
