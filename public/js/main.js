/**
 * ══════════════════════════════════════════════════════════════════════════
 * ANJALI SHIKHARE — PYTHON FULL-STACK DEVELOPER PORTFOLIO
 * CLIENT-SIDE INTERACTION CONTROLLER
 * ══════════════════════════════════════════════════════════════════════════
 */

// ── 1. LOADER CONTROLLER ──────────────────────────────────────────────────
window.addEventListener('load', () => {
  const loader = document.getElementById('loader');
  if (loader) {
    setTimeout(() => {
      loader.classList.add('hide');
    }, 700);
  }
});

// ── 2. ANIMATE ON SCROLL (AOS) ────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  if (typeof AOS !== 'undefined') {
    AOS.init({
      once: true,
      offset: 50,
      duration: 650,
      easing: 'ease-out-cubic'
    });
  }

  initNavigation();
  initProjectTabs();
  initCertFilters();
  initCertModal();
});

// ── 3. NAVIGATION & SCROLL SPY ───────────────────────────────────────────
function initNavigation() {
  const navBtn = document.getElementById('mobileMenuBtn');
  const drawer = document.getElementById('mobileDrawer');
  const icon   = document.getElementById('hamburgerIcon');

  if (navBtn && drawer) {
    navBtn.addEventListener('click', () => {
      drawer.classList.toggle('open');
      const isOpen = drawer.classList.contains('open');
      if (icon) {
        icon.className = isOpen ? 'fas fa-xmark' : 'fas fa-bars';
      }
    });
  }

  // Active section tracking on scroll
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.pill-link');
  const backTop  = document.getElementById('backTop');

  window.addEventListener('scroll', () => {
    const scrollPos = window.scrollY + 140;

    sections.forEach(sec => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      const id = sec.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });

    if (backTop) {
      backTop.classList.toggle('visible', window.scrollY > 450);
    }
  }, { passive: true });
}

function closeMobileMenu() {
  const drawer = document.getElementById('mobileDrawer');
  const icon   = document.getElementById('hamburgerIcon');
  if (drawer) {
    drawer.classList.remove('open');
  }
  if (icon) {
    icon.className = 'fas fa-bars';
  }
}

// ── 4. MASTER-DETAIL PROJECT SHOWCASE TABS ────────────────────────────────
function initProjectTabs() {
  const tabs = document.querySelectorAll('.project-nav-tab');
  const panels = document.querySelectorAll('.project-stage-panel');

  if (!tabs.length || !panels.length) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetId = tab.getAttribute('data-target');
      if (!targetId) return;

      // Update Tab active states
      tabs.forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');

      // Update Panel visibility
      panels.forEach(p => {
        if (p.getAttribute('id') === targetId) {
          p.classList.add('active');
        } else {
          p.classList.remove('active');
        }
      });
    });
  });
}

// ── 5. CERTIFICATES FILTERING ─────────────────────────────────────────────
function initCertFilters() {
  const filterBtns = document.querySelectorAll('.cert-filter-btn');
  const certItems  = document.querySelectorAll('.cert-item');

  if (!filterBtns.length || !certItems.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.getAttribute('data-filter');

      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      certItems.forEach(item => {
        const cat = item.getAttribute('data-category');
        if (filter === 'all' || cat === filter) {
          item.style.display = 'block';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });
}

// ── 6. CERTIFICATE LIGHTBOX MODAL ─────────────────────────────────────────
function initCertModal() {
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeCertModal();
    }
  });
}

function openCertModal(imageSrc, title, meta) {
  const modal    = document.getElementById('certModal');
  const modalImg = document.getElementById('certModalImg');
  const modalTtl = document.getElementById('certModalTitle');
  const modalMet = document.getElementById('certModalMeta');
  const modalLnk = document.getElementById('certModalOpenTab');

  if (!modal || !modalImg) return;

  modalImg.src = imageSrc;
  if (modalTtl) modalTtl.textContent = title;
  if (modalMet) modalMet.textContent = meta;
  if (modalLnk) modalLnk.href = imageSrc;

  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeCertModal() {
  const modal = document.getElementById('certModal');
  if (!modal) return;

  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

// ── 7. ONE-CLICK EMAIL COPY ───────────────────────────────────────────────
function copyEmailToClipboard() {
  const email = 'anjalishikhare.sveri.cse@gmail.com';
  navigator.clipboard.writeText(email).then(() => {
    const tooltip = document.getElementById('railEmailTooltip');
    if (tooltip) {
      const original = tooltip.textContent;
      tooltip.textContent = 'Copied to clipboard!';
      setTimeout(() => {
        tooltip.textContent = original;
      }, 2400);
    } else {
      alert('Email copied: ' + email);
    }
  }).catch(() => {
    window.location.href = `mailto:${email}`;
  });
}

// ── 8. CONTACT FORM AJAX DISPATCH (EXPRESS BACKEND INTEGRATION) ───────────
async function submitForm() {
  const nameEl    = document.getElementById('cName');
  const emailEl   = document.getElementById('cEmail');
  const subjectEl = document.getElementById('cSubject');
  const messageEl = document.getElementById('cMessage');
  const feedback  = document.getElementById('formMsg');
  const btn       = document.getElementById('submitBtn');

  if (!nameEl || !emailEl || !messageEl || !feedback || !btn) return;

  const name    = nameEl.value.trim();
  const email   = emailEl.value.trim();
  const subject = subjectEl ? subjectEl.value.trim() : 'Portfolio Contact';
  const message = messageEl.value.trim();

  // Reset feedback
  feedback.className = 'form-feedback';
  feedback.style.display = 'none';

  // Validation
  if (!name || !email || !message) {
    showFormFeedback('error', '<i class="fas fa-circle-exclamation me-2"></i>Please fill in all required fields (Name, Email, Message).');
    return;
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    showFormFeedback('error', '<i class="fas fa-circle-exclamation me-2"></i>Please provide a valid email address.');
    return;
  }

  // Button loading state
  const originalBtnContent = btn.innerHTML;
  btn.innerHTML = '<span>Transmitting...</span> <i class="fas fa-spinner fa-spin ms-2"></i>';
  btn.disabled = true;

  try {
    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name, email, subject, message })
    });

    const data = await response.json();

    if (data.success) {
      showFormFeedback('success', '<i class="fas fa-check-circle me-2"></i>Message dispatched successfully! Thank you for reaching out.');
      nameEl.value = '';
      emailEl.value = '';
      if (subjectEl) subjectEl.value = '';
      messageEl.value = '';
    } else {
      showFormFeedback('error', `<i class="fas fa-circle-exclamation me-2"></i>${data.message || 'Unable to deliver message. Please try again.'}`);
    }
  } catch (err) {
    showFormFeedback('error', '<i class="fas fa-circle-exclamation me-2"></i>Network communication error. You can email me directly at <a href="mailto:anjalishikhare.sveri.cse@gmail.com" class="text-dark fw-bold">anjalishikhare.sveri.cse@gmail.com</a>.');
  } finally {
    btn.innerHTML = originalBtnContent;
    btn.disabled = false;
  }
}

function showFormFeedback(type, messageHtml) {
  const feedback = document.getElementById('formMsg');
  if (!feedback) return;

  feedback.className = `form-feedback ${type}`;
  feedback.innerHTML = messageHtml;
  feedback.style.display = 'block';
}
