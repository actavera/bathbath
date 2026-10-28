const revealItems = document.querySelectorAll(".reveal");

const analyticsConfig = {
  host: "https://crm.bluerhinobath.com/umami",
  websiteId: "4837c197-c70f-4e8d-8cb7-84adceab78c2",
};

function trackAnalyticsEvent(name, data = {}) {
  if (window.umami?.track) window.umami.track(name, data);
}

function initializeAnalytics() {
  document.querySelectorAll('a[href^="tel:"]').forEach((link) => {
    link.addEventListener("click", () => trackAnalyticsEvent("phone_click", { page: location.pathname }));
  });

  document.querySelectorAll('a[href="#estimate"], a[href$="#estimate"]').forEach((link) => {
    link.addEventListener("click", () => trackAnalyticsEvent("estimate_click", { page: location.pathname }));
  });

  document.querySelectorAll("form.estimate-form").forEach((form) => {
    let started = false;
    form.addEventListener("focusin", () => {
      if (started) return;
      started = true;
      trackAnalyticsEvent("form_start", { page: location.pathname });
    });
    form.addEventListener("submit", () => trackAnalyticsEvent("form_submit", { page: location.pathname }));
  });

  if (location.pathname.endsWith("/thanks.html") || location.pathname === "/thanks.html") {
    trackAnalyticsEvent("lead_complete", { page: location.pathname });
  }
}

if (["bluerhinobath.com", "www.bluerhinobath.com"].includes(location.hostname)) {
  const analyticsScript = document.createElement("script");
  analyticsScript.defer = true;
  analyticsScript.src = `${analyticsConfig.host}/script.js`;
  analyticsScript.dataset.websiteId = analyticsConfig.websiteId;
  analyticsScript.dataset.hostUrl = analyticsConfig.host;
  analyticsScript.dataset.domains = "bluerhinobath.com,www.bluerhinobath.com";
  analyticsScript.addEventListener("load", initializeAnalytics);
  document.head.appendChild(analyticsScript);
}

document.querySelectorAll("[data-before-after]").forEach((comparison) => {
  const range = comparison.querySelector(".before-after-range");
  if (!range) return;
  const updateComparison = () => comparison.style.setProperty("--reveal-position", `${range.value}%`);
  range.addEventListener("input", updateComparison);
  updateComparison();
});

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
