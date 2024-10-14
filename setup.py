from setuptools import setup, find_packages

# Read the contents of README.md for long description
with open("README.md", "r") as fh:
    long_description = fh.read()

setup(
    name="INBOT_AI_Library",  # Replace with your library name
    version="0.1.0",  # Initial version
    author="Flavia Iespa",
    author_email="flavia.iespa@uni.minerva.edu",
    description="An AI-driven chatbot for internal knowledge management",
    long_description=long_description,
    long_description_content_type="text/markdown",
    url="https://github.com/your-repo-url",  # Replace with your GitHub repo URL
    packages=find_packages(where="src"),  # Specify that packages are inside `src/`
    package_dir={"": "src"},  # Root package directory
    install_requires=[
        "groq>=0.11.0",  # GPT API
        "Flask>=3.0.3",   # Web framework for Flask app
        "fuzzywuzzy>=0.18.0",  # Fuzzy text searching
        "nltk>=3.9.1",  # Natural Language Toolkit for text processing
        "PyPDF2>=3.0.1",  # PDF parsing
        "python-docx>=1.1.2",  # Word document parsing
        "RapidFuzz>=3.10.0",  # Optimized fuzzy matching (consider replacing fuzzywuzzy)
    ],
    classifiers=[
        "Programming Language :: Python :: 3",
        "License :: OSI Approved :: MIT License",
        "Operating System :: OS Independent",
    ],
    python_requires=">=3.7",
)
