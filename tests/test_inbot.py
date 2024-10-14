from inbot.chatbot import INBOTChatbot  # Import the updated INBOTChatbot class

def format_groq_response(response):
    """Cleans up and formats Groq's response for better readability."""
    formatted_response = response.strip()  # Remove unnecessary whitespaces around the response
    return formatted_response

# Initialize the chatbot and ensure 'data/' directory is created
chatbot = INBOTChatbot(documents_dir='data/')

# Step 1: Upload and index the document
print("Step 1: Uploading and indexing the document...")
upload_response = chatbot.upload_document('/Users/flaviaiespa/Documents/Flavia Iespa - SWE2024.pdf')
print(upload_response)

# Check if the document was indexed successfully
if 'Flavia Iespa - SWE2024.pdf' in chatbot.document_index:
    # Step 2: Ask a question using Groq API
    print("\nStep 2: Asking a question to the Groq API...")
    cleaned_text = chatbot.document_index['Flavia Iespa - SWE2024.pdf']  # Retrieve cleaned text from the index
    groq_response = chatbot.ask_question(cleaned_text[:500])  # Send part of the cleaned text as a question
    formatted_response = format_groq_response(groq_response)  # Format the response
    print("Groq Response:\n", formatted_response)

    # Step 3: Search for a term in the document
    print("\nStep 3: Searching for a term ('Python') in the document...")
    search_query = "Python"  # Term you know exists in the document
    search_results = chatbot.search_documents(search_query)
    print(f"Search results for '{search_query}':\n{search_results}")
else:
    print("Failed to index the document or retrieve cleaned text from index.")
