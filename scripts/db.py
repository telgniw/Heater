#!/usr/env/bin python
import sqlite3

class Database:
    def __init__(self, path):
        self.path = path
        self._execute_('''
            CREATE TABLE IF NOT EXISTS Data (
                id          INTEGER PRIMARY KEY,
                place       TEXT,
                uv          TINYINT,
                timestamp   TIMESTAMP DEFAULT CURRENT_TIME,
                UNIQUE(place, timestamp)
            )
        ''')

    def _execute_(self, sql, params=None):
        conn = sqlite3.connect(self.path)
        c = conn.cursor()
        try:
            c.execute(sql, params) if params else c.execute(sql)
        except:
            pass
        conn.commit()

    def insert(self, place, uv, time):
        self._execute_('''
            INSERT INTO Data (place, uv, timestamp)
            VALUES (?,?,?)
        ''', (place, uv, time))
