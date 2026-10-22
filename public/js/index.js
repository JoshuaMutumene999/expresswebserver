const loginForm = document.querySelector('#login-form');
const loginMessage = document.querySelector('#login-message');

const status = document.querySelector('#status');
const loginSection = document.querySelector('#login-section');
const logoutButton = document.querySelector('#logout-button');

const username = document.querySelector('#username').value;

async function checkAuthState() {
    try {
        const response = await fetch('/api/whoami');
        const data = await response.json();

        if (data.loggedIn) {
            // status.innerHTML = '<h2>Would you like to see your?</h2>';
            // loginSection.hidden = true;
            // logoutButton.hidden = false;

            status.textContent = '';
            const heading = document.createElement('h1');
            heading.textContent = `Welcome back, ${data.username}!`;
            status.append(heading);
        } else {
            status.innerHTML = '<h1>Hello, hi!</h1>';
            loginSection.hidden = false;
            logoutButton.hidden = true;
        }
    } catch (error) {
        status.innerHTML = '<h1>Hello, hi!</h1>';
        loginSection.hidden = false;
        logoutButton.hidden = true;
    }
}

loginForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const password = document.querySelector('#password').value;
    const rememberMe = event.target.rememberMe.checked;

    const response = await fetch(loginForm.action, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, rememberMe })
    });

    const data = await response.json().catch(() => ({ success: false }));

    if (data.success) {
        loginMessage.textContent = 'Login successful!';
        loginForm.reset();
        await checkAuthState();
        window.location.href = data.redirect || '/';
    } else {
        loginMessage.textContent = data.error || 'Login failed. Please check your password.';
    }
});

logoutButton.addEventListener('click', async () => {
    const response = await fetch('/logout', {
        method: 'POST'
    });

    const data = await response.json().catch(() => ({ success: false }));
    if (data.success) {
        window.location.href = '/';
    }
});
checkAuthState();
