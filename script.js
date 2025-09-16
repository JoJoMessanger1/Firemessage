// Initialisiere Pusher
const pusher = new Pusher(PUSHER_APP_KEY, {
    cluster: PUSHER_CLUSTER
});

// Referenzen zu HTML-Elementen
const chatMessages = document.getElementById('chat-messages');
const messageInput = document.getElementById('message-input');
const sendButton = document.getElementById('send-button');

// Dummy-Benutzername für den Anfang
const username = "Nutzer" + Math.floor(Math.random() * 100);

// Abonniere den "Chat"-Kanal
const channel = pusher.subscribe('chat-channel');

// Listener für eingehende Nachrichten auf dem Kanal
channel.bind('new-message', function(data) {
    displayMessage(data);
});

// Funktion zum Senden einer Nachricht
function sendMessage() {
    const messageText = messageInput.value.trim();
    if (messageText) {
        // Sende die Nachricht über eine einfache HTTP-Anfrage an die Pusher Debug-API
        fetch(`https://${PUSHER_CLUSTER}.pusher.com/apps/${PUSHER_APP_KEY}/events`, {
            method: 'POST',
            body: JSON.stringify({
                name: 'new-message',
                channels: ['chat-channel'],
                data: JSON.stringify({
                    sender: username,
                    text: messageText
                })
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(() => {
            messageInput.value = '';
        })
        .catch((error) => {
            console.error("Fehler beim Senden der Nachricht:", error);
        });
    }
}

// Funktion zum Anzeigen einer Nachricht
function displayMessage(message) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message');
    const senderSpan = document.createElement('span');
    senderSpan.classList.add('sender');
    senderSpan.textContent = message.sender + ": ";
    const textNode = document.createTextNode(message.text);
    messageElement.appendChild(senderSpan);
    messageElement.appendChild(textNode);
    chatMessages.appendChild(messageElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Event-Listener für das Senden von Nachrichten
sendButton.addEventListener('click', sendMessage);
messageInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        sendMessage();
    }
});
