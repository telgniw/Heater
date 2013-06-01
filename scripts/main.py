#!/usr/env/bin python
from bs4 import BeautifulSoup as Soup
from urllib2 import urlopen
from datetime import datetime

uv_url  = 'http://cdx.epa.gov.tw/CDX/OpenData/UV.xml'
cwb_url = 'http://www.cwb.gov.tw/V7/observe/real/ALL.htm'

result = {}

# Parse uv data.
f = urlopen(uv_url)
soup = Soup(f.read(), 'xml')

for data in soup.UvData.find_all('Data'):
    try:
        name = data.SiteName.get_text()
        time = datetime.strptime(
            data.DataCreationDate.get_text(),
            '%Y-%m-%d %H:%M'
        )

        if name not in result:
            result[name] = {}

        result[name][time] = {
            'uv': int(data.Uvi.get_text())
        }
    except:
        pass

# Parse humidity and temperature data.
f = urlopen(cwb_url)
soup = Soup(f.read())

for tr in soup.table.find_all('tr')[1:]:
    try:
        ths = tr.find_all('th')

        name = ths[0].get_text()
        time = datetime.strptime(
            ths[1].get_text(),
            '%m/%d %H:%M'
        ).replace(year=datetime.now().year)

        if name not in result:
            result[name] = {}
        if time not in result[name]:
            result[name][time] = {}

        tds = tr.find_all('td')

        try:
            result[name][time]['hum']  = int(tds[7].get_text())
        except ValueError:
            pass

        try:
            result[name][time]['temp'] = float(tds[0].get_text())
        except ValueError:
            pass
    except:
        pass

# Insert result into database.
from argparse import ArgumentParser as ArgParser
from db import Database

parser = ArgParser(description='Fetch weather data and insert into database.')
parser.add_argument('db_path', help='Path for the sqlite database.')

args = parser.parse_args()

db = Database(args.db_path)

for name, records in result.iteritems():
    for time, record in records.iteritems():
        uv = record['uv'] if 'uv' in record else None
        hum = record['hum'] if 'hum' in record else None
        temp = record['temp'] if 'temp' in record else None

        db.insert(name, uv, hum, temp, time)
