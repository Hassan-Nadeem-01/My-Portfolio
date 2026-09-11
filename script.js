// everything runs after DOM ready, no build step, plain es6

document.addEventListener('DOMContentLoaded', () => {

  // mobile menu
  const toggle = document.getElementById('navToggle');
  const links = document.getElementById('navLinks');

  if (toggle && links) {
    toggle.addEventListener('click', () => {
      const isOpen = links.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // close when clicking a link
    links.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        links.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });

    // esc closes it too
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && links.classList.contains('is-open')) {
        links.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    });
  }

  // nav scroll + active link highlighting
  const nav = document.getElementById('nav');
  const sections = document.querySelectorAll('section[id]');
  const navLinkEls = document.querySelectorAll('.nav__links a');

  const onScroll = () => {
    const scrollY = window.scrollY;

    // add blur on scroll
    if (nav) {
      nav.classList.toggle('is-scrolled', scrollY > 20);
    }

    // ScrollSpy active link updates
    let currentSectionId = '';
    sections.forEach((section) => {
      const sectionTop = section.offsetTop - 140;
      const sectionHeight = section.offsetHeight;
      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        currentSectionId = section.getAttribute('id');
      }
    });

    navLinkEls.forEach((a) => {
      a.classList.remove('is-active');
      if (a.getAttribute('href') === `#${currentSectionId}`) {
        a.classList.add('is-active');
      }
    });
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // fade stuff in on scroll. bail out on old browsers.
  const revealEls = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    revealEls.forEach((el) => revealObserver.observe(el));
  } else {
    // no IntersectionObserver = just show everything
    revealEls.forEach((el) => el.classList.add('is-visible'));
  }

  // mouse spotlight on cards
  const interactiveCards = document.querySelectorAll(
    '.project-card, .info-card, .skills__group, .contact__card, .timeline__content, .dev-card, .capability-card'
  );

  interactiveCards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });

  // gallery switcher (1/2/3 buttons)
  const galleries = document.querySelectorAll('.project-gallery');

  galleries.forEach((gallery) => {
    const btns = gallery.querySelectorAll('.gallery-btn');
    const imgs = gallery.querySelectorAll('.gallery-img');

    btns.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const targetId = btn.getAttribute('data-target');

        btns.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');

        imgs.forEach((img) => {
          if (img.getAttribute('data-img-id') === targetId) {
            img.classList.add('active');
          } else {
            img.classList.remove('active');
          }
        });
      });
    });
  });

  // if profile pic 404s, show the "HN" initials instead
  const heroPhoto = document.querySelector('.hero__photo img');
  if (heroPhoto) {
    heroPhoto.addEventListener('error', function() {
      this.style.display = 'none';
      this.nextElementSibling.style.display = 'flex';
    });
  }

  // Gallery image error handling
  const galleryImages = document.querySelectorAll('.gallery-img');
  galleryImages.forEach((img) => {
    img.addEventListener('error', function() {
      this.classList.add('has-error');
      const display = this.closest('.project-gallery__display');
      if (display && !display.querySelector('.project-gallery__fallback')) {
        const fallback = document.createElement('div');
        fallback.className = 'project-gallery__fallback';
        fallback.textContent = 'Preview Unavailable';
        display.appendChild(fallback);
        const controls = display.closest('.project-gallery')?.querySelector('.project-gallery__controls');
        if (controls) controls.style.display = 'none';
      }
    });
  });

  // copy email to clipboard
  const copyEmailBtn = document.getElementById('copyEmailBtn');
  const copyEmailText = document.getElementById('copyEmailText');
  const emailToCopy = 'hassan.nadeem.cs@gmail.com';

  if (copyEmailBtn) {
    copyEmailBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(emailToCopy).then(() => {
        showToast('✓ Email address copied to clipboard!');
        if (copyEmailText) {
          const originalText = copyEmailText.textContent;
          copyEmailText.textContent = 'Copied!';
          setTimeout(() => {
            copyEmailText.textContent = originalText;
          }, 2500);
        }
      }).catch(() => {
        showToast('Email: hassan.nadeem.cs@gmail.com');
      });
    });
  }

  function showToast(message) {
    let toast = document.querySelector('.toast-notice');
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'toast-notice';
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add('show');

    setTimeout(() => {
      toast.classList.remove('show');
    }, 3000);
  }

  // back to top
  const backToTopBtn = document.getElementById('backToTop');
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    });
  }

});
