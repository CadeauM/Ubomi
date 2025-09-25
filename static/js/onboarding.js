document.addEventListener('DOMContentLoaded', () => {
  const onboardingForm = document.getElementById('onboarding-form');

  onboardingForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const language = document.getElementById('language').value;
    const connection = document.querySelector('input[name="connection"]:checked')?.value;

    if (!language || !connection) {
      alert("Please choose both language and connection type.");
      return;
    }

    // Save preferences in localStorage (for demo purposes)
    localStorage.setItem('userLanguage', language);
    localStorage.setItem('userConnection', connection);

    // Redirect to dashboard
    window.location.href = "dashboard.html";
  });
});
