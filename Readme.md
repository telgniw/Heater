7 Days UV Light Meals
=====================

UV information is fetched from [cwb.gov.tw] for heater.

    # To fetch current weather data into database.
    python scripts/main.py data/uv.sqlite3

[cwb.gov.tw]: http://www.cwb.gov.tw/


Visualization API
-----------------

Generating magic circle.

    GET /api/draw/magic

JavaScript call to the page.

    // start magic circle
    start(date, place_l, place_r, duration_l, duration_r);

field       | format
----------- | -------------
date        | 'yyyy-MM-dd'
place       | '地點'
duration    | 0 (optional)

    // stop magic circle
    stop(position);

field       | format
----------- | -----------------
position    | POSITION.LEFT
            | POSITION.RIGHT


Data API
--------

Get location list.

    GET /api

Get uv list for a specific location and time.

    GET /api/地點/yyyy-MM-dd


From UV to Toast
----------------

UV Index    | Heating Time (seconds)
:---------- | -----------:
0 ~ 2       | 0
3 ~ 5       | 30
6 ~ 7       | 60
8 ~ 10      | 90
11+         | 120


Total Heating Time (seconds)    | Estimated Burnt
:------------------------------ | :--------------
0 ~ 250                         | No
251 ~ 500                       | Slight
500+                            | Significant


Library Used
------------

* [BeautifulSoup4]: for parsing html and xml data.
* [D3]: data-driven documents, a javascript visualization tool.
* [Flatstrap] and [Bootstrap Datepicker].

[BeautifulSoup4]: http://www.crummy.com/software/BeautifulSoup/
[D3]: http://d3js.org/
[Flatstrap]: http://flatstrap.org/
[Bootstrap Datepicker]: http://vitalets.github.io/bootstrap-datepicker/


License
-------

Copyright (c) 2013 Chao Hao Yang, Daniel Y.C. Kao, Ke-Ting Huang, [Yi Huang]

[Yi Huang]: http://github.com/telgniw
