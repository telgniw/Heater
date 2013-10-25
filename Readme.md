7 Days UV Light Meals
=====================

UV information is fetched from [cwb.gov.tw] for heater.

    # To fetch current weather data into database.
    python scripts/main.py data/uv.sqlite3

[cwb.gov.tw]: http://www.cwb.gov.tw/

See [here](http://uvmeals.csie.org/vis) for the magic circle visualization using [D3].

[![Snapshot](http://image-link.png)](http://vimeo.com/vimeo-id?autoplay=1)


API
---

Not documented.


From UV to Toast
----------------

UV Index    | Heating Time (seconds)
:---------: | -----------:
0 ~ 2       | 0
3 ~ 5       | 30
6 ~ 7       | 60
8 ~ 10      | 90
11+         | 120


Total Heating Time (seconds)    | Burnt
:-----------------------------: | :---:
0 ~ 250                         | No
251 ~ 500                       | Slightly
500+                            | Totally


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
