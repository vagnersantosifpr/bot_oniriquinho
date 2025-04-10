const messageInput = document.getElementById('message-input');
const sendButton = document.getElementById('send-button');
const chatBody = document.getElementById('chat-body');

sendButton.addEventListener('click', sendMessage);

async function sendMessage() {
    const messageText = messageInput.value;
    if (messageText.trim() !== '') {
        addMessage('user', messageText);

        try {
            const response = await fetch('http://localhost:3000/api/chat', {  // Adapte a porta se necessário
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ message: messageText })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            addMessage('bot', `Oniriquinho: ${data.response}`);

        } catch (error) {
            console.error("Erro ao obter resposta do servidor:", error);
            addMessage('bot', "Oniriquinho: Desculpe, não consegui entender.");
        }

        messageInput.value = '';
    }
}

function addMessage(sender, messageText) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message');
    messageDiv.classList.add(`${sender}-message`);
    messageDiv.textContent = messageText;
    chatBody.appendChild(messageDiv);
    chatBody.scrollTop = chatBody.scrollHeight;
}