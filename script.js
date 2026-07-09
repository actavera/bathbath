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

const demoForm = document.querySelector("form[data-demo-form]");
const status = document.querySelector("#form-status");

if (demoForm && status) {
  demoForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const data = new FormData(demoForm);
    const name = String(data.get("name") || "").trim().split(" ")[0] || "there";

    status.textContent = `Thanks, ${name}. This sample form is ready to connect to your lead system.`;
    demoForm.reset();
  });
}
