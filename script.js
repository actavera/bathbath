const revealItems = document.querySelectorAll(".reveal");

const adRevvScripts = [
  "https://cdn.idpixel.app/v1/idp-analytics-6ae23d0882d07f4488854767.min.js",
  "https://analytics.adrevv.com/pixel/Cr7RmJ11K8HlfBJh",
];

const trackingConsentKey = "blueRhinoTrackingConsent";

function loadAdRevv() {
  if (document.querySelector("[data-adrevv-tracker]")) return;
  for (const source of adRevvScripts) {
    const script = document.createElement("script");
    script.src = source;
    script.defer = true;
    script.dataset.adrevvTracker = "true";
    document.head.appendChild(script);
  }
}

function trackingConsent() {
  try {
    return localStorage.getItem(trackingConsentKey);
  } catch {
    return null;
  }
}

function saveTrackingConsent(value) {
  try {
    localStorage.setItem(trackingConsentKey, value);
  } catch {
    // The choice applies to this page when browser storage is unavailable.
  }
}

function showTrackingDisclosure() {
  document.querySelector(".tracking-disclosure")?.remove();
  document.body.classList.add("tracking-disclosure-visible");

  const disclosure = document.createElement("section");
  disclosure.className = "tracking-disclosure";
  disclosure.setAttribute("role", "dialog");
  disclosure.setAttribute("aria-labelledby", "tracking-disclosure-title");
  disclosure.innerHTML = `
    <div class="tracking-disclosure-copy">
      <strong id="tracking-disclosure-title">Your privacy choices</strong>
      <p>We use anonymous website analytics. With your permission, we also use visitor-identification technology that may associate website activity with contact information such as a name, email, phone number, or mailing address so we can understand interest in our services and follow up.</p>
    </div>
    <div class="tracking-disclosure-actions">
      <button type="button" class="tracking-decline">Decline</button>
      <button type="button" class="tracking-allow">Allow</button>
    </div>`;

  disclosure.querySelector(".tracking-allow").addEventListener("click", () => {
    saveTrackingConsent("allowed");
    loadAdRevv();
    trackAnalyticsEvent("tracking_consent", { choice: "allowed" });
    closeTrackingDisclosure(disclosure);
  });
  disclosure.querySelector(".tracking-decline").addEventListener("click", () => {
    saveTrackingConsent("declined");
    trackAnalyticsEvent("tracking_consent", { choice: "declined" });
    closeTrackingDisclosure(disclosure);
  });
  document.body.appendChild(disclosure);
  disclosure.querySelector(".tracking-allow").focus({ preventScroll: true });
}

function closeTrackingDisclosure(disclosure) {
  disclosure.remove();
  document.body.classList.remove("tracking-disclosure-visible");
  addPrivacyChoicesButton();
}

function addPrivacyChoicesButton() {
  if (document.querySelector(".privacy-choices-button")) return;
  const button = document.createElement("button");
  button.type = "button";
  button.className = "privacy-choices-button";
  button.textContent = "Privacy choices";
  button.addEventListener("click", showTrackingDisclosure);
  document.body.appendChild(button);
}

const savedTrackingConsent = trackingConsent();
if (savedTrackingConsent === "allowed") {
  loadAdRevv();
  addPrivacyChoicesButton();
} else if (savedTrackingConsent === "declined") {
  addPrivacyChoicesButton();
} else {
  showTrackingDisclosure();
}

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
