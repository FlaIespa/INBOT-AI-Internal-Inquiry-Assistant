import os
import PyPDF2  
from groq import Groq
from docx import Document 
import re
import nltk
from nltk.stem import PorterStemmer
from fuzzywuzzy import fuzz, process
import logging
import shutil
from dotenv import load_dotenv  # Import dotenv
import os

# Load environment variables from the .env file
load_dotenv()

print(f"Loaded API Key: {os.environ.get('GROQ_API_KEY')}") 

logging.basicConfig(filename='inbot.log', level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

nltk.download('punkt_tab')

# Initialize Groq client
client = Groq(
    api_key=os.environ.get("GROQ_API_KEY"),
)

class INBOTChatbot:
    def __init__(self, documents_dir='data/'):
        """Initialize the chatbot and ensure the document directory exists."""
        self.documents_dir = documents_dir
        self.document_index = {}
        if not os.path.exists(documents_dir):
            os.makedirs(documents_dir)
            logging.info(f"Created directory {documents_dir} for storing documents.")
        else:
            self.index_documents()
    
    def index_documents(self):
        """Index all existing documents by parsing and cleaning their contents."""
        logging.info("Indexing documents for faster search.")
        try:
            for file_name in os.listdir(self.documents_dir):
                file_path = os.path.join(self.documents_dir, file_name)
                parsed_text = self.parse_document(file_path)

                if parsed_text and not parsed_text.startswith("Error"):
                    cleaned_text = self.clean_parsed_text(parsed_text)
                    self.document_index[file_name] = cleaned_text  # Cache cleaned text in memory

            logging.info(f"Indexed {len(self.document_index)} documents successfully.")
        except Exception as e:
            logging.error(f"Error during document indexing: {e}")

    def upload_document(self, file_path):
        """Uploads and saves a document to the 'data/' directory and indexes it."""
        try:
            if not os.path.exists(file_path):
                logging.error(f"Error: File '{file_path}' not found.")
                return "Error: File not found."
            
            # Copy the document into the 'data/' folder
            file_name = os.path.basename(file_path)
            destination_path = os.path.join(self.documents_dir, file_name)
            
            # Only copy the document if it's not already in the 'data/' folder
            if not os.path.exists(destination_path):
                shutil.copy(file_path, destination_path)
                logging.info(f"Document '{file_name}' uploaded and saved to '{self.documents_dir}'.")
            else:
                logging.info(f"Document '{file_name}' already exists in '{self.documents_dir}', skipping copy.")

            # Parse and index the document
            parsed_text = self.parse_document(destination_path)
            if parsed_text and not parsed_text.startswith("Error"):
                cleaned_text = self.clean_parsed_text(parsed_text)
                self.document_index[file_name] = cleaned_text
                
                # Optionally, save to cache
                if hasattr(self, 'save_document_cache'):
                    self.save_document_cache()

                logging.info(f"Document '{file_name}' parsed, cleaned, and indexed successfully.")
                return f"Document '{file_name}' uploaded and indexed successfully."
            else:
                logging.error(f"Failed to parse document '{file_name}'.")
                return f"Error parsing document '{file_name}'."

        except Exception as e:
            logging.error(f"Error during document upload and indexing for '{file_path}': {e}")
            return f"Error during document upload: {e}"

    def parse_document(self, file_path):
        """Parses the text from PDF, DOCX, and TXT files."""
        ext = os.path.splitext(file_path)[1].lower()  # Get file extension
        text = ""
        try:
            if ext == ".pdf":
                # Parse PDF file
                with open(file_path, 'rb') as f:
                    reader = PyPDF2.PdfReader(f)
                    text = " ".join([page.extract_text() for page in reader.pages])
                logging.info(f"Successfully parsed PDF document '{file_path}'.")

            elif ext == ".docx":
                # Parse DOCX file
                doc = Document(file_path)
                text = " ".join([para.text for para in doc.paragraphs])
                logging.info(f"Successfully parsed DOCX document '{file_path}'.")
            
            elif ext == ".txt":
                # Parse TXT file
                with open(file_path, 'r') as f:
                    text = f.read()
                logging.info(f"Successfully parsed TXT document '{file_path}'.")
            
            else:
                logging.warning(f"Unsupported file format for '{file_path}'.")
                return "Unsupported file format."
            return text
        except Exception as e:
            logging.error(f"Error parsing document '{file_path}': {e}")
            return f"Error parsing document: {e}"

    def clean_parsed_text(self, text):
        """Cleans the parsed text by improving readability."""

        try: 
            # Lowercase the text to make it more readable and consistent
            cleaned_text = text.lower()

            # Replace bullet points and strange characters with proper formatting
            cleaned_text = cleaned_text.replace('•', '\n- ').replace('●', '\n- ')

            # Use regex to handle common issues:
            # Add a space between lowercase and uppercase letters (for joined words)
            cleaned_text = re.sub(r'([a-z])([A-Z])', r'\1 \2', cleaned_text)

            # Add spaces around punctuation marks
            cleaned_text = re.sub(r'(?<!\s)([.,!?%])', r' \1', cleaned_text)

            # Remove any multiple spaces and normalize spaces
            cleaned_text = re.sub(r'\s+', ' ', cleaned_text).strip()
            
            logging.info("Text cleaned successfully.")
            return cleaned_text
        except Exception as e:
            logging.error(f"Error cleaning text: {e}")
            return f"Error cleaning text: {e}"


    def ask_question(self, question):
        """Ask a question to the Groq API"""
        try:
            # Interact with the Groq API
            chat_completion = client.chat.completions.create(
                messages=[
                    {
                        "role": "user",
                        "content": question,
                    }
                ],
                model="llama3-8b-8192",  # Keep the Groq model
            )
            
            logging.info(f"Question asked to Groq API: {question}")
            return chat_completion.choices[0].message.content

        except Exception as e:
            logging.error(f"Error during Groq API request: {e}")
            return f"Error during Groq API request: {e}"

    
    def search_documents(self, query, threshold=80):
        """Searches through all documents for the query with fuzzy matching and highlights the term."""
        results = []
        try:
            for file_name in os.listdir(self.documents_dir):
                file_path = os.path.join(self.documents_dir, file_name)
                document_text = self.parse_document(file_path)

                # Use fuzzy matching to find the closest match to the query
                match = process.extractOne(query.lower(), document_text.lower().split(), scorer=fuzz.token_set_ratio)
                if match and match[1] >= threshold:  # Only accept matches above the threshold
                    match_term = match[0]

                    # Find the position of the matched term
                    snippet_start = max(0, document_text.lower().find(match_term) - 100)
                    snippet_end = snippet_start + 300
                    snippet = document_text[snippet_start:snippet_end]

                    # Highlight the matched term
                    highlighted_snippet = snippet.replace(match_term, f"**{match_term}**")

                    results.append(f"Match found in {file_name}:\n...{highlighted_snippet}...\n")

            if results:
                logging.info(f"Search for '{query}' completed. {len(results)} matches found.")
                return "\n".join(results)
            else:
                logging.info(f"Search for '{query}' found no matches.")
                return "No matches found in uploaded documents."
        except Exception as e:
            logging.error(f"Error during document search for '{query}': {e}")
            return f"Error during document search: {e}"