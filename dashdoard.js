const firebaseConfig = {
    apiKey: "AIzaSyBzwrKqwuzEv4edoyEIIHG0403oeIpgumk",
    authDomain: "farooq-e8271.firebaseapp.com",
    projectId: "farooq-e8271",
    storageBucket: "farooq-e8271.firebasestorage.app",
    messagingSenderId: "191983447841",
    appId: "1:191983447841:web:6f2695a26e67f3f3551860"
  };

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

const dashboard = document.getElementById('dashboard');
const dashboardLoading = document.getElementById('dashboard-loading');
const userDisplay = document.getElementById('user-display');
const userEmail = document.getElementById('user-email');
const userAvatar = document.getElementById('user-avatar');
const logoutBtn = document.getElementById('logout-btn');

auth.onAuthStateChanged((user) => {
    if (user) {
        userDisplay.textContent = user.displayName || user.email;
        userEmail.textContent = user.email;
        userAvatar.textContent = (user.displayName ? user.displayName.charAt(0) : user.email.charAt(0)).toUpperCase();
        
        dashboardLoading.style.display = 'none';
        dashboard.style.display = 'block';
    } else {
        window.location.href = 'index.html'; 
    }
});

logoutBtn.addEventListener('click', () => {
    auth.signOut().then(() => {
        console.log("User logged out");
    }).catch((error) => {
        console.error("Logout error:", error);
    });
});