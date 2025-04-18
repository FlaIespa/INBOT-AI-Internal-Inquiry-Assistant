from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from datetime import datetime  

# Initialize SQLAlchemy and Bcrypt
db = SQLAlchemy()
bcrypt = Bcrypt()

# User Model
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password_hash = db.Column(db.String(200), nullable=False)
    bio = db.Column(db.Text, nullable=True)  # Optional bio field
    avatar = db.Column(db.String(255), nullable=True)  # Optional profile picture URL
    created_at = db.Column(db.DateTime, default=datetime.utcnow)  # Timestamp for user creation

    def __init__(self, name, email, password):
        self.name = name
        self.email = email
        self.password_hash = bcrypt.generate_password_hash(password).decode('utf-8')

    def check_password(self, password):
        return bcrypt.check_password_hash(self.password_hash, password)

# Uploaded File Model
class UploadedFile(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    filename = db.Column(db.String(255), nullable=False)
    filepath = db.Column(db.String(255), nullable=False)
    uploaded_at = db.Column(db.DateTime, default=datetime.utcnow)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)  # Link to user
    user = db.relationship('User', backref=db.backref('uploaded_files', lazy=True))  # Relationship

class ActivityLog(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)  # Link to user
    user = db.Column(db.String(100), nullable=False)  # Name or ID of the user
    type = db.Column(db.String(50), nullable=False)  # Type of activity (upload, edit, login, etc.)
    description = db.Column(db.String(255), nullable=False)  # Description of the activity
    date = db.Column(db.DateTime, default=datetime.utcnow)  # Timestamp of the activity

