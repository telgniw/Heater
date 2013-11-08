var POSITION = {
    LEFT: 0,
    RIGHT: 1,
};

var OPACITY = {
    ON: 1,
    PAUSE: 0.75,
    OFF: 0,
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

var SPEED = {
    TURN: 0.01,
    FADE: 0.03,
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
        center: 70,
        barDate: 135,
        barTime: 165,
        barUv: 240,
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

    var toastUrl = function(duration) {
        var base_url = '/img/toasts/';
        if(duration > 480)
            return base_url + '04.png';
        else if(duration > 360) 
            return base_url + '03.png';
        else if(duration > 240)
            return base_url + '02.png';
        else if(duration > 120)
            return base_url + '01.png';
        else
            return base_url + '00.png';
    };

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
            .attr('height', height);

        var box = svg.append('g');

        box.append('circle')
            .attr('cx', center.x)
            .attr('cy', center.y)
            .attr('r', radius.center)
            .style('fill', makeRgb(COLOR.DARK))
            .style('stroke', 'none');

        box.append('circle')
            .attr('cx', center.x)
            .attr('cy', center.y)
            .attr('r', radius.barTime - 10)
            .style('fill', 'none')
            .style('stroke', makeRgb(COLOR.LIGHT))
            .style('stroke-width', 25);

        var g = box.append('g')
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
        this._.box = box;
        this._.g = g;
    };
    that.clear = function() {
        this._.box
            .transition()
            .duration(500)
            .style('opacity', OPACITY.PAUSE);

        this._.svg
            .select('g.toast')
            .transition()
            .duration(1000)
            .ease('elastic')
            .attr('transform', 'translate(56, 56)');

        this._.g
            .select('g.uv')
            .transition()
            .duration(1000)
            .style('opacity', 0)
            .remove();
    };
    that.hide = function() {
        this._.box
            .transition()
            .duration(500)
            .style('opacity', OPACITY.OFF);
    };
    that.draw = function(today, place, duration) {
        this._.box
            .transition()
            .duration(500)
            .style('opacity', OPACITY.ON);

        this._.svg
            .select('g.toast')
            .remove();

        var g = this._.g
            .append('g')
            .attr('class', 'uv');

        if(duration != undefined) {
            var offset_p = place.length * 28 + 14;
            var offset = (400 - (offset_p + 144)) / 2;

            var toast = this._.svg
                .append('g')
                .attr('class', 'toast')
                .attr('transform', 'translate(56, 768)');

            toast.append('svg:image')
                .attr('xlink:href', toastUrl(duration))
                .attr('width', 400)
                .attr('height', 400);

            toast.append('text')
                .attr('x', offset)
                .attr('y', -24)
                .style('fill', makeRgb(COLOR.NORMAL))
                .style('font-family', '"Apple Gothic", "SimHei", monospace')
                .style('font-size', 28)
                .style('font-weight', 200)
                .text(place);

            toast.append('text')
                .attr('x', offset + offset_p)
                .attr('y', -24)
                .style('fill', makeRgb(COLOR.NORMAL))
                .style('font-family', '"Apple Gothic", "SimHei", monospace')
                .style('font-size', 24)
                .style('font-weight', 200)
                .text('的吐司烤好囉');
        }

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
        this.clear();
    };

    that.init(target);

    var updateAnimation = function() {
        if(!this._.animationOn) {
            return;
        }

        now = Date.now();
        this._.animationOffset += now - this._.animationStartTime;
        this._.animationOffset %= 108000;
        this._.animationStartTime = now;

        var deg = SPEED.TURN * this._.animationOffset;
        if(this._.position == POSITION.RIGHT) {
            deg = -deg;
        }

        this._.g
            .attr('transform', function() {
                return 'rotate(' + deg + ')';
            });

        this._.g.select('g.uv')
            .selectAll('path.uv')
            .style('opacity', function(datum, i) {
                var pi2 = 2 * Math.PI;
                var p = pi2 / 7;
                var d = p * (datum.group + datum.offset/datum.groupLength) + pi2 - (SPEED.FADE * deg % pi2);
                var k = d % Math.PI;
                var j = (k < p)? 1 : 0;
                return (1 - Math.sin(3.5 * k) * j) * 0.8 + 0.2;
            });
    };
    d3.timer(function() {
        updateAnimation.apply(that);
    });

    return that;
}
