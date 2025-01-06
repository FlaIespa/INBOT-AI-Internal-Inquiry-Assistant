from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from auth import auth_bp, db, bcrypt  # Import the auth Blueprint, database, and bcrypt
from auth.models import UploadedFile  # Import the UploadedFile model
from chatbot import INBOTChatbot
import logging
import os
from flask_jwt_extended import JWTManager, jwt_required, get_jwt_identity
import secrets


# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS

# Use a secure, environment-based secret key
app.config['JWT_SECRET_KEY'] = os.environ.get('JWT_SECRET_KEY', secrets.token_hex(32))
jwt = JWTManager(app)

# Optional: Configure additional JWT settings
# app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=1)

# Ensure the 'instance' directory exists
os.makedirs('instance', exist_ok=True)

# Configure SQLite database
basedir = os.path.abspath(os.path.dirname(__file__))  # Get the base directory of the project
app.config['SQLALCHEMY_DATABASE_URI'] = f"sqlite:///{os.path.join(basedir, 'instance', 'inbot.db')}"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize SQLAlchemy and Bcrypt
db.init_app(app)
bcrypt.init_app(app)

# Chatbot-related configurations
UPLOAD_FOLDER = './data/uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
chatbot = INBOTChatbot(documents_dir=UPLOAD_FOLDER)

# Logging
logging.basicConfig(level=logging.INFO)

# Register Blueprints
app.register_blueprint(auth_bp, url_prefix='/auth')

# Ensure database tables are created
with app.app_context():
    try:
        db.create_all()
        print("✅ Database tables created successfully.")
    except Exception as e:
        print(f"❌ Error creating database tables: {e}")

# Home route
@app.route('/')
def home():
    return "Welcome to the INBOT API!"

# Chatbot ask route
@app.route('/api/ask', methods=['POST'])
def ask_chatbot():
    try:
        data = request.get_json()
        question = data.get("question")
        
        if not question or not isinstance(question, str) or question.strip() == "":
            return jsonify({"error": "Invalid question format"}), 400

        # Use the chatbot logic to get the response
        response = chatbot.ask_question(question)
        return jsonify({"response": response})
    
    except Exception as e:
        logging.error(f"Error in /api/ask: {e}")
        return jsonify({"error": "Internal server error"}), 500

@app.route('/api/upload', methods=['POST'])
@jwt_required()
def upload_file():
    try:
        user_id = get_jwt_identity()  # Retrieve the user ID from the token
        if 'file' not in request.files:
            return jsonify({"error": "No file part in the request"}), 422

        uploaded_file = request.files['file']

        # Validate file
        if uploaded_file.filename == '':
            return jsonify({"error": "No file selected"}), 422

        # Save the file and store its information in the database
        filename = secure_filename(uploaded_file.filename)
        file_path = os.path.join(UPLOAD_FOLDER, filename)
        uploaded_file.save(file_path)

        # Add file record to database (example)
        new_file = UploadedFile(filename=filename, filepath=file_path, user_id=user_id)
        db.session.add(new_file)
        db.session.commit()

        return jsonify({"message": "File uploaded successfully!"}), 201
    except Exception as e:
        logging.error(f"Error uploading file: {e}")
        return jsonify({"error": str(e)}), 500



@app.route('/api/files', methods=['GET'])
@jwt_required()
def get_files():
    try:
        user_id = get_jwt_identity()  # Get the user ID from the token
        # Query files associated with the user
        files = UploadedFile.query.filter_by(user_id=user_id).all()
        return jsonify({"files": [{"name": f.filename, "uploaded_at": f.uploaded_at} for f in files]}), 200
    except Exception as e:
        logging.error(f"Error fetching files for user {user_id}: {e}")
        return jsonify({"error": "Failed to fetch files"}), 500



