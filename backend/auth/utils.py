import re
# import logging
# from auth.models import ActivityLog, db, User
# from flask import request
import jwt
from flask import request, jsonify
from functools import wraps


def is_valid_email(email):
    """Validate an email address using a regex."""
    email_regex = r'^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$'
    return re.match(email_regex, email) is not None

def is_strong_password(password):
    """Check if a password is strong enough."""
    return (
        len(password) >= 8 and  # At least 8 characters
        any(char.isdigit() for char in password) and  # Contains a digit
        any(char.isupper() for char in password) and  # Contains an uppercase letter
        any(char.islower() for char in password) and  # Contains a lowercase letter
        any(char in "!@#$%^&*()-_+=" for char in password)  # Contains a special character
    )

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')

        if not token:
            return jsonify({'error': 'Token is missing'}), 401

        try:
            # Decode the token
            data = jwt.decode(token, os.getenv('SECRET_KEY'), algorithms=['HS256'])
            request.user_id = data['user_id']  # Attach the user ID to the request
        except jwt.ExpiredSignatureError:
            return jsonify({'error': 'Token has expired'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'error': 'Invalid token'}), 401

        return f(*args, **kwargs)
    return decorated


# def log_activity(activity_type, description):
#     """Log an activity to the database with the authenticated user's information."""
#     try:
#         # Fetch authenticated user from the request headers
#         user_email = request.headers.get('X-User-Email')
#         user = User.query.filter_by(email=user_email).first()

#         if not user:
#             logging.warning(f"User with email {user_email} not found. Activity will not be logged.")
#             return

#         activity = ActivityLog(user=user.name, type=activity_type, description=description)
#         db.session.add(activity)
#         db.session.commit()
#         logging.info(f"Activity logged: {description}")
#     except Exception as e:
#         logging.error(f"Error logging activity: {e}")

