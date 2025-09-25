document.addEventListener('DOMContentLoaded', () => {
  const chatWindow = document.getElementById('chat-window');
  const chatInput = document.getElementById('chat-input');
  const sendBtn = document.getElementById('send-btn');
  const suggestions = document.querySelectorAll('.suggestion-card');

  function appendMessage(text, sender = 'user') {
    const msg = document.createElement('div');
    msg.className = `message ${sender}`;
    msg.textContent = text;
    chatWindow.appendChild(msg);
    chatWindow.scrollTop = chatWindow.scrollHeight;
  }

  function sendMessage() {
    const text = chatInput.value.trim();
    if (!text) return;

    appendMessage(text, 'user');
    chatInput.value = '';

    // Fake bot reply
    setTimeout(() => {
      appendMessage("I hear you. Let's talk more about that.", 'bot');
    }, 1000);
  }

  sendBtn.addEventListener('click', sendMessage);
  chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
  });

  // Suggestion cards insert text
  suggestions.forEach(card => {
    card.addEventListener('click', () => {
      chatInput.value = card.textContent;
      sendMessage();
    });
  });
});
