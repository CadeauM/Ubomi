from flask import Blueprint, render_template

# This 'Blueprint' is just an organizational tool for Flask routes.
main_bp = Blueprint('main', __name__)

@main_bp.route('/')
def index():
    return render_template('index.html') # This now points to our landing page

@main_bp.route('/login')
def login_page():
    return render_template('login.html')

@main_bp.route('/signup')
def signup_page():
    return render_template('signup.html')

@main_bp.route('/dashboard')
def dashboard():
    return render_template('dashboard.html')

@main_bp.route('/chat')
def chat_page():
    return render_template('chatbot.html') # The file is named chatbot.html