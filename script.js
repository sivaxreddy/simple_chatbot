const chatMessages = document.querySelector('.chat-messages');
const messageInput = document.getElementById('message-input');
const sendButton = document.getElementById('send-button');

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

// Add initial message
addMessage("Hello! How can I assist you today?");
