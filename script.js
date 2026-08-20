const navToggle = document.querySelector(".nav-toggle");
const nav = document.querySelector(".site-nav");
const header = document.querySelector("[data-header]");
const heroImages = document.querySelectorAll(".hero-image");
const slideDots = document.querySelectorAll("[data-slide-to]");
const slideButtons = document.querySelectorAll("[data-slide]");
const quoteForm = document.querySelector("[data-quote-form]");
const statusMessage = document.querySelector("[data-form-status]");
const yearNode = document.querySelector("[data-year]");
const fadePanels = document.querySelectorAll(".fade-panel");

let activeSlide = 0;
let slideTimer;

if (yearNode) {
  yearNode.textContent = new Date().getFullYear();
}

if (navToggle && nav) {
  navToggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  nav.addEventListener("click", (event) => {
    if (event.target instanceof HTMLAnchorElement) {
      nav.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
    }
  });
}

if (header) {
  const updateHeader = () => {
    const atTop = window.scrollY <= 10;

    header.classList.toggle("is-hidden", !atTop);
    header.classList.toggle("is-compact", !atTop);
    header.classList.toggle("has-shadow", !atTop);
  };

  window.addEventListener("scroll", updateHeader, { passive: true });
  updateHeader();
}

const showSlide = (index) => {
  if (!heroImages.length) {
    return;
  }

  activeSlide = (index + heroImages.length) % heroImages.length;

  heroImages.forEach((image, currentIndex) => {
    image.classList.toggle("is-active", currentIndex === activeSlide);
  });

  slideDots.forEach((dot, currentIndex) => {
    dot.classList.toggle("is-active", currentIndex === activeSlide);
  });
};

const restartSlider = () => {
  window.clearInterval(slideTimer);
  slideTimer = window.setInterval(() => showSlide(activeSlide + 1), 5200);
};

if (heroImages.length) {
  slideDots.forEach((dot) => {
    dot.addEventListener("click", () => {
      showSlide(Number(dot.dataset.slideTo));
      restartSlider();
    });
  });

  slideButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const direction = button.dataset.slide === "previous" ? -1 : 1;
      showSlide(activeSlide + direction);
      restartSlider();
    });
  });

  restartSlider();
}

if (fadePanels.length && "IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.22 }
  );

  fadePanels.forEach((panel) => observer.observe(panel));
} else {
  fadePanels.forEach((panel) => panel.classList.add("is-visible"));
}

if (quoteForm && statusMessage) {
  quoteForm.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!quoteForm.checkValidity()) {
      quoteForm.reportValidity();
      return;
    }

    statusMessage.textContent = "Thanks. This demo form is ready to connect to email or a CRM.";
    quoteForm.reset();
  });
}

/* =========================================================
   FULL-WIDTH GALLERY CATEGORY + CAROUSEL
   ========================================================= */

