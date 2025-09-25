from flask import Flask, request, jsonify, render_template, redirect, url_for
from flask_cors import CORS
from utils.database import init_db, add_user, check_user, add_health_data, get_health_data, get_last_mood
from utils.analysis import analyze_mood
import os
import ollama

app = Flask(__name__)
CORS(app)
app.secret_key = os.urandom(24)

init_db()

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/dashboard')
def dashboard():
    return render_template('dashboard.html')

@app.route('/chat')
def chat():
    return render_template('chat.html')

@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    if not username or not password:
        return jsonify({"message": "Username and password are required."}), 400
    
    if add_user(username, password):
        return jsonify({"message": "User registered successfully."}), 201
    else:
        return jsonify({"message": "Username already exists."}), 409

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    if check_user(username, password):
        # In a real app, you would use JWTs.
        # For now, we'll use a simple token.
        return jsonify({"message": "Login successful!", "access_token": f"{username}-token"}), 200
    else:
        return jsonify({"message": "Invalid credentials"}), 401

@app.route('/api/chat', methods=['POST'])
def api_chat():
    data = request.get_json()
    user_message = data.get('message')
    history = data.get('history', [])

    system_prompt = {
        "role": "system",
        "content": "You are Smart Health, a South African AI-powered mental health assistant designed to provide supportive and informative responses. Respond empathetically and professionally, offering general advice and encouraging users to seek professional help when needed."
    }

    messages = [system_prompt] + history + [{'role': 'user', 'content': user_message}]

    try:
        response = ollama.chat(
            model='mistral',
            messages=messages
        )
        return jsonify({"reply": response['message']['content']})
    except Exception as e:
        print(f"Error communicating with Ollama: {e}")
        return jsonify({"error": "Could not connect to the chat model. Is the Ollama server running?"}), 500

@app.route('/api/health-data', methods=['GET', 'POST'])
def api_health_data():
    auth_header = request.headers.get('Authorization')
    if not auth_header or not auth_header.startswith('Bearer '):
        return jsonify({"message": "Unauthorized"}), 401
    
    token = auth_header.split(' ')[1]
    # In a real app, you'd verify the JWT. Here we do a simple check.
    username = token.split('-token')[0]

    if request.method == 'POST':
        data = request.get_json()
        mood = data.get('mood')
        energy = data.get('energy')
        symptoms = data.get('symptoms')
        
        if add_health_data(username, mood, energy, symptoms):
            analysis = analyze_mood(username, mood, symptoms)
            return jsonify({"success": True, "message": "Health data added.", "analysis": analysis})
        else:
            return jsonify({"success": False, "message": "Failed to add health data."}), 500
            
    elif request.method == 'GET':
        history = get_health_data(username)
        return jsonify(history)

if __name__ == '__main__':
    app.run(debug=True, port=5000)