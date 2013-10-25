$(function() {
    var $place = $('.location');
    var $datepicker = $('#date-picker');

    d3.select('#magic')
        .append('svg')
        .attr('width', 512)
        .attr('height', 512)
        .append('g')
        .attr('class', 'magic left');

    var magic = magicCircle('.magic', POSITION.LEFT);

    var updateVisualization = function() {
        var place = $place.text();
        var date = $('input', $datepicker).val();

        magic.stopAnimation();
        magic.draw(date, place);
        magic.startAnimation();
    };
    var onLocationSelected = function() {
        var place = $(this).text();
        $place.text(place);

        $.getJSON('api/' + place, function(data) {
            $datepicker.show()
                .datepicker('update', data.last_date)
                .datepicker('setStartDate', data.first_date)
                .datepicker('setEndDate', data.last_date);

            updateVisualization();
        });
    };

    $('#navbar-vis').addClass('active');

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
});