document.querySelectorAll("[data-gallery-category]").forEach((category) => {

  const trigger = category.querySelector(".gallery-category-trigger");
  const expanded = category.querySelector(".gallery-expanded");

  const mainImage = category.querySelector("[data-gallery-main]");
  const previousButton = category.querySelector("[data-gallery-prev]");
  const nextButton = category.querySelector("[data-gallery-next]");
  const counter = category.querySelector("[data-gallery-counter]");

  const thumbnails = Array.from(
    category.querySelectorAll("[data-gallery-thumb]")
  );

  if (!trigger || !expanded || !mainImage || thumbnails.length === 0) {
    return;
  }

  let currentIndex = 0;

  const images = thumbnails.map((thumbnail) => ({
    src: thumbnail.dataset.image,
    alt: thumbnail.dataset.alt || ""
  }));


  /* -----------------------------------------
     Create full-width gallery container
  ----------------------------------------- */

  let fullWidthGallery =
    document.querySelector(".gallery-full-width");

  if (!fullWidthGallery) {

    fullWidthGallery = document.createElement("div");

    fullWidthGallery.className = "gallery-full-width";

    category
      .closest(".gallery-grid")
      .after(fullWidthGallery);

  }


  /* -----------------------------------------
     Show selected image
  ----------------------------------------- */

  const showGalleryImage = (index) => {

    currentIndex =
      (index + images.length) % images.length;

    const selectedImage = images[currentIndex];

    const feature =
      fullWidthGallery.querySelector(".gallery-feature");

    if (!feature) {
      return;
    }

    feature.classList.add("is-changing");

    window.setTimeout(() => {

      mainImage.src = selectedImage.src;
      mainImage.alt = selectedImage.alt;

      if (counter) {
        counter.textContent =
          `${currentIndex + 1} / ${images.length}`;
      }

      thumbnails.forEach((thumbnail, thumbnailIndex) => {

        thumbnail.classList.toggle(
          "is-active",
          thumbnailIndex === currentIndex
        );

      });

      feature.classList.remove("is-changing");

    }, 180);
  };


  /* -----------------------------------------
     Open gallery
  ----------------------------------------- */

  trigger.addEventListener("click", () => {

    const isOpen =
      category.classList.contains("is-open");


    /*
     * If this category is already open,
     * close the gallery.
     */

    if (isOpen) {

      category.classList.remove("is-open");

      trigger.setAttribute(
        "aria-expanded",
        "false"
      );

      expanded.style.display = "none";

      fullWidthGallery.classList.remove("is-visible");

      return;
    }


    /*
     * Close every other category.
     */

    document
      .querySelectorAll("[data-gallery-category].is-open")
      .forEach((otherCategory) => {

        otherCategory.classList.remove("is-open");

        const otherTrigger =
          otherCategory.querySelector(
            ".gallery-category-trigger"
          );

        const otherExpanded =
          otherCategory.querySelector(
            ".gallery-expanded"
          );

        if (otherTrigger) {

          otherTrigger.setAttribute(
            "aria-expanded",
            "false"
          );

        }

        if (otherExpanded) {

          otherExpanded.style.display = "none";

        }

      });


    /*
     * Open this category.
     */

    category.classList.add("is-open");

    trigger.setAttribute(
      "aria-expanded",
      "true"
    );


    /*
     * Move the expanded gallery into the
     * full-width container.
     */

    expanded.style.display = "block";

    fullWidthGallery.innerHTML = "";

    fullWidthGallery.appendChild(expanded);


    /*
     * Make the full-width gallery visible.
     */

    fullWidthGallery.classList.add("is-visible");


    /*
     * Start on first image.
     */

    currentIndex = 0;

    showGalleryImage(0);


    /*
     * Scroll the full gallery into view.
     */

    window.setTimeout(() => {

      fullWidthGallery.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });

    }, 120);

  });


  /* -----------------------------------------
     Previous image
  ----------------------------------------- */

  if (previousButton) {

    previousButton.addEventListener(
      "click",
      (event) => {

        event.stopPropagation();

        showGalleryImage(
          currentIndex - 1
        );

      }
    );

  }


  /* -----------------------------------------
     Next image
  ----------------------------------------- */

  if (nextButton) {

    nextButton.addEventListener(
      "click",
      (event) => {

        event.stopPropagation();

        showGalleryImage(
          currentIndex + 1
        );

      }
    );

  }


  /* -----------------------------------------
     Thumbnail clicks
  ----------------------------------------- */

  thumbnails.forEach(
    (thumbnail, index) => {

      thumbnail.addEventListener(
        "click",
        (event) => {

          event.stopPropagation();

          showGalleryImage(index);

        }
      );

    }
  );


  /* -----------------------------------------
     Keyboard controls
  ----------------------------------------- */

  document.addEventListener(
    "keydown",
    (event) => {

      if (
        !fullWidthGallery.classList.contains(
          "is-visible"
        )
      ) {
        return;
      }

      if (event.key === "ArrowLeft") {

        showGalleryImage(
          currentIndex - 1
        );

      }

      if (event.key === "ArrowRight") {

        showGalleryImage(
          currentIndex + 1
        );

      }

      if (event.key === "Escape") {

        category.classList.remove(
          "is-open"
        );

        trigger.setAttribute(
          "aria-expanded",
          "false"
        );

        expanded.style.display =
          "none";

        fullWidthGallery.classList.remove(
          "is-visible"
        );

      }

    }
  );

});
