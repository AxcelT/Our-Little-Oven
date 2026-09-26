const form = document.getElementById("login-form");

form.addEventListener("submit", (event) => {
  event.preventDefault();

  window.location.href = "dashboard.html";
});
