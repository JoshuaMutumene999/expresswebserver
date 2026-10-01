async function loadMessages() {
    const response = await fetch('/api/guestbook');
    const messages = await response.json();
    // document.querySelector('#guestbook-list').innerHTML = messages.map(msg => `<li>${msg}</li>`).join('');

    const list = document.querySelector('#guestbook-list');
    list.innerHTML = ''; // Clearing with an empty string is safe

    [...messages].reverse().forEach(message => {
        const li = document.createElement('li');
        const msg = document.createElement('p');
        msg.textContent = message; // Stops the hack
        li.appendChild(msg);
        list.appendChild(li);
    });
}

document.querySelector('#guestbook-form').addEventListener('submit', async (event) => {
    event.preventDefault();
    await fetch('/api/guestbook', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ msg: event.target.msg.value })
    });
    event.target.reset();
    loadMessages();
});
loadMessages();