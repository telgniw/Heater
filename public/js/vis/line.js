$(function() {
    var onLocationSelected = function($place, $chart) {
    };

    $('#navbar-vis').addClass('active');

    $('.row-fluid > .span6').each(function() {
        var $chart = $('.chart', $(this));
        $('.menu-item > a', $(this)).click(function() {
            onLocationSelected($(this), $chart);
        });
    });

    $(window).resize(updateVisualization);
});
