import requests

OLLAMA_URL = "http://localhost:11434/api/generate"


def generate_response(model, system_prompt, user_message):

    response = requests.post(
        OLLAMA_URL,
        json={
            "model": model,
            "system": system_prompt,
            "prompt": user_message,
            "stream": False
        }
    )

    data = response.json()

    return data["response"]