@app.route('/api/files/<filename>', methods=['DELETE'])
@jwt_required()  # Require JWT authentication
def delete_file(filename):
    """Delete a specific file owned by the authenticated user."""
    try:
        user_id = get_jwt_identity()  # Get the user ID from the JWT token
        logging.info(f"User {user_id} attempting to delete file: {filename}")

        # Fetch the file record owned by the user
        file_record = UploadedFile.query.filter_by(filename=filename, user_id=user_id).first()
        if not file_record:
            logging.warning(f"File '{filename}' not found or not owned by user {user_id}.")
            return jsonify({"error": "File not found or you don't have permission to delete it"}), 404

        # Get the file path
        file_path = file_record.filepath
        logging.info(f"Deleting file from filesystem: {file_path}")

        # Remove the file from the filesystem
        try:
            if os.path.exists(file_path):
                os.remove(file_path)
                logging.info(f"File '{filename}' removed from filesystem.")
            else:
                logging.warning(f"File '{filename}' not found in filesystem.")
        except OSError as e:
            logging.error(f"Failed to remove file '{file_path}' from filesystem: {e}")

        # Remove the file record from the database
        db.session.delete(file_record)
        db.session.commit()
        logging.info(f"File '{filename}' removed from database.")

        # Optionally remove it from the chatbot index
        if filename in chatbot.document_index:
            del chatbot.document_index[filename]
            logging.info(f"File '{filename}' removed from chatbot index.")

        return jsonify({"message": f"File '{filename}' deleted successfully"}), 200
    except Exception as e:
        logging.error(f"Error deleting file '{filename}': {e}")
        return jsonify({"error": str(e)}), 500


@app.route('/api/chat', methods=['POST'])
def chat_with_bot():
    """Endpoint to interact with the chatbot."""
    try:
        data = request.get_json()
        question = data.get("question")
        
        if not question or not isinstance(question, str) or question.strip() == "":
            return jsonify({"error": "Invalid question format"}), 400

        # Use the chatbot to get a response
        response = chatbot.ask_question(question)
        return jsonify({"response": response})
    
    except Exception as e:
        logging.error(f"Error in /api/chat: {e}")
        return jsonify({"error": "Internal server error"}), 500

# Fetch user profile
@app.route('/auth/user-profile', methods=['GET'])
@jwt_required()
def get_user_profile():
    user_id = get_jwt_identity()  # Extract user_id from JWT
    user = User.query.get(user_id)

    if not user:
        return jsonify({"error": "User not found"}), 404

    return jsonify({
        "name": user.name,
        "email": user.email,
        "bio": user.bio if hasattr(user, "bio") else "",
        "avatar": user.avatar if hasattr(user, "avatar") else "",
    })


# Update user profile
@app.route('/auth/update-profile', methods=['POST'])
def update_user_profile():
    data = request.json
    user_email = request.headers.get('X-User-Email')  # Example of how to pass user's email
    user = User.query.filter_by(email=user_email).first()

    if not user:
        return jsonify({"error": "User not found"}), 404

    try:
        user.name = data.get("name", user.name)
        user.bio = data.get("bio", user.bio)
        user.avatar = data.get("avatar", user.avatar)  # This assumes avatar is a URL or base64 string

        db.session.commit()
        return jsonify({"message": "Profile updated successfully!"})
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": f"Failed to update profile: {str(e)}"}), 500

# Fetch user stats
@app.route('/api/user-stats', methods=['GET'])
@jwt_required()
def get_user_stats():
    user_id = get_jwt_identity()  # Extract user_id from JWT
    user = User.query.get(user_id)

    if not user:
        return jsonify({"error": "User not found"}), 404

    stats = {
        "interactions": 125,  # Example: Count chatbot interactions
        "documentsUploaded": UploadedFile.query.filter_by(user_id=user_id).count(),
        "editsMade": 10,  # Example: Count edits made by this user
    }

    return jsonify(stats)


@app.route('/auth/upload-avatar', methods=['POST'])
def upload_avatar():
    user_email = request.headers.get('X-User-Email')
    user = User.query.filter_by(email=user_email).first()
    if not user:
        return jsonify({"error": "User not found"}), 404

    if 'avatar' not in request.files:
        return jsonify({"error": "No avatar file provided"}), 400

    avatar = request.files['avatar']
    avatar_filename = f"{user.id}_avatar.png"
    avatar_path = os.path.join(app.config['UPLOAD_FOLDER'], avatar_filename)

    try:
        avatar.save(avatar_path)
        user.avatar = f"/static/uploads/{avatar_filename}"
        db.session.commit()
        return jsonify({"message": "Avatar uploaded successfully!", "avatar": user.avatar})
    except Exception as e:
        logging.error(f"Error uploading avatar: {e}")
        db.session.rollback()
        return jsonify({"error": "Failed to upload avatar"}), 500

@app.route('/uploads/<filename>', methods=['GET'])
def serve_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

@app.route('/api/user/metrics', methods=['GET'])
def get_user_metrics():
    """Fetch user-specific metrics."""
    user_id = request.headers.get('X-User-ID')  # User ID passed in headers
    if not user_id:
        return jsonify({"error": "User ID is required"}), 400

    try:
        user = User.query.get(user_id)
        if not user:
            return jsonify({"error": "User not found"}), 404

        total_documents = UploadedFile.query.filter_by(user_id=user_id).count()
        active_sessions = ActivityLog.query.filter_by(user_id=user_id, type='login').count()

        return jsonify({
            "totalDocuments": total_documents,
            "activeSessions": active_sessions,
        }), 200
    except Exception as e:
        logging.error(f"Error fetching user metrics: {e}")
        return jsonify({"error": "Failed to fetch metrics"}), 500

@app.route('/api/user/upload-trends', methods=['GET'])
def get_user_upload_trends():
    """Fetch user-specific upload trends."""
    user_id = request.headers.get('X-User-ID')  # User ID passed in headers
    if not user_id:
        return jsonify({"error": "User ID is required"}), 400

    try:
        uploads = (
            db.session.query(
                db.func.strftime('%Y-%m', UploadedFile.uploaded_at).label('month'),
                db.func.count(UploadedFile.id).label('count')
            )
            .filter_by(user_id=user_id)
            .group_by('month')
            .order_by('month')
            .all()
        )

        trends = [{"month": row[0], "count": row[1]} for row in uploads]

        return jsonify({"trends": trends}), 200
    except Exception as e:
        logging.error(f"Error fetching user upload trends: {e}")
        return jsonify({"error": "Failed to fetch upload trends"}), 500

@app.route('/api/user/activity-logs', methods=['GET'])
def get_user_activity_logs():
    """Fetch user-specific activity logs."""
    user_id = request.headers.get('X-User-ID')  # User ID passed in headers
    if not user_id:
        return jsonify({"error": "User ID is required"}), 400

    try:
        logs = ActivityLog.query.filter_by(user_id=user_id).order_by(ActivityLog.date.desc()).all()
        return jsonify({
            "logs": [
                {
                    "id": log.id,
                    "description": log.description,
                    "type": log.type,
                    "date": log.date.strftime('%Y-%m-%d %H:%M:%S'),
                }
                for log in logs
            ]
        }), 200
    except Exception as e:
        logging.error(f"Error fetching user activity logs: {e}")
        return jsonify({"error": "Failed to fetch activity logs"}), 500

# Main server entry point
if __name__ == '__main__':
    try:
        print(f"🚀 INBOT AI Backend Starting on Port 5000...")
        print(f"   Upload Directory: {UPLOAD_FOLDER}")
        print("\n📋 Available Endpoints:")
        print("   - GET  / : Home route")
        print("   - POST /api/ask : Ask chatbot a question")
        print("   - POST /api/upload : Upload a document")
        print("   - GET  /api/files : List uploaded files")
        print("   - DELETE /api/files/<filename> : Delete a specific file")
        print("   - POST /auth/signup : Signup for an account")
        print("   - POST /auth/login : Login to your account")

        # Start the Flask development server
        app.run(host="127.0.0.1", port=5000, debug=False)
    except Exception as e:
        print(f"❌ Error starting server: {e}")
