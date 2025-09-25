// js/login.js

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const feedbackMessage = document.getElementById('feedback-message');

    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const username = usernameInput.value.trim();
        const password = passwordInput.value.trim();
        
        if (username && password) { 
            handleLoginSuccess();
        } else {
            handleLoginFailure("Please enter a username and password.");
        }
    });

    function handleLoginSuccess() {
        feedbackMessage.textContent = 'Login successful! Redirecting...';
        feedbackMessage.className = 'success';
        feedbackMessage.style.display = 'block';

        // Storing username for the dashboard to use
        localStorage.setItem('username', usernameInput.value.trim());

        setTimeout(() => {
            window.location.href = '/dashboard'; 
        }, 1000);
    }

    function handleLoginFailure(message) {
        feedbackMessage.textContent = message || 'Invalid username or password.';
        feedbackMessage.className = 'error';
        feedbackMessage.style.display = 'block';
    }
});