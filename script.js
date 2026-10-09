(() => {
  const carousel = document.querySelector(".carousel");

  // Pages without a carousel don't need this code.
  if (!carousel) return;

  const slides = [...carousel.querySelectorAll(".slide")];
  const dots = [...carousel.querySelectorAll(".carousel-dot")];
  const previousButton = document.querySelector("#previous-slide");
  const nextButton = document.querySelector("#next-slide");
  const playbackButton = document.querySelector("#toggle-autoplay");
  const slideCount = document.querySelector("#slide-count");

  if (
    !slides.length ||
    !previousButton ||
    !nextButton ||
    !playbackButton ||
    !slideCount
  ) {
    return;
  }

  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  );

  const rotationDelay = 5000;

  let currentSlide = 0;
  let timer = null;
  let autoplayEnabled = !reducedMotion.matches;
  let pointerInside = false;
  let focusInside = false;

  function showSlide(index) {
    currentSlide = (index + slides.length) % slides.length;

    slides.forEach((slide, slideIndex) => {
      const active = slideIndex === currentSlide;

      slide.hidden = !active;
      slide.classList.toggle("is-active", active);
      slide.setAttribute("aria-hidden", String(!active));
      slide.setAttribute("role", "group");
      slide.setAttribute("aria-roledescription", "slide");
      slide.setAttribute(
        "aria-label",
        `${slideIndex + 1} of ${slides.length}`
      );
    });

    dots.forEach((dot, dotIndex) => {
      const active = dotIndex === currentSlide;

      dot.classList.toggle("is-active", active);

      if (active) {
        dot.setAttribute("aria-current", "true");
      } else {
        dot.removeAttribute("aria-current");
      }
    });

    const current = String(currentSlide + 1).padStart(2, "0");
    const total = String(slides.length).padStart(2, "0");

    slideCount.textContent = `${current} / ${total}`;
  }

  function stopTimer() {
    if (timer !== null) {
      window.clearInterval(timer);
      timer = null;
    }
  }

  function syncAutoplay() {
    stopTimer();

    playbackButton.textContent = autoplayEnabled
      ? "Pause slideshow"
      : "Play slideshow";

    playbackButton.setAttribute(
      "aria-label",
      autoplayEnabled
        ? "Pause automatic slideshow"
        : "Start automatic slideshow"
    );

    if (
      !autoplayEnabled ||
      pointerInside ||
      focusInside ||
      document.hidden ||
      slides.length < 2
    ) {
      return;
    }

    timer = window.setInterval(() => {
      showSlide(currentSlide + 1);
    }, rotationDelay);
  }

  function navigateTo(index) {
    showSlide(index);
    syncAutoplay();
  }

  previousButton.addEventListener("click", () => {
    navigateTo(currentSlide - 1);
  });

  nextButton.addEventListener("click", () => {
    navigateTo(currentSlide + 1);
  });

  dots.forEach((dot) => {
    dot.addEventListener("click", () => {
      const target = Number(dot.dataset.target);

      if (Number.isInteger(target)) {
        navigateTo(target);
      }
    });
  });

  playbackButton.addEventListener("click", () => {
    autoplayEnabled = !autoplayEnabled;
    syncAutoplay();
  });

  // Temporarily stop rotation while someone interacts with it.
  carousel.addEventListener("mouseenter", () => {
    pointerInside = true;
    syncAutoplay();
  });

  carousel.addEventListener("mouseleave", () => {
    pointerInside = false;
    syncAutoplay();
  });

  carousel.addEventListener("focusin", () => {
    focusInside = true;
    syncAutoplay();
  });

  carousel.addEventListener("focusout", (event) => {
    focusInside = carousel.contains(event.relatedTarget);
    syncAutoplay();
  });

  // Support arrow keys when a carousel control is focused.
  carousel.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      navigateTo(currentSlide - 1);
    }

    if (event.key === "ArrowRight") {
      event.preventDefault();
      navigateTo(currentSlide + 1);
    }
  });

  // Don't keep rotating in a hidden browser tab.
  document.addEventListener("visibilitychange", syncAutoplay);

  reducedMotion.addEventListener("change", (event) => {
    if (event.matches) {
      autoplayEnabled = false;
      syncAutoplay();
    }
  });

  showSlide(0);
  syncAutoplay();
})();
