// ============ LOGIN ============
const LOGIN_USER = "admin";
const LOGIN_PASS = "1234";

const loginScreen = document.getElementById("login-screen");
const appScreen = document.getElementById("app-screen");
const loginForm = document.getElementById("login-form");
const loginError = document.getElementById("login-error");
const logoutBtn = document.getElementById("logout-btn");

function checkSession() {
  if (sessionStorage.getItem("loggedIn") === "true") {
    loginScreen.style.display = "none";
    appScreen.style.display = "block";
  }
}

loginForm.addEventListener("submit", function (e) {
  e.preventDefault();
  const user = document.getElementById("login-user").value.trim();
  const pass = document.getElementById("login-pass").value.trim();

  if (user === LOGIN_USER && pass === LOGIN_PASS) {
    sessionStorage.setItem("loggedIn", "true");
    loginError.textContent = "";
    loginScreen.style.display = "none";
    appScreen.style.display = "block";
  } else {
    loginError.textContent = "Usuario o contraseña incorrectos.";
  }
});

logoutBtn.addEventListener("click", function () {
  sessionStorage.removeItem("loggedIn");
  appScreen.style.display = "none";
  loginScreen.style.display = "flex";
  loginForm.reset();
});

checkSession();