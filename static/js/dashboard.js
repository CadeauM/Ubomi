document.addEventListener('DOMContentLoaded', async () => {
   
    const username = localStorage.getItem('username');
    const token = localStorage.getItem('accessToken');

    if (!username || !token) {
        window.location.href = '/login';
        return;
    }

    const usernameDisplay = document.getElementById('username-display');
    const emailDisplay = document.getElementById('email-display');
    const moodForm = document.getElementById('mood-form');
    const energySlider = document.getElementById('energy-slider');
    const energyValue = document.getElementById('energy-value');
    const analysisMessage = document.getElementById('analysis-message');
    const moodCounters = {
        Happy: document.getElementById('happy-count'),
        Neutral: document.getElementById('neutral-count'),
        Sad: document.getElementById('sad-count'),
        Anxious: document.getElementById('anxious-count'),
        Stressed: document.getElementById('stressed-count'),
    };
    
    async function loadUserProfile() {
        try {
            const response = await fetch('/api/profile', {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!response.ok) {
                localStorage.clear();
                window.location.href = '/login';
                return;
            }

            const data = await response.json();
            usernameDisplay.textContent = data.username;
            emailDisplay.textContent = data.email;

        } catch (error) {
            console.error('Failed to load profile:', error);
            usernameDisplay.textContent = "User";
            emailDisplay.textContent = "N/A";
        }
    }

    async function loadHealthData() {
        try {
            const response = await fetch('/api/health-data', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) return;

            const data = await response.json();
            
            Object.values(moodCounters).forEach(counter => counter.textContent = '0');

            data.forEach(item => {
                if (moodCounters[item.mood]) {
                    moodCounters[item.mood].textContent = parseInt(moodCounters[item.mood].textContent) + 1;
                }
            });
        } catch (error) {
            console.error('Failed to load health data:', error);
        }
    }

    moodForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const mood = document.getElementById('mood-select').value;
        const energy = energySlider.value;
        const symptoms = document.getElementById('symptoms-text').value;

        try {
            const response = await fetch('/api/health-data', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ mood, energy, symptoms })
            });

            if (response.ok) {
                analysisMessage.textContent = `Your check-in has been saved successfully!`;
                await loadHealthData(); 
                moodForm.reset();
                energySlider.value = 5;
                energyValue.textContent = 5;
            } else {
                analysisMessage.textContent = `Failed to save your check-in.`;
            }
        } catch (error) {
            analysisMessage.textContent = 'Error connecting to the server.';
        }
    });
    
    energySlider.addEventListener('input', () => {
        energyValue.textContent = energySlider.value;
    });


    await loadUserProfile();
    await loadHealthData();
});