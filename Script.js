// SCROLL TO TOP FUNCTIONALITY 
const scrollToTopBtn = document.getElementById('scrollToTopBtn');
 
window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
        scrollToTopBtn.classList.add('show');
    } else {
        scrollToTopBtn.classList.remove('show');
    }
});
 
scrollToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});
 
// PROJECT FILTER + VIEW ALL FUNCTIONALITY
const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');
const projectsGrid = document.getElementById('projectsGrid');
const viewAllBtn = document.getElementById('viewAllBtn');
const projectCount = document.getElementById('projectCount');
 
let isExpanded = false;
const initialShowCount = 3;
const totalProjects = projectCards.length;
 
function toggleViewAll() {
    isExpanded = !isExpanded;
    projectsGrid.classList.toggle('expanded', isExpanded);
 
    const buttonText = viewAllBtn.querySelector('span');
 
    if (isExpanded) {
        buttonText.textContent = 'Show Less';
        viewAllBtn.classList.add('expanded');
        const visible = document.querySelectorAll('.project-card[style*="display: block"], .project-card:not([style*="display: none"])').length;
        projectCount.textContent = `Showing all ${visible} projects`;
    } else {
        buttonText.textContent = 'View All Projects';
        viewAllBtn.classList.remove('expanded');
        const activeFilter = document.querySelector('.filter-btn.active').getAttribute('data-filter');
        const visibleCount = activeFilter === 'all'
            ? totalProjects
            : document.querySelectorAll(`.project-card[data-category="${activeFilter}"]`).length;
        projectCount.textContent = `Showing ${Math.min(initialShowCount, visibleCount)} of ${visibleCount} projects`;
    }
}
window.toggleViewAll = toggleViewAll;
 
filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
 
        const filter = btn.getAttribute('data-filter');
        let visibleCount = 0;
 
        projectCards.forEach(card => {
            if (filter === 'all' || card.getAttribute('data-category') === filter) {
                card.style.display = 'block';
                visibleCount++;
                setTimeout(() => {
                    card.style.animation = 'none';
                    setTimeout(() => { card.style.animation = ''; }, 10);
                }, 10);
            } else {
                card.style.display = 'none';
            }
        });
 
        isExpanded = false;
        projectsGrid.classList.remove('expanded');
        viewAllBtn.classList.remove('expanded');
        viewAllBtn.querySelector('span').textContent = 'View All Projects';
        projectCount.textContent = `Showing ${Math.min(initialShowCount, visibleCount)} of ${visibleCount} projects`;
    });
});
 
// IMAGE LIGHTBOX (supports multiple screenshots per project)
const lightboxOverlay = document.getElementById('lightboxOverlay');
const lightboxImage = document.getElementById('lightboxImage');
const lightboxCaption = document.getElementById('lightboxCaption');
const lightboxCounter = document.getElementById('lightboxCounter');
const lightboxClose = document.getElementById('lightboxClose');
const lightboxPrev = document.getElementById('lightboxPrev');
const lightboxNext = document.getElementById('lightboxNext');
 
let currentGallery = [];
let currentIndex = 0;
let currentTitle = '';
 
function showLightboxImage() {
    lightboxImage.src = currentGallery[currentIndex];
    lightboxCaption.textContent = currentTitle;
    const multi = currentGallery.length > 1;
    lightboxCounter.textContent = multi ? `${currentIndex + 1} / ${currentGallery.length}` : '';
    lightboxPrev.classList.toggle('show', multi);
    lightboxNext.classList.toggle('show', multi);
}
 
function openLightbox(gallery, title, startIndex) {
    currentGallery = gallery;
    currentIndex = startIndex || 0;
    currentTitle = title || '';
    showLightboxImage();
    lightboxOverlay.classList.add('show');
    document.body.style.overflow = 'hidden';
}
 
function closeLightbox() {
    lightboxOverlay.classList.remove('show');
    lightboxImage.src = '';
    document.body.style.overflow = '';
}
 
function showNext() {
    if (!currentGallery.length) return;
    currentIndex = (currentIndex + 1) % currentGallery.length;
    showLightboxImage();
}
 
function showPrev() {
    if (!currentGallery.length) return;
    currentIndex = (currentIndex - 1 + currentGallery.length) % currentGallery.length;
    showLightboxImage();
}
 
document.querySelectorAll('.project-image-wrap').forEach(wrap => {
    const img = wrap.querySelector('.project-image');
    const imagesAttr = wrap.getAttribute('data-images') || '';
    const gallery = imagesAttr.split(',').map(s => s.trim()).filter(Boolean);
    const title = wrap.getAttribute('data-title');
 
    // Only usable once the visible thumbnail has actually loaded a real screenshot
    // (falls back gracefully to the icon placeholder otherwise, see inline onerror)
    if (gallery.length > 1) {
        const badge = document.createElement('span');
        badge.className = 'project-image-count';
        badge.innerHTML = `<i class="fas fa-images"></i> ${gallery.length}`;
        wrap.appendChild(badge);
    }
 
    wrap.addEventListener('click', () => {
        if (img && img.style.display !== 'none' && img.complete && img.naturalWidth > 0) {
            openLightbox(gallery, title, 0);
        }
    });
});
 
lightboxClose.addEventListener('click', closeLightbox);
lightboxNext.addEventListener('click', showNext);
lightboxPrev.addEventListener('click', showPrev);
 
lightboxOverlay.addEventListener('click', (e) => {
    if (e.target === lightboxOverlay) closeLightbox();
});
 
document.addEventListener('keydown', (e) => {
    if (!lightboxOverlay.classList.contains('show')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') showNext();
    if (e.key === 'ArrowLeft') showPrev();
});
 
// Basic swipe support for mobile (left/right to navigate)
let touchStartX = 0;
lightboxOverlay.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
}, { passive: true });
 
lightboxOverlay.addEventListener('touchend', (e) => {
    const diff = e.changedTouches[0].screenX - touchStartX;
    if (Math.abs(diff) > 50) {
        diff < 0 ? showNext() : showPrev();
    }
}, { passive: true });
 
// SMOOTH SCROLLING FOR NAVIGATION LINKS 
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});
 
// NAVBAR COLLAPSE ON LINK CLICK
const navbarCollapse = document.querySelector('.navbar-collapse');
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        if (navbarCollapse.classList.contains('show')) {
            document.querySelector('.navbar-toggler').click();
        }
    });
});
 

 
console.log('Portfolio loaded successfully.');