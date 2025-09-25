import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from groq import Groq
from dotenv import load_dotenv

from models import db, bcrypt, User, HealthData  # Import our new models
from routes import main_bp

load_dotenv()

def create_app():
    app = Flask(__name__)
    CORS(app)

    # --- Database Configuration ---
    # This line reads the DATABASE_URL set on Render.
    app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL').replace("://", "ql://", 1)
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    db.init_app(app)
    bcrypt.init_app(app)

    # --- Register Blueprints ---
    app.register_blueprint(main_bp)

    # --- API Routes ---
    @app.route('/api/register', methods=['POST'])
    def api_register():
        data = request.get_json()
        username = data.get('username')
        password = data.get('password')

        if not username or not password:
            return jsonify({"message": "Username and password are required."}), 400

        existing_user = User.query.filter_by(username=username).first()
        if existing_user:
            return jsonify({"message": "Username already exists."}), 409

        new_user = User(username=username)
        new_user.password = password  # The setter in the model will hash it
        db.session.add(new_user)
        db.session.commit()

        return jsonify({"message": "User registered successfully."}), 201

    @app.route('/api/login', methods=['POST'])
    def api_login():
        data = request.get_json()
        username = data.get('username')
        password = data.get('password')

        user = User.query.filter_by(username=username).first()

        if user and user.check_password(password):
            return jsonify({"message": "Login successful!", "access_token": f"{username}-token"}), 200
        else:
            return jsonify({"message": "Invalid credentials"}), 401

    @app.route('/api/health-data', methods=['GET', 'POST'])
    def api_health_data():
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return jsonify({"message": "Unauthorized"}), 401
        
        token = auth_header.split(' ')[1]
        username = token.split('-token')[0]

        if request.method == 'POST':
            data = request.get_json()
            new_entry = HealthData(
                username=username,
                mood=data.get('mood'),
                energy=data.get('energy'),
                symptoms=data.get('symptoms')
            )
            db.session.add(new_entry)
            db.session.commit()
            return jsonify({"success": True, "message": "Health data added."})
            
        elif request.method == 'GET':
            history = HealthData.query.filter_by(username=username).order_by(HealthData.timestamp.desc()).all()
            # Convert SQLAlchemy objects to dictionaries
            history_list = [
                {
                    "timestamp": item.timestamp.isoformat(),
                    "mood": item.mood,
                    "energy": item.energy,
                    "symptoms": item.symptoms
                } for item in history
            ]
            return jsonify(history_list)

    @app.route('/api/chat', methods=['POST'])
    def api_chat():
        # This function remains the same
        data = request.get_json()
        user_message = data.get('message')
        history = data.get('history', [])
        client = Groq(api_key=os.environ.get("GROQ_API_KEY"))
        system_prompt = { "role": "system", "content": "You are Smart Health..." }
        messages = [system_prompt] + history + [{'role': 'user', 'content': user_message}]
        try:
            chat_completion = client.chat.completions.create(messages=messages, model="llama3-8b-8192")
            return jsonify({"reply": chat_completion.choices[0].message.content})
        except Exception as e:
            return jsonify({"error": "Could not connect to the chat API."}), 500

    return app

app = create_app()

@app.cli.command("db-create")
def db_create():
    db.create_all()
    print("Database tables created!")