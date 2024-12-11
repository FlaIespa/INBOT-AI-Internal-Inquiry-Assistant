# INBOT AI Library

Welcome to the **INBOT AI Library**, an AI-powered internal knowledge management chatbot designed to help organizations streamline internal document retrieval, answer queries based on document content, and provide intelligent insights into company knowledge. This project supports integration with various platforms and APIs, making it easy to connect to services like Slack for a more interactive experience.

## Table of Contents
- [Features](#features)
- [Installation](#installation)
- [Basic Usage](#basic-usage)
- [Integration](#integration)
- [Documentation](#documentation)
- [Development Setup](#development-setup)
- [Contributing](#contributing)
- [License](#license)

---

## Features
- **Document Upload and Parsing**: Upload and parse documents in formats like PDF and DOCX.
- **Context-Aware Responses**: Use Groq's API to generate responses based on document content.
- **Slack Integration**: Easily connect the chatbot to Slack and interact with it in your workspace.
- **Search Optimization**: Includes fuzzy matching and optimized text search using NLTK and RapidFuzz.
- **Error Handling**: Robust error handling and logging.
- **Extensible Design**: Can be extended to support other communication platforms and APIs.

---

## Installation

### Requirements:
- Python 3.7+
- A valid [Groq API Key](https://groq.com/docs)
- Slack API Key (if Slack integration is used)

### Installing the INBOT AI Library

To install the **INBOT AI Library**, run the following command in your terminal:

```bash
pip install INBOT_AI_Library
```

### Using a Virtual Environment (Recommended)
It is recommended to use a virtual environment to manage dependencies:

Create and activate a virtual environment:

```bash
python -m venv venv
source venv/bin/activate  # For Windows: venv\Scripts\activate
```

Install the library:

```bash
pip install INBOT_AI_Library
```

Verify installation:

```bash
pip freeze
```

---

## Basic Usage

```python
from inbot import INBOTChatbot

# Initialize the chatbot with your Groq API key
chatbot = INBOTChatbot(api_key='your-api-key')

# Upload and parse a document
chatbot.upload_document('path/to/document.pdf')
parsed_text = chatbot.parse_document('path/to/document.pdf')

# Ask a question based on the document
response = chatbot.ask_question(parsed_text)
print(response)
```

---

## Integration

### Slack Integration
You can easily integrate the INBOT AI Library into your Slack workspace. To set up the integration:

1. Create a Slack App and enable bot functionality in your workspace. You can follow Slack's official guide [here](https://api.slack.com/start).
2. Set up environment variables for your Slack credentials:

   ```bash
   export SLACK_API_TOKEN='your-slack-api-token'
   ```

For detailed steps and advanced configurations, check out the full Integration Guide.

---

## Documentation
Full documentation for the INBOT AI Library can be found [here](https://github.com/FlaIespa/INBOT-AI-Internal-Inquiry-Assistant). The documentation covers:

- Installation
- Usage examples
- API Reference
- Integration with Slack and other platforms

For contributing or reporting issues, please visit our GitHub Issues page.

---

## Development Setup
To set up the development environment:

Clone the repository:

```bash
git clone https://github.com/FlaIespa/INBOT-AI-Internal-Inquiry-Assistant.git
cd INBOT-AI-Internal-Inquiry-Assistant
```

Install the necessary Python dependencies:

```bash
pip install -r requirements.txt
```

If you’re working on the React web app for documentation or UI, navigate to the respective directory (websites/documentation or websites/user-interface) and install the dependencies:

```bash
npm install
```

---

## Contributing
We welcome contributions! To contribute, follow these steps:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/your-feature`).
3. Commit your changes (`git commit -m 'Add feature'`).
4. Push to the branch (`git push origin feature/your-feature`).
5. Open a Pull Request.

For more details, please refer to our Contribution Guidelines.

---

## License
This project is licensed under the MIT License. See the LICENSE file for details.