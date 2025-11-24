import google.generativeai as genai

genai.configure(api_key="AIzaSyCzJdDbv8bgHedR3wHauggh2u54Fyo7AGA")
model = genai.GenerativeModel('gemini-1.5-flash')  # or 'gemini-pro'

response = model.generate_content("Hello, how are you, lmk in emojis?")
print(response.text)