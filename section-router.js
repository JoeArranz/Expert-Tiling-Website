(() => {
  const pageId = new URLSearchParams(window.location.search).get("section");
  const pages = {
    services: { title: "Services | Expert Tiling" },
    portfolio: { title: "Portfolio | Expert Tiling" },
    process: { title: "Our Process | Expert Tiling" },
    about: { title: "About | Expert Tiling" },
    contact: { title: "Contact | Expert Tiling" }
  };

  if (!pages[pageId]) {
    return;
  }

  const activeSection = document.getElementById(pageId);
  if (!activeSection) {
    return;
  }

  document.body.classList.remove("home-page");
  document.body.classList.add("section-page-body", "routed-section-page");
  activeSection.classList.add("active-section");
  document.title = pages[pageId].title;

  const brand = document.querySelector(".brand");
  if (brand) {
    brand.setAttribute("href", "index.html");
  }

  document.querySelectorAll(".site-nav a").forEach((link) => {
    link.removeAttribute("aria-current");
    if (link.getAttribute("href") === `${pageId}.html`) {
      link.setAttribute("aria-current", "page");
    }
  });

  ["services", "portfolio", "process"].forEach((target) => {
    document.querySelectorAll(`a[href="#${target}"]`).forEach((link) => {
      link.setAttribute("href", `index.html#${target}`);
    });
  });

  activeSection.querySelectorAll('a[href^="#"]').forEach((link) => {
    const target = link.getAttribute("href").slice(1);
    if (pages[target]) {
      link.setAttribute("href", `${target}.html`);
    }
  });

  try {
    window.history.replaceState({}, "", `${pageId}.html`);
  } catch {
    // Some browsers keep the index.html?section= URL for local files.
  }
})();
