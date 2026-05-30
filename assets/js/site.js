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
  const dots = carousel.nextElementSibling;
  if (!dots || !dots.matches("[data-carousel-dots]")) return;

  const dotItems = Array.from(dots.querySelectorAll("span"));
  const cards = Array.from(carousel.children);

  const setActiveDot = () => {
    const center = carousel.scrollLeft + carousel.clientWidth / 2;
    let activeIndex = 0;
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
  };

  carousel.addEventListener("scroll", setActiveDot, { passive: true });
  window.addEventListener("resize", setActiveDot);
  setActiveDot();
});
