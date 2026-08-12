const nav = document.querySelector("[data-nav]");
const navToggle = document.querySelector("[data-nav-toggle]");

if (nav && navToggle) {
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

const revealTargets = document.querySelectorAll("[data-reveal]");

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.14 }
  );

  revealTargets.forEach((target) => observer.observe(target));
} else {
  revealTargets.forEach((target) => target.classList.add("is-visible"));
}

document.querySelectorAll("[data-hero-slideshow]").forEach((slideshow) => {
  const slides = Array.from(slideshow.querySelectorAll("[data-hero-slide]"));
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const initialSlideDelay = 4000;
  const slideDelay = 5000;
  let activeIndex = 0;
  let hasAdvanced = false;
  let timeoutId;

  if (slides.length < 2 || reducedMotion.matches) return;

  const showSlide = (index) => {
    slides.forEach((slide, slideIndex) => {
      const isActive = slideIndex === index;
      slide.classList.toggle("is-active", isActive);
      slide.setAttribute("aria-hidden", String(!isActive));
    });
  };

  const stopSlideshow = () => {
    window.clearTimeout(timeoutId);
    timeoutId = undefined;
  };

  const scheduleNextSlide = (delay = slideDelay) => {
    stopSlideshow();
    timeoutId = window.setTimeout(() => {
      activeIndex = (activeIndex + 1) % slides.length;
      hasAdvanced = true;
      showSlide(activeIndex);
      slides.forEach((slide) => slide.removeAttribute("data-hero-initial"));
      scheduleNextSlide();
    }, delay);
  };

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      stopSlideshow();
    } else {
      scheduleNextSlide(hasAdvanced ? slideDelay : initialSlideDelay);
    }
  });

  scheduleNextSlide(initialSlideDelay);
});

document.querySelectorAll("[data-profile-hero-scroll-wipe]").forEach((heroImage) => {
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  if (reducedMotion.matches) return;

  const updateWipe = () => {
    const headerHeight = window.innerWidth >= 760 ? 82 : 72;
    const { top, height } = heroImage.getBoundingClientRect();
    const progress = Math.min(Math.max((headerHeight - top) / (height * 0.72), 0), 1);

    heroImage.style.setProperty("--profile-hero-wipe-inset", `${progress * 100}%`);
  };

  window.addEventListener("scroll", updateWipe, { passive: true });
  window.addEventListener("resize", updateWipe);
  updateWipe();
});

document.querySelectorAll("[data-carousel]").forEach((carousel) => {
  const container = carousel.closest(".tk-container") || carousel.parentElement;
  if (!container) return;

  const dots = container.querySelector("[data-carousel-dots]");
  const dotItems = dots ? Array.from(dots.querySelectorAll("span")) : [];
  const prevButton = container.querySelector("[data-carousel-prev]");
  const nextButton = container.querySelector("[data-carousel-next]");
  const cards = Array.from(carousel.children);
  let activeIndex = 0;

  const updateCarouselState = () => {
    const center = carousel.scrollLeft + carousel.clientWidth / 2;
    let shortestDistance = Infinity;

    cards.forEach((card, index) => {
      const cardCenter = card.offsetLeft + card.clientWidth / 2;
      const distance = Math.abs(center - cardCenter);
      if (distance < shortestDistance) {
        shortestDistance = distance;
        activeIndex = index;
      }
    });

    dotItems.forEach((dot, index) => {
      dot.classList.toggle("is-active", index === activeIndex);
    });

    if (prevButton instanceof HTMLButtonElement) {
      prevButton.disabled = activeIndex === 0;
    }

    if (nextButton instanceof HTMLButtonElement) {
      nextButton.disabled = activeIndex === cards.length - 1;
    }
  };

  const scrollToCard = (index) => {
    const card = cards[index];
    if (!card) return;

    card.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });
  };

  prevButton?.addEventListener("click", () => {
    scrollToCard(Math.max(activeIndex - 1, 0));
  });

  nextButton?.addEventListener("click", () => {
    scrollToCard(Math.min(activeIndex + 1, cards.length - 1));
  });

  carousel.addEventListener("scroll", updateCarouselState, { passive: true });
  window.addEventListener("resize", updateCarouselState);
  updateCarouselState();
});

document.querySelectorAll("[data-ai-feature-carousel]").forEach((carousel) => {
  const slides = Array.from(carousel.querySelectorAll("[data-ai-feature-slide]"));
  const dots = Array.from(carousel.querySelectorAll("[data-ai-feature-dot]"));
  const prevButton = carousel.querySelector("[data-ai-feature-prev]");
  const nextButton = carousel.querySelector("[data-ai-feature-next]");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let activeIndex = 0;
  let timerId = null;
  let pausedByInteraction = false;

  const showSlide = (nextIndex) => {
    activeIndex = (nextIndex + slides.length) % slides.length;
    slides.forEach((slide, index) => {
      slide.classList.toggle("is-active", index === activeIndex);
    });
    dots.forEach((dot, index) => {
      dot.classList.toggle("is-active", index === activeIndex);
      dot.setAttribute("aria-current", index === activeIndex ? "true" : "false");
    });
  };

  const stopAutoplay = () => {
    pausedByInteraction = true;
    if (timerId) window.clearInterval(timerId);
    timerId = null;
  };

  const startAutoplay = () => {
    if (reducedMotion.matches || pausedByInteraction || slides.length < 2) return;
    timerId = window.setInterval(() => showSlide(activeIndex + 1), 8000);
  };

  prevButton?.addEventListener("click", () => {
    stopAutoplay();
    showSlide(activeIndex - 1);
  });

  nextButton?.addEventListener("click", () => {
    stopAutoplay();
    showSlide(activeIndex + 1);
  });

  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      stopAutoplay();
      showSlide(index);
    });
  });

  carousel.addEventListener("pointerdown", stopAutoplay, { once: true });
  showSlide(0);
  startAutoplay();
});

document.querySelectorAll("[data-gallery-filters]").forEach((filters) => {
  const container = filters.closest(".tk-container");
  const grid = container?.querySelector("[data-gallery-grid]");
  if (!grid) return;

  const buttons = Array.from(filters.querySelectorAll("[data-gallery-filter]"));
  const items = Array.from(grid.querySelectorAll("[data-gallery-category]"));

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const filter = button.getAttribute("data-gallery-filter") || "all";
      grid.setAttribute("data-gallery-active", filter);

      buttons.forEach((item) => {
        item.classList.toggle("is-active", item === button);
      });

      items.forEach((item) => {
        const categories = (item.getAttribute("data-gallery-category") || "").split(" ");
        item.classList.toggle("is-hidden", filter !== "all" && !categories.includes(filter));
      });
    });
  });
});
