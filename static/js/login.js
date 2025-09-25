document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const feedbackMessage = document.getElementById('feedback-message');

    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        
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
        }
    });

    function handleLoginSuccess() {
        feedbackMessage.textContent = 'Login successful! Redirecting...';
        feedbackMessage.className = 'success';
        feedbackMessage.style.display = 'block';
        setTimeout(() => { window.location.href = '/dashboard'; }, 1000);
    }

    function handleLoginFailure(message) {
        feedbackMessage.textContent = message;
        feedbackMessage.className = 'error';
        feedbackMessage.style.display = 'block';
    }
});