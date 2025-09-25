document.addEventListener('DOMContentLoaded', () => {
    const signupForm = document.getElementById('signup-form');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirm-password');
    const feedbackMessage = document.getElementById('feedback-message');

    const reqLength = document.getElementById('req-length');
    const reqLowercase = document.getElementById('req-lowercase');
    const reqUppercase = document.getElementById('req-uppercase');
    const reqNumber = document.getElementById('req-number');
    const reqSpecial = document.getElementById('req-special');

    passwordInput.addEventListener('input', () => {
        validatePassword(passwordInput.value);
    });

    signupForm.addEventListener('submit', (event) => {
        event.preventDefault(); 

        const username = usernameInput.value.trim();
        const password = passwordInput.value.trim();
        const confirmPassword = confirmPasswordInput.value.trim();

        
        if (!username || !password || !confirmPassword) {
            handleSignupFailure('Please fill out all fields.');
            return;
        }

        if (password !== confirmPassword) {
            handleSignupFailure('Passwords do not match. Please try again.');
            return;
        }

        if (!validatePassword(password)) {
            handleSignupFailure('Your password does not meet all the security requirements.');
            return;
        }
        handleSignupSuccess();
    });

    /**
     * Checks a password against all security rules and updates the UI checklist.
     * @param {string} password
     * @returns {boolean}
     */
    function validatePassword(password) {
        let allRequirementsMet = true;

        if (password.length >= 8) {
            reqLength.classList.add('valid');
        } else {
            reqLength.classList.remove('valid');
            allRequirementsMet = false;
        }
        if (/[a-z]/.test(password)) {
            reqLowercase.classList.add('valid');
        } else {
            reqLowercase.classList.remove('valid');
            allRequirementsMet = false;
        }

        if (/[A-Z]/.test(password)) {
            reqUppercase.classList.add('valid');
        } else {
            reqUppercase.classList.remove('valid');
            allRequirementsMet = false;
        }
        if (/[0-9]/.test(password)) {
            reqNumber.classList.add('valid');
        } else {
            reqNumber.classList.remove('valid');
            allRequirementsMet = false;
        }
        
        if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
            reqSpecial.classList.add('valid');
        } else {
            reqSpecial.classList.remove('valid');
            allRequirementsMet = false;
        }

        return allRequirementsMet;
    }
    
    function handleSignupSuccess() {
        feedbackMessage.textContent = 'Account created successfully! Redirecting to login...';
        feedbackMessage.className = 'success';
        setTimeout(() => {
            window.location.href = 'login.html'; 
        }, 2000); 
    }

    function handleSignupFailure(message) {
        feedbackMessage.textContent = message;
        feedbackMessage.className = 'error';
    }
});