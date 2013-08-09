$(function() {
    var width = 700, height = 700;
    var margin = { top: 25, right: 50, bottom: 25, left: 50 };

    var center = {
        x: width / 2,
        y: height / 2,
    };
    var radius = {
        star: 110,
        innerUv: 225,
        outerUv: 350,
        shift: 25,
        place: 75,
    };

    var svg = d3.select('#magic')
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

    var r = radius.place - radius.shift;
    var dr = (radius.place * (Math.sqrt(2) - 1) + r) * Math.cos(0.25 * Math.PI);
    svg.append('circle')
        .attr('class', 'line place')
        .attr('cx', radius.place)
        .attr('cy', height - radius.place)
        .attr('r', radius.place);
    svg.append('circle')
        .attr('class', 'line place')
        .attr('cx', dr)
        .attr('cy', height - dr)
        .attr('r', r);
    svg.append('text')
        .attr('x', -18 * place.length)
        .attr('y', 12)
        .attr('class', 'label place')
        .attr('transform', 'translate(' + dr + ',' + (height - dr) + ')')
        .text(place);

    var g = svg.append('g')
        .attr('transform', 'translate(' + center.x + ',' + center.y + ')');

    var n = 7, wuxing = ['日', '月', '水', '火', '木', '金', '土'];
    var d = 2 * Math.PI / 7;
    var line = d3.svg.line()
        .x(function(d) { return d.x })
        .y(function(d) { return d.y })
        .interpolate('linear');
    var cos = function(r, d) { return r * Math.cos(d - 0.5 * Math.PI); };
    var sin = function(r, d) { return r * Math.sin(d - 0.5 * Math.PI); };
    var point = function(r, d) { return { x: cos(r, d), y : sin(r, d) }; };

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
            .attr('transform', 'rotate(' + (360 / n * ((i + 4) % 7) - 180) + ')')
            .text(wuxing[i]);
    }
    
    /*
    new api(place).getForWeek(today, function(data) {
    });
    */
});
