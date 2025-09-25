document.addEventListener('DOMContentLoaded', () => {
    const signupForm = document.getElementById('signup-form');
    const feedbackMessage = document.getElementById('feedback-message');
    const passwordInput = document.getElementById('password');
    const requirements = {
        length: document.getElementById('req-length'),
        lowercase: document.getElementById('req-lowercase'),
        uppercase: document.getElementById('req-uppercase'),
        number: document.getElementById('req-number'),
        special: document.getElementById('req-special'),
    };

    passwordInput.addEventListener('input', () => {
        const value = passwordInput.value;
        // Check length
        requirements.length.classList.toggle('valid', value.length >= 8);
        // Check for lowercase letter
        requirements.lowercase.classList.toggle('valid', /[a-z]/.test(value));
        // Check for uppercase letter
        requirements.uppercase.classList.toggle('valid', /[A-Z]/.test(value));
        // Check for number
        requirements.number.classList.toggle('valid', /[0-9]/.test(value));
        // Check for special character
        requirements.special.classList.toggle('valid', /[!@#$]/.test(value));
    });

    signupForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        
        const email = document.getElementById('email').value; // Get email value
        const username = document.getElementById('username').value;
        const password = passwordInput.value;
        const confirmPassword = document.getElementById('confirm-password').value;

        const isLengthValid = password.length >= 8;
        const isLowercaseValid = /[a-z]/.test(password);
        const isUppercaseValid = /[A-Z]/.test(password);
        const isNumberValid = /[0-9]/.test(password);
        const isSpecialValid = /[!@#$]/.test(password);
        
        if (!isLengthValid || !isLowercaseValid || !isUppercaseValid || !isNumberValid || !isSpecialValid) {
            showFeedback('Password does not meet all requirements.', 'error');
            return;
        }

        if (password !== confirmPassword) {
            showFeedback('Passwords do not match.', 'error');
            return;
        }

        try {
            const response = await fetch('/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, email, password }) 
            });

            const data = await response.json();

            if (response.ok) {
                showFeedback('Registration successful! Please log in.', 'success');
                setTimeout(() => {
                    window.location.href = '/login';
                }, 2000);
            } else {
                showFeedback(data.message, 'error');
            }
        } catch (error) {
            showFeedback('Could not connect to the server.', 'error');
        }
    });

    function showFeedback(message, type) {
        feedbackMessage.textContent = message;
        feedbackMessage.className = type;
        feedbackMessage.style.display = 'block';
    }
});