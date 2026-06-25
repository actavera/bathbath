const form = document.querySelector("#estimate-form");
const status = document.querySelector("#form-status");

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const data = new FormData(form);
  const name = String(data.get("name") || "").trim().split(" ")[0] || "there";

  status.textContent = `Thanks, ${name}. This sample form is ready to connect to your lead system.`;
  form.reset();
});
