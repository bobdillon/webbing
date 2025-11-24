import google.generativeai as genai
import os

api_key = os.getenv("gemini_api_key")
genai.configure(api_key=api_key)
model = genai.GenerativeModel('gemini-1.5-flash')  # or 'gemini-pro'

response = model.generate_content("Hello, how are you, lmk in emojis?")
print(response.text)