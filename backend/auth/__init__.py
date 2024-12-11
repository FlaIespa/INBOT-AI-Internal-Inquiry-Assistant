from .auth import auth_bp  # Import the authentication Blueprint
from .models import db, bcrypt  # Import database and bcrypt instances

# Define what gets imported when "from auth import *" is used
__all__ = ["auth_bp", "db", "bcrypt"]
