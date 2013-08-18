Weather Heater
==============

Fetch weather information (uv) from [cwb.gov.tw] for heater.

    # Fetch current weather data into database.
    python scripts/main.py data/uv.sqlite3

[cwb.gov.tw]: http://www.cwb.gov.tw/

See [here](http://yi.csie.org/heater/vis/magic) for the magic circle visualization using [D3].

[![Snapshot](https://raw.github.com/telgniw/Heater/022d2473580a08e2c81619a47413a4cbcb5c1c7a/images/video-snapshot.png)](http://vimeo.com/72251188?autoplay=1)

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

Copyleft (ↄ) 2013 [Yi Huang]

[Yi Huang]: http://github.com/telgniw
