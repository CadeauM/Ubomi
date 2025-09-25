document.addEventListener('DOMContentLoaded', () => {
  const moodForm = document.getElementById('mood-form');
  const energySlider = document.getElementById('energy-slider');
  const energyValue = document.getElementById('energy-value');
  const analysisMessage = document.getElementById('analysis-message');

  // Update energy display dynamically
  energySlider.addEventListener('input', () => {
    energyValue.textContent = energySlider.value;
  });

  // Mood counters
  const moodCounters = {
    Happy: document.getElementById('happy-count'),
    Neutral: document.getElementById('neutral-count'),
    Sad: document.getElementById('sad-count'),
    Anxious: document.getElementById('anxious-count'),
    Stressed: document.getElementById('stressed-count'),
  };

  const moodData = { Happy: 0, Neutral: 0, Sad: 0, Anxious: 0, Stressed: 0 };

  // Handle form submit
  moodForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const mood = document.getElementById('mood-select').value;
    const energy = energySlider.value;
    const notes = document.getElementById('symptoms-text').value;

    // Update analysis
    analysisMessage.textContent = `You feel ${mood} with an energy level of ${energy}. Notes: ${notes || "None"}`;

    // Update counters
    moodData[mood]++;
    moodCounters[mood].textContent = moodData[mood];

    // Reset form
    moodForm.reset();
    energySlider.value = 5;
    energyValue.textContent = 5;
  });
});
