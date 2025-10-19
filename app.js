const firebaseConfig = {
    apiKey: "AIzaSyBzwrKqwuzEv4edoyEIIHG0403oeIpgumk",
    authDomain: "farooq-e8271.firebaseapp.com",
    projectId: "farooq-e8271",
    storageBucket: "farooq-e8271.firebasestorage.app",
    messagingSenderId: "191983447841",
    appId: "1:191983447841:web:6f2695a26e67f3f3551860"
  };

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

// DOM Elements for THIS page
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const loginFormElement = document.getElementById('loginForm');
const registerFormElement = document.getElementById('registerForm');
const showRegisterLink = document.getElementById('show-register');
const showLoginLink = document.getElementById('show-login');
const logoutSuccess = document.getElementById('logout-success');
const registerSuccess = document.getElementById('register-success');
const loginError = document.getElementById('login-error');
const registerError = document.getElementById('register-error');
const loginLoading = document.getElementById('login-loading');
const registerLoading = document.getElementById('register-loading');

// Show register form
showRegisterLink.addEventListener('click', () => {
    loginForm.style.display = 'none';
    registerForm.style.display = 'block';
    hideAllMessages();
});

// Show login form
showLoginLink.addEventListener('click', () => {
    registerForm.style.display = 'none';
    loginForm.style.display = 'block';
    hideAllMessages();
});

// Hide all global messages
function hideAllMessages() {
    if (logoutSuccess) logoutSuccess.style.display = 'none';
    if (registerSuccess) registerSuccess.style.display = 'none';
    if (loginError) loginError.style.display = 'none';
    if (registerError) registerError.style.display = 'none';
}

// Login form validation and submission
loginFormElement.addEventListener('submit', (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const emailError = document.getElementById('email-error');
    const passwordError = document.getElementById('password-error');

    let isValid = true;

    // Validate email
    if (email === '') {
        emailError.style.display = 'block';
        isValid = false;
    } else {
        emailError.style.display = 'none';
    }

    // Validate password
    if (password === '') {
        passwordError.style.display = 'block';
        isValid = false;
    } else {
        passwordError.style.display = 'none';
    }

    if (isValid) {
        loginLoading.style.display = 'block';
        loginError.style.display = 'none';

        // Firebase login
        auth.signInWithEmailAndPassword(email, password)
            .then((userCredential) => {
                // Signed in
                console.log("Login successful:", userCredential.user.email);

                // --- THIS IS THE CHANGE ---
                // Open dashboard.html in a new tab
                window.open('dashboard.html', '_blank');
                // -------------------------

                loginLoading.style.display = 'none';
                loginFormElement.reset();
            })
            .catch((error) => {
                loginLoading.style.display = 'none';
                loginError.style.display = 'block';
                console.error("Login error:", error);
            });
    }
});

// Register form validation and submission
registerFormElement.addEventListener('submit', (e) => {
    e.preventDefault();

    const username = document.getElementById('reg-username').value.trim();
    const email = document.getElementById('reg-email').value.trim();
    const password = document.getElementById('reg-password').value;
    const confirmPassword = document.getElementById('reg-confirm-password').value;

    const usernameError = document.getElementById('reg-username-error');
    const emailError = document.getElementById('reg-email-error');
    const passwordError = document.getElementById('reg-password-error');
    const confirmPasswordError = document.getElementById('reg-confirm-password-error');

    let isValid = true;

    // Validate username
    if (username.length < 2) {
        usernameError.style.display = 'block';
        isValid = false;
    } else {
        usernameError.style.display = 'none';
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        emailError.style.display = 'block';
        isValid = false;
    } else {
        emailError.style.display = 'none';
    }

    // Validate password
    if (password.length < 6) {
        passwordError.style.display = 'block';
        isValid = false;
    } else {
        passwordError.style.display = 'none';
    }

    // Validate confirm password
    if (password !== confirmPassword) {
        confirmPasswordError.style.display = 'block';
        isValid = false;
    } else {
        confirmPasswordError.style.display = 'none';
    }

    if (isValid) {
        registerLoading.style.display = 'block';
        registerError.style.display = 'none';

        // Firebase registration
        auth.createUserWithEmailAndPassword(email, password)
            .then((userCredential) => {
                const user = userCredential.user;

                // Update user profile with display name
                return user.updateProfile({
                    displayName: username
                }).then(() => {
                    // Show success message and switch to login form
                    registerForm.style.display = 'none';
                    loginForm.style.display = 'block';
                    registerSuccess.style.display = 'block';
                    registerFormElement.reset();
                    registerLoading.style.display = 'none';
                });
            })
            .catch((error) => {
                registerLoading.style.display = 'none';
                registerError.style.display = 'block';
                // Handle specific errors
                if (error.code === 'auth/email-already-in-use') {
                    registerError.textContent = 'This email is already in use.';
                } else {
                    registerError.textContent = 'Error creating account. Please try again.';
                }
                console.error("Registration error:", error);
            });
    }
})