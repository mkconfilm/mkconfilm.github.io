(() => {
  const form = document.querySelector(".booking-form");

  if (!form) return;

  const button = form.querySelector('button[type="submit"]');

  if (!button) return;

  const errorMessage = document.createElement("p");

  errorMessage.className = "submission-error";
  errorMessage.setAttribute("role", "alert");
  errorMessage.hidden = true;

  button.before(errorMessage);

  let submitting = false;

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (submitting) return;

    if (!form.reportValidity()) return;

    submitting = true;
    errorMessage.hidden = true;
    errorMessage.textContent = "";

    const originalButtonContent = button.innerHTML;

    button.disabled = true;
    button.textContent = "Sending…";
    form.setAttribute("aria-busy", "true");

    let accepted = false;

    try {
      const response = await fetch(form.action, {
        method: "POST",
        body: new FormData(form),
        headers: {
          Accept: "application/json"
        }
      });

      if (!response.ok) {
        throw new Error("Submission was not accepted.");
      }

      accepted = true;

      window.location.assign("thank-you.html");
    } catch (error) {
      errorMessage.textContent =
        "We couldn’t confirm your inquiry was sent. " +
        "Please check your connection and try again. " +
        "Your details are still here.";

      errorMessage.hidden = false;
    } finally {
      if (!accepted) {
        submitting = false;
        button.disabled = false;
        button.innerHTML = originalButtonContent;
        form.removeAttribute("aria-busy");
      }
    }
  });
})();
