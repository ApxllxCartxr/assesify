from google import genai
import os

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

# List all available models
models = client.list_models()
for model in models:
    print(model.name, "-", model.type)
