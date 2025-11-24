import google.generativeai as genai
import os
from dotenv import load_dotenv

# Load the .env file
load_dotenv()


gemini_api_key = os.getenv("gemini_api_key")
genai.configure(api_key=gemini_api_key)
model = genai.GenerativeModel('gemini-2.5-flash')  # or 'gemini-pro'

response = model.generate_content("Hello, how are you? lmk only with emojis.")
print(response.text)