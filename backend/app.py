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
        # Check if a file part exists in the request
        if 'file' not in request.files:
            return jsonify({"error": "No file part"}), 400

        file = request.files['file']

        # Check if the file has a name
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

        return jsonify({"message": f"File '{file.filename}' uploaded successfully!"}), 201
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


# Delete file route
@app.route('/api/files/<filename>', methods=['DELETE'])
def delete_file(filename):
    """Delete a specific file."""
    try:
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        
        # Check if the file exists
        if not os.path.exists(file_path):
            return jsonify({"error": f"File '{filename}' not found"}), 404

        # Remove the file
        os.remove(file_path)

        # Optionally remove it from the chatbot index (if needed)
        if filename in chatbot.document_index:
            del chatbot.document_index[filename]

        return jsonify({"message": f"File '{filename}' deleted successfully"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

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
