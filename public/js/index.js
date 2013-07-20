var drawLineChart = function(data) {
};

$(function() {
    var onLocationSelected = function() {
        var location = $(this).text();

        $('#nav-location-menu').children('a').children('.text').text(location);

        $.getJSON('api/' + location, function(data) {
            var $datePicker = $('#nav-datepicker')
                .show()
                .datepicker('update', data.last_date)
                .datepicker('setStartDate', data.first_date)
                .datepicker('setEndDate', data.last_date);

            updateVisualization();
        });
    };
    var updateVisualization = function() {
        var location = $('#nav-location-menu').children('a').children('.text').text()
        var date = $('#nav-datepicker').children('input').val();

        $.getJSON('api/' + location + '/' + date, function(data) {
            drawLineChart(data);
        });
    };

    $('.menu-item > a').click(onLocationSelected);

    $('#nav-datepicker')
        .datepicker({
            autoclose: true,
            format: 'yyyy-mm-dd',
        })
        .on('changeDate', updateVisualization);
});
