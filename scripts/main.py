#!/usr/env/bin python
from bs4 import BeautifulSoup as Soup
from urllib2 import urlopen
from datetime import datetime

uv_url  = 'http://opendata.epa.gov.tw/ws/Data/UV/?format=xml'

def fetch_uv_result():
    result = {}

    # Parse uv data.
    f = urlopen(uv_url)
    soup = Soup(f.read(), 'xml')

    for data in soup.UV.find_all('Data'):
        try:
            name = data.SiteName.get_text()
            time = datetime.strptime(
                data.PublishTime.get_text(),
                '%Y-%m-%d %H:%M'
            )

            result[name] = {
                'time': time,
                'uv':   int(data.UVI.get_text()),
            }
        except:
            pass

    return result

if __name__ == '__main__':
    # Insert result into database.
    from argparse import ArgumentParser as ArgParser
    from db import Database

    parser = ArgParser(description='Fetch weather data and insert into database.')
    parser.add_argument('db_path', help='Path for the sqlite database.')

    args = parser.parse_args()

    db = Database(args.db_path)
    result = fetch_uv_result()

    for name, record in result.iteritems():
        time, uv = record['time'], record['uv']
        db.insert(name, uv, time)
