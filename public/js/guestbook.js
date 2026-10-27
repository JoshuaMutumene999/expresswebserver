let currentUser = null;
// fetch('/api/guestbook/d28c149f-cf2b-44a8-b7bd-5ee873347eec', { method: 'DELETE' })
//     .then(r => console.log(r.status));

async function deleteEntry(id) {
    if (!confirm('Delete this message?')) return;
    const listError = document.querySelector('#list-error');

    try {
        const response = await fetch(`/api/guestbook/${encodeURIComponent(id)}`, {
            method: 'DELETE'
        });
        if (!response.ok) {
            const data = await response.json().catch(() => ({}));
            listError.textContent = data.error || 'Could not delete that message.';
            return;
        }
        loadMessages();
    } catch (err) {
        listError.textContent = 'Could not reach the server. Check your connection.';
    }
}

async function saveEdit(entry, newMsg) {
    const listError = document.querySelector('#list-error');

    try {
        const response = await fetch(`/api/guestbook/${encodeURIComponent(entry.id)}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: entry.name, msg: newMsg })
        });
        if (!response.ok) {
            const data = await response.json().catch(() => ({}));
            listError.textContent = data.error || 'Could not save your changes.';
            return;
        }
        loadMessages();
    } catch (err) {
        listError.textContent = 'Could not reach the server. Check your connection.';
    }
}

function startEdit(li, entry) {
    li.innerHTML = ''; // clearing with an empty string is safe

    const textarea = document.createElement('textarea');
    textarea.value = entry.msg; // .value is safe, like textContent
    textarea.maxLength = 280;

    const canEdit = entry.authorId === currentUser.userId || currentUser.role === 'admin';
    if (canEdit) {
        // ...your existing code that creates and appends the Edit and Delete buttons...
        const saveButton = document.createElement('button');
        saveButton.type = 'button';
        saveButton.textContent = 'Save';
        saveButton.addEventListener('click', () => saveEdit(entry, textarea.value));

        const cancelButton = document.createElement('button');
        cancelButton.type = 'button';
        cancelButton.textContent = 'Cancel';
        cancelButton.addEventListener('click', loadMessages);
    }

    li.append(textarea, saveButton, cancelButton);
    textarea.focus();
}

async function loadMessages() {
    const listError = document.querySelector('#list-error');
    listError.textContent = '';
    try {

        const response = await fetch('/api/guestbook');
        const entries = await response.json().catch(() => ({}));

        if (!currentUser) {
            currentUser = await (await fetch('/api/whoami')).json();
        }

        // document.querySelector('#guestbook-list').innerHTML = messages.map(msg => `<li>${msg}</li>`).join('');

        if (!response.ok) {
            // const errorMessage = data.error || 'Could not load messages.';
            // listError.textContent = errorMessage;
            // return;

            listError.textContent = data.error || 'Could not load messages.';
            return;
        }

        const list = document.querySelector('#guestbook-list');
        list.innerHTML = ''; // Clearing with an empty string is safe

        // Newest first: copy the array, then reverse the copy


        [...entries].reverse().forEach(entry => {
            const li = document.createElement('li');

            const name = document.createElement('strong');
            name.textContent = entry.name;

            const date = document.createElement('small');
            date.textContent = new Date(entry.createdAt).toLocaleString();

            const msg = document.createElement('p');
            msg.textContent = entry.msg;
            li.append(name, ' ', date, msg);

            if (entry.updatedAt) {
                const edited = document.createElement('small');
                edited.textContent = ' (edited)';
                li.append(edited);
            }

            const canEdit = entry.authorId === currentUser.userId || currentUser.role === 'admin';
            if (canEdit) {
                // ...your existing code that creates and appends the Edit and Delete buttons...
                const editButton = document.createElement('button');
                editButton.type = 'button';
                editButton.textContent = 'Edit';
                editButton.addEventListener('click', () => startEdit(li, entry));

                const deleteButton = document.createElement('button');
                deleteButton.type = 'button';
                deleteButton.textContent = 'Delete';
                deleteButton.addEventListener('click', () => deleteEntry(entry.id));

                li.append(editButton, deleteButton);


            }
            list.append(li);
        });

    } catch (err) {
        listError.textContent = 'Could not reach the server. Check your connection.';
    }
};

document.querySelector('#guestbook-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const errorBox = document.querySelector('#form-error');
    errorBox.textContent = '';
    try {
        const response = await fetch('/api/guestbook', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },

            body: JSON.stringify({ msg: document.querySelector('#msg').value, website: document.querySelector('#website').value })
        });

        if (!response.ok) {
            const data = await response.json().catch(() => ({}));
            errorBox.textContent = data.error || 'That says it is incorrect, please try again.';
            return; // keep what the user typed
        }
    } catch (err) {
        errorBox.textContent = 'Your server cannot be reached. Check your connection.';
        return;
    }

    e.target.reset();
    loadMessages();
});
loadMessages();