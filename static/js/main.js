document.addEventListener('DOMContentLoaded', () => {
    const API_URL = 'http://127.0.0.1:5000';
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');

    // If on login page, handle auth forms
    if (document.getElementById('auth-view')) {
        handleAuthPage();
    }

    // If on a page with a logout button, user is logged in
    if (document.getElementById('logout-button')) {
        if (!token || !username) {
            window.location.href = '/'; // Redirect to login if not authenticated
            return;
        }
        
        document.getElementById('logout-button').addEventListener('click', logout);
        
        // Dispatch based on the current page
        if (window.location.pathname.includes('/dashboard')) {
            handleDashboardPage();
        } else if (window.location.pathname.includes('/chat')) {
            handleChatPage();
        }
    }
});

function handleAuthPage() {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const authMessage = document.getElementById('auth-message');
    const showRegister = document.getElementById('show-register');
    const showLogin = document.getElementById('show-login');
    const loginFormContainer = document.getElementById('login-form-container');
    const registerFormContainer = document.getElementById('register-form-container');

    showRegister.addEventListener('click', (e) => {
        e.preventDefault();
        loginFormContainer.style.display = 'none';
        registerFormContainer.style.display = 'block';
    });

    showLogin.addEventListener('click', (e) => {
        e.preventDefault();
        registerFormContainer.style.display = 'none';
        loginFormContainer.style.display = 'block';
    });

    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('register-username').value;
        const password = document.getElementById('register-password').value;

        const response = await fetch(`/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
        });

        const data = await response.json();
        authMessage.textContent = data.message;
        if (response.ok) {
            registerForm.reset();
            setTimeout(() => {
                showLogin.click();
                authMessage.textContent = '';
            }, 2000);
        }
    });

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('login-username').value;
        const password = document.getElementById('login-password').value;

        const response = await fetch(`/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
        });

        const data = await response.json();
        if (response.ok) {
            localStorage.setItem('token', data.access_token);
            localStorage.setItem('username', username);
            window.location.href = '/dashboard';
        } else {
            authMessage.textContent = data.message;
        }
    });
}

function handleDashboardPage() {
    const username = localStorage.getItem('username');
    document.getElementById('username-display').textContent = username;
    const moodForm = document.getElementById('mood-form');
    const analysisContainer = document.getElementById('analysis-container');
    
    fetchHealthHistory();

    moodForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        const mood = document.getElementById('mood-select').value;
        const energy = document.getElementById('energy-slider').value;
        const symptoms = document.getElementById('symptoms-text').value;

        const response = await fetch(`/api/health-data`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ mood, energy, symptoms }),
        });

 const data = await response.json();
        if (response.ok && data.analysis) {
            let suggestionsHTML = '<p>No specific suggestions at this time.</p>';
            if (data.analysis.suggestions && data.analysis.suggestions.length > 0) {
                suggestionsHTML = '<ul>' + data.analysis.suggestions.map((s, index) => {
                    if (index === 0) {
                        return `<a href="chat"><li>${s.text}</li></a>`;
                    }
                    return `<li>${s.text}</li>`;
                }).join('') + '</ul>';
            }            

            analysisContainer.innerHTML = `
                <p><strong>Analysis:</strong> ${data.analysis.message || ''}</p>
                <p>${data.analysis.comparative_message || ''}</p>
                <div><strong>Suggestions:</strong></div>
                ${suggestionsHTML}
            `;
        } else {
            analysisContainer.innerHTML = `<p class="message">Could not retrieve analysis.</p>`;
        }

        moodForm.reset();
        await fetchHealthHistory();
    });
}

function handleChatPage() {
    const chatForm = document.getElementById('chat-form');
    const chatInput = document.getElementById('chat-input');
    const chatMessages = document.getElementById('chat-messages');
    let chatHistory = []; // Maintain history in a variable

    chatForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const message = chatInput.value;
        if (!message) return;

        appendMessage(message, 'user');
        chatHistory.push({ role: 'user', content: message });
        chatInput.value = '';

        const response = await fetch(`/api/chat`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: message, history: chatHistory }),
        });

        const data = await response.json();
        appendMessage(data.reply, 'bot');
        chatHistory.push({ role: 'assistant', content: data.reply });
    });

    function appendMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', `${sender}-message`);
        messageDiv.textContent = text;
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
}

async function fetchHealthHistory() {
    const token = localStorage.getItem('token');
    const historyTableBody = document.querySelector('#history-table tbody');
    if (!historyTableBody) return;

    const response = await fetch(`/api/health-data`, {
        headers: { 'Authorization': `Bearer ${token}` },
    });

    if (response.ok) {
        const data = await response.json();
        historyTableBody.innerHTML = '';
        data.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${new Date(item.timestamp).toLocaleString()}</td>
                <td>${item.mood}</td>
                <td>${item.energy}</td>
                <td>${item.symptoms}</td>
            `;
            historyTableBody.appendChild(row);
        });
    }
}

function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    window.location.href = '/';
}