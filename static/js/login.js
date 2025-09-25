// js/login.js

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const feedbackMessage = document.getElementById('feedback-message');

    loginForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const username = usernameInput.value.trim();
        const password = passwordInput.value.trim();
        
        // Simple login check (replace with real auth later)
        if (username === 'user' && password === 'password') {
            handleLoginSuccess();
        } else {
            handleLoginFailure();
        }
    });

    function handleLoginSuccess() {
        feedbackMessage.textContent = 'Login successful! Redirecting...';
        feedbackMessage.className = 'success';
        feedbackMessage.style.display = 'block';

        setTimeout(() => {
            // Redirect to onboarding page instead of dashboard
            window.location.href = 'onboarding.html'; 
        }, 1000);
    }

    function handleLoginFailure() {
        feedbackMessage.textContent = 'Invalid username or password. Please try again.';
        feedbackMessage.className = 'error';
        feedbackMessage.style.display = 'block';
        passwordInput.value = '';
        usernameInput.focus();
    }
});
