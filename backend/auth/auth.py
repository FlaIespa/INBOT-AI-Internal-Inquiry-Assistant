from flask import Blueprint, request, jsonify
from .models import db, User
from .utils import is_valid_email, is_strong_password
# from utils import log_activity
from dotenv import load_dotenv
from datetime import datetime, timedelta
import os
import jwt 

# Load environment variables
load_dotenv()

# Access the secret key from the .env file
SECRET_KEY = os.getenv('SECRET_KEY')

auth_bp = Blueprint('auth', __name__)

# Signup Route
@auth_bp.route('/signup', methods=['POST'])
def signup():
    try:
        data = request.get_json()
        name = data.get('name')
        email = data.get('email')
        password = data.get('password')

        # Validate input
        if not name or not email or not password:
            return jsonify({'error': 'All fields are required'}), 400
        if not is_valid_email(email):
            return jsonify({'error': 'Invalid email address'}), 400
        if not is_strong_password(password):
            return jsonify({'error': 'Password is not strong enough'}), 400

        # Check if email already exists
        if User.query.filter_by(email=email).first():
            return jsonify({'error': 'Email already registered'}), 400

        # Create a new user
        new_user = User(name=name, email=email, password=password)
        db.session.add(new_user)
        db.session.commit()
        return jsonify({'message': 'User registered successfully'}), 201

    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Login Route
from flask_jwt_extended import create_access_token

@auth_bp.route('/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')

        # Validate input
        if not email or not password:
            return jsonify({'error': 'Email and password are required'}), 400

        # Check if the user exists
        user = User.query.filter_by(email=email).first()
        if not user or not user.check_password(password):
            return jsonify({'error': 'Invalid email or password'}), 401

        # Generate a JWT token using flask_jwt_extended
        access_token = create_access_token(identity=user.id, expires_delta=timedelta(hours=1))

        # Include token in the response
        return jsonify({
            'message': 'Login successful',
            'token': access_token
        }), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500


