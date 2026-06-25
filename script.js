const form = document.querySelector("#estimate-form");
const status = document.querySelector("#form-status");
const revealItems = document.querySelectorAll(".reveal");

revealItems.forEach((item, index) => {
  item.style.setProperty("--reveal-delay", `${Math.min(index * 70, 420)}ms`);
});

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    {
      rootMargin: "0px 0px -12% 0px",
      threshold: 0.12,
    },
  );

  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const data = new FormData(form);
  const name = String(data.get("name") || "").trim().split(" ")[0] || "there";

  status.textContent = `Thanks, ${name}. This sample form is ready to connect to your lead system.`;
  form.reset();
});
