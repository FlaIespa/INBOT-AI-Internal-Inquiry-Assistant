from flask import Flask, request, jsonify
from flask_cors import CORS
from chatbot import INBOTChatbot
import logging
import os

from flask import Flask, request, jsonify
from flask_cors import CORS
from chatbot import INBOTChatbot
import logging
import os
import socket

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS

UPLOAD_FOLDER = './data/uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

logging.basicConfig(level=logging.INFO)

# Initialize the chatbot
chatbot = INBOTChatbot(documents_dir=UPLOAD_FOLDER)..

def find_free_port():
    """Find a free port for the server to use."""
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        s.bind(('', 0))
        s.listen(1)
        port = s.getsockname()[1]
    return port

if __name__ == '__main__':
    # Determine port (use environment variable or find a free port)
    port = int(os.getenv('PORT', find_free_port()))
    host = os.getenv('HOST', '127.0.0.1')
    
    # Logging server startup information
    print(f"🚀 INBOT AI Backend Starting...")
    print(f"   Host: {host}")
    print(f"   Port: {port}")
    print(f"   Upload Directory: {UPLOAD_FOLDER}")
    print("\n📋 Available Endpoints:")
    print("   - GET  / : Home route")
    print("   - POST /api/ask : Ask chatbot a question")
    print("   - POST /api/upload : Upload a document")
    print("   - GET  /api/files : List uploaded files")
    print("   - DELETE /api/files/<filename> : Delete a specific file")
    
    try:
        # Start the Flask development server
        app.run(
            host=host, 
            port=port, 
            debug=False, 
            use_reloader=False
        )
    except Exception as e:
        print(f"❌ Error starting server: {e}")
        import traceback
        traceback.print_exc()

@app.route('/')
def home():
    return "Welcome to the INBOT API!"

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
def upload_file():
    try:
        if 'file' not in request.files:
            return jsonify({"error": "No file part"}), 400
        file = request.files['file']
        if file.filename == '':
            return jsonify({"error": "No selected file"}), 400

        filepath = os.path.join(app.config['UPLOAD_FOLDER'], file.filename)
        file.save(filepath)  # Save file to the upload directory
        chatbot.upload_document(filepath)  # Index the uploaded document
        return jsonify({"message": f"File '{file.filename}' uploaded successfully!"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/files', methods=['GET'])
def list_files():
    """List all uploaded files."""
    try:
        files = os.listdir(app.config['UPLOAD_FOLDER'])
        return jsonify({"files": [{"name": f} for f in files]})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

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

if __name__ == '__main__':
    debug_mode = os.getenv("FLASK_DEBUG", "false").lower() == "true"
    app.run(host="127.0.0.1", port=5000, debug=False, use_reloader=False)