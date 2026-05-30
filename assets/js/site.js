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
