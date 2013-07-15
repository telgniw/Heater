$(function() {
    var menu = function(text, caret) {
        var $title = $('<a></a>')
            .addClass('dropdown-toggle')
            .attr('data-toggle', 'dropdown')
            .attr('href', '#')
            .text(text);

        caret = caret != undefined? caret : true;
        if(caret) {
            $title.append(
                $('<b></b>').addClass('caret')
            );
        }

        return $('<li></li>').append($title);
    };
    var menuBody = function() {
        return $('<ul></ul>').addClass('dropdown-menu');
    };
    var menuSplit = function() {
        return $('<li></li>').addClass('divider');
    };
    var datePicker = function() {
        var $input = $('<div></div>')
            .addClass('input-append date')
            .append(
                $('<input>')
                    .addClass('input-small')
                    .attr('type', 'text')
            )
            .append(
                $('<span></span>')
                    .addClass('add-on')
                    .append(
                        $('<i></i>')
                            .addClass('icon-th')
                    )
            )
            .css('margin-bottom', 0);

        return $input;
    };

    var mainLocations = [
        '基隆', '臺北', '桃園', '新竹', '苗栗',
        '臺中', '彰化', '南投', '嘉義', '臺南',
        '高雄', '屏東', '臺東', '花蓮', '宜蘭',
    ];
    var onLocationSelected = function() {
        var datum = $(this).data('data');

        var $title = $('#menu-location').children('a');
        var $caret = $title.children('b');

        $title
            .text(datum.location + ' ')
            .append($caret);

        var $datePicker = $('nav').find('.date');

        if($datePicker.size() == 0) {
            $datePicker = datePicker().datepicker({
                'autoclose': true,
                'format': 'yyyy-mm-dd',
            });

            $('input', $datePicker).change(updateVisualization);

            $('nav .nav').last()
                .after(
                    $('<form></form>')
                        .addClass('navbar-form')
                        .append($datePicker)
                );
        }

        $datePicker
            .datepicker('update', datum.last_date)
            .datepicker('setStartDate', datum.first_date)
            .datepicker('setEndDate', datum.last_date);

        updateVisualization();
    };
    var updateVisualization = function() {
        var location = $.trim(
            $('#menu-location').children('a').text()
        );
        var date = $('nav').find('.date').children('input').val();

        $.getJSON('api/' + location + '/' + date, function(data) {
            // TODO
        });
    };

    var $menu = menu('Location ')
        .attr('id', 'menu-location');
    $('nav .nav').first()
        .after(
            $('<ul></ul>')
                .addClass('nav')
                .append(
                    $('<li></li>')
                        .addClass('divider-vertical')
                )
                .append($menu)
        );

    $.getJSON('api', function(data) {
        var $options = menuBody();
        var $more = menuBody();
        $options
            .append(
                menu('More Options', false)
                    .addClass('dropdown-submenu')
                    .append($more)
            )
            .append(menuSplit());

        for(var i in data) {
            var $target = $options;
            if(mainLocations.indexOf(data[i].location) == -1) {
                $target = $more;
            }

            $target.append(
                $('<li></li>').append(
                    $('<a></a>')
                        .attr('href', '#')
                        .click(onLocationSelected)
                        .data('data', data[i])
                        .text(data[i].location)
                )
            );
        }

        $menu.append($options);
    });
});
