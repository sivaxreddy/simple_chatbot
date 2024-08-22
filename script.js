// Get the chat messages container
const chatMessages = document.querySelector('.chat-messages');
const messageInput = document.getElementById('message-input');
const sendButton = document.getElementById('send-button');
const darkModeToggle = document.getElementById('dark-mode');
const html = document.documentElement;

// Function to add a message to the chat
function addMessage(message, isUser = false) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', isUser ? 'user-message' : 'bot-message');
    messageElement.innerHTML = `<div class="message-content">${message}</div>`;
    chatMessages.appendChild(messageElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Function to send a message to the server and get a response
async function sendMessage() {
    const message = messageInput.value.trim();

    if (message) {
        addMessage(message, true);
        messageInput.value = '';

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ message })
            });

            if (response.ok) {
                const data = await response.json();
                addMessage(data.response);
            } else {
                throw new Error('Error fetching bot response');
            }
        } catch (error) {
            console.error('Error:', error);
            addMessage('An error occurred while fetching the bot response.');
        }
    }
}

// Event listeners
sendButton.addEventListener('click', sendMessage);
messageInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        sendMessage();
    }
});

// Dark mode toggle functionality
function updateTheme(isDark) {
    html.setAttribute('data-theme', isDark ? 'dark' : 'light');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    updateDarkModeIcon(isDark);
}

function updateDarkModeIcon(isDark) {
    const sunIcon = darkModeToggle.nextElementSibling.querySelector('.fa-sun');
    const moonIcon = darkModeToggle.nextElementSibling.querySelector('.fa-moon');
    sunIcon.style.display = isDark ? 'inline-block' : 'none';
    moonIcon.style.display = isDark ? 'none' : 'inline-block';
}

// Check for saved theme preference or default to user's system preference
const prefersDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
const savedTheme = localStorage.getItem('theme');

const initialTheme = savedTheme === 'dark' || (!savedTheme && prefersDarkMode);
updateTheme(initialTheme);
darkModeToggle.checked = initialTheme;

darkModeToggle.addEventListener('change', () => {
    updateTheme(darkModeToggle.checked);
});

// Add initial message
addMessage("Hello! How can I assist you today?");