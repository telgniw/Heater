Weather Heater
==============

Fetch weather information (uv, temperature, and humidity) from [cwb.gov.tw] for dinner heater.

    # Fetch current weather data into database.
    python scripts/main.py data/weather.sqlite3

[cwb.gov.tw]: http://www.cwb.gov.tw/

See `index.html` for a simple visualization of the fetched data using [D3].

[![Snapshot](http://github.com/telgniw/Heater/raw/master/images/video-snapshot.png)](http://vimeo.com/67564720?autoplay=1)

[![Circle Snapshot](http://github.com/telgniw/Heater/raw/master/images/video-snapshot-circle.png)](https://vimeo.com/68265739?autoplay=1)

Library Used
------------

* [BeautifulSoup4]: for parsing html and xml data.
* [D3]: data-driven documents, a javascript visualization tool.

[BeautifulSoup4]: http://www.crummy.com/software/BeautifulSoup/
[D3]: http://d3js.org/

License
-------

Copyleft (ↄ) 2013 [Yi Huang]

[Yi Huang]: http://github.com/telgniw
