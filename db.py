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
                hum         TINYINT,
                temp        FLOAT,
                timestamp   TIMESTAMP DEFAULT CURRENT_TIME
            )
        ''')

    def _execute_(self, sql, params=None):
        conn = sqlite3.connect(self.path)
        c = conn.cursor()
        c.execute(sql, params) if params else c.execute(sql)
        conn.commit()

    def insert(self, place, uv, hum, temp):
        self._execute_('''
            INSERT INTO Data (place, uv, hum, temp)
            VALUES (?,?,?,?)
        ''', (place, uv, hum, temp))
