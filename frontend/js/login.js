const form = document.getElementById("login-form");
const error = document.getElementById("login-error");

/* Already signed in: skip the login page. */
fetch("/api/me").then((res) => {
  if (res.ok) window.location.href = "dashboard.html";
});

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  error.hidden = true;

  let res = null;
  try {
    res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: document.getElementById("name").value,
        password: document.getElementById("password").value
      })
    });
  } catch {
    /* Server unreachable: falls through to the "not answering" message. */
  }

  if (res && res.ok) {
    window.location.href = "dashboard.html";
    return;
  }
  if (res && res.status === 401) {
    error.textContent = "That's not the right name or password.";
  } else if (res && res.status === 429) {
    error.textContent = "Too many tries. Wait a bit and try again.";
  } else {
    error.textContent = "The oven isn't answering. Try again in a bit.";
  }
  error.hidden = false;
});
