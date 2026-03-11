// Eldtree Waitlist — Google Apps Script integration
const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxwRdQMDenquqgtfrwNIubne55ROdA2loXlvTjvxQIgCEaTgVDUIbdDvi1-CWMAQ3G57w/exec";

const form = document.getElementById("waitlist-form");
const emailInput = document.getElementById("email");
const honeypot = document.getElementById("website");
const submitBtn = document.getElementById("submit-btn");
const btnText = submitBtn.querySelector(".btn-text");
const btnLoading = submitBtn.querySelector(".btn-loading");
const messageEl = document.getElementById("form-message");

// Simple rate limit: one submission per 30 seconds
let lastSubmit = 0;

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  // Honeypot check — if filled, it's a bot
  if (honeypot.value) return;

  const now = Date.now();
  if (now - lastSubmit < 30000) {
    showMessage("Please wait a moment before trying again.", "error");
    return;
  }

  const email = emailInput.value.trim();
  if (!email) return;

  submitBtn.disabled = true;
  btnText.hidden = true;
  btnLoading.hidden = false;
  messageEl.hidden = true;

  try {
    await fetch(APPS_SCRIPT_URL, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ email }),
    });

    lastSubmit = Date.now();
    showMessage("You're on the list. We'll be in touch.", "success");
    emailInput.value = "";
  } catch (err) {
    showMessage("Something went wrong. Try again.", "error");
  } finally {
    submitBtn.disabled = false;
    btnText.hidden = false;
    btnLoading.hidden = true;
  }
});

function showMessage(text, type) {
  messageEl.textContent = text;
  messageEl.className = "form-message " + type;
  messageEl.hidden = false;
}
