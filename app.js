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

// DOM Elements
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

function fadeSwitch(hideEl, showEl) {
  hideEl.classList.remove('fade-in');
  hideEl.style.display = 'none';
  showEl.style.display = 'block';
  showEl.classList.add('fade-in');
}

// Show signup form
showRegisterLink.addEventListener('click', () => {
  fadeSwitch(loginForm, registerForm);
  hideAllMessages();
});

// Show login form
showLoginLink.addEventListener('click', () => {
  fadeSwitch(registerForm, loginForm);
  hideAllMessages();
});

// Hide messages
function hideAllMessages() {
  [logoutSuccess, registerSuccess, loginError, registerError].forEach((el) => {
    if (el) el.style.display = 'none';
  });
}

// Login form
loginFormElement.addEventListener('submit', (e) => {
  e.preventDefault();

  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;
  const emailError = document.getElementById('email-error');
  const passwordError = document.getElementById('password-error');

  let isValid = true;

  if (email === '') {
    emailError.style.display = 'block';
    isValid = false;
  } else emailError.style.display = 'none';

  if (password === '') {
    passwordError.style.display = 'block';
    isValid = false;
  } else passwordError.style.display = 'none';

  if (isValid) {
    loginLoading.style.display = 'block';
    loginError.style.display = 'none';

    auth.signInWithEmailAndPassword(email, password)
      .then((userCredential) => {
        console.log("Login successful:", userCredential.user.email);
        window.open('dashboard.html', '_blank');
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

// Signup form
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

  if (username.length < 2) {
    usernameError.style.display = 'block';
    isValid = false;
  } else usernameError.style.display = 'none';

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    emailError.style.display = 'block';
    isValid = false;
  } else emailError.style.display = 'none';

  if (password.length < 6) {
    passwordError.style.display = 'block';
    isValid = false;
  } else passwordError.style.display = 'none';

  if (password !== confirmPassword) {
    confirmPasswordError.style.display = 'block';
    isValid = false;
  } else confirmPasswordError.style.display = 'none';

  if (isValid) {
    registerLoading.style.display = 'block';
    registerError.style.display = 'none';

    auth.createUserWithEmailAndPassword(email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        return user.updateProfile({ displayName: username }).then(() => {
          fadeSwitch(registerForm, loginForm);
          registerSuccess.style.display = 'block';
          registerFormElement.reset();
          registerLoading.style.display = 'none';
        });
      })
      .catch((error) => {
        registerLoading.style.display = 'none';
        registerError.style.display = 'block';
        if (error.code === 'auth/email-already-in-use') {
          registerError.textContent = 'This email is already in use.';
        } else {
          registerError.textContent = 'Error creating account. Please try again.';
        }
        console.error("Registration error:", error);
      });
  }
});
