# INBOT – Personal Document Management & Query Chatbot

**INBOT** is an AI‑powered personal management tool designed to help you organize, manage, and query your digital documents. With a sleek chatbot interface, INBOT enables individuals to upload files, categorize them, and interact with their documents using natural language queries—all through a secure and intuitive platform.

Visit our website: [inbot.software](https://inbot.software)

---

## Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation & Setup](#installation--setup)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

**INBOT** empowers you to take control of your digital document workflows. Upload various document types (like PDFs and text files), have the system automatically extract and index the content, and later ask natural language questions about your documents. The solution leverages Supabase as its backend service (including secure file storage, authentication, and a PostgreSQL database with PG Vector for text embeddings) and integrates OpenAI's API to generate document embeddings and power the chatbot's responses.

---

## Features

- **Document Upload & Parsing**  
  Easily upload documents using a simple drag-and-drop interface. INBOT extracts text from your files and generates embeddings for effective querying.

- **AI Chatbot Interface**  
  Ask natural language questions about your documents. The chatbot uses OpenAI's API to search through embeddings and return relevant answers.

- **Organized File Management**  
  Organize your files by creating custom categories and folders, making it easy to retrieve and manage your documents.

- **Customizable Experience**  
  Adjust your interface language (English or Portuguese), switch between dark and light modes, and set your preferred time zone through the Settings page.

- **Secure Backend**  
  Powered by Supabase, offering secure user authentication, file storage, and database management, along with PG Vector for advanced text embedding search.

---

## Tech Stack

- **Frontend:**  
  - React  
  - Tailwind CSS  
  - Framer Motion  
  - Heroicons  

- **Backend:**  
  - Supabase (PostgreSQL, Storage, Authentication)  
  - PG Vector for text embedding storage  
  - OpenAI API for generating text embeddings and powering natural language responses

---

## Installation & Setup

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- A Supabase project (with Storage, Authentication, and Database configured)
- OpenAI API key

### Setup Instructions

1. **Clone the Repository**
   ```bash
   git clone https://github.com/yourusername/INBOT.git
   cd INBOT
   ```

2. **Install Frontend Dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Configure Environment Variables**  
   Create a .env file in the root directory and add:
   ```env
   REACT_APP_SUPABASE_URL=your-supabase-url
   REACT_APP_SUPABASE_ANON_KEY=your-supabase-anon-key
   REACT_APP_OPENAI_API_KEY=your-openai-api-key
   REACT_APP_EMBEDDING_API_URL=https://api.openai.com/v1/embeddings
   ```

4. **Run the Application**
   ```bash
   npm start
   # or
   yarn start
   ```

## Usage

### Upload & Organize Documents
Navigate to the File Management page to upload your documents. INBOT will automatically extract text from your files, generate embeddings for later querying, and even use AI to suggest labels for each document. You can create custom categories and organize your files into folders for easier management.

### Query Your Documents
Use the Chatbot interface to ask natural language questions about your documents. The system leverages OpenAI to search through the embeddings and return the most relevant information based on your queries.

### Customize Your Experience
Access the Settings page to adjust your preferences, including interface language (English or Portuguese), appearance (dark/light mode), and time zone.

## Contributing

We welcome contributions! To contribute, please follow these steps:

1. Fork the repository.
2. Create a new branch:
   ```bash
   git checkout -b feature/your-feature
   ```
3. Commit your changes:
   ```bash
   git commit -m 'Add feature'
   ```
4. Push to your branch:
   ```bash
   git push origin feature/your-feature
   ```
5. Open a Pull Request.

For more details, please refer to our CONTRIBUTING.md.

## License

This project is licensed under the MIT License. See the LICENSE file for details.

Visit [inbot.software](https://inbot.software) to try out INBOT!
