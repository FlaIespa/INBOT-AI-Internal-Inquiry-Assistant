from flask import Flask, request, jsonify
from flask_cors import CORS
from auth import auth_bp, db, bcrypt  # Import the auth Blueprint, database, and bcrypt
from auth.models import UploadedFile  # Import the UploadedFile model
from chatbot import INBOTChatbot
import logging
import os

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS

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

# File upload route
@app.route('/api/upload', methods=['POST'])
def upload_file():
    try:
        if 'file' not in request.files:
            return jsonify({"error": "No file part"}), 400

        file = request.files['file']
        if file.filename == '':
            return jsonify({"error": "No selected file"}), 400

        # Save the file to the upload directory
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], file.filename)
        file.save(filepath)

        # Add file details to the database
        uploaded_file = UploadedFile(
            filename=file.filename,
            filepath=filepath
        )
        db.session.add(uploaded_file)
        db.session.commit()

        # Index the document in the chatbot
        indexing_result = chatbot.upload_document(filepath)

        return jsonify({"message": indexing_result}), 201
    except Exception as e:
        logging.error(f"Error during file upload: {e}")
        return jsonify({"error": "Internal server error"}), 500


@app.route('/api/files', methods=['GET'])
def list_files():
    try:
        files = UploadedFile.query.all()
        return jsonify({"files": [{"name": f.filename} for f in files]})
    except Exception as e:
        logging.error(f"Error listing files: {e}")
        return jsonify({"error": "Internal server error"}), 500


@app.route('/api/files/<filename>', methods=['DELETE'])
def delete_file(filename):
    """Delete a specific file."""
    try:
        # Get the file path
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        logging.info(f"Attempting to delete file: {file_path}")

        # Check if the file exists in the filesystem
        if not os.path.exists(file_path):
            logging.warning(f"File '{filename}' not found in filesystem.")
            # Check if the file exists in the database and delete the record if found
            file_record = UploadedFile.query.filter_by(filename=filename).first()
            if file_record:
                db.session.delete(file_record)
                db.session.commit()
                logging.info(f"Deleted file '{filename}' from database but it was not found in the filesystem.")
                return jsonify({"message": f"File '{filename}' deleted from database but not found in filesystem."}), 200
            return jsonify({"error": f"File '{filename}' not found"}), 404

        # Remove the file from the filesystem
        os.remove(file_path)
        logging.info(f"File '{filename}' removed from filesystem.")

        # Remove the file record from the database
        file_record = UploadedFile.query.filter_by(filename=filename).first()
        if file_record:
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
def get_user_profile():
    # Replace with the actual user authentication logic
    user_email = request.headers.get('X-User-Email')  # Example of how to pass user's email
    user = User.query.filter_by(email=user_email).first()
    
    if not user:
        return jsonify({"error": "User not found"}), 404

    return jsonify({
        "name": user.name,
        "email": user.email,
        "bio": user.bio if hasattr(user, "bio") else "",  # Ensure 'bio' field exists in the database
        "avatar": user.avatar if hasattr(user, "avatar") else "",  # Ensure 'avatar' field exists
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
def get_user_stats():
    user_email = request.headers.get('X-User-Email')  # Example of how to pass user's email
    user = User.query.filter_by(email=user_email).first()

    if not user:
        return jsonify({"error": "User not found"}), 404

    # Example static stats; replace with real calculations if needed
    stats = {
        "interactions": 125,  # Example: Count chatbot interactions for this user
        "documentsUploaded": 50,  # Example: Count documents uploaded by this user
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
