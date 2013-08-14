$(function() {
    var $datepicker = $('#date-picker');
    $('#navbar-vis').addClass('active');

    var magics = [];

    $('.menu-item').click(function() {
        var place = $(this).text();
        var today = $('input', $datepicker).val();
        var root = $(this).parents('div.btn-group');
        for(var i = 0; i < 2; i++) {
            if(root.hasClass('c' + i)) {
                var dir = (i % 2)? 'counter' : 'clockwise';
                magics[i].draw(place, today, dir);
                magics[i].startAnimation();
            }
        }
    });

    $datepicker
        .datepicker({
            autoclose: true,
            format: 'yyyy-mm-dd',
            todayHighlight: true,
        })
        .datepicker('update', d3.time.format('%Y-%m-%d')(new Date()))
        .on('changeDate', function() {
            for(var i = 0; i < 2; i++) {
                magics[i].clear();
            }
        });

    for(var i = 0; i < 2; i++) {
        var magic = magicCircle(0.68);
        magic.init('.magic.c' + i);
        magics.push(magic);

        $('.c' + i + ' .menu-item').first().click();
    }
});
