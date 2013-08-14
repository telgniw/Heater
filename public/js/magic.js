var magicCircle = function(scale) {
    scale = scale || 1;

    var width = 700 * scale, height = 700 * scale;
    var margin = { top: 25, right: 50, bottom: 25, left: 50 };

    var center = {
        x: width / 2,
        y: height / 2,
    };
    var radius = {
        star: 110 * scale,
        innerUv: 225 * scale,
        outerUv: 350 * scale,
        shift: 25 * scale,
        place: 75 * scale,
    };

    var wuxing = ['日', '月', '水', '火', '木', '金', '土'];
    var line = d3.svg.line()
        .x(function(d) { return d.x })
        .y(function(d) { return d.y })
        .interpolate('linear');
    var cos = function(r, d) { return r * Math.cos(d - 0.5 * Math.PI); };
    var sin = function(r, d) { return r * Math.sin(d - 0.5 * Math.PI); };
    var point = function(r, d) { return { x: cos(r, d), y : sin(r, d) }; };

    var that = {};
    that.isAnimated = false;
    that.init = function(target) {
        var svg = d3.select(target)
            .append('svg')
            .attr('width', margin.left + width + margin.right)
            .attr('height', margin.top + height + margin.bottom)
            .append('g')
            .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
        
        svg.append('circle')
            .attr('class', 'line star')
            .attr('cx', center.x)
            .attr('cy', center.y)
            .attr('r', radius.star);
        svg.append('circle')
            .attr('class', 'line')
            .attr('cx', center.x)
            .attr('cy', center.y)
            .attr('r', radius.innerUv);
        svg.append('circle')
            .attr('class', 'line')
            .attr('cx', center.x)
            .attr('cy', center.y)
            .attr('r', radius.outerUv - radius.shift);
        svg.append('circle')
            .attr('class', 'line')
            .attr('cx', center.x)
            .attr('cy', center.y)
            .attr('r', radius.outerUv);

        var g = svg.append('g')
            .attr('transform', 'translate(' + center.x + ',' + center.y + ')')
            .append('g');

        var d = 2 * Math.PI / 7;
        for(var i = 0; i < 7; i++) {
            var ds = d * i, de = d * ((i + 1) % 7), dn = d * ((i + 3) % 7);
            g.append('path')
                .attr('class', 'line star')
                .attr('d', line([
                    point(radius.star, ds), point(radius.star, de)
                ]));
            g.append('path')
                .attr('class', 'line star')
                .attr('d', line([
                    point(radius.star, ds), point(radius.star, dn)
                ]));
            g.append('path')
                .attr('class', 'line star')
                .attr('d', line([
                    point(radius.star, ds), point(radius.innerUv - radius.shift, ds)
                ]));
            g.append('text')
                .attr('class', 'label star')
                .attr('x', -18)
                .attr('y', -(radius.star + radius.shift))
                .attr('transform', 'rotate(' + (360 / 7 * ((i + 4) % 7) - 180) + ')')
                .text(wuxing[i]);
        }

        that.svg = svg;
        that.g = g;

        that.drawLabel('請選擇地點');
    };
    that.clear = function() {
        var g = that.g;
        g.select('g.uv').remove();

        that.drawLabel('');
        that.stopAnimation();
    };
    that.draw = function(place, today, direction) {
        that.clear();

        var g = that.g;
        var gUv = g.append('g')
            .attr('class', 'uv');

        var isCounter = (direction == 'counter');
        that.drawLabel(place, isCounter);

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
            var h = radius.outerUv - radius.shift - radius.innerUv;
            var uvRatio = datum.uv / 16;
            var st = point(radius.innerUv, d),
                ed = point(radius.innerUv + h * uvRatio, d);
            var dir = vector(st, ed), base = pVector(st, ed);
            var w = 1.2 + Math.pow(Math.E * 1.2, uvRatio * 2.5) * 0.75;
            return line([
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

            gUv.selectAll('path')
                .data(sorted)
                .enter()
                .append('path')
                .attr('class', 'line uv')
                .attr('d', bar);
        });

        var speed = (isCounter? -1 : 1) * 0.005;
        d3.timer(function() {
            if(!that.isAnimated)
                return;

            var elapsed = Date.now() - that.animationStartTime;
            var degree = speed * elapsed;
            g.attr('transform', function() {
                return 'rotate(' + degree + ')';
            });
            gUv.selectAll('path')
                .style('opacity', function(datum, i) {
                    var pi2 = 2 * Math.PI;
                    var p = pi2 / 7;
                    var d = p * (datum.group + datum.offset/datum.groupLength) + pi2 - (0.2 * degree % pi2);
                    var k = d % Math.PI;
                    var j = (k < p)? 1 : 0;
                    return (1 - Math.sin(3.5 * k) * j) * 0.8 + 0.2;
                });
        });
    };
    that.drawLabel = function(text, isCounter) {
        var r = radius.place - radius.shift;
        var dr = (radius.place * (Math.sqrt(2) - 1) + r) * Math.cos(0.25 * Math.PI);

        var svg = that.svg;
        var label = svg.select('g.label');
        if(label.empty()) {
            label = svg.append('g')
                .attr('class', 'label');
            label.append('circle')
                .attr('class', 'line place outer')
                .attr('cy', height - radius.place)
                .attr('r', radius.place);
            label.append('circle')
                .attr('class', 'line place inner')
                .attr('cy', height - dr)
                .attr('r', r);
            label.append('text')
                .attr('class', 'label place');
        }

        label.select('circle.outer')
            .attr('cx', isCounter? width - radius.place : radius.place);
        label.select('circle.inner')
            .attr('cx', isCounter? width - dr : dr);

        var textLabel = label.select('text')
            .attr('transform', 'translate(' + (isCounter? width- dr : dr) + ',' + (height - dr) + ')');
        textLabel.selectAll('tspan').remove();

        var nLines = Math.ceil(text.length / 3);
        for(var i = 0; i < text.length; i += 3) {
            var line = text.slice(i, i + 3);
            textLabel.append('tspan')
                .attr('x', -0.5 * line.length + 'em')
                .attr('y', ((i / 3) - 0.5 * (nLines - 2)) + 'em')
                .text(line);
        }
    };
    that.startAnimation = function() {
        that.isAnimated = true;
        that.animationStartTime = Date.now();
    };
    that.stopAnimation = function() {
        that.isAnimated = false;
    };

    return that;
};
