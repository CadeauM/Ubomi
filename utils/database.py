import sqlite3
import os
from datetime import datetime

# Get the absolute path for the database file
db_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "users.db")

def init_db():
    """Initializes the database and creates tables if they don't exist."""
    conn = sqlite3.connect(db_path)
    c = conn.cursor()
    c.execute(
        '''CREATE TABLE IF NOT EXISTS users
           (username TEXT PRIMARY KEY, password TEXT)'''
    )
    c.execute(
        '''CREATE TABLE IF NOT EXISTS health_data
           (id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
            mood TEXT,
            energy INTEGER,
            symptoms TEXT,
            FOREIGN KEY (username) REFERENCES users (username))'''
    )
    conn.commit()
    conn.close()

def add_user(username, password):
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    try:
        cursor.execute("INSERT INTO users (username, password) VALUES (?, ?)", (username, password))
        conn.commit()
        return True
    except sqlite3.IntegrityError:
        return False
    finally:
        conn.close()

def check_user(username, password):
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM users WHERE username = ? AND password = ?", (username, password))
    user = cursor.fetchone()
    conn.close()
    return user is not None

def add_health_data(username, mood, energy, symptoms):
    conn = sqlite3.connect(db_path)
    try:
        c = conn.cursor()
        c.execute(
            "INSERT INTO health_data (username, mood, energy, symptoms) VALUES (?, ?, ?, ?)",
            (username, mood, energy, symptoms)
        )
        conn.commit()
        return True
    except Exception as e:
        print(f"DATABASE ERROR in add_health_data: {e}")
        return False
    finally:
        conn.close()

def get_health_data(username):
    """Retrieves all health data for a given user, ordered by timestamp."""
    conn = sqlite3.connect(db_path)
    c = conn.cursor()
    c.execute(
        "SELECT timestamp, mood, energy, symptoms FROM health_data WHERE username = ? ORDER BY timestamp DESC",
        (username,)
    )
    data = c.fetchall()
    conn.close()
    # Convert list of tuples to list of dictionaries
    return [{"timestamp": row[0], "mood": row[1], "energy": row[2], "symptoms": row[3]} for row in data]

def get_last_mood(username):
    """Retrieves the previous mood for a given user, skipping the most recent one."""
    conn = sqlite3.connect(db_path)
    c = conn.cursor()
    # The OFFSET 1 skips the most recent entry, which is the one just submitted,
    # allowing for a comparison with the actual previous mood.
    c.execute(
        "SELECT mood FROM health_data WHERE username = ? ORDER BY timestamp DESC LIMIT 1 OFFSET 1",
        (username,)
    )
    result = c.fetchone()
    conn.close()
    return result[0] if result else None