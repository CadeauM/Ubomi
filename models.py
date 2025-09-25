from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from datetime import datetime

db = SQLAlchemy()
bcrypt = Bcrypt()

class User(db.Model):
    """User model for authentication."""
    
    __tablename__ = 'users'

    username = db.Column(db.String(80), primary_key=True, nullable=False)
    # The password column will store a HASH, not the actual password
    password_hash = db.Column(db.String(128), nullable=False)

    @property
    def password(self):
        raise AttributeError('password is not a readable attribute')

    @password.setter
    def password(self, password):
        """Hashes the password and stores it."""
        self.password_hash = bcrypt.generate_password_hash(password).decode('utf-8')

    def check_password(self, password):
        """Checks if a provided password matches the stored hash."""
        return bcrypt.check_password_hash(self.password_hash, password)

class HealthData(db.Model):
    """HealthData model for storing user check-ins."""

    __tablename__ = 'health_data'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    username = db.Column(db.String(80), db.ForeignKey('users.username'), nullable=False)
    timestamp = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    mood = db.Column(db.String(50), nullable=False)
    energy = db.Column(db.Integer, nullable=False)
    symptoms = db.Column(db.Text, nullable=True)

    user = db.relationship('User', backref='health_data')