from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from auth.models import User, ActivityLog, UploadedFile  # Import models
from auth import auth_bp, db, bcrypt  # Import Blueprint, database, and bcrypt
from chatbot import INBOTChatbot
import logging
import os
from flask_jwt_extended import JWTManager, jwt_required, get_jwt_identity
from werkzeug.utils import secure_filename
import secrets

# Initialize Flask app
app = Flask(__name__)
CORS(app, resources={
    r"/api/*": {
        "origins": ["http://localhost:3000", "http://127.0.0.1:3000"],
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"]
    },
    r"/auth/*": {
        "origins": ["http://localhost:3000", "http://127.0.0.1:3000"],
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"]
    }
})

# Secure secret key
app.config['JWT_SECRET_KEY'] = os.environ.get('JWT_SECRET_KEY', secrets.token_hex(32))
jwt = JWTManager(app)

# Database configuration
basedir = os.path.abspath(os.path.dirname(__file__))
app.config['SQLALCHEMY_DATABASE_URI'] = f"sqlite:///{os.path.join(basedir, 'instance', 'inbot.db')}"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize extensions
db.init_app(app)
bcrypt.init_app(app)

# Chatbot setup
UPLOAD_FOLDER = './data/uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
chatbot = INBOTChatbot(documents_dir=UPLOAD_FOLDER)

# Logging configuration
logging.basicConfig(level=logging.INFO)

# Register Blueprints
app.register_blueprint(auth_bp, url_prefix='/auth')

# Database initialization
with app.app_context():
    try:
        db.drop_all()
        db.create_all()
        print("✅ Database tables recreated successfully.")
    except Exception as e:
        print(f"❌ Error recreating database tables: {e}")

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

        chatbot.fetch_files_from_supabase()  # Fetch files from Supabase
        response = chatbot.ask_question(question)  # Get chatbot response
        return jsonify({"response": response}), 200
    except Exception as e:
        logging.error(f"Error in /api/ask: {e}")
        return jsonify({"error": "Internal server error"}), 500

@app.route('/api/upload', methods=['POST'])
@jwt_required()
def upload_file():
    try:
        user_id = get_jwt_identity()
        if 'file' not in request.files:
            return jsonify({"error": "No file part in the request"}), 422

        uploaded_file = request.files['file']

        if uploaded_file.filename == '':
            return jsonify({"error": "No file selected"}), 422

        filename = secure_filename(uploaded_file.filename)
        file_path = os.path.join(UPLOAD_FOLDER, filename)

        # Save file locally
        uploaded_file.save(file_path)

        # Save to Supabase storage
        with open(file_path, 'rb') as f:
            supabase_response = chatbot.supabase.storage.from_('files').upload(filename, f)
            if supabase_response.error:
                return jsonify({"error": "Failed to upload file to Supabase"}), 500

        # Save metadata to database
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
        user_id = get_jwt_identity()
        files = UploadedFile.query.filter_by(user_id=user_id).all()
        return jsonify({"files": [{"name": f.filename, "uploaded_at": f.uploaded_at} for f in files]}), 200
    except Exception as e:
        logging.error(f"Error fetching files: {e}")
        return jsonify({"error": "Failed to fetch files"}), 500

@app.route('/api/files/<filename>', methods=['DELETE'])
@jwt_required()
def delete_file(filename):
    try:
        user_id = get_jwt_identity()
        file_record = UploadedFile.query.filter_by(filename=filename, user_id=user_id).first()

        if not file_record:
            return jsonify({"error": "File not found or not owned by the user"}), 404

        # Delete from filesystem
        if os.path.exists(file_record.filepath):
            os.remove(file_record.filepath)

        # Delete from Supabase storage
        supabase_response = chatbot.supabase.storage.from_('files').remove([filename])
        if supabase_response.error:
            return jsonify({"error": "Failed to delete file from Supabase storage"}), 500

        # Delete from database
        db.session.delete(file_record)
        db.session.commit()

        return jsonify({"message": f"File '{filename}' deleted successfully"}), 200
    except Exception as e:
        logging.error(f"Error deleting file: {e}")
        return jsonify({"error": str(e)}), 500

# Chat endpoint for interacting with the bot
@app.route('/api/chat', methods=['POST'])
def chat_with_bot():
    try:
        data = request.get_json()
        question = data.get("question")

        if not question or not isinstance(question, str) or question.strip() == "":
            return jsonify({"error": "Invalid question format"}), 400

        chatbot.fetch_files_from_supabase()  # Fetch and index files
        response = chatbot.ask_question(question)  # Get bot response
        return jsonify({"response": response}), 200
    except Exception as e:
        logging.error(f"Error in /api/chat: {e}")
        return jsonify({"error": "Internal server error"}), 500

if __name__ == '__main__':
    try:
        print("🚀 Starting INBOT API on port 5000")
        app.run(host="127.0.0.1", port=5000, debug=True)
    except Exception as e:
        logging.error(f"Error starting server: {e}")
