window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  const angle = 24 + scrollY * 1; // Ajusta velocidad cambiando 1
  document.body.style.background = `linear-gradient(${angle}deg, #d2d6ef, #e1e5f0, #8cb7ca)`;
});