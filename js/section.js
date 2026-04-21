let currentIndex = 0;

function scrollCarousel(direction) {
  const container = document.getElementById("promoCarousel");
  const cards = container.querySelectorAll(".promo-card");

  const cardWidth = cards[0].offsetWidth + 16;
  const maxIndex = cards.length - 1;

  currentIndex += direction;

  if (currentIndex < 0) currentIndex = 0;
  if (currentIndex > maxIndex) currentIndex = maxIndex;

  container.scrollTo({
    left: currentIndex * cardWidth,
    behavior: "smooth"
  });
}