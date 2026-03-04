// Build images array from the carousel HTML — no need to update JS when adding images
const items = document.querySelectorAll('.carousel-track .item img');
const images = Array.from(items).map(img => ({ src: img.src, alt: img.alt }));

let currentIndex = 0;

function openLightbox(index) {
  currentIndex = index;
  const img = document.getElementById('lightboxImg');
  img.src = images[currentIndex].src;
  img.alt = images[currentIndex].alt;
  img.style.opacity = 1;
  document.getElementById('lightboxOverlay').classList.add('active');
  document.body.style.overflow = 'hidden';
  updateNavButtons();
}

function updateLightbox(direction) {
  const img = document.getElementById('lightboxImg');

  img.style.opacity = 0;
  img.style.transform = `translateX(${direction > 0 ? '30px' : '-30px'})`;

  setTimeout(() => {
    img.src = images[currentIndex].src;
    img.alt = images[currentIndex].alt;
    img.style.transition = 'none';
    img.style.transform = `translateX(${direction > 0 ? '-30px' : '30px'})`;

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        img.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        img.style.opacity = 1;
        img.style.transform = 'translateX(0)';
      });
    });

    updateNavButtons();
  }, 300);
}

function changeImage(direction) {
  currentIndex = (currentIndex + direction + images.length) % images.length;
  updateLightbox(direction);
}

function updateNavButtons() {
  // No longer hide buttons — navigation is continuous/circular
  document.querySelector('.lightbox-prev').classList.remove('hidden');
  document.querySelector('.lightbox-next').classList.remove('hidden');
}

function closeLightbox() {
  document.getElementById('lightboxOverlay').classList.remove('active');
  document.body.style.overflow = '';
}

function closeLightboxOnBg(e) {
  if (e.target === document.getElementById('lightboxOverlay')) closeLightbox();
}

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowLeft') changeImage(-1);
  if (e.key === 'ArrowRight') changeImage(1);
});

// Drag-to-scroll
const track = document.getElementById('carouselTrack');
let isDown = false, startX, scrollLeft;

track.addEventListener('mousedown', e => {
  isDown = true;
  startX = e.pageX - track.offsetLeft;
  scrollLeft = track.scrollLeft;
});
track.addEventListener('mouseleave', () => isDown = false);
track.addEventListener('mouseup', () => isDown = false);
track.addEventListener('mousemove', e => {
  if (!isDown) return;
  e.preventDefault();
  track.scrollLeft = scrollLeft - (e.pageX - track.offsetLeft - startX);
});