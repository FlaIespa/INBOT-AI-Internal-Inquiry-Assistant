import re

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
