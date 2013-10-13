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
        animationOffset: 0,
        animationStartTime: 0,
        position: position,
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
        
        this._.svg = svg;
        this._.g = g;
    };
    that.clear = function() {
        this._.g
            .select('g.uv')
            .transition()
            .duration(1000)
            .style('opacity', 0)
            .remove();

        this.stopAnimation();
    };
    that.draw = function(today, place) {
        this._.g.select('g.uv').remove();

        var g = this._.g
            .append('g')
            .attr('class', 'uv');

        var len = function(p1, p2) {
            return Math.sqrt((p2.x - p1.x) * (p2.x - p1.x) + (p2.y - p1.y) * (p2.y - p1.y));
        };
        var vector = function(p1, p2) {
            var l = len(p1, p2);
            return function(p, k) {
                return {
                    x: p.x + k * (p2.x - p1.x) / l,
                    y: p.y + k * (p2.y - p1.y) / l,
                };
            };
        };
        var pVector = function(p1, p2) {
            var l = len(p1, p2);
            return function(p, k) {
                return {
                    x: p.x + k * (p1.y - p2.y) / l,
                    y: p.y + k * (p2.x - p1.x) / l,
                };
            };
        };
        var bar = function(datum) {
            var p = 2 * Math.PI / 7;
            var d = p * (datum.group + datum.offset/datum.groupLength);
            var h = radius.barUv - radius.barTime;
            var uvRatio = datum.uv / 15;
            var st = makePoint(radius.barTime + 2, d),
                ed = makePoint(radius.barTime + h * uvRatio, d);
            var dir = vector(st, ed), base = pVector(st, ed);
            var w = 1.5 + Math.pow(Math.E * 1.2, uvRatio * 2.3) * 0.75;
            return makeLine([
                base(st, w), base(st, -w),
                dir(base(ed, -w), -2 * w), ed, dir(base(ed, w), -2 * w)
            ]);
        };
        new api(place).getForWeek(today, function(data) {
            var grouped = {};
            for(var i in data) {
                var datum = data[i];
                var day = datum.time.getDay();
                if(grouped[day] == undefined)
                    grouped[day] = [];
                grouped[day].push(datum);
            }

            var sorted = [];
            for(var k = 0; k < 7; k++) {
                var sum = 0;
                for(var i in grouped[k]) {
                    var datum = grouped[k][i];
                    sum += datum.uv + 1;
                }

                var current = 0;
                for(var i in grouped[k]) {
                    var datum = grouped[k][i];
                    current += datum.uv + 1;

                    datum.group = k;
                    datum.offset = current;
                    datum.groupLength = sum;
                    datum.groupSize = grouped[k].length;

                    if(datum.groupLength <= 0 || datum.uv <= 0)
                        continue;

                    sorted.push(datum);
                }
            }

            g.selectAll('path')
                .data(sorted)
                .enter()
                .append('path')
                .attr('class', 'uv')
                .attr('d', bar)
                .style('fill', makeRgb(COLOR.LIGHT))
                .style('stroke', 'none')
                .style('opacity', 0)
                .transition()
                .duration(1000)
                .style('opacity', 1);
        });
    };
    that.isAnimated = function() {
        return this._.animationOn;
    };
    that.startAnimation = function() {
        this._.animationOn = true;
        this._.animationStartTime = Date.now();
    };
    that.stopAnimation = function() {
        this._.animationOn = false;
    };

    that.init(target);

    var updateAnimation = function() {
        if(!this._.animationOn) {
            return;
        }

        now = Date.now();
        this._.animationOffset += now - this._.animationStartTime;
        this._.animationOffset %= 36000;
        this._.animationStartTime = now;

        var deg = 0.01 * this._.animationOffset;
        if(this._.position == POSITION.RIGHT) {
            deg = -deg;
        }

        this._.g
            .attr('transform', function() {
                return 'rotate(' + deg + ')';
            });
    };
    d3.timer(function() {
        updateAnimation.apply(that);
    });

    return that;
}
