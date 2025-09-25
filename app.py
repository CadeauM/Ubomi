import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from groq import Groq
from dotenv import load_dotenv

# Import our routes blueprint
from routes import main_bp 

load_dotenv()

def create_app():
    app = Flask(__name__)
    CORS(app) # Allow our frontend to talk to our backend

    # --- Register Blueprints ---
    # This tells Flask to use all the routes we defined in routes.py
    app.register_blueprint(main_bp)

    # --- API Routes ---
    # This is the backend logic that our JavaScript will call.

    @app.route('/api/register', methods=['POST'])
    def api_register():
        # We will add database logic here later
        return jsonify({"message": "User registered successfully."}), 201

    @app.route('/api/login', methods=['POST'])
    def api_login():
        # We will add database logic here later
        data = request.get_json()
        username = data.get('username')
        # For now, let's just let anyone log in for testing
        return jsonify({"message": "Login successful!", "access_token": f"{username}-token"}), 200

    @app.route('/api/chat', methods=['POST'])
    def api_chat():
        data = request.get_json()
        user_message = data.get('message')
        history = data.get('history', [])

        if not os.environ.get("GROQ_API_KEY"):
            return jsonify({"error": "GROQ_API_KEY is not configured on the server."}), 500

        client = Groq(api_key=os.environ.get("GROQ_API_KEY"))
        
        system_prompt = {
            "role": "system",
            "content": "You are Smart Health, a South African AI-powered mental health assistant..." # Truncated for brevity
        }
        messages = [system_prompt] + history + [{'role': 'user', 'content': user_message}]

        try:
            chat_completion = client.chat.completions.create(
                messages=messages,
                model="llama3-8b-8192",
            )
            return jsonify({"reply": chat_completion.choices[0].message.content})
        except Exception as e:
            print(f"Error communicating with Groq API: {e}")
            return jsonify({"error": "Could not connect to the chat API."}), 500

    # We will add the /api/health-data route back in the next step!

    return app

app = create_app()

if __name__ == '__main__':
    app.run(debug=True, port=5000)