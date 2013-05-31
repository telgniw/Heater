#!/usr/env/bin python3
import sqlite3

class Database:
    def __init__(self, path):
        self.path = path
        self._execute_('''
            CREATE TABLE IF NOT EXISTS Data (
                id          INTEGER PRIMARY KEY,
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
