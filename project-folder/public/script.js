const registerForm = document.getElementById('register-form');
const loginForm = document.getElementById('login-form');
const messageArea = document.getElementById('message-area');

function toggleForms() {
    registerForm.classList.toggle('hidden');
    loginForm.classList.toggle('hidden');
    messageArea.textContent = ''; // Hapus pesan saat ganti form
}

// Validasi Password
function isPasswordValid(password) {
    const hasMinLength = password.length >= 9;
    const hasUpperCase = /[A-Z]/.test(password);
    return hasMinLength && hasUpperCase;
}

// Handle Pendaftaran
async function handleRegister(event) {
    event.preventDefault();
    const username = document.getElementById('reg-username').value;
    const email = document.getElementById('reg-email').value;
    const nomor = document.getElementById('reg-nomor').value;
    const password = document.getElementById('reg-password').value;
    const passwordConfirm = document.getElementById('reg-password-confirm').value;

    messageArea.textContent = '';

    if (password !== passwordConfirm) {
        messageArea.textContent = 'Konfirmasi password tidak cocok!';
        messageArea.className = 'error';
        return;
    }

    if (!isPasswordValid(password)) {
        messageArea.textContent = 'Password tidak memenuhi syarat.';
        messageArea.className = 'error';
        return;
    }

    try {
        const response = await fetch('/api/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, nomor, password }),
        });

        const result = await response.json();

        if (response.ok) {
            messageArea.textContent = result.message;
            messageArea.className = 'success';
            // Reset form setelah berhasil
            event.target.reset(); 
            setTimeout(toggleForms, 2000); // Pindah ke form login setelah 2 detik
        } else {
            messageArea.textContent = result.message;
            messageArea.className = 'error';
        }
    } catch (error) {
        messageArea.textContent = 'Terjadi kesalahan. Coba lagi.';
        messageArea.className = 'error';
    }
}

// Handle Login
async function handleLogin(event) {
    event.preventDefault();
    const identifier = document.getElementById('login-identifier').value;
    const password = document.getElementById('login-password').value;
    
    messageArea.textContent = '';

    try {
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ identifier, password }),
        });

        const result = await response.json();

        if (response.ok) {
            // Jika login berhasil, redirect atau tampilkan pesan
            document.querySelector('.container').innerHTML = `<h1>Selamat Datang, ${result.username}!</h1><p>Login berhasil.</p>`;
        } else {
            messageArea.textContent = result.message;
            messageArea.className = 'error';
        }
    } catch (error) {
        messageArea.textContent = 'Terjadi kesalahan. Coba lagi.';
        messageArea.className = 'error';
    }
}
