document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const feedbackMessage = document.getElementById('feedback-message');

    loginForm.addEventListener('submit', (event) => {
        event.preventDefault();
        
<<<<<<< HEAD
        // Simple login check (replace with real auth later)
        if (username === 'user' && password === 'password') {
            handleLoginSuccess();
        } else {
            handleLoginFailure();
=======
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });

            const data = await response.json();

            if (response.ok) {
                // Store token and username for other pages to use
                localStorage.setItem('accessToken', data.access_token);
                localStorage.setItem('username', username);
                handleLoginSuccess();
            } else {
                handleLoginFailure(data.message);
            }
        } catch (error) {
            handleLoginFailure('Could not connect to the server.');
>>>>>>> fb3a9c4d12b28133c9f7ea8ce46eead0b2ee9f63
        }
    });

    function handleLoginSuccess() {
        feedbackMessage.textContent = 'Login successful! Redirecting...';
        feedbackMessage.className = 'success';
        feedbackMessage.style.display = 'block';
<<<<<<< HEAD

        setTimeout(() => {
            // Redirect to onboarding page instead of dashboard
            window.location.href = 'onboarding.html'; 
        }, 1000);
    }

    function handleLoginFailure() {
        feedbackMessage.textContent = 'Invalid username or password. Please try again.';
=======
        setTimeout(() => { window.location.href = '/dashboard'; }, 1000);
    }

    function handleLoginFailure(message) {
        feedbackMessage.textContent = message;
>>>>>>> fb3a9c4d12b28133c9f7ea8ce46eead0b2ee9f63
        feedbackMessage.className = 'error';
        feedbackMessage.style.display = 'block';
        passwordInput.value = '';
        usernameInput.focus();
    }
});
