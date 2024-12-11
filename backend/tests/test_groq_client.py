from groq import Groq
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

# Test Groq client initialization
try:
    client = Groq(api_key=os.getenv("GROQ_API_KEY"))
    print("Groq client initialized successfully!")
except Exception as e:
    print(f"Error initializing Groq client: {e}")
