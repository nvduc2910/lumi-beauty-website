// Smooth scrolling and animations for Lumi Beauty website

// Zalo Contact Modal handling
function initZaloContactModal() {
  const modal = document.getElementById("zaloContactModal");
  if (!modal) return;

  const openLinks = document.querySelectorAll("[data-open-zalo-modal]");
  const closeTriggers = modal.querySelectorAll("[data-modal-close]");
  const body = document.body;
  const descElement = modal.querySelector("[data-zalo-service-desc]");
  let currentServiceKey = null;

  // Service name mapping
  const serviceMap = {
    vi: {
      "eyebrow-tattoo": "phun mày",
      "phun-may-shading": "phun mày shading",
      "eyeliner-tattoo": "phun mí mở tròng",
      "lip-brightening": "khử thâm môi",
    },
    en: {
      "eyebrow-tattoo": "eyebrow PMU",
      "phun-may-shading": "eyebrow shading PMU",
      "eyeliner-tattoo": "eyeliner PMU",
      "lip-brightening": "lip brightening",
    },
    ko: {
      "eyebrow-tattoo": "눈썹 반영구",
      "phun-may-shading": "눈썹 쉐이딩 반영구",
      "eyeliner-tattoo": "아이라인 반영구",
      "lip-brightening": "입술 톤 브라이트닝",
    },
  };

  const getServiceKey = (href) => {
    const url = href || "";

    if (url.includes("phun-may-shading")) {
      return "phun-may-shading";
    } else if (url.includes("eyebrow-tattoo")) {
      return "eyebrow-tattoo";
    } else if (url.includes("eyeliner-tattoo")) {
      return "eyeliner-tattoo";
    } else if (
      url.includes("khu-tham-moi-nam-nu") ||
      url.includes("lip-brightening")
    ) {
      return "lip-brightening";
    }

    return null;
  };

  const updateModalDescription = (serviceKey) => {
    if (!descElement || !serviceKey) return;

    currentServiceKey = serviceKey;
    const serviceName =
      serviceMap[currentLanguage] && serviceMap[currentLanguage][serviceKey]
        ? serviceMap[currentLanguage][serviceKey]
        : null;

    if (!serviceName) return;

    const dict = getDictionary(currentLanguage);
    let desc =
      dict.zalo_contact_modal_desc ||
      "Bạn đang quan tâm tới dịch vụ {service}. Vui lòng liên hệ với chúng tôi qua Zalo để được tư vấn chi tiết.";
    desc = desc.replace("{service}", serviceName);
    descElement.textContent = desc;
  };

  const openModal = (event, linkElement) => {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    // Detect service name from the link
    const href = linkElement
      ? linkElement.getAttribute("href") || linkElement.textContent.trim()
      : null;
    const serviceKey = getServiceKey(href);

    // Update modal description with service name
    if (serviceKey) {
      updateModalDescription(serviceKey);
    }

    if (modal.classList.contains("is-open")) return;
    modal.classList.remove("is-closing");
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    body.classList.add("modal-open");

    const focusTarget = modal.querySelector("a, button");
    if (focusTarget) {
      setTimeout(() => focusTarget.focus(), 80);
    }
  };

  const closeModal = (skipAnimation = false) => {
    if (!modal.classList.contains("is-open")) return;

    const finalizeClose = () => {
      modal.classList.remove("is-open", "is-closing");
      modal.setAttribute("aria-hidden", "true");
      body.classList.remove("modal-open");
    };

    if (skipAnimation) {
      finalizeClose();
      return;
    }

    if (modal.classList.contains("is-closing")) {
      return;
    }

    modal.classList.add("is-closing");
    const dialog = modal.querySelector(".modal-dialog");

    if (dialog) {
      dialog.addEventListener("animationend", finalizeClose, { once: true });
    } else {
      finalizeClose();
    }
  };

  openLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      openModal(event, link);
    });
  });

  closeTriggers.forEach((trigger) => {
    trigger.addEventListener("click", () => {
      closeModal();
    });
  });

  modal.addEventListener("click", (event) => {
    if (event.target.classList.contains("modal-backdrop")) {
      closeModal();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && modal.classList.contains("is-open")) {
      closeModal();
    }
  });
}

document.addEventListener("DOMContentLoaded", function () {
  // Initialize all animations and interactions
  initScrollAnimations();
  initMobileMenu();
  initServicesDropdown();
  initContactForm();
  initBookingModal();
  initZaloContactModal();
  initImageGallery();
  initCounterAnimations();
  initParallaxEffects();
  initLanguageSwitcher();
  initBlogScroller();
  initHeroVideo();
});

// Listen for components loaded event (for blog posts with dynamic header/footer)
// This ensures translations are re-applied after components are loaded
document.addEventListener("componentsLoaded", function () {
  // Re-apply translations to newly loaded components
  if (
    typeof setLanguage === "function" &&
    typeof currentLanguage !== "undefined"
  ) {
    setTimeout(() => {
      // Initialize language without redirecting (skipRedirect = true)
      setLanguage(currentLanguage, true);
      // Re-initialize language switcher to update dropdown button
      if (typeof initLanguageSwitcher === "function") {
        initLanguageSwitcher();
      }
    }, 100);
  }
});

// Scroll-triggered animations
function initScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("animate-fade-in-up");
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observe all sections for animation
  const sections = document.querySelectorAll("section");
  sections.forEach((section) => {
    observer.observe(section);
  });

  // Observe cards and items for staggered animations
  const cards = document.querySelectorAll(
    ".service-card, .testimonial-card, .blog-card, .feature-item"
  );
  cards.forEach((card, index) => {
    card.style.animationDelay = `${index * 0.1}s`;
    observer.observe(card);
  });
}

// Mobile menu functionality
function initMobileMenu() {
  const mobileToggle = document.querySelector(".mobile-menu-toggle");
  const nav = document.querySelector(".nav");

  if (mobileToggle && nav) {
    mobileToggle.addEventListener("click", function () {
      nav.classList.toggle("active");
      mobileToggle.classList.toggle("active");
    });

    // Close menu when clicking on links
    const navLinks = document.querySelectorAll(".nav-list a");
    navLinks.forEach((link) => {
      link.addEventListener("click", () => {
        nav.classList.remove("active");
        mobileToggle.classList.remove("active");
      });
    });
  }
}

// Services dropdown functionality
function initServicesDropdown() {
  const dropdownItem = document.querySelector(".nav-item-dropdown");
  const dropdownLink = document.querySelector(".nav-link-with-dropdown");
  const dropdownMenu = document.querySelector(".nav-dropdown-menu");

  if (!dropdownItem || !dropdownLink || !dropdownMenu) {
    return;
  }

  // Toggle dropdown on click (for mobile/touch devices)
  dropdownLink.addEventListener("click", function (e) {
    // On mobile, prevent default and toggle dropdown
    if (window.innerWidth <= 768) {
      e.preventDefault();
      dropdownItem.classList.toggle("active");
    }
    // On desktop, allow default behavior (scroll to #services)
  });

  // Close dropdown when clicking outside
  document.addEventListener("click", function (e) {
    if (!dropdownItem.contains(e.target)) {
      dropdownItem.classList.remove("active");
    }
  });

  // Close dropdown when clicking on a dropdown link
  const dropdownLinks = dropdownMenu.querySelectorAll("a");
  dropdownLinks.forEach((link) => {
    link.addEventListener("click", () => {
      dropdownItem.classList.remove("active");
      // Also close mobile menu if open
      const nav = document.querySelector(".nav");
      const mobileToggle = document.querySelector(".mobile-menu-toggle");
      if (nav && mobileToggle) {
        nav.classList.remove("active");
        mobileToggle.classList.remove("active");
      }
    });
  });
}

// Contact form handling
function initContactForm() {
  const contactForm = document.querySelector(".contact-form");

  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const phoneInput = contactForm.querySelector('input[type="tel"]');
      const phoneNumber = phoneInput.value.trim();

      if (phoneNumber) {
        // Show success message
        showNotification(t("contact_form_success"), "success");
        phoneInput.value = "";

        // Here you would typically send the data to a server
        console.log("Phone number submitted:", phoneNumber);
      } else {
        showNotification(t("contact_form_phone_required"), "error");
      }
    });
  }
}

// Booking modal handling
function initBookingModal() {
  const modal = document.getElementById("bookingModal");
  if (!modal) return;

  const openButtons = document.querySelectorAll('[data-action="open-booking"]');
  const closeTriggers = modal.querySelectorAll("[data-modal-close]");
  const body = document.body;
  const form = modal.querySelector(".booking-form");
  const responseEl = modal.querySelector(".form-response");

  const openModal = () => {
    if (modal.classList.contains("is-open")) return;
    modal.classList.remove("is-closing");
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    body.classList.add("modal-open");

    if (responseEl) {
      responseEl.textContent = "";
      responseEl.classList.remove("error");
    }

    const focusTarget = modal.querySelector("input, select, textarea, button");
    if (focusTarget) {
      setTimeout(() => focusTarget.focus(), 80);
    }
  };

  const closeModal = (skipAnimation = false) => {
    if (!modal.classList.contains("is-open")) return;

    const finalizeClose = () => {
      modal.classList.remove("is-open", "is-closing");
      modal.setAttribute("aria-hidden", "true");
      body.classList.remove("modal-open");
      if (responseEl) {
        responseEl.textContent = "";
        responseEl.classList.remove("error");
      }
    };

    if (skipAnimation) {
      finalizeClose();
      return;
    }

    if (modal.classList.contains("is-closing")) {
      return;
    }

    modal.classList.add("is-closing");
    const dialog = modal.querySelector(".modal-dialog");

    if (dialog) {
      dialog.addEventListener("animationend", finalizeClose, { once: true });
    } else {
      finalizeClose();
    }
  };

  openButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
      event.preventDefault();
      openModal();
    });
  });

  closeTriggers.forEach((trigger) => {
    trigger.addEventListener("click", () => {
      closeModal();
    });
  });

  modal.addEventListener("click", (event) => {
    if (event.target.classList.contains("modal-backdrop")) {
      closeModal();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && modal.classList.contains("is-open")) {
      closeModal();
    }
  });

  if (form) {
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      const formData = new FormData(form);

      try {
        responseEl.textContent = t("booking_sending");
        responseEl.classList.remove("error");

        const submission = await fetch(form.action, {
          method: "POST",
          body: formData,
          headers: {
            Accept: "application/json",
          },
        });

        if (!submission.ok) {
          throw new Error("Form submission failed");
        }

        responseEl.textContent = t("booking_success");
        form.reset();

        setTimeout(() => {
          closeModal();
        }, 2000);
      } catch (error) {
        console.error("Booking form submit error:", error);
        responseEl.textContent = t("booking_error");
        responseEl.classList.add("error");
      }
    });
  }
}

// Image gallery with lightbox effect
function initImageGallery() {
  const galleryImages = Array.from(
    document.querySelectorAll(".gallery-item img, .feedback-item img")
  );

  if (!galleryImages.length) return;

  const images = galleryImages.map((img) => ({
    src: img.src,
    alt: img.alt || "",
  }));

  galleryImages.forEach((img, index) => {
    img.dataset.galleryIndex = String(index);
    img.addEventListener("click", () => {
      openLightbox(images, index);
    });
  });
}

function openLightbox(images, startIndex = 0) {
  if (!Array.isArray(images) || !images.length) return;

  let currentIndex = startIndex;

  const lightbox = document.createElement("div");
  lightbox.className = "lightbox active";
  lightbox.setAttribute("role", "dialog");
  lightbox.setAttribute("aria-modal", "true");
  lightbox.innerHTML = `
        <div class="lightbox-content">
            <button class="lightbox-btn lightbox-btn--prev" type="button" aria-label="Previous image">&#10094;</button>
            <img class="lightbox-image" src="${
              images[currentIndex].src
            }" alt="${images[currentIndex].alt}">
            <button class="lightbox-btn lightbox-btn--next" type="button" aria-label="Next image">&#10095;</button>
            <span class="lightbox-close" aria-label="Close">&times;</span>
        </div>
        <div class="lightbox-counter">
            <span class="lightbox-index">${currentIndex + 1}</span>
            <span>/</span>
            <span class="lightbox-total">${images.length}</span>
        </div>
    `;

  document.body.appendChild(lightbox);
  document.body.style.overflow = "hidden";

  const imageEl = lightbox.querySelector(".lightbox-image");
  const closeBtn = lightbox.querySelector(".lightbox-close");
  const prevBtn = lightbox.querySelector(".lightbox-btn--prev");
  const nextBtn = lightbox.querySelector(".lightbox-btn--next");
  const indexEl = lightbox.querySelector(".lightbox-index");

  const render = () => {
    const item = images[currentIndex];
    imageEl.src = item.src;
    imageEl.alt = item.alt;
    indexEl.textContent = String(currentIndex + 1);
  };

  const showNext = () => {
    currentIndex = (currentIndex + 1) % images.length;
    render();
  };

  const showPrev = () => {
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    render();
  };

  const teardown = () => {
    document.removeEventListener("keydown", onKeyDown);
    lightbox.removeEventListener("click", onBackdropClick);
    lightbox.removeEventListener("touchstart", onTouchStart);
    lightbox.removeEventListener("touchend", onTouchEnd);
    document.body.style.overflow = "";
    document.body.removeChild(lightbox);
  };

  const onKeyDown = (event) => {
    if (event.key === "Escape") {
      teardown();
    } else if (event.key === "ArrowRight") {
      showNext();
    } else if (event.key === "ArrowLeft") {
      showPrev();
    }
  };

  const onBackdropClick = (event) => {
    if (event.target === lightbox) {
      teardown();
    }
  };

  let touchStartX = 0;
  const onTouchStart = (event) => {
    touchStartX = event.changedTouches[0].clientX;
  };
  const onTouchEnd = (event) => {
    const touchEndX = event.changedTouches[0].clientX;
    const deltaX = touchEndX - touchStartX;
    if (Math.abs(deltaX) > 40) {
      if (deltaX < 0) {
        showNext();
      } else {
        showPrev();
      }
    }
  };

  closeBtn.addEventListener("click", teardown);
  prevBtn.addEventListener("click", showPrev);
  nextBtn.addEventListener("click", showNext);
  document.addEventListener("keydown", onKeyDown);
  lightbox.addEventListener("click", onBackdropClick);
  lightbox.addEventListener("touchstart", onTouchStart);
  lightbox.addEventListener("touchend", onTouchEnd);

  const styleId = "lightbox-styles";
  if (!document.getElementById(styleId)) {
    const style = document.createElement("style");
    style.id = styleId;
    style.textContent = `
            .lightbox {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.9);
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                z-index: 10000;
                animation: fadeIn 0.3s ease;
            }
            .lightbox-content {
                position: relative;
                display: flex;
                align-items: center;
                gap: 1.5rem;
                max-width: min(90vw, 1000px);
                max-height: min(80vh, 680px);
                padding: 24px;
            }
            .lightbox-image {
                max-width: 100%;
                max-height: 100%;
                border-radius: 16px;
                object-fit: contain;
                box-shadow: 0 24px 48px rgba(15, 23, 42, 0.35);
            }
            .lightbox-btn {
                border: none;
                background: rgba(0, 0, 0, 0.45);
                color: white;
                width: 48px;
                height: 48px;
                border-radius: 50%;
                font-size: 30px;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: background 0.2s ease;
            }
            .lightbox-btn:hover {
                background: rgba(0, 0, 0, 0.65);
            }
            .lightbox-close {
                position: absolute;
                top: 8px;
                right: 16px;
                color: white;
                font-size: 32px;
                cursor: pointer;
                background: rgba(0, 0, 0, 0.45);
                width: 44px;
                height: 44px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            .lightbox-close:hover {
                background: rgba(0, 0, 0, 0.65);
            }
            .lightbox-counter {
                margin-top: 12px;
                color: #f3f4f6;
                font-size: 0.95rem;
                letter-spacing: 0.08em;
            }
            @media (max-width: 768px) {
                .lightbox-content {
                    flex-direction: row;
                    gap: 0.8rem;
                    padding: 16px;
                }
                .lightbox-btn {
                    width: 40px;
                    height: 40px;
                    font-size: 24px;
                }
                .lightbox-image {
                    max-width: calc(100vw - 120px);
                    max-height: calc(100vh - 160px);
                }
            }
        `;
    document.head.appendChild(style);
  }
}

// Counter animations for statistics
function initCounterAnimations() {
  const counters = document.querySelectorAll(".stat-number");

  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  counters.forEach((counter) => {
    counterObserver.observe(counter);
  });
}

function animateCounter(element) {
  const target = parseInt(element.textContent.replace(/\D/g, ""));
  const duration = 2000;
  const increment = target / (duration / 16);
  let current = 0;

  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      current = target;
      clearInterval(timer);
    }

    const suffix = element.textContent.replace(/\d/g, "").replace(/\+/g, "");
    element.textContent = Math.floor(current) + suffix;
  }, 16);
}

// Parallax effects for hero section
function initParallaxEffects() {
  const heroImage = document.querySelector(".main-image");
  const overlayItems = document.querySelectorAll(".overlay-item");

  if (!heroImage) {
    return;
  }

  let latestScrollY = window.pageYOffset;
  let ticking = false;

  const updateTransforms = () => {
    const rate = latestScrollY * -0.5;
    heroImage.style.transform = `translateY(${rate}px)`;

    if (overlayItems.length) {
      overlayItems.forEach((item, index) => {
        const itemRate = latestScrollY * (-0.3 - index * 0.1);
        item.style.transform = `translateY(${itemRate}px)`;
      });
    }

    ticking = false;
  };

  const requestTick = () => {
    if (!ticking) {
      window.requestAnimationFrame(updateTransforms);
      ticking = true;
    }
  };

  window.addEventListener(
    "scroll",
    () => {
      latestScrollY = window.pageYOffset;
      requestTick();
    },
    { passive: true }
  );

  // Initial paint
  requestTick();
}

// Lazy load hero video for better performance
function initHeroVideo() {
  const heroVideo = document.querySelector(".hero-video");
  if (!heroVideo) return;

  // Use Intersection Observer to load video when it's about to enter viewport
  const videoObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const video = entry.target;

          // Load the video source
          video.load();

          // Try to play the video (autoplay)
          const playPromise = video.play();

          if (playPromise !== undefined) {
            playPromise
              .then(() => {
                // Video is playing
                video.classList.add("video-loaded");
              })
              .catch((error) => {
                // Autoplay was prevented, but video is loaded
                console.log("Video autoplay prevented:", error);
                video.classList.add("video-loaded");
              });
          }

          // Stop observing once video starts loading
          videoObserver.unobserve(video);
        }
      });
    },
    {
      // Start loading when video is 200px away from viewport
      rootMargin: "200px",
      threshold: 0.01,
    }
  );

  videoObserver.observe(heroVideo);

  // Fallback: Load video after page is fully loaded if it hasn't loaded yet
  window.addEventListener("load", () => {
    setTimeout(() => {
      if (!heroVideo.classList.contains("video-loaded")) {
        heroVideo.load();
        const playPromise = heroVideo.play();
        if (playPromise !== undefined) {
          playPromise.catch(() => {
            // Autoplay prevented, but video is ready
          });
        }
        heroVideo.classList.add("video-loaded");
      }
    }, 500);
  });
}

// Notification system
function showNotification(message, type = "info") {
  const notification = document.createElement("div");
  notification.className = `notification notification-${type}`;
  notification.textContent = message;

  // Add notification styles
  const style = document.createElement("style");
  style.textContent = `
        .notification {
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 8px;
            color: white;
            font-weight: 600;
            z-index: 10000;
            animation: slideInRight 0.3s ease;
        }
        .notification-success {
            background: #4ecdc4;
        }
        .notification-error {
            background: #ff6b9d;
        }
        .notification-info {
            background: #6c757d;
        }
        @keyframes slideInRight {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
    `;
  document.head.appendChild(style);

  document.body.appendChild(notification);

  // Remove notification after 3 seconds
  setTimeout(() => {
    notification.style.animation = "slideInRight 0.3s ease reverse";
    setTimeout(() => {
      if (document.body.contains(notification)) {
        document.body.removeChild(notification);
      }
    }, 300);
  }, 3000);
}

// Get current language from URL path (/vi, /en, /ko)
function getCurrentLanguageFromPath() {
  const path = window.location.pathname;
  if (path.startsWith("/vi/") || path === "/vi" || path.endsWith("/vi")) {
    return "vi";
  } else if (
    path.startsWith("/en/") ||
    path === "/en" ||
    path.endsWith("/en")
  ) {
    return "en";
  } else if (
    path.startsWith("/ko/") ||
    path === "/ko" ||
    path.endsWith("/ko")
  ) {
    return "ko";
  }
  // Default to vi if no language in path
  return "vi";
}

// Get base path for current language
function getLanguageBasePath() {
  const lang = getCurrentLanguageFromPath();
  return `/${lang}/`;
}

// Fix navigation links to work with /vi, /en, /ko structure
function initNavigationLinks() {
  const lang = getCurrentLanguageFromPath();
  const basePath = getLanguageBasePath();

  // Fix logo link - if it's "/" or absolute root, make it relative to current language
  const logoLink = document.querySelector(".logo a");
  if (logoLink) {
    const logoHref = logoLink.getAttribute("href");
    if (logoHref === "/" || logoHref === "") {
      logoLink.setAttribute("href", `${basePath}index.html`);
    } else if (logoHref.startsWith("/") && !logoHref.startsWith(`/${lang}/`)) {
      // If it's absolute but not with language prefix, fix it
      const relativePath = logoHref.substring(1);
      logoLink.setAttribute("href", `${basePath}${relativePath}`);
    }
  }

  // Smooth scroll for anchor links on the same page
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const href = this.getAttribute("href");
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
        // Update URL hash without scrolling
        if (window.history && window.history.replaceState) {
          window.history.replaceState(null, null, href);
        }
      }
    });
  });

  // Fix relative links in navigation to ensure they work correctly
  const navLinks = document.querySelectorAll(".nav a[href]");
  navLinks.forEach((link) => {
    const href = link.getAttribute("href");

    // Skip anchor links (already handled above)
    if (href && href.startsWith("#")) {
      return;
    }

    // Skip external links
    if (
      href &&
      (href.startsWith("http://") ||
        href.startsWith("https://") ||
        href.startsWith("//"))
    ) {
      return;
    }

    // If link is absolute path starting with / but not with language prefix, fix it
    if (
      href &&
      href.startsWith("/") &&
      !href.startsWith("/vi/") &&
      !href.startsWith("/en/") &&
      !href.startsWith("/ko/")
    ) {
      // Remove leading slash and add language prefix
      const relativePath = href.substring(1);
      link.setAttribute("href", `${basePath}${relativePath}`);
    }
    // Relative links (like "gallery.html" or "../../index.html") should work as is
  });
}

// Initialize navigation links on page load
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initNavigationLinks);
} else {
  initNavigationLinks();
}

// Header scroll effect
window.addEventListener("scroll", () => {
  const header = document.querySelector(".header");
  if (window.scrollY > 100) {
    header.classList.add("scrolled");
  } else {
    header.classList.remove("scrolled");
  }
});

// Add scrolled header styles
const headerStyle = document.createElement("style");
headerStyle.textContent = `
    .header.scrolled {
        background: rgba(255, 255, 255, 0.95);
        backdrop-filter: blur(10px);
    }
    
    .mobile-menu-toggle.active span:nth-child(1) {
        transform: rotate(45deg) translate(5px, 5px);
    }
    
    .mobile-menu-toggle.active span:nth-child(2) {
        opacity: 0;
    }
    
    .mobile-menu-toggle.active span:nth-child(3) {
        transform: rotate(-45deg) translate(7px, -6px);
    }
    
    @media (max-width: 768px) {
        .header-content {
            position: relative;
        }
        
        .nav {
            display: none;
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background: white;
            flex-direction: column;
            padding: 2rem;
            opacity: 0;
            transform: translateY(-10px);
            z-index: 999;
        }
        
        .nav.active {
            display: flex;
            animation: mobileNavSlide 0.3s ease forwards;
        }
        
        .nav-list {
            flex-direction: column;
            gap: 1rem;
            width: 100%;
        }
        
        .nav-list a {
            padding: 0.5rem 0;
            border-bottom: 1px solid #eee;
            display: block;
        }

        @keyframes mobileNavSlide {
            from {
                opacity: 0;
                transform: translateY(-10px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
    }
`;
document.head.appendChild(headerStyle);

// Language switching functionality
const translations = {
  vi: {
    // General
    page_title:
      "Lumi Beauty - Phun Xăm Thẩm Mỹ Đẹp Tự Nhiên Tại Đà Nẵng - Chuyên Phun Mày Môi Mí Chuyên Nghiệp",
    close_modal: "Đóng",
    floating_contact_zalo: "Chat Zalo",
    floating_contact_facebook: "Chat Facebook",
    floating_contact_tiktok: "TikTok",
    meta_description:
      "Lumi Beauty Đà Nẵng chuyên phun xăm thẩm mỹ mày, môi, mí chuẩn y khoa với công nghệ hiện đại, không đau rát và chăm sóc tận tâm.",
    meta_keywords:
      "phun xăm thẩm mỹ đà nẵng, phun môi đẹp, phun mày tự nhiên, Lumi Beauty",
    og_title: "Lumi Beauty - Phun Xăm Thẩm Mỹ Đẹp Tự Nhiên Tại Đà Nẵng",
    og_description:
      "Trải nghiệm phun mày, phun môi, phun mí chuẩn y khoa tại Lumi Beauty Đà Nẵng - không đau rát, không sưng, màu đẹp lâu bền.",
    twitter_title: "Lumi Beauty - Phun Xăm Thẩm Mỹ Đà Nẵng",
    twitter_description:
      "Lumi Beauty cung cấp dịch vụ phun mày, môi, mí hiện đại 1-1 tận tâm và kết quả tự nhiên bền đẹp.",
    business_name: "Lumi Beauty",
    business_description:
      "Lumi Beauty Đà Nẵng cung cấp phun xăm thẩm mỹ mày, môi, mí chuẩn y khoa, không đau rát và dịch vụ chăm sóc khách hàng tận tâm.",

    // Navigation
    beauty_services: "Dịch vụ phun xăm",
    beauty_guide: "Kiến thức",
    gallery: "Thư viện ảnh",
    feedback: "Feedback",
    contact: "Liên hệ",
    offers: "Feedback",
    book_now: "ĐẶT LỊCH NGAY",
    about_us_contact: "About us & Contact",

    // Hero Section
    main_title: "PHUN XĂM THẨM MỸ",
    natural_beauty: "Đẹp TỰ NHIÊN",
    enhance_features: "Tôn nét riêng của bạn",
    hero_description:
      "Lumi Beauty mang đến trải nghiệm <strong>phun xăm 1-1 chuyên biệt</strong> cho từng gương mặt, giúp bạn sở hữu đôi môi hồng hào, cặp mày thanh thoát và ánh nhìn tự nhiên. Mỗi khách hàng được chăm sóc riêng biệt bởi chuyên viên phun xăm có kinh nghiệm, đảm bảo kết quả tinh tế và hài hòa nhất.",
    contact_now: "LIÊN HỆ NGAY",

    // Feature Tags
    no_pain: "KHÔNG ĐAU RÁT",
    no_swelling: "KHÔNG SƯNG",
    no_diet: "KHÔNG CẦN KIÊNG",

    // Stats
    years_experience: "năm kinh nghiệm",
    potential_customers: "khách hàng tiềm năng",
    five_star_reviews: "đánh giá 5* từ khách hàng",
    certifications: "giấy chứng chỉ hành nghề",

    // Help Section
    greeting: "Xin chào!",
    how_can_help:
      "Lumi Beauty có thể giới thiệu bản thân trong 1 phút được ko?",
    help_intro:
      "Lumi Beauty là địa chỉ phun xăm thẩm mỹ tại Đà Nẵng được nhiều khách hàng tin chọn nhờ phong cách 1-1 riêng tư và tận tâm.",
    help_quote:
      'Chúng tôi tin rằng: "Mỗi gương mặt là một nét đẹp riêng cần được tôn lên một cách tinh tế và tự nhiên."',
    help_commitment:
      "Vì vậy, Lumi luôn dành trọn thời gian để lắng nghe, tư vấn và thiết kế dáng môi – mày – mí phù hợp nhất với từng khách hàng. Với quy trình chuẩn y khoa, màu mực organic an toàn, Lumi Beauty cam kết mang lại vẻ đẹp tự nhiên, không sưng, không đau và bền màu theo thời gian.",
    book_description:
      "Đặt lịch hẹn hôm nay để được tư vấn và nhận nhiều ưu đãi hấp dẫn",
    contact_description:
      "Liên hệ với chúng tôi ngay nếu bạn có ý kiến phản hồi hoặc bất kỳ thắc mắc cần được tư vấn",
    book_appointment: "Đặt lịch hẹn hôm nay",
    want_to_book: "TÔI MUỐN ĐẶT LỊCH HẸN",
    contact_us: "Liên hệ",
    need_consultation: "TÔI CẦN TƯ VẤN",

    // Services
    our_services: "Dịch Vụ Của Lumi Beauty",
    lip_tattoo_title: "Phun môi collagen",
    lip_tattoo_benefit1: "Giúp môi hồng hào, tươi tắn và căng mọng tự nhiên.",
    lip_tattoo_benefit2:
      "Kỹ thuật 1-1 với đầu kim siêu mảnh, giảm đau tối đa và lên màu chuẩn đẹp sau khi bong.",
    lip_tattoo_benefit3: "Phù hợp cho môi khô, thâm hoặc nhạt màu.",
    eyebrow_tattoo_title: "Phun mày shading",
    eyebrow_tattoo_benefit1:
      "Tạo dáng mày hài hòa, mềm mại, tự nhiên, tôn nét thanh thoát của gương mặt.",
    eyebrow_tattoo_benefit2:
      "Kỹ thuật phun mày 1-1, đo tỉ lệ chuẩn theo khuôn mặt trước khi thực hiện.",
    eyebrow_tattoo_benefit3: "Đảm bảo dáng mày cân đối, không thô cứng.",
    eyeliner_tattoo_title: "Phun mí mở tròng",
    eyeliner_tattoo_benefit1:
      "Giúp đôi mắt to tròn, có chiều sâu và vẫn tự nhiên.",
    eyeliner_tattoo_benefit2:
      "Quy trình nhẹ nhàng, không đau, không cần can thiệp phẫu thuật.",
    eyeliner_tattoo_benefit3:
      "Phù hợp khách muốn làm đẹp nhưng giữ vẻ tự nhiên.",
    lip_removal_title: "Khử thâm môi cho nam & nữ",
    lip_removal_benefit1:
      "Phục hồi sắc môi sáng hồng tự nhiên, đều màu và mềm mại.",
    lip_removal_benefit2:
      "Kỹ thuật khử thâm 1-1, an toàn, hiệu quả chỉ sau một liệu trình.",
    lip_removal_benefit3:
      "Giải pháp cho cả nam giới muốn cải thiện màu môi mà không bị đỏ giả.",
    discover_more: "KHÁM PHÁ THÊM",

    // Service Detail - Lip Tattoo
    lip_detail_page_title:
      "Phun Môi Collagen Đà Nẵng - Lumi Beauty | Kỹ Thuật Chuẩn Y Khoa",
    lip_detail_meta_description:
      "Phun môi collagen tại Lumi Beauty Đà Nẵng: kỹ thuật chuẩn y khoa, 1-1 chuyên viên 7+ năm kinh nghiệm, màu giữ bền 18-36 tháng, hồi phục nhanh 1-2 ngày. Mực hữu cơ nhập khẩu, bảo hành 04 tháng.",
    lip_detail_badge: "Dịch vụ nổi bật",
    lip_detail_hero_heading: "Phun Môi Collagen Lumi Beauty",
    lip_detail_hero_subheading: "Sắc môi ửng hồng, căng mọng chỉ sau 48 giờ",
    lip_detail_hero_highlight1:
      "Giảm thâm và cải thiện sắc môi rõ rệt chỉ sau một liệu trình",
    lip_detail_hero_highlight2:
      "Màu môi trong trẻo, mềm mịn, không viền – không bị đậm hay bệt",
    lip_detail_hero_highlight3:
      "Cảm giác nhẹ nhàng, hầu như không đau – hồi phục nhanh sau 1–2 ngày",
    lip_detail_hero_highlight4:
      "Màu giữ bền 18–36 tháng, lên sắc chuẩn và không phai loang",
    lip_detail_hero_paragraph1:
      "Chúng tôi kết hợp kỹ thuật phun Collagen Baby Lip với phác đồ đo sắc tố riêng cho từng khách hàng. 100% mực hữu cơ nhập khẩu, không chì, không gây khô nứt và giữ màu chuẩn từ 18-36 tháng.",
    lip_detail_hero_paragraph2:
      "Liệu trình được thực hiện bởi chuyên viên có chứng chỉ y tế, quy trình chuẩn vô khuẩn, cam kết không đau rát, không sưng và hồi phục nhanh.",
    lip_detail_hero_stat_label: "Khách hài lòng sau buổi dặm đầu tiên",
    lip_detail_highlights_title: "Vì sao phun môi tại Lumi Beauty khác biệt?",
    lip_detail_highlight1_title: "Công nghệ Collagen Baby Lip",
    lip_detail_highlight1_desc:
      "Hạt mực siêu mịn kết hợp serum collagen nội sinh giúp môi phục hồi nhanh, mềm mượt và căng bóng tự nhiên.",
    lip_detail_highlight2_title: "Phác màu riêng cho từng sắc tố",
    lip_detail_highlight2_desc:
      "Đo sắc tố da, môi bằng máy phân tích để pha màu chuẩn, không bị lệch tông, không tái thâm sau khi bong.",
    lip_detail_highlight3_title: "Không đau - Không sưng",
    lip_detail_highlight3_desc:
      "Gây tê y khoa ủ 2 lớp và kỹ thuật đi kim nano ôm sát bề mặt, đảm bảo khách ngủ trọn liệu trình, môi không bầm tím.",
    lip_detail_highlight4_title: "Bảo hành 12 tháng",
    lip_detail_highlight4_desc:
      "Theo dõi sát sao sau liệu trình, miễn phí 1 lần dặm màu và tặng bộ chăm sóc tại nhà suốt 12 tháng.",
    lip_detail_process_title: "Quy trình chuẩn y khoa trong 90 phút",
    lip_detail_process_intro:
      "Mỗi bước đều tuân thủ kiểm soát vô trùng, đảm bảo trải nghiệm nhẹ nhàng và kết quả chuẩn xác.",
    lip_detail_process_step1_title: "Thăm khám & tư vấn cá nhân",
    lip_detail_process_step1_desc:
      "Chuyên viên đánh giá tình trạng môi, sắc tố da và mong muốn của khách để lựa chọn tone màu và kỹ thuật phù hợp.",
    lip_detail_process_step2_title: "Vệ sinh & ủ tê an toàn",
    lip_detail_process_step2_desc:
      "Làm sạch môi và vùng quanh, ủ tê chuyên dụng để đảm bảo quá trình phun môi nhẹ nhàng, không đau.",
    lip_detail_process_step3_title: "Pha màu và chuẩn bị dụng cụ",
    lip_detail_process_step3_desc:
      "Mực hữu cơ được pha theo tone cá nhân, dụng cụ vô trùng chuẩn y khoa, đảm bảo an toàn tuyệt đối.",
    lip_detail_process_step4_title: "Phun môi bằng máy PMU chuyên dụng",
    lip_detail_process_step4_desc:
      "Kỹ thuật Collagen giúp môi lên màu chuẩn, mềm mịn, không viền và căng mọng tự nhiên.",
    lip_detail_process_step5_title: "Dưỡng môi và hoàn tất",
    lip_detail_process_step5_desc:
      "Bôi dưỡng bằng tinh chất collagen, kiểm tra lại kết quả, hướng dẫn chăm sóc tại nhà để màu lên đều và bền lâu.",
    lip_detail_process_step6_title: "Chăm sóc & hỗ trợ sau liệu trình",
    lip_detail_process_step6_desc:
      "Hướng dẫn chi tiết cách chăm sóc môi, hỗ trợ dặm màu nếu cần, đảm bảo kết quả lâu dài và môi luôn mềm mượt.",
    process_step1_alt: "Thăm khám & tư vấn cá nhân",
    process_step2_alt: "Vệ sinh & ủ tê an toàn",
    process_step3_alt: "Pha màu và chuẩn bị dụng cụ",
    process_step4_alt: "Phun môi bằng máy PMU chuyên dụng",
    process_step5_alt: "Dưỡng môi và hoàn tất",
    process_step6_alt: "Chăm sóc & hỗ trợ sau liệu trình",
    why_choose_image_alt: "Phun Môi Collagen tại Lumi Beauty",
    lip_detail_results_outcome_title: "Kết quả bạn nhận được",
    lip_detail_results_outcome_item1:
      "Môi ửng hồng sau 48 giờ, lên chuẩn màu sau 7 ngày.",
    lip_detail_results_outcome_item2:
      "Giảm tình trạng thâm bẩm sinh 60-80% ngay sau liệu trình.",
    lip_detail_results_outcome_item3:
      "Dáng môi căng đầy, khóe môi tươi tắn mà không cần son.",
    lip_detail_results_aftercare_title: "Chăm sóc tại nhà đơn giản",
    lip_detail_results_aftercare_item1:
      "Thoa dưỡng môi độc quyền sáng - tối trong 7 ngày đầu.",
    lip_detail_results_aftercare_item2:
      "Tránh nước nóng, thực phẩm quá cay hoặc có màu đậm trong 3 ngày.",
    lip_detail_results_aftercare_item3:
      "Tái khám miễn phí sau 30 ngày để kiểm tra độ bền màu.",
    lip_detail_pricing_title: "Bảng giá & gói ưu đãi Phun Môi Collagen",
    lip_detail_pricing_intro:
      "Giá từ 2.000.000đ – 3.000.000đ, tùy thuộc vào loại môi và tình trạng cụ thể của bạn.",
    lip_detail_pricing_title_main: "Phun Môi Collagen",
    lip_detail_pricing_subtitle:
      "Giá phụ thuộc vào tình trạng môi và màu sắc lựa chọn",
    lip_detail_pricing_item1:
      "Kỹ thuật Collagen chuẩn y khoa – lên màu tự nhiên, mềm mịn",
    lip_detail_pricing_item2:
      "Mỗi khách được chăm sóc 1-1 trong không gian riêng tư",
    lip_detail_pricing_item3: "Miễn phí 1 lần dặm màu trong 04 tháng",
    lip_detail_pricing_item5:
      "100% mực hữu cơ nhập khẩu, không chì, an toàn cho mọi loại môi",
    lip_detail_pricing_option1_title: "Gói Phun Môi Baby Lip",
    lip_detail_pricing_option1_item1: "Phun collagen baby lip chuẩn y khoa.",
    lip_detail_pricing_option1_item2: "Tặng serum dưỡng ẩm 7 ngày.",
    lip_detail_pricing_option1_item3: "Bảo hành 6 tháng.",
    lip_detail_pricing_option2_badge: "Ưa chuộng nhất",
    lip_detail_pricing_option2_title: "Gói Collagen Luxury",
    lip_detail_pricing_option2_item1: "Phun mày môi phối màu theo tông da.",
    lip_detail_pricing_option2_item2:
      "Tặng bộ chăm sóc 14 ngày & serum khóa màu.",
    lip_detail_pricing_option2_item3: "Miễn phí 1 lần dặm màu trong 12 tháng.",
    lip_detail_pricing_option3_title: "Gói Xử Lý Thâm Nặng",
    lip_detail_pricing_option3_item1:
      "Kết hợp khử thâm và phun baby lip 2 buổi.",
    lip_detail_pricing_option3_item2: "Theo dõi định kỳ 3 tháng/lần.",
    lip_detail_pricing_option3_item3: "Tư vấn dinh dưỡng cải thiện sắc tố.",
    lip_detail_pricing_note:
      "Giá đã bao gồm bộ dụng cụ vô trùng dùng một lần và thuế VAT. Giá cụ thể phụ thuộc vào tình trạng môi và màu sắc lựa chọn. Liên hệ để nhận ưu đãi nhóm hoặc chương trình khuyến mãi hiện hành.",
    lip_detail_faq_title: "Câu hỏi thường gặp",
    lip_detail_faq_q1: "Phun môi collagen có đau không?",
    lip_detail_faq_a1:
      "Quy trình sử dụng ủ tê chuyên dụng, kỹ thuật nhẹ nhàng, hầu như không đau và ít sưng.",
    lip_detail_faq_q2: "Màu môi sẽ giữ được bao lâu?",
    lip_detail_faq_a2:
      "Màu lên chuẩn và giữ bền từ 18–36 tháng tùy cơ địa, bạn sẽ có môi hồng tự nhiên lâu dài.",
    lip_detail_faq_q3: "Bao lâu thì môi hồi phục hoàn toàn?",
    lip_detail_faq_a3:
      "Thông thường 1–2 ngày đầu môi hơi sưng nhẹ, sau 5–7 ngày màu ổn định, môi mềm mịn và tự nhiên.",
    lip_detail_faq_q4: "Tôi có cần nghỉ dưỡng sau liệu trình không?",
    lip_detail_faq_a4:
      "Không cần nghỉ dưỡng, bạn có thể sinh hoạt bình thường. Chỉ cần theo hướng dẫn chăm sóc môi để màu lên đẹp nhất.",
    lip_detail_faq_q5: "Tôi có thể chọn tone màu riêng không?",
    lip_detail_faq_a5:
      "Chắc chắn, chuyên viên sẽ tư vấn tone phù hợp với làn da và mong muốn, đảm bảo màu lên tự nhiên.",
    lip_detail_faq_q6: "Nếu môi phai màu hoặc cần chỉnh sửa thì sao?",
    lip_detail_faq_a6:
      "Bạn được miễn phí 1 lần dặm màu trong 04 tháng, đảm bảo môi luôn đẹp và đều màu.",
    lip_problems_title: "Các vấn đề của môi",
    lip_problems_intro:
      "Những vấn đề phổ biến về môi mà chúng tôi có thể giải quyết",
    lip_problem1_title: "Môi thâm, xỉn màu",
    lip_problem1_desc:
      "Môi tối màu khiến khuôn mặt thiếu sức sống và bạn luôn phải dùng son để che khuyết điểm.",
    lip_problem1_alt: "Môi thâm, xỉn màu",
    lip_problem2_title: "Màu môi không đều",
    lip_problem2_desc:
      "Một số vùng môi đậm, một số vùng nhạt khiến việc trang điểm khó và màu môi thiếu hài hòa.",
    lip_problem2_alt: "Màu môi không đều",
    lip_problem4_title: "Môi lệch, viền môi không cân xứng",
    lip_problem4_desc:
      "Môi không đều hai bên khiến nụ cười thiếu hài hòa và làm mất tự tin khi giao tiếp.",
    lip_problem4_alt: "Môi lệch, viền môi không cân xứng",
    lip_problem5_title: "Môi xuống tông theo thời gian",
    lip_problem5_desc:
      "Dù chăm sóc kỹ, màu môi vẫn phai và mất sức sống sau một thời gian, cần giải pháp lâu dài.",
    lip_problem5_alt: "Môi xuống tông theo thời gian",
    why_choose_title: "Vì sao nhiều khách hàng chọn phun môi tại Lumi Beauty",
    why_choose_item1_title: "Phun môi 1-1 – Chuyên viên 7+ năm kinh nghiệm",
    why_choose_item1_desc:
      "Tại Lumi Beauty, mỗi khách hàng được chăm sóc riêng tư, 1-1 bởi chuyên viên phun môi với 7 năm kinh nghiệm, đảm bảo đôi môi lên màu tinh tế, hài hòa và phù hợp từng gương mặt.",
    why_choose_item2_title: "Công nghệ Collagen",
    why_choose_item2_desc:
      "Kỹ thuật tiên tiến giúp môi lên màu tự nhiên, mềm mịn và căng mọng, giảm thâm hiệu quả.",
    why_choose_item3_title: "Mực hữu cơ nhập khẩu, an toàn tuyệt đối",
    why_choose_item3_desc:
      "100% mực hữu cơ không chì, không gây kích ứng, phù hợp với mọi loại da và môi nhạy cảm.",
    why_choose_item4_title: "Quy trình nhẹ nhàng, không đau, hồi phục nhanh",
    why_choose_item4_desc:
      "Phun môi bằng máy PMU chuyên dụng, giảm sưng đau tối đa, phục hồi chỉ sau 1–2 ngày.",
    why_choose_item5_title: "Kết quả bền màu lâu dài",
    why_choose_item5_desc:
      "Màu môi ổn định 18–36 tháng, lên đúng tone và giữ được hiệu ứng tự nhiên theo thời gian.",
    why_choose_item6_title: "Chăm sóc tận tình, bảo hành sau liệu trình",
    why_choose_item6_desc:
      "Hướng dẫn chăm sóc chi tiết, hỗ trợ dặm màu miễn phí để bạn luôn sở hữu đôi môi hoàn hảo.",
    service_commitment_title: "Cam kết dịch vụ",
    service_commitment_intro:
      "Lumi Beauty cam kết mang đến cho bạn dịch vụ tốt nhất với những đảm bảo rõ ràng",
    commitment1_title: "An toàn tuyệt đối",
    commitment1_desc:
      "Quy trình chuẩn y khoa, dụng cụ vô trùng, mực hữu cơ nhập khẩu, bảo vệ sức khỏe môi của bạn.",
    commitment2_title: "Kết quả tự nhiên – bền màu",
    commitment2_desc:
      "Phun môi lên màu chuẩn, mềm mịn, giữ được 18–36 tháng, hài hòa với gương mặt.",
    commitment3_title: "Chăm sóc tận tâm, 1-1",
    commitment3_desc:
      "Mỗi khách hàng được tư vấn và chăm sóc riêng, hướng dẫn chi tiết sau liệu trình để môi luôn đẹp.",
    commitment4_title: "Bảo hành & hỗ trợ dặm màu",
    commitment4_desc:
      "Hỗ trợ dặm màu 1 lần miễn phí nếu cần, đảm bảo đôi môi hoàn hảo như cam kết ban đầu.",
    lip_detail_cta_title: "Sẵn sàng sở hữu sắc môi tươi trẻ?",
    lip_detail_cta_desc:
      "Đặt lịch ngay hôm nay để được Lumi Beauty đo tông màu và lên phác đồ chăm sóc riêng cho bạn.",
    color_development_title: "Quy trình lên màu",
    color_development_intro: "Quá trình phục hồi và lên màu sau khi phun môi",
    timeline_day1_title: "Môi vừa phun xong",
    timeline_day1_desc:
      "Môi hơi căng do tổn thương và thuốc tê, cảm giác nhẹ rát là bình thường.",
    timeline_day2_title: "Môi khô và chuẩn bị bong",
    timeline_day2_desc:
      "Môi bắt đầu khô, cần dùng dưỡng tái tạo để hỗ trợ quá trình bong tự nhiên.",
    timeline_day3_title: "Môi bong nhẹ, màu chưa đều",
    timeline_day3_desc:
      "Lớp bong hoàn toàn, màu nhẹ, viền đậm, lòng môi nhạt. Trong thời gian này, cần dưỡng thường xuyên và kiêng cẩn thận.",
    timeline_day10_title: "Màu môi ổn định dần",
    timeline_day10_desc:
      "Màu có thể sậm hoặc nhạt tùy cơ địa và cách chăm sóc. Đây là giai đoạn bình thường, không cần lo lắng. Thoa dưỡng đều đặn.",
    timeline_day30_title: "Môi tươi tắn, căng mịn",
    timeline_day30_desc:
      "Màu môi bắt đầu đều, môi căng mịn hơn. Tiếp tục thoa dưỡng thường xuyên.",
    timeline_day50_title: "Màu ổn định hoàn toàn",
    timeline_day50_desc:
      "Màu môi ổn định, khách hàng có thể dặm lại nếu màu chưa đạt như mong muốn.",

    // Service Detail - Brow Tattoo
    brow_detail_page_title:
      "Phun Mày Shading Lumi Beauty - Mày mịn như tán bột, đẹp tự nhiên",
    brow_detail_meta_description:
      "Phun mày shading tại Lumi Beauty: mày mịn như tán bột, đẹp tự nhiên 18-36 tháng. Kỹ thuật shading giúp đầu mày mềm - thân mày mịn - đuôi mày sắc nét.",
    brow_detail_badge: "Định hình chân mày",
    brow_detail_hero_heading: "Phun Mày Shading Lumi Beauty",
    brow_detail_hero_subheading:
      "Phun Mày Shading – Mày mịn như tán bột, đẹp tự nhiên 18–36 tháng",
    brow_detail_hero_paragraph1:
      "Kỹ thuật shading giúp đầu mày mềm – thân mày mịn – đuôi mày sắc nét, tạo hiệu ứng makeup nhẹ mà vẫn giữ sự tự nhiên.",
    brow_detail_hero_paragraph2:
      "Shading phù hợp 98% gương mặt – dễ chịu, ít đau, lên màu đều. Mực hữu cơ thuần châu Âu, an toàn với phụ nữ sau sinh từ 6 tháng. Bảo hành dáng và màu trong 04 tháng.",
    brow_detail_hero_stat_label: "Khách không cần kẻ mày trong 18 tháng",
    brow_before_after_title: "Kết quả trước và sau",
    brow_before_after_intro:
      "Xem những kết quả tuyệt vời của khách hàng sau khi phun mày shading tại Lumi Beauty",
    brow_before_after_image1_alt: "Kết quả phun mày tại Lumi Beauty",
    brow_before_after_image2_alt: "Kết quả phun mày tại Lumi Beauty",
    brow_before_after_image3_alt: "Kết quả phun mày tại Lumi Beauty",
    brow_before_after_image4_alt: "Kết quả phun mày tại Lumi Beauty",
    brow_before_after_image5_alt: "Kết quả phun mày tại Lumi Beauty",
    brow_before_after_image6_alt: "Kết quả phun mày tại Lumi Beauty",
    brow_before_after_image7_alt: "Kết quả phun mày tại Lumi Beauty",
    brow_before_after_image8_alt: "Kết quả phun mày tại Lumi Beauty",
    brow_before_after_image9_alt: "Kết quả phun mày tại Lumi Beauty",
    brow_before_after_image10_alt: "Kết quả phun mày tại Lumi Beauty",
    brow_before_after_image11_alt: "Kết quả phun mày tại Lumi Beauty",
    brow_before_after_image12_alt: "Kết quả phun mày tại Lumi Beauty",
    brow_before_after_cta_text: "Muốn biết gương mặt bạn hợp dáng nào?",
    brow_before_after_cta_button: "Cần tư vấn miễn phí",
    brow_who_suitable_title: "Phun Mày Shading Phù Hợp Với Ai?",
    brow_who_suitable_intro: "Dịch vụ này dành cho bạn nếu:",
    brow_who_suitable_image1_alt: "Lông mày quá ngắn",
    brow_who_suitable_item1: "Lông mày quá ngắn",
    brow_who_suitable_image2_alt: "Lông mày nhạt",
    brow_who_suitable_item2: "Lông mày nhạt",
    brow_who_suitable_image3_alt: "Lông mày ngắn, thưa và mỏng",
    brow_who_suitable_item3: "Lông mày ngắn, thưa và mỏng",
    brow_who_suitable_image4_alt: "Lông mày không hài hoà, không cân xứng",
    brow_who_suitable_item4: "Lông mày không hài hoà, không cân xứng",
    brow_who_suitable_note:
      "👉 Shading phù hợp 98% gương mặt – dễ chịu, ít đau, lên màu đều.",
    brow_standards_title: "Tiêu chuẩn một chân mày Shading đẹp",
    brow_standards_intro: "Dành riêng cho shading",
    brow_standard1_image_alt: "Tỉ lệ vừa phải – đầu mềm, đuôi rõ nét",
    brow_standard1_title: "Tỉ lệ vừa phải – đầu mềm, đuôi rõ nét",
    brow_standard1_desc:
      "Shading không sắc đậm như xăm, không lộ sợi như hair-stroke. Tạo độ mờ tự nhiên ở đầu, chuyển mịn dần về đuôi.",
    brow_standard2_image_alt: "Màu trong – không đậm cứng",
    brow_standard2_title: "Màu trong – không đậm cứng",
    brow_standard2_desc:
      "Shading đẹp khi màu mịn, hài hòa, nhìn như đánh eyebrow powder hằng ngày.",
    brow_standard3_image_alt: "Form mày phù hợp gương mặt",
    brow_standard3_title: "Form mày phù hợp gương mặt",
    brow_standard3_desc:
      "Shading tôn kiểu mày ngang, cong nhẹ, hoặc classic arch tùy gương mặt.",
    brow_shapes_title: "Gương mặt nào phù hợp với Shading?",
    brow_shapes_intro:
      "Mỗi khuôn mặt có dáng mày shading phù hợp riêng. Hãy để Lumi Beauty tư vấn cho bạn.",
    brow_shape1_image_alt: "Mặt tròn - Shading có góc nhẹ",
    brow_shape1_title: "Mặt tròn – Shading có góc nhẹ",
    brow_shape1_desc: "Giúp gương mặt thon gọn hơn.",
    brow_shape2_image_alt: "Mặt dài - Shading ngang tự nhiên",
    brow_shape2_title: "Mặt dài – Shading ngang tự nhiên",
    brow_shape2_desc: "Tạo sự cân bằng chiều dài mặt.",
    brow_shape3_image_alt: "Mặt vuông - Shading cong mềm",
    brow_shape3_title: "Mặt vuông – Shading cong mềm",
    brow_shape3_desc: 'Giảm độ góc cạnh, "nữ tính hóa" đường nét.',
    brow_shape4_image_alt: "Mặt trái xoan - Shading natural",
    brow_shape4_title: "Mặt trái xoan – Shading natural",
    brow_shape4_desc: "Giữ vẻ mềm mại tự nhiên cho gương mặt.",
    brow_detail_process_title: "Quy trình phun mày Shading",
    brow_detail_process_intro: "75 phút – chuẩn quốc tế",
    brow_detail_process_step1_title: "Thăm khám và tư vấn",
    brow_detail_process_step1_desc:
      "Kỹ thuật viên kiểm tra tình trạng da, lắng nghe mong muốn và tư vấn dáng mày – màu mực phù hợp.",
    brow_detail_process_step2_title: "Vệ sinh và sát khuẩn",
    brow_detail_process_step2_desc:
      "Vùng chân mày được tẩy trang, làm sạch và sát khuẩn kỹ để tránh viêm nhiễm.",
    brow_detail_process_step3_title: "Ủ tê và chuẩn bị mực",
    brow_detail_process_step3_desc:
      "Kỹ thuật viên ủ tê giúp bạn thoải mái trong suốt quá trình. Trong lúc chờ tê ngấm sẽ tiến hành pha mực phù hợp.",
    brow_detail_process_step4_title: "Đo vẽ dáng mày",
    brow_detail_process_step4_desc:
      "Tiến hành đo tỉ lệ và phác thảo dáng mày sao cho hài hòa với khuôn mặt.",
    brow_detail_process_step5_title: "Thực hiện phun mày Shading",
    brow_detail_process_step5_desc:
      "Sử dụng thiết bị phun xăm chuyên dụng với đầu kim siêu nhỏ để đưa mực vào da và tạo hiệu ứng rải hạt tự nhiên.",
    brow_commitment_title: "Cam kết dịch vụ",
    brow_commitment_intro: "Những cam kết của Lumi Beauty đối với khách hàng",
    brow_commitment1_title: "Lên màu chuẩn trong 10–14 ngày",
    brow_commitment2_title: "Không trổ xanh/đỏ",
    brow_commitment3_title: "Giữ màu 18–36 tháng",
    brow_commitment4_title: "Mực hữu cơ châu Âu",
    brow_commitment5_title: "100% vật tư dùng 1 lần",
    brow_commitment6_title: "Bảo hành 04 tháng – miễn phí dặm",
    why_lumi_brow_title: "Lý do nên chọn Phun Mày Shading tại Lumi Beauty",
    why_lumi_brow_intro: "Rút gọn nhưng mạnh",
    why_lumi_brow0_title: "Phun mày 1-1 – Chuyên viên 7+ năm kinh nghiệm",
    why_lumi_brow0_desc:
      "Tại Lumi Beauty, mỗi khách hàng được chăm sóc riêng tư, 1-1 bởi chuyên viên phun mày với 7 năm kinh nghiệm, đảm bảo chân mày tinh tế, hài hòa và phù hợp từng gương mặt.",
    why_lumi_brow1_title: "Màu shading được pha nhạt hơn 30%",
    why_lumi_brow1_desc: "Đảm bảo tự nhiên sau bong",
    why_lumi_brow2_title: "Kỹ thuật đi kim mịn",
    why_lumi_brow2_desc: "Không đau, không sưng, hồi nhanh",
    why_lumi_brow3_title: "Thiết kế dáng mày cá nhân hóa",
    why_lumi_brow3_desc: "Không làm theo khuôn mẫu",
    why_lumi_brow4_title: "An toàn cho phụ nữ sau sinh từ 6 tháng",
    brow_detail_pricing_title: "Bảng giá – Phun Mày Shading",
    brow_detail_pricing_intro:
      "Giá phụ thuộc vào tình trạng nền cũ và dáng mong muốn",
    brow_detail_pricing_single_title: "Phun Mày Shading",
    brow_detail_pricing_single_subtitle:
      "Giá được xác định sau khi tư vấn và đánh giá tình trạng chân mày",
    brow_detail_pricing_single_item1: "Thiết kế form mày cá nhân hóa",
    brow_detail_pricing_single_item2: "Kỹ thuật shading mềm – mịn",
    brow_detail_pricing_single_item3: "Serum dưỡng 7 ngày",
    brow_detail_pricing_single_item4: "Bảo hành 04 tháng",
    brow_detail_pricing_single_item5: "Miễn phí dặm",
    brow_detail_pricing_note:
      "Giá đã gồm vật tư dùng một lần và thuế VAT. Nhóm từ 2 người giảm thêm 5%.",
    brow_reviews_title: "Review khách hàng",
    brow_review1_name: "Lan Anh",
    brow_review1_age: "28 tuổi",
    brow_review1_text:
      '"Mày cũ bị trổ xanh. Sau khi làm shading ở Lumi màu mịn đẹp, ai gặp cũng hỏi ở đâu làm."',
    brow_review2_name: "Kim Ngân",
    brow_review2_age: "31 tuổi",
    brow_review2_text:
      '"Không thích kiểu sợi nên chọn shading. Mịn, mềm, đúng kiểu mình thích."',
    brow_detail_faq_title: "Câu hỏi thường gặp",
    brow_detail_faq_intro: "Rút gọn – đúng trọng tâm Shading",
    brow_detail_faq_q1: "Có bị đậm sau làm không?",
    brow_detail_faq_a1:
      "Không. Màu được pha nhạt hơn 30% để sau bong lên đúng tông.",
    brow_detail_faq_q2: "Bao lâu lên màu đẹp?",
    brow_detail_faq_a2: "Từ ngày 10–14 là đẹp tự nhiên.",
    brow_detail_faq_q3: "Có đau không?",
    brow_detail_faq_a3:
      "Không đau nhiều. Shading ít tổn thương, phù hợp cả người sợ đau.",
    brow_detail_cta_title: "Muốn có đôi mày mềm – mịn – tự nhiên như tán bột?",
    brow_detail_cta_desc: "Đặt lịch ngay để Lumi Beauty đo dáng mày miễn phí.",

    // Service Detail - Lip Brightening (Neutralizing Pigment)
    lip_removal_detail_page_title:
      "Khử Thâm Môi Chuyên Sâu Lumi Beauty - Trả lại sắc môi tươi sáng",
    lip_removal_detail_meta_description:
      "Khử thâm môi bằng kỹ thuật Neutralizing Pigment tại Lumi Beauty, làm ấm nền thâm xanh-tím-xám, giảm 30-60% sau 1 buổi, không đau không sưng, bảo hành 6-12 tháng.",
    lip_removal_detail_badge: "Neutralizing Pigment",
    lip_removal_detail_hero_heading:
      "Khử Thâm Môi Neutralizing – Sáng Màu Chỉ Sau 1 Buổi",
    lip_removal_detail_hero_subheading:
      "Kỹ thuật trung hòa sắc tố thâm bằng pigment cam/đào/coral, không phun màu – không đau – không sưng. Giúp môi sáng hơn 50–80% và đều màu tự nhiên chỉ sau 7–14 ngày.",
    lip_removal_detail_hero_paragraph1:
      "Liệu trình kết hợp laser lạnh thế hệ mới và serum vitamin C + B5 đậm đặc, phá hủy sắc tố thâm mà không gây bong tróc hay bỏng rát. Phù hợp với môi thâm do bẩm sinh, thâm do dùng son chì hoặc do nội tiết.",
    lip_removal_detail_hero_paragraph2:
      "Mỗi khách hàng được xây dựng phác đồ riêng gồm 1-2 buổi khử thâm và 1 buổi phun baby lip hoàn thiện, đảm bảo lên màu tự nhiên, lâu bền.",
    lip_removal_detail_hero_stat_label: "Giảm sắc tố thâm sau buổi đầu tiên",
    lip_removal_detail_hero_benefit1: "Giảm thâm xanh – tím – xám",
    lip_removal_detail_hero_benefit2: "Không bong mảng – hồi siêu nhanh",
    lip_removal_detail_hero_benefit3: "Phù hợp cả nam & nữ",
    lip_removal_detail_why_choose_title:
      "Khử thâm môi 1-1 – Chuyên viên 7+ năm kinh nghiệm",
    lip_removal_detail_why_choose_desc:
      "Tại Lumi Beauty, mỗi khách hàng đều được phục vụ theo mô hình 1-1 với chuyên viên có hơn 7 năm kinh nghiệm trong lĩnh vực phun xăm thẩm mỹ. Chúng tôi cam kết mang đến dịch vụ chuyên nghiệp, an toàn và hiệu quả cao nhất.",
    lip_removal_detail_highlights_title:
      "Ưu điểm của liệu trình khử thâm Lumi Beauty",
    lip_removal_detail_highlight1_title: "Công nghệ laser lạnh 650nm",
    lip_removal_detail_highlight1_desc:
      "Tác động chọn lọc lên sắc tố thâm, không gây bỏng nhiệt, không làm mỏng môi.",
    lip_removal_detail_highlight2_title: "Serum vitamin độc quyền",
    lip_removal_detail_highlight2_desc:
      "Phục hồi biểu bì nhanh, cấp ẩm sâu và khóa ẩm giúp môi mềm mượt ngay sau liệu trình.",
    lip_removal_detail_highlight3_title: "Phác đồ riêng từng mức độ",
    lip_removal_detail_highlight3_desc:
      "Tùy tình trạng bẩm sinh hay do thói quen, Lumi Beauty điều chỉnh năng lượng và số buổi phù hợp.",
    lip_removal_detail_highlight4_title: "Kết hợp phun baby lip hoàn thiện",
    lip_removal_detail_highlight4_desc:
      "Sau khi khử thâm, môi được phủ màu baby lip giúp duy trì sắc hồng tươi ít nhất 18 tháng.",
    lip_removal_detail_process_title: "Quy trình khử thâm môi an toàn",
    lip_removal_detail_process_intro:
      "Thời gian 60-75 phút/buổi, bao gồm khử thâm và chăm sóc phục hồi chuyên sâu.",
    lip_removal_detail_process_step1_title: "Phân tích sắc tố",
    lip_removal_detail_process_step1_desc:
      "Soi da môi bằng đèn chuyên dụng, đánh giá mức độ thâm và nguyên nhân để chọn phác độ.",
    lip_removal_detail_process_step2_title: "Tẩy da chết enzyme",
    lip_removal_detail_process_step2_desc:
      "Loại bỏ tế bào chết bằng enzyme papain dịu nhẹ, giúp sắc tố thâm lộ rõ và dễ xử lý.",
    lip_removal_detail_process_step3_title: "Khử thâm bằng laser lạnh",
    lip_removal_detail_process_step3_desc:
      "Chiếu laser 650nm đúng điểm thâm, phá hủy melanin mà không ảnh hưởng mô xung quanh.",
    lip_removal_detail_process_step4_title: "Ủ serum vitamin & mặt nạ phục hồi",
    lip_removal_detail_process_step4_desc:
      "Ủ serum vitamin C, E, B5 và đắp mặt nạ peptide giúp môi dịu ngay, giảm khô nứt.",
    lip_removal_detail_process_step5_title: "Phủ màu baby lip (nếu cần)",
    lip_removal_detail_process_step5_desc:
      "Sau 7-10 ngày, tiến hành phun baby lip để hoàn thiện sắc môi hồng hào tự nhiên.",
    lip_removal_detail_results_outcome_title: "Mức độ cải thiện",
    lip_removal_detail_results_outcome_item1:
      "Giảm 50-70% sắc tố thâm ngay buổi đầu với môi thâm do son.",
    lip_removal_detail_results_outcome_item2:
      "Môi bẩm sinh thâm cải thiện 30-40% sau 2 buổi, tiếp tục sáng dần sau 4 tuần.",
    lip_removal_detail_results_outcome_item3:
      "Kết hợp phun baby lip mang lại màu hồng tự nhiên, bền đẹp 18-24 tháng.",
    lip_removal_detail_results_aftercare_title: "Chăm sóc sau liệu trình",
    lip_removal_detail_results_aftercare_item1:
      "Bôi dưỡng môi Lumi Care 3 lần/ngày trong 7 ngày đầu.",
    lip_removal_detail_results_aftercare_item2:
      "Uống đủ 2 lít nước, hạn chế cà phê, trà đậm trong 5 ngày.",
    lip_removal_detail_results_aftercare_item3:
      "Tránh nắng trực tiếp và son chứa chì trong 14 ngày.",
    lip_removal_detail_pricing_title: "Gói liệu trình & chi phí",
    lip_removal_detail_pricing_intro:
      "Giá trọn gói, gồm sản phẩm chăm sóc tại nhà và theo dõi định kỳ.",
    lip_removal_detail_pricing_option1_title: "Gói Khử Thâm Cơ Bản",
    lip_removal_detail_pricing_option1_item1:
      "1 buổi laser lạnh + 1 bộ dưỡng môi tại nhà.",
    lip_removal_detail_pricing_option1_item2: "Theo dõi sau 14 ngày.",
    lip_removal_detail_pricing_option1_item3:
      "Phù hợp môi thâm nhẹ do dùng son.",
    lip_removal_detail_pricing_option2_badge: "Phổ biến nhất",
    lip_removal_detail_pricing_option2_title: "Gói Khử Thâm + Baby Lip",
    lip_removal_detail_pricing_option2_item1:
      "2 buổi khử thâm + 1 buổi phun baby lip.",
    lip_removal_detail_pricing_option2_item2:
      "Bộ dưỡng 14 ngày & serum khóa màu.",
    lip_removal_detail_pricing_option2_item3: "Bảo hành màu 12 tháng.",
    lip_removal_detail_pricing_option3_title: "Gói Xử Lý Thâm Nặng",
    lip_removal_detail_pricing_option3_item1:
      "3 buổi laser lạnh + chăm sóc chuyên sâu.",
    lip_removal_detail_pricing_option3_item2:
      "Tư vấn dinh dưỡng, bổ sung vitamin hỗ trợ cải thiện sắc tố.",
    lip_removal_detail_pricing_option3_item3:
      "Miễn phí 1 buổi phun baby lip hoàn thiện.",
    lip_removal_detail_pricing_note:
      "Tặng bộ dưỡng môi Lumi Care trị giá 390.000đ cho mọi gói. Khách quay lại được giảm 10%.",
    lip_removal_detail_faq_title: "Câu hỏi thường gặp",
    lip_removal_detail_faq_q1: "Khử thâm môi có đau không?",
    lip_removal_detail_faq_a1:
      "Liệu trình sử dụng laser lạnh với năng lượng thấp và ủ tê y khoa nên hầu như không đau, chỉ hơi ấm nhẹ trong 2-3 phút đầu.",
    lip_removal_detail_faq_q2: "Bao lâu sau có thể phun màu?",
    lip_removal_detail_faq_a2:
      "Sau 7-10 ngày, khi môi hồi phục hoàn toàn và sắc thâm giảm rõ, chúng tôi sẽ phun baby lip để hoàn thiện màu.",
    lip_removal_detail_faq_q3: "Khử thâm có làm môi bị khô không?",
    lip_removal_detail_faq_a3:
      "Sau liệu trình, môi được cấp ẩm sâu bằng serum và mặt nạ peptide nên không khô. Bạn chỉ cần dưỡng đều theo hướng dẫn.",
    lip_removal_detail_cta_title: "Sẵn sàng đánh thức sắc môi hồng tự nhiên?",
    lip_removal_detail_cta_desc:
      "Đặt lịch ngay hôm nay để được Lumi Beauty thăm khám và xây dựng phác đồ khử thâm dành riêng cho bạn.",

    // Lip Brightening - Neutralizing Pigment specific translations
    lip_brightening_intro_title: "Dịch vụ khử thâm môi là gì?",
    lip_brightening_intro_what:
      "Khử thâm môi bằng kỹ thuật Neutralizing Pigment là phương pháp sử dụng sắc tố trung hòa (cam/đào/coral) đưa rất nông vào bề mặt môi để làm ấm nền thâm, giảm sắc tố lạnh như xanh – tím – xám. Kỹ thuật này không phải phun môi, không tạo màu mới và không thay đổi cấu trúc môi. Sau khi trung hòa, môi sẽ sáng hơn 50–80%, đều màu hơn và tự nhiên hồng hào hơn.",
    lip_brightening_intro_who_title: "Phù hợp với ai? (Chuẩn Neutralizing)",
    lip_brightening_intro_who1: "Môi thâm xanh / tím / xám (thâm lạnh)",
    lip_brightening_intro_who2: "Môi thâm bẩm sinh",
    lip_brightening_intro_who3: "Môi thâm do son lâu năm",
    lip_brightening_intro_who4: "Môi thâm do nội tiết",
    lip_brightening_intro_who5:
      "Môi khó lên màu khi phun môi, cần làm ấm nền trước",
    lip_brightening_intro_benefits_title: "Lợi ích chính của dịch vụ",
    lip_brightening_benefit1_title: "Làm ấm nền thâm",
    lip_brightening_benefit1_desc:
      "Trung hòa sắc tố lạnh giúp môi sáng, mềm và tự nhiên hơn.",
    lip_brightening_benefit2_title: "Giảm thâm 30–60% sau buổi đầu",
    lip_brightening_benefit2_desc:
      "Mức độ cải thiện tùy theo nền thâm ban đầu.",
    lip_brightening_benefit3_title: "Không đau – không sưng",
    lip_brightening_benefit3_desc: "Đi nông, không tác động sâu như phun môi.",
    lip_brightening_benefit4_title: "Màu sáng dần trong 7–14 ngày",
    lip_brightening_benefit4_desc: "Môi không bị bong mảng lớn, hồi nhanh.",
    lip_brightening_benefit5_title: "Tạo nền đẹp để phun baby lip sau đó",
    lip_brightening_benefit5_desc:
      "Khi nền đã được làm ấm, màu phun lên chuẩn và bền.",
    lip_brightening_commitment_title: "Cam kết tại Lumi Beauty",
    lip_brightening_commitment1:
      "Không phun màu, không tạo viền môi – chỉ trung hòa sắc tố thâm",
    lip_brightening_commitment2: "Kỹ thuật an toàn, phù hợp cả môi nhạy cảm",
    lip_brightening_commitment3: "Phác đồ tùy theo mức độ thâm lạnh",
    lip_brightening_commitment4: "Theo dõi sát sao 7–14 ngày",
    lip_brightening_commitment5: "Bảo hành kết quả trong 6–12 tháng",
    lip_brightening_results_title: "Kết quả sau thực hiện",
    lip_brightening_results_intro:
      "Sau buổi trung hòa sắc tố, môi sẽ sáng hơn 50–80%, giảm rõ nền thâm xanh – tím – xám. Môi lên sắc hồng nhẹ, đều màu và mềm mịn hơn. Với nền thâm nặng, cần 2–3 buổi để đạt hiệu quả tối ưu. Sau khi nền đã sáng, bạn có thể phun baby lip để lên màu tươi và bền hơn.",
    lip_brightening_process_title: "Quy trình thực hiện khử thâm môi",
    lip_brightening_process_intro:
      "Thời gian 40-60 phút/buổi, áp dụng chuẩn vô trùng quốc tế, đảm bảo an toàn tuyệt đối.",
    lip_brightening_process_step1_title: "Phân tích sắc tố môi",
    lip_brightening_process_step1_desc:
      "Đánh giá mức thâm lạnh, base màu, nền da.",
    lip_brightening_process_step2_title: "Xác định pigment trung hòa",
    lip_brightening_process_step2_desc:
      "Cam – đào – coral tùy vào tone thâm: xanh, tím, xám.",
    lip_brightening_process_step3_title: "Ủ tê y khoa",
    lip_brightening_process_step3_desc: "Giúp khách thoải mái, không đau.",
    lip_brightening_process_step4_title: "Thực hiện Neutralizing Pigment",
    lip_brightening_process_step4_desc:
      "Đi kim cực nông, đều, trải pigment trung hòa giúp làm ấm nền mà KHÔNG tạo màu.",
    lip_brightening_process_step5_title: "Kiểm tra & hướng dẫn chăm sóc",
    lip_brightening_process_step5_desc:
      "Môi hơi khô nhẹ 1–2 ngày đầu, sáng dần trong 7–14 ngày.",
    lip_brightening_advantages_title: "Ưu điểm nổi bật của kỹ thuật",
    lip_brightening_advantages_intro:
      "Những điểm mạnh làm nên chất lượng dịch vụ khử thâm môi tại Lumi Beauty",
    lip_brightening_advantage1_title: "Hiệu quả nhanh 50–80% sau 1 buổi",
    lip_brightening_advantage1_desc:
      "Mức độ cải thiện tùy theo nền thâm ban đầu, có thể thấy rõ sự khác biệt ngay sau buổi đầu.",
    lip_brightening_advantage2_title: "Không bong nhiều",
    lip_brightening_advantage2_desc:
      "Môi không bị bong mảng lớn, chỉ khô nhẹ 1–2 ngày đầu, hồi phục nhanh chóng.",
    lip_brightening_advantage3_title: "Không làm mỏng môi",
    lip_brightening_advantage3_desc:
      "Kỹ thuật đi nông, không ảnh hưởng đến cấu trúc tự nhiên của môi.",
    lip_brightening_advantage4_title: "Không để lại viền",
    lip_brightening_advantage4_desc:
      "Chỉ trung hòa sắc tố thâm, không phun màu nên không tạo viền môi.",
    lip_brightening_advantage5_title: "Không bị loang màu",
    lip_brightening_advantage5_desc:
      "Kỹ thuật trung hòa chuyên nghiệp đảm bảo màu đều, không loang.",
    lip_brightening_advantage6_title: "Làm nền cực đẹp để phun môi",
    lip_brightening_advantage6_desc:
      "Sau khi nền được làm ấm, phun baby lip sẽ lên màu chuẩn và bền hơn.",
    lip_brightening_advantage7_title: "Phù hợp cho cả nam & nữ",
    lip_brightening_advantage7_desc:
      "Kỹ thuật phù hợp với mọi giới tính, điều chỉnh màu phù hợp với từng khách hàng.",
    lip_brightening_advantage8_title: "Thích hợp cho môi thâm lạnh nặng",
    lip_brightening_advantage8_desc:
      "Đặc biệt hiệu quả với môi thâm xanh – tím – xám, cần 2–3 buổi cho nền nặng.",
    lip_brightening_pricing_title: "Bảng giá dịch vụ",
    lip_brightening_pricing_intro:
      "Giá trọn gói, đã bao gồm sản phẩm chăm sóc tại nhà và theo dõi định kỳ.",
    lip_brightening_pricing_main_title: "Khử Thâm Môi – Neutralizing Pigment",
    lip_brightening_pricing_subtitle:
      "Tùy mức độ thâm lạnh (xanh/tím/xám) và số buổi cần làm",
    lip_brightening_pricing_item1: "Neutralizing pigment chuyên dụng",
    lip_brightening_pricing_item2: "Ủ tê y khoa",
    lip_brightening_pricing_item3: "Dụng cụ dùng 1 lần",
    lip_brightening_pricing_item4: "Theo dõi & hỗ trợ 24/7",
    lip_brightening_pricing_item5: "Bảo hành 04 tháng - khử lại lần 2 miễn phí",
    lip_brightening_pricing_note:
      "Giá đã bao gồm thuế VAT và dụng cụ vô trùng. Tùy mức độ thâm lạnh và số buổi điều trị, giá có thể điều chỉnh.",
    lip_brightening_warranty_title: "Chế độ bảo hành",
    lip_brightening_warranty_intro:
      "Cam kết của Lumi Beauty đối với khách hàng",
    lip_brightening_warranty1_title:
      "Bảo hành 04 tháng - khử lại lần 2 miễn phí",
    lip_brightening_warranty1_desc:
      "Bảo hành kết quả trong 04 tháng kể từ ngày hoàn thành liệu trình, tùy mức độ thâm ban đầu.",
    lip_brightening_warranty2_title: "Khử lại lần 2 miễn phí",
    lip_brightening_warranty2_desc:
      "Miễn phí 1 lần dặm lại nếu màu chưa đạt chuẩn hoặc cần điều chỉnh trong thời gian bảo hành.",
    lip_brightening_warranty3_title: "Theo dõi sát sao",
    lip_brightening_warranty3_desc:
      "Theo dõi tình trạng sau liệu trình, tư vấn chăm sóc và đặt lịch tái khám miễn phí sau 14-30 ngày.",
    lip_brightening_warranty4_title: "Hỗ trợ 24/7",
    lip_brightening_warranty4_desc:
      "Luôn sẵn sàng hỗ trợ và tư vấn khách hàng qua điện thoại, Zalo, Facebook mọi lúc mọi nơi.",
    lip_brightening_precautions_title: "Lưu ý trước khi làm",
    lip_brightening_precautions_intro:
      "Những điều cần lưu ý để đảm bảo quy trình diễn ra an toàn và hiệu quả",
    lip_brightening_precaution1_title: "Tránh uống cà phê 6 tiếng",
    lip_brightening_precaution1_desc:
      "Không uống cà phê, trà đậm, rượu bia trong vòng 6 tiếng trước khi thực hiện để tránh ảnh hưởng đến quá trình tê.",
    lip_brightening_precaution2_title: "Tránh dùng thuốc Aspirin",
    lip_brightening_precaution2_desc:
      "Không dùng Aspirin, thuốc chống đông máu trong 7 ngày trước khi thực hiện để tránh chảy máu nhiều.",
    lip_brightening_precaution3_title: "Không làm khi đang sốt/cảm",
    lip_brightening_precaution3_desc:
      "Hoãn lịch hẹn nếu đang sốt, cảm cúm, nhiễm trùng vùng môi hoặc đang điều trị bệnh cấp tính.",
    lip_brightening_precaution4_title: "Thông báo tiền sử bệnh",
    lip_brightening_precaution4_desc:
      "Thông báo cho Lumi Beauty nếu có tiền sử dị ứng, bệnh ngoài da, đang mang thai hoặc cho con bú.",
    lip_brightening_precaution5_title: "Không làm đẹp môi 7 ngày",
    lip_brightening_precaution5_desc:
      "Không xăm môi, phun môi, tẩy trắng môi trong ít nhất 7 ngày trước khi khử thâm.",
    lip_brightening_precaution6_title: "Uống đủ nước",
    lip_brightening_precaution6_desc:
      "Uống đủ 2 lít nước mỗi ngày trong 3 ngày trước khi thực hiện để môi được cấp ẩm tốt nhất.",
    lip_brightening_aftercare_title:
      "Chăm sóc sau trung hòa sắc tố (Aftercare)",
    lip_brightening_aftercare_intro:
      "Hướng dẫn chi tiết cách chăm sóc môi sau liệu trình Neutralizing Pigment",
    lip_brightening_aftercare_day1_title: "Giai đoạn quan trọng nhất",
    lip_brightening_aftercare_day1_item1:
      "Không rửa mặt bằng nước, chỉ lau nhẹ bằng khăn ướt",
    lip_brightening_aftercare_day1_item2:
      "Bôi dưỡng môi Lumi Care mỗi 2-3 giờ/lần",
    lip_brightening_aftercare_day1_item3:
      "Tránh nói chuyện nhiều, không chạm tay vào môi",
    lip_brightening_aftercare_day1_item4:
      "Uống nước bằng ống hút, tránh thức ăn cay nóng",
    lip_brightening_aftercare_day3_title: "Duy trì chăm sóc",
    lip_brightening_aftercare_day3_item1:
      "Bôi dưỡng môi 3-4 lần/ngày, giữ môi luôn ẩm",
    lip_brightening_aftercare_day3_item2:
      "Không đánh răng bằng kem đánh răng có flouride",
    lip_brightening_aftercare_day3_item3:
      "Tránh nắng trực tiếp, che chắn khi ra ngoài",
    lip_brightening_aftercare_day3_item4:
      "Không bóc vảy nếu có, để tự nhiên bong",
    lip_brightening_aftercare_day7_title: "Tiếp tục chăm sóc",
    lip_brightening_aftercare_day7_item1: "Bôi dưỡng môi 2-3 lần/ngày",
    lip_brightening_aftercare_day7_item2:
      "Có thể dùng son dưỡng không màu sau 7 ngày",
    lip_brightening_aftercare_day7_item3:
      "Tránh son có chì, son lâu trôi trong 14 ngày",
    lip_brightening_aftercare_day7_item4: "Uống đủ nước, ăn nhiều rau củ quả",
    lip_brightening_aftercare_day14_title: "Lên màu ổn định",
    lip_brightening_aftercare_day14_item1: "Màu bắt đầu lên lại và ổn định dần",
    lip_brightening_aftercare_day14_item2:
      "Tiếp tục dưỡng môi hàng ngày để duy trì độ ẩm",
    lip_brightening_aftercare_day14_item3:
      "Tránh nắng, bôi kem chống nắng môi nếu cần",
    lip_brightening_aftercare_day14_item4:
      "Tái khám sau 30 ngày để đánh giá kết quả",
    lip_brightening_aftercare_note_title: "Những điều cần kiêng",
    lip_brightening_aftercare_avoid1:
      "Không ăn đồ cay nóng, chua trong 7 ngày đầu",
    lip_brightening_aftercare_avoid2:
      "Không hôn, không dùng chung dụng cụ ăn uống",
    lip_brightening_aftercare_avoid3:
      "Không tắm nước nóng, xông hơi trong 7 ngày",
    lip_brightening_aftercare_avoid4: "Không bóc vảy, không chà xát môi",
    lip_brightening_faq_title: "Câu hỏi thường gặp",
    lip_brightening_faq_q1: "Có phải phun môi không?",
    lip_brightening_faq_a1:
      "Không. Đây là kỹ thuật trung hòa sắc tố, không tạo màu môi. Chúng tôi chỉ sử dụng sắc tố trung hòa (cam/đào/coral) để làm ấm nền thâm xanh – tím – xám, không phải phun màu môi.",
    lip_brightening_faq_q2: "Một buổi cải thiện được bao nhiêu?",
    lip_brightening_faq_a2:
      "30–60% tùy nền thâm. Môi thâm nhẹ có thể cải thiện 50–60% sau 1 buổi. Môi thâm nặng (xanh – tím – xám) cần 2–3 buổi để đạt hiệu quả tối ưu.",
    lip_brightening_faq_q3: "Có đau hoặc sưng không?",
    lip_brightening_faq_a3:
      "Hầu như không. Kỹ thuật đi nông nên rất nhẹ nhàng. Chúng tôi sử dụng tê y khoa để đảm bảo khách thoải mái trong suốt quy trình.",
    lip_brightening_faq_q4: "Có bong không?",
    lip_brightening_faq_a4:
      "Không bong mảng. Chỉ khô nhẹ 1–2 ngày đầu, môi sẽ sáng dần trong 7–14 ngày. Quy trình nhẹ nhàng hơn nhiều so với phun môi.",
    lip_brightening_faq_q5: "Bao lâu được phun môi?",
    lip_brightening_faq_a5:
      "Sau 7–14 ngày khi nền sáng và đều. Sau khi trung hòa sắc tố, nền môi đã được làm ấm, lúc này phun baby lip sẽ lên màu chuẩn và bền hơn.",
    lip_brightening_faq_q6: "Có cần kiêng nước không?",
    lip_brightening_faq_a6:
      "Trong 24h đầu không rửa mặt bằng nước, chỉ lau nhẹ bằng khăn ướt. Sau 24h có thể rửa mặt bình thường nhưng tránh chà xát vùng môi. Tránh tắm nước nóng, xông hơi trong 7 ngày đầu.",
    lip_brightening_faq_q7: "Có cần kiêng ăn gì không?",
    lip_brightening_faq_a7:
      "Trong 7 ngày đầu, tránh ăn đồ cay nóng, chua, mặn. Uống nước bằng ống hút, tránh thức ăn quá nóng. Uống đủ 2 lít nước mỗi ngày, hạn chế cà phê, trà đậm trong 5 ngày đầu.",
    lip_brightening_faq_q8: "Nam làm có hợp không?",
    lip_brightening_faq_a8:
      "Có, dịch vụ khử thâm môi bằng kỹ thuật Neutralizing Pigment phù hợp với cả nam và nữ. Chúng tôi sẽ điều chỉnh màu trung hòa phù hợp với giới tính và nhu cầu của từng khách hàng.",
    lip_brightening_faq_q9: "Thâm lạnh nặng có cải thiện được không?",
    lip_brightening_faq_a9:
      "Có. Với môi thâm lạnh nặng (xanh – tím – xám), cần 2–3 buổi để đạt hiệu quả tối ưu. Sau khi nền được làm ấm, môi sẽ sáng hơn 30–60% và có thể phun baby lip để hoàn thiện.",
    lip_brightening_faq_q10: "Có thể makeup ngay sau khử thâm không?",
    lip_brightening_faq_a10:
      "Sau 7 ngày có thể dùng son dưỡng không màu. Tránh son có chì, son lâu trôi trong 14 ngày đầu. Sau 14 ngày có thể makeup bình thường nhưng nên chọn son không có chì.",
    lip_brightening_expert_title: "Lời khuyên của Lumi Beauty",
    lip_brightening_expert_advice1:
      "Trung hòa sắc tố (Neutralizing Pigment) là bước bắt buộc trước khi phun môi đối với nền môi thâm lạnh. Nếu bỏ qua bước này, môi phun sẽ dễ bị lên sai màu – loang màu – không ăn màu.",
    lip_brightening_expert_advice2:
      "Với kỹ thuật đi nông & pigment chuyên dụng, khách sẽ nhận thấy môi sáng hơn rõ rệt mà không đau và không sưng. Kỹ thuật này không phải phun môi, không tạo màu mới mà chỉ làm ấm nền thâm xanh – tím – xám.",
    lip_brightening_expert_advice3:
      "Sau khi nền được làm ấm, bạn có thể phun baby lip để lên màu tươi và bền hơn. Mỗi khách hàng có tình trạng môi khác nhau, vì vậy chúng tôi sẽ xây dựng phác đồ riêng cho từng người.",
    lip_brightening_expert_signature: "— Lumi Beauty",
    lip_brightening_cta_title: "Sẵn sàng đánh thức sắc môi hồng tự nhiên?",
    lip_brightening_cta_desc:
      "Đặt lịch ngay hôm nay để được Lumi Beauty thăm khám 1-1 và xây dựng phác đồ khử thâm dành riêng cho bạn.",

    // Why Choose Us
    why_choose_title: "Vì Sao Nhiều Khách Hàng Tin Chọn Lumi Beauty?",
    feature_personalized_title: "Phun xăm 1-1 riêng biệt",
    feature_personalized_desc:
      "Mỗi khách hàng được phục vụ riêng, chuyên viên theo dõi trọn quy trình.",
    feature_expert_title: "Chuyên viên tay nghề cao",
    feature_expert_desc: "Được đào tạo bài bản, nhiều năm kinh nghiệm.",
    feature_organic_title: "Mực organic an toàn",
    feature_organic_desc: "Không gây sưng đau, không đổi màu theo thời gian.",
    feature_space_title: "Không gian sạch & riêng tư",
    feature_space_desc:
      "Tạo cảm giác thư giãn, thoải mái trong suốt buổi làm đẹp.",
    feature_feedback_title: "Hàng trăm khách hàng hài lòng",
    feature_feedback_desc: "Feedback thật – kết quả thật.",

    // Contact Methods
    contact_intro:
      "✨ Bạn muốn sở hữu nét đẹp tự nhiên, tinh tế mà vẫn giữ được cá tính riêng? Hãy để Lumi Beauty đồng hành cùng bạn trong hành trình phun xăm thẩm mỹ 1-1 chuyên biệt.",
    contact_methods_title:
      "Đừng ngần ngại - chọn cách liên lạc phù hợp nhất với bạn.",
    contact_call_title: "Gọi điện trực tiếp",
    contact_call_description: "Nhấn để kết nối ngay với Lumi Beauty",
    contact_call_button: "GỌI NGAY",
    contact_facebook_title: "Chat Facebook",
    contact_facebook_description:
      "Nhận tư vấn nhanh trên Messenger của Lumi Beauty",
    contact_facebook_button: "MỞ MESSENGER",
    contact_zalo_title: "Chat Zalo",
    contact_zalo_description:
      "Kết nối Zalo để được hỗ trợ và nhận ưu đãi riêng",
    contact_zalo_button: "MỞ ZALO",
    contact_email_title: "Gửi email",
    contact_email_description:
      "Để lại lời nhắn chi tiết, chúng tôi sẽ phản hồi trong 24h",
    contact_email_button: "GỬI EMAIL",
    contact_free_button: "Liên hệ tư vấn miễn phí",

    // Zalo Contact Modal
    zalo_contact_modal_title: "Liên hệ trực tiếp với chúng tôi",
    zalo_contact_modal_desc:
      "Bạn đang quan tâm tới dịch vụ {service}. Vui lòng liên hệ với chúng tôi qua Zalo để được tư vấn chi tiết.",
    zalo_contact_phone_label: "Số điện thoại Zalo:",
    zalo_contact_open_button: "MỞ ZALO NGAY",

    // Contact Form
    contact_form_title:
      "Đừng ngần ngại - để lại số điện thoại, chúng tôi sẽ giúp bạn chọn dịch vụ phù hợp nhất với khuôn mặt của mình.",
    phone_placeholder: "Nhập số điện thoại của bạn",
    send: "GỬI ĐI",
    contact_form_success:
      "Cảm ơn bạn! Chúng tôi sẽ liên hệ lại sớm nhất có thể.",
    contact_form_error: "Đã xảy ra lỗi. Vui lòng thử lại.",
    contact_form_phone_required: "Vui lòng nhập số điện thoại của bạn.",

    // Gallery
    real_images: "Hình Ảnh Thực Tế",
    lip_tattoo_label: "Phun xăm môi",
    eyebrow_tattoo_label: "Phun mày",

    // Testimonials
    customer_reviews: "Đánh Giá Từ Khách Hàng",
    scroll_hint: "Vuốt ngang để xem thêm",
    testimonial1:
      "Dịch vụ tuyệt vời! Môi của tôi trông tự nhiên và đẹp hơn rất nhiều. Nhân viên rất chuyên nghiệp và tận tâm.",
    testimonial2:
      "Rất hài lòng với kết quả phun mày. Dáng mày được thiết kế phù hợp với khuôn mặt, màu sắc tự nhiên.",
    testimonial3:
      "Quy trình không đau như mong đợi. Sau khi phun môi, màu sắc lên đều và tự nhiên. Sẽ quay lại lần sau!",

    // Blog
    learn_more_title: "Hiểu hơn về làm đẹp - phun xăm",
    blog1_title: "Phun môi bao lâu lên màu đẹp tự nhiên?",
    blog2_title: "Sau khi phun mày cần kiêng gì để có dáng đẹp và màu đều?",
    blog3_title:
      "Phân biệt phun môi baby, collagen và ombre - nên chọn loại nào?",
    read_more: "Xem thêm",
    view_more_gallery: "XEM THÊM HÌNH ẢNH",
    view_more_feedback: "XEM THÊM FEEDBACK",

    // Footer
    footer_tagline: "Phun xăm đẹp tự nhiên - Tôn nét riêng của bạn",
    footer_address: "151 Trần Duy Hưng, Cầu Giấy, Hà Nội",
    services_title: "Dịch vụ",
    lip_service: "Phun xăm môi",
    eyebrow_service: "Phun xăm mày",
    lip_removal_service: "Khử thâm môi",
    contact_title: "Liên hệ",
    about_us_contact: "About us & Contact",
    consultation_title: "Tư vấn",
    connect_with_us: "Kết nối với chúng tôi",
    footer_line1: "💋 Chuyên phun xăm thẩm mỹ Mày - Môi - Mí tự nhiên",
    footer_line2: "💋 Tư vấn và chăm sóc tận tâm",
    footer_address_detail: "Võ Quý Huân, Khu Đô Thị FPT City, Da Nang, Vietnam",
    footer_tiktok: "TikTok: @lumibeautyphunxam",
    footer_facebook: "Facebook: facebook.com/lumibeautypmubrowlip",
    facebook_iframe_title: "Trang Facebook Lumi Beauty",
    footer_copyright: "© 2025 Lumi Beauty. All rights reserved.",

    // Booking Modal
    booking_title: "Đặt lịch hẹn ngay",
    booking_description:
      "Điền thông tin của bạn để Lumi Beauty liên hệ tư vấn trong thời gian sớm nhất.",
    booking_name_label: "Họ và tên",
    booking_name_placeholder: "Nguyễn Thị Ánh",
    booking_phone_label: "Số điện thoại",
    booking_phone_placeholder: "0900 067 832",
    booking_service_label: "Dịch vụ quan tâm",
    booking_service_option_lip: "Phun môi",
    booking_service_option_eyebrow: "Phun mày",
    booking_service_option_lip_removal: "Khử thâm môi",
    booking_service_option_other: "Khác",
    booking_time_label: "Thời gian mong muốn",
    booking_notes_label: "Ghi chú thêm",
    booking_notes_placeholder: "Chia sẻ nhu cầu hoặc câu hỏi của bạn",
    booking_submit: "GỬI YÊU CẦU",
    booking_sending: "Đang gửi thông tin...",
    booking_success:
      "Cảm ơn bạn! Lumi Beauty sẽ liên hệ lại trong thời gian sớm nhất.",
    booking_error:
      "Gửi không thành công. Vui lòng thử lại hoặc liên hệ trực tiếp.",

    copyright: "© 2023 Lumi Beauty. All rights reserved.",
  },

  en: {
    // General
    page_title:
      "Lumi Beauty - Natural Permanent Makeup in Da Nang - Expert Brows, Lips & Eyeliner",

    close_modal: "Close",

    floating_contact_zalo: "Chat on Zalo",
    floating_contact_facebook: "Chat on Facebook",
    floating_contact_tiktok: "TikTok",

    meta_description:
      "Lumi Beauty Da Nang specializes in natural permanent makeup for brows, lips, and eyeliner using modern, gentle techniques with medically safe procedures.",

    meta_keywords:
      "pmu da nang, natural ombre brows, lip blushing, lumi beauty da nang",

    og_title: "Lumi Beauty - Natural Permanent Makeup in Da Nang",

    og_description:
      "Experience natural, long-lasting brows, lips, and eyeliner at Lumi Beauty Da Nang – gentle technique, no swelling, no pain, beautifully healed results.",

    twitter_title: "Lumi Beauty - Permanent Makeup Da Nang",

    twitter_description:
      "Lumi Beauty offers modern PMU treatments for brows, lips, and eyeliner with 1-on-1 service and soft, natural results.",

    business_name: "Lumi Beauty",

    business_description:
      "Lumi Beauty Da Nang provides premium permanent makeup for brows, lips, and eyeliner with gentle techniques and dedicated client care.",

    // Navigation
    beauty_services: "PMU Services",
    beauty_guide: "Beauty Knowledge",
    gallery: "Gallery",
    feedback: "Client Feedback",
    contact: "Contact",
    offers: "Feedback",
    book_now: "BOOK NOW",
    about_us_contact: "About Us & Contact",

    // Hero Section
    main_title: "PERMANENT MAKEUP",
    natural_beauty: "Naturally Beautiful",
    enhance_features: "Enhance Your Unique Features",

    hero_description:
      "Lumi Beauty offers a <strong>dedicated 1-on-1 PMU experience</strong> tailored to each face, helping you achieve soft pink lips, refined brows, and naturally bright eyes. Every client is treated with personalized care by experienced PMU artists, ensuring the most delicate and harmonious results.",

    contact_now: "CONTACT NOW",

    // Feature Tags
    no_pain: "NO PAIN",
    no_swelling: "NO SWELLING",
    no_diet: "NO DIET NEEDED",

    // Stats
    years_experience: "years of experience",
    potential_customers: "potential customers",
    five_star_reviews: "5-star client reviews",
    certifications: "professional certifications",

    // Help Section
    greeting: "Hello!",
    how_can_help: "Could Lumi Beauty introduce ourselves in just one minute?",

    help_intro:
      "Lumi Beauty is a trusted PMU studio in Da Nang, loved for its private 1-on-1 service and gentle, dedicated approach.",

    help_quote:
      'We believe that: "Every face carries its own unique beauty that deserves to be enhanced in the most delicate and natural way."',

    help_commitment:
      "That’s why we take time to listen, consult, and design the most suitable brow, lip, and eyeliner shape for each individual. With medically safe procedures and organic pigments, Lumi Beauty is committed to delivering natural results with no swelling, no pain, and beautifully long-lasting color.",

    book_description:
      "Book your appointment today for consultation and special offers.",

    contact_description:
      "Contact us anytime if you have feedback or need personalized advice.",

    book_appointment: "Book Your Appointment Today",
    want_to_book: "I WANT TO BOOK",
    contact_us: "Contact Us",
    need_consultation: "I NEED CONSULTATION",

    // Services
    our_services: "Lumi Beauty Services",

    lip_tattoo_title: "Collagen Lip Blushing",
    lip_tattoo_benefit1: "Creates soft, rosy, naturally plump-looking lips.",
    lip_tattoo_benefit2:
      "1-on-1 technique with ultra-fine needles for minimal discomfort and beautifully even color after healing.",
    lip_tattoo_benefit3: "Ideal for dry, dark, or pale lips.",

    eyebrow_tattoo_title: "Shading Ombre Brows",
    eyebrow_tattoo_benefit1:
      "Shapes soft, natural-looking brows that enhance facial harmony.",
    eyebrow_tattoo_benefit2:
      "Personalized 1-on-1 brow mapping with precise facial ratio measurements before the procedure.",
    eyebrow_tattoo_benefit3:
      "Ensures balanced brows without harsh or heavy strokes.",

    eyeliner_tattoo_title: "Lashline Enhancement",
    eyeliner_tattoo_benefit1:
      "Creates bigger, brighter-looking eyes with a naturally defined lash line.",
    eyeliner_tattoo_benefit2:
      "Gentle, painless procedure with no surgery involved.",
    eyeliner_tattoo_benefit3:
      "Perfect for clients who want subtle enhancement while keeping a natural look.",

    lip_removal_title: "Lip Neutralizing for Men & Women",
    lip_removal_benefit1:
      "Brightens dark lips and restores a naturally soft, even tone.",
    lip_removal_benefit2:
      "Safe and effective 1-on-1 neutralizing technique with visible improvement after one session.",
    lip_removal_benefit3:
      "A great solution for men who want healthier-looking lips without any artificial redness.",

    discover_more: "DISCOVER MORE",

    // Service Detail - Brow Tattoo
    brow_detail_page_title:
      "Lumi Beauty Shading Brows – Soft Powdered Effect, Naturally Beautiful for 18–36 Months",

    brow_detail_meta_description:
      "Shading Brows at Lumi Beauty: soft powdered effect, natural finish lasting 18–36 months. Soft head, smooth body, defined tail for a gentle makeup look.",

    brow_detail_badge: "Brow Design",

    brow_detail_hero_heading: "Lumi Beauty Shading Brows",
    brow_detail_hero_subheading:
      "Shading Brows – Soft Powdered Effect, Naturally Beautiful for 18–36 Months",

    brow_detail_hero_paragraph1:
      "The shading technique creates a soft brow head, smooth brow body, and a naturally defined tail, giving a gentle makeup-like effect without looking harsh.",

    brow_detail_hero_paragraph2:
      "Shading suits 98% of face shapes – comfortable, minimal pain, and even color healing. European organic pigments are safe for moms 6+ months postpartum. Includes a 4-month shape & color warranty.",

    brow_detail_hero_stat_label: "No need to draw your brows for 18 months",

    brow_before_after_title: "Before & After Results",
    brow_before_after_intro:
      "See the beautiful transformations from clients who chose Shading Brows at Lumi Beauty",

    brow_before_after_image1_alt: "Shading Brows result at Lumi Beauty",
    brow_before_after_image2_alt: "Shading Brows result at Lumi Beauty",
    brow_before_after_image3_alt: "Shading Brows result at Lumi Beauty",
    brow_before_after_image4_alt: "Shading Brows result at Lumi Beauty",
    brow_before_after_image5_alt: "Shading Brows result at Lumi Beauty",
    brow_before_after_image6_alt: "Shading Brows result at Lumi Beauty",
    brow_before_after_image7_alt: "Shading Brows result at Lumi Beauty",
    brow_before_after_image8_alt: "Shading Brows result at Lumi Beauty",
    brow_before_after_image9_alt: "Shading Brows result at Lumi Beauty",
    brow_before_after_image10_alt: "Shading Brows result at Lumi Beauty",
    brow_before_after_image11_alt: "Shading Brows result at Lumi Beauty",
    brow_before_after_image12_alt: "Shading Brows result at Lumi Beauty",

    brow_before_after_cta_text:
      "Want to know which brow shape suits your face?",
    brow_before_after_cta_button: "Get Free Consultation",

    brow_who_suitable_title: "Who Is Shading Brows Suitable For?",
    brow_who_suitable_intro: "This service is perfect if you have:",

    brow_who_suitable_image1_alt: "Eyebrows too short",
    brow_who_suitable_item1: "Eyebrows that are too short",

    brow_who_suitable_image2_alt: "Light eyebrows",
    brow_who_suitable_item2: "Light or barely visible eyebrows",

    brow_who_suitable_image3_alt: "Sparse, thin eyebrows",
    brow_who_suitable_item3: "Sparse, thin, or short brows",

    brow_who_suitable_image4_alt: "Uneven or unbalanced brows",
    brow_who_suitable_item4: "Uneven or unbalanced eyebrows",

    brow_who_suitable_note:
      "👉 Shading suits 98% of facial structures – gentle, minimal pain, even color healing.",

    brow_standards_title: "Standards of a Beautiful Shading Brow",
    brow_standards_intro: "For Shading Brows only",

    brow_standard1_image_alt: "Balanced ratio – soft front, defined tail",
    brow_standard1_title: "Balanced Ratio – Soft Front, Defined Tail",
    brow_standard1_desc:
      "Shading isn’t as bold as tattooing nor as visible as hair-strokes. It creates a soft gradient at the front, smoothly transitioning to a defined tail.",

    brow_standard2_image_alt: "Soft color – no harsh tones",
    brow_standard2_title: "Soft Color – No Harsh Darkness",
    brow_standard2_desc:
      "Shading looks best when the pigment is smooth and harmonious, like daily eyebrow powder.",

    brow_standard3_image_alt: "Brow form based on face shape",
    brow_standard3_title: "Brow Form Based on Face Shape",
    brow_standard3_desc:
      "Shading works beautifully for straight brows, soft arches, or classic arches depending on your features.",

    brow_shapes_title: "Which Face Shape Suits Shading Brows?",
    brow_shapes_intro:
      "Each face shape pairs best with a specific shading style. Let Lumi Beauty guide you.",

    brow_shape1_image_alt: "Round face – Shading with soft angles",
    brow_shape1_title: "Round Face – Soft Angled Shading",
    brow_shape1_desc: "Makes the face look slimmer.",

    brow_shape2_image_alt: "Long face – Natural straight shading",
    brow_shape2_title: "Long Face – Natural Straight Shading",
    brow_shape2_desc: "Balances facial length.",

    brow_shape3_image_alt: "Square face – Soft curved shading",
    brow_shape3_title: "Square Face – Soft Curved Shading",
    brow_shape3_desc: "Softens angles and adds a feminine touch.",

    brow_shape4_image_alt: "Oval face – Natural shading",
    brow_shape4_title: "Oval Face – Natural Shading",
    brow_shape4_desc: "Maintains soft, natural harmony.",

    brow_detail_process_title: "Shading Brows Procedure",
    brow_detail_process_intro: "75 minutes – international standard",

    brow_detail_process_step1_title: "Consultation & Assessment",
    brow_detail_process_step1_desc:
      "The artist checks skin condition, listens to your goals, and recommends the best brow shape and pigment.",

    brow_detail_process_step2_title: "Cleansing & Sanitizing",
    brow_detail_process_step2_desc:
      "Brows are thoroughly cleansed and sanitized to prevent irritation or infection.",

    brow_detail_process_step3_title: "Numbing & Pigment Preparation",
    brow_detail_process_step3_desc:
      "Topical numbing is applied for comfort. Meanwhile, the artist prepares the customized pigment shade.",

    brow_detail_process_step4_title: "Brow Mapping",
    brow_detail_process_step4_desc:
      "Precise measurements and sketching ensure the brow form harmonizes with your facial proportions.",

    brow_detail_process_step5_title: "Shading Brows Application",
    brow_detail_process_step5_desc:
      "Using specialized PMU equipment with ultra-fine needles, the artist deposits pigment into the skin to create a soft, pixelated shading effect.",

    brow_commitment_title: "Service Commitment",
    brow_commitment_intro: "What Lumi Beauty Promises You",

    brow_commitment1_title: "Perfect Color in 10–14 Days",
    brow_commitment2_title: "No Blue/Red Discoloration",
    brow_commitment3_title: "Color Lasts 18–36 Months",
    brow_commitment4_title: "European Organic Pigments",
    brow_commitment5_title: "100% Single-Use Materials",
    brow_commitment6_title: "4-Month Warranty – Free Touch-Up",

    why_lumi_brow_title: "Why Choose Shading Brows at Lumi Beauty?",
    why_lumi_brow_intro: "Short but powerful",

    why_lumi_brow0_title: "1-on-1 Brows – Artist with 7+ Years of Experience",
    why_lumi_brow0_desc:
      "At Lumi Beauty, every client receives private 1-on-1 care from a brow specialist with over 7 years of experience, ensuring refined, harmonious brows tailored to your face.",

    why_lumi_brow1_title: "Pigment Diluted 30% for Soft Healing",
    why_lumi_brow1_desc: "Ensures a natural finish after healing",

    why_lumi_brow2_title: "Ultra-Smooth Needle Technique",
    why_lumi_brow2_desc: "No pain, no swelling, fast recovery",

    why_lumi_brow3_title: "Personalized Brow Design",
    why_lumi_brow3_desc: "No template-based shaping",

    why_lumi_brow4_title: "Safe for Moms 6 Months Postpartum",

    brow_detail_pricing_title: "Pricing – Shading Brows",
    brow_detail_pricing_intro:
      "Pricing depends on old brow condition and desired shape",

    brow_detail_pricing_single_title: "Shading Brows",
    brow_detail_pricing_single_subtitle:
      "Final pricing is determined after consultation and assessment",

    brow_detail_pricing_single_item1: "Personalized brow design",
    brow_detail_pricing_single_item2: "Soft & smooth shading technique",
    brow_detail_pricing_single_item3: "7-day aftercare serum",
    brow_detail_pricing_single_item4: "4-month warranty",
    brow_detail_pricing_single_item5: "Free touch-up",

    brow_detail_pricing_note:
      "Price includes single-use materials and VAT. Groups of 2+ receive an extra 5% discount.",

    brow_reviews_title: "Client Reviews",

    brow_review1_name: "Lan Anh",
    brow_review1_age: "28 years old",
    brow_review1_text:
      '"My old brows turned blue. After doing shading at Lumi, the color healed soft and beautiful — everyone asks where I got them done."',

    brow_review2_name: "Kim Ngan",
    brow_review2_age: "31 years old",
    brow_review2_text:
      '"I don’t like hair-strokes so I chose shading. Soft, smooth, exactly the style I wanted."',

    brow_detail_faq_title: "Frequently Asked Questions",
    brow_detail_faq_intro: "Short, clear, and focused on Shading",

    brow_detail_faq_q1: "Will the brows look too dark right after?",
    brow_detail_faq_a1:
      "No. Pigment is diluted by 30% to heal to the correct softness.",

    brow_detail_faq_q2: "When will the brows look their best?",
    brow_detail_faq_a2: "From day 10–14, the color becomes naturally perfect.",

    brow_detail_faq_q3: "Does it hurt?",
    brow_detail_faq_a3:
      "Very minimal. Shading is gentle and suitable even for clients afraid of pain.",

    brow_detail_cta_title: "Want soft, smooth, powder-like brows?",
    brow_detail_cta_desc:
      "Book now for a free brow mapping session at Lumi Beauty.",

    // Service Detail - Lip Brightening (Neutralizing Pigment)
    lip_removal_detail_page_title:
      "Lumi Beauty Advanced Lip Brightening – Restore Natural Lip Color",

    lip_removal_detail_meta_description:
      "Lip brightening using Neutralizing Pigment at Lumi Beauty warms dark tones (blue–purple–grey), reduces 30–60% pigmentation after one session, painless and non-swelling, 6–12 month warranty.",

    lip_removal_detail_badge: "Neutralizing Pigment",

    lip_removal_detail_hero_heading:
      "Neutralizing Lip Darkening – Brighter Lips in One Session",

    lip_removal_detail_hero_subheading:
      "Neutralizing technique uses warm pigments (orange/peach/coral) to neutralize cool tones without adding color — no pain, no swelling. Achieve 50–80% brightness with even, natural tone after 7–14 days.",

    lip_removal_detail_hero_paragraph1:
      "The treatment combines next-generation cold laser with concentrated vitamin C + B5 serum to break down dark pigments without peeling or burning. Suitable for lips darkened from genetics, old lipstick, or hormonal changes.",

    lip_removal_detail_hero_paragraph2:
      "Each client receives a personalized plan including 1–2 neutralizing sessions and a baby-lip session for natural, long-lasting pink lips.",

    lip_removal_detail_hero_stat_label:
      "Reduced pigmentation after the first session",
    lip_removal_detail_hero_benefit1:
      "Reduces blue – purple – gray pigmentation",
    lip_removal_detail_hero_benefit2: "No peeling – super fast recovery",
    lip_removal_detail_hero_benefit3: "Suitable for both men & women",
    lip_removal_detail_why_choose_title:
      "1-on-1 Lip Brightening – 7+ Years Expert Experience",
    lip_removal_detail_why_choose_desc:
      "At Lumi Beauty, every client is served in a 1-on-1 model with an expert with over 7 years of experience in cosmetic tattooing. We are committed to providing the most professional, safe, and effective service.",
    lip_removal_detail_highlights_title:
      "Why Lumi Beauty’s Lip Brightening Works",

    lip_removal_detail_highlight1_title: "650nm Cold Laser Technology",
    lip_removal_detail_highlight1_desc:
      "Targets dark pigments without thermal damage or thinning the lips.",

    lip_removal_detail_highlight2_title: "Exclusive Vitamin Serum",
    lip_removal_detail_highlight2_desc:
      "Accelerates healing, deeply hydrates, and locks in moisture immediately.",

    lip_removal_detail_highlight3_title: "Customized Treatment Plan",
    lip_removal_detail_highlight3_desc:
      "Energy level and number of sessions adjusted for congenital or lifestyle-related pigmentation.",

    lip_removal_detail_highlight4_title: "Baby Lip Application Included",
    lip_removal_detail_highlight4_desc:
      "After neutralizing, a baby lip color layer helps maintain fresh pink lips for at least 18 months.",

    lip_removal_detail_process_title: "Safe Lip Brightening Procedure",
    lip_removal_detail_process_intro:
      "A 60–75 minute session including neutralizing and intensive lip recovery.",

    lip_removal_detail_process_step1_title: "Pigment Analysis",
    lip_removal_detail_process_step1_desc:
      "Evaluate dark tones and root causes using specialized lighting.",

    lip_removal_detail_process_step2_title: "Enzyme Exfoliation",
    lip_removal_detail_process_step2_desc:
      "Gentle papain enzyme removes dead skin for clearer pigment assessment.",

    lip_removal_detail_process_step3_title: "Cold Laser Neutralizing",
    lip_removal_detail_process_step3_desc:
      "650nm laser breaks down melanin without harming surrounding tissue.",

    lip_removal_detail_process_step4_title: "Vitamin Infusion & Recovery Mask",
    lip_removal_detail_process_step4_desc:
      "Vitamin C, E, B5 serum + peptide mask for instant soothing and reduced dryness.",

    lip_removal_detail_process_step5_title: "Baby Lip Color (Optional)",
    lip_removal_detail_process_step5_desc:
      "After 7–10 days, baby lip blushing is performed to complete the natural pink finish.",

    lip_removal_detail_results_outcome_title: "Expected Results",
    lip_removal_detail_results_outcome_item1:
      "50–70% improvement after one session for pigmentation caused by lipstick.",

    lip_removal_detail_results_outcome_item2:
      "Congenital dark lips improve 30–40% after 2 sessions, continue brightening over 4 weeks.",

    lip_removal_detail_results_outcome_item3:
      "Baby-lip application provides lasting natural pink color for 18–24 months.",

    lip_removal_detail_results_aftercare_title: "Aftercare Instructions",
    lip_removal_detail_results_aftercare_item1:
      "Apply Lumi Care lip balm 3 times daily for 7 days.",
    lip_removal_detail_results_aftercare_item2:
      "Drink 2L of water daily, limit coffee and strong tea for 5 days.",
    lip_removal_detail_results_aftercare_item3:
      "Avoid direct sunlight and lead-based lipstick for 14 days.",

    lip_removal_detail_pricing_title: "Treatment Packages & Pricing",
    lip_removal_detail_pricing_intro:
      "All-inclusive packages with home-care products and follow-up checks.",

    lip_removal_detail_pricing_option1_title: "Basic Brightening Package",
    lip_removal_detail_pricing_option1_item1:
      "1 cold laser session + home-care lip kit",
    lip_removal_detail_pricing_option1_item2: "14-day follow-up",
    lip_removal_detail_pricing_option1_item3:
      "Ideal for mild dark lips caused by lipstick",

    lip_removal_detail_pricing_option2_badge: "Most Popular",
    lip_removal_detail_pricing_option2_title: "Brightening + Baby Lip Package",
    lip_removal_detail_pricing_option2_item1:
      "2 neutralizing sessions + 1 baby lip session",
    lip_removal_detail_pricing_option2_item2:
      "14-day home-care kit & color-locking serum",
    lip_removal_detail_pricing_option2_item3: "12-month color warranty",

    lip_removal_detail_pricing_option3_title: "Severe Pigmentation Package",
    lip_removal_detail_pricing_option3_item1:
      "3 cold laser sessions + intensive care",
    lip_removal_detail_pricing_option3_item2:
      "Nutritional and vitamin guidance to support pigment recovery",
    lip_removal_detail_pricing_option3_item3: "Free baby lip session included",

    lip_removal_detail_pricing_note:
      "Free Lumi Care lip treatment worth 390,000₫ with any package. Returning clients receive 10% off.",

    lip_removal_detail_faq_title: "Frequently Asked Questions",

    lip_removal_detail_faq_q1: "Does lip brightening hurt?",
    lip_removal_detail_faq_a1:
      "No. Cold laser with low energy + medical numbing ensures comfort — only slight warmth in the first 2–3 minutes.",

    lip_removal_detail_faq_q2: "When can I apply lip color?",
    lip_removal_detail_faq_a2:
      "After 7–10 days once the lips fully recover and pigmentation is reduced, a baby lip session can be performed.",

    lip_removal_detail_faq_q3: "Does it make lips dry?",
    lip_removal_detail_faq_a3:
      "No. Vitamins and peptide masks deeply hydrate the lips. Just follow the aftercare routine.",

    lip_removal_detail_cta_title:
      "Ready to Reveal Naturally Pink, Brighter Lips?",
    lip_removal_detail_cta_desc:
      "Book your appointment today for a personalized pigmentation-brightening plan.",

    // Lip Brightening - Neutralizing Pigment
    lip_brightening_intro_title: "What Is Lip Neutralizing?",
    lip_brightening_intro_what:
      "Lip neutralizing uses warm corrector pigments (orange/peach/coral) placed very shallowly to warm up cool tones like blue–purple–grey. It does NOT add new lip color, does NOT change lip structure, and is NOT lip blushing. After neutralizing, lips brighten 50–80%, tone becomes more even, and appear naturally pink.",

    lip_brightening_intro_who_title:
      "Who Is It Suitable For? (Neutralizing Standard)",
    lip_brightening_intro_who1: "Blue / purple / grey cool-tone lips",
    lip_brightening_intro_who2: "Congenitally dark lips",
    lip_brightening_intro_who3: "Dark lips from long-term lipstick use",
    lip_brightening_intro_who4: "Darkening caused by hormones",
    lip_brightening_intro_who5:
      "Lips that do not retain color when tattooed — need warming first",

    lip_brightening_intro_benefits_title: "Main Benefits",
    lip_brightening_benefit1_title: "Warm Up Cool Tones",
    lip_brightening_benefit1_desc:
      "Neutralizing pigments soften cool undertones for brighter, softer lips.",

    lip_brightening_benefit2_title: "30–60% Brightening After One Session",
    lip_brightening_benefit2_desc:
      "Improvement depends on initial pigmentation.",

    lip_brightening_benefit3_title: "No Pain – No Swelling",
    lip_brightening_benefit3_desc:
      "Very shallow technique, unlike lip blushing.",

    lip_brightening_benefit4_title: "Visible Brightening in 7–14 Days",
    lip_brightening_benefit4_desc: "No peeling; recovery is fast and gentle.",

    lip_brightening_benefit5_title: "Perfect Base for Baby Lip Blushing",
    lip_brightening_benefit5_desc:
      "Once the base is warm, baby lip color appears more vibrant and long-lasting.",

    lip_brightening_commitment_title: "Our Commitment",
    lip_brightening_commitment1:
      "No added lip color — only pigment neutralization",
    lip_brightening_commitment2: "Safe technique suitable for sensitive lips",
    lip_brightening_commitment3:
      "Personalized plan based on pigmentation level",
    lip_brightening_commitment4: "Daily follow-up for 7–14 days",
    lip_brightening_commitment5: "6–12 month result warranty",

    lip_brightening_results_title: "After Treatment Results",
    lip_brightening_results_intro:
      "After neutralizing, lips brighten 50–80%, blue–purple–grey tones reduce significantly, lips become softer, more even, and naturally pink. Severe pigmentation may require 2–3 sessions. After brightening, baby lip blushing will give a lasting pink tone.",

    lip_brightening_process_title: "Neutralizing Pigment Procedure",
    lip_brightening_process_intro:
      "A 40–60 minute session using international sterile standards for absolute safety.",

    lip_brightening_process_step1_title: "Lip Pigment Analysis",
    lip_brightening_process_step1_desc:
      "Assess cool tones, undertone base, and skin type.",

    lip_brightening_process_step2_title: "Choosing the Correct Neutralizer",
    lip_brightening_process_step2_desc:
      "Orange, peach, or coral depending on blue-purple-grey undertone.",

    lip_brightening_process_step3_title: "Medical Numbing",
    lip_brightening_process_step3_desc:
      "Provides full comfort during treatment.",

    lip_brightening_process_step4_title: "Neutralizing Pigment Application",
    lip_brightening_process_step4_desc:
      "Ultra-shallow needle technique distributes warm pigment evenly WITHOUT adding new lip color.",

    lip_brightening_process_step5_title: "Check & Aftercare Guidance",
    lip_brightening_process_step5_desc:
      "Mild dryness for 1–2 days, brightening gradually within 7–14 days.",

    lip_brightening_advantages_title: "Why This Technique Works",
    lip_brightening_advantages_intro:
      "The strengths behind Lumi Beauty’s high-quality lip neutralizing service",

    lip_brightening_advantage1_title: "50–80% Brightening After One Session",
    lip_brightening_advantage1_desc:
      "Improvement varies by initial pigmentation but visible from session one.",

    lip_brightening_advantage2_title: "Minimal Peeling",
    lip_brightening_advantage2_desc: "Only mild dryness; no heavy flaking.",

    lip_brightening_advantage3_title: "Does Not Thin the Lips",
    lip_brightening_advantage3_desc:
      "Very shallow depth — does not affect natural lip texture.",

    lip_brightening_advantage4_title: "No Lip Line Marks",
    lip_brightening_advantage4_desc:
      "Neutralizing only — no added lip color, no outlines.",

    lip_brightening_advantage5_title: "No Color Patching",
    lip_brightening_advantage5_desc:
      "Professional technique ensures even color warming.",

    lip_brightening_advantage6_title:
      "Creates the Perfect Base for Lip Blushing",
    lip_brightening_advantage6_desc:
      "Warm base allows baby lip color to attach better and last longer.",

    lip_brightening_advantage7_title: "Suitable for Men & Women",
    lip_brightening_advantage7_desc:
      "Technique tailored to gender preference and natural look.",

    lip_brightening_advantage8_title: "Effective for Severe Cool-Tone Lips",
    lip_brightening_advantage8_desc:
      "Blue–purple–grey lips may require 2–3 sessions for optimal results.",

    lip_brightening_pricing_title: "Service Pricing",
    lip_brightening_pricing_intro:
      "All-inclusive packages with home care and follow-up.",

    lip_brightening_pricing_main_title: "Lip Neutralizing – Pigment Correction",
    lip_brightening_pricing_subtitle:
      "Pricing varies depending on cool-tone severity (blue/purple/grey) & required sessions",

    lip_brightening_pricing_item1: "Professional neutralizing pigments",
    lip_brightening_pricing_item2: "Medical numbing",
    lip_brightening_pricing_item3: "Single-use sterile tools",
    lip_brightening_pricing_item4: "24/7 support",
    lip_brightening_pricing_item5:
      "4-month warranty – free second neutralizing session",

    lip_brightening_pricing_note:
      "Price includes VAT and sterile tools. Cost varies depending on severity and number of sessions.",

    lip_brightening_warranty_title: "Warranty Policy",
    lip_brightening_warranty_intro: "Lumi Beauty’s commitment to your results",

    lip_brightening_warranty1_title:
      "4-Month Warranty – Free Second Neutralizing Session",
    lip_brightening_warranty1_desc:
      "Covers results for 4 months from treatment completion, depending on initial pigmentation.",

    lip_brightening_warranty2_title: "Free Second Session",
    lip_brightening_warranty2_desc:
      "Free correction if color is insufficient within warranty period.",

    lip_brightening_warranty3_title: "Close Monitoring",
    lip_brightening_warranty3_desc:
      "Follow-up checks after 14–30 days with personalized care guidance.",

    lip_brightening_warranty4_title: "24/7 Support",
    lip_brightening_warranty4_desc:
      "Available via phone, Zalo, or Facebook anytime.",

    lip_brightening_precautions_title: "Pre-Treatment Notes",
    lip_brightening_precautions_intro:
      "Important guidelines to ensure a safe and effective procedure",

    lip_brightening_precaution1_title: "Avoid Coffee for 6 Hours",
    lip_brightening_precaution1_desc:
      "No coffee, strong tea, alcohol for 6 hours before treatment to optimize numbing.",

    lip_brightening_precaution2_title: "Avoid Aspirin",
    lip_brightening_precaution2_desc:
      "No aspirin or blood thinners for 7 days prior.",

    lip_brightening_precaution3_title: "Do Not Treat When Sick",
    lip_brightening_precaution3_desc:
      "Postpone if you have fever, flu, lip infection, or acute illness.",

    lip_brightening_precaution4_title: "Inform Medical History",
    lip_brightening_precaution4_desc:
      "Notify Lumi Beauty of allergies, skin conditions, pregnancy or breastfeeding.",

    lip_brightening_precaution5_title: "Avoid Lip Procedures for 7 Days",
    lip_brightening_precaution5_desc:
      "No lip tattooing, bleaching, or lip peeling for at least 7 days prior.",

    lip_brightening_precaution6_title: "Hydrate Well",
    lip_brightening_precaution6_desc:
      "Drink 2L water daily for 3 days before treatment.",

    lip_brightening_aftercare_title:
      "Aftercare Instructions (Neutralizing Pigment)",
    lip_brightening_aftercare_intro:
      "Detailed aftercare guide following Neutralizing Pigment treatment",

    // Day 1
    lip_brightening_aftercare_day1_title: "Most Important Phase",
    lip_brightening_aftercare_day1_item1:
      "Do not wash your face with water; gently wipe with wet wipes only",
    lip_brightening_aftercare_day1_item2:
      "Apply Lumi Care lip balm every 2–3 hours",
    lip_brightening_aftercare_day1_item3:
      "Avoid excessive talking and touching the lips",
    lip_brightening_aftercare_day1_item4:
      "Drink water using a straw; avoid spicy or hot foods",

    // Day 3–6
    lip_brightening_aftercare_day3_title: "Continue Care",
    lip_brightening_aftercare_day3_item1:
      "Apply lip balm 3–4 times per day to maintain moisture",
    lip_brightening_aftercare_day3_item2: "Avoid fluoride toothpaste",
    lip_brightening_aftercare_day3_item3:
      "Avoid direct sunlight; protect lips outdoors",
    lip_brightening_aftercare_day3_item4:
      "Do not pick or peel — allow natural shedding",

    // Day 7–14
    lip_brightening_aftercare_day7_title: "Maintain Care",
    lip_brightening_aftercare_day7_item1: "Apply lip balm 2–3 times per day",
    lip_brightening_aftercare_day7_item2:
      "You may use clear lip balm after 7 days",
    lip_brightening_aftercare_day7_item3:
      "Avoid lead-based or long-lasting lipsticks for 14 days",
    lip_brightening_aftercare_day7_item4:
      "Stay hydrated and eat fruits & vegetables",

    lip_brightening_aftercare_day14_title: "Color Stabilization",
    lip_brightening_aftercare_day14_item1:
      "Color begins to reappear and stabilize",
    lip_brightening_aftercare_day14_item2: "Continue daily lip care",
    lip_brightening_aftercare_day14_item3: "Use lip sunscreen if needed",
    lip_brightening_aftercare_day14_item4: "Follow-up check after 30 days",

    lip_brightening_aftercare_note_title: "What to Avoid",
    lip_brightening_aftercare_avoid1:
      "Avoid spicy, hot, and sour foods for 7 days",
    lip_brightening_aftercare_avoid2: "Avoid kissing or sharing utensils",
    lip_brightening_aftercare_avoid3: "Avoid hot showers or steam for 7 days",
    lip_brightening_aftercare_avoid4: "Do not rub or peel the lips",

    lip_brightening_faq_title: "Frequently Asked Questions",

    lip_brightening_faq_q1: "Is this lip tattooing?",
    lip_brightening_faq_a1:
      "No. This is a pigment-neutralizing technique, not lip tattooing. We only use warm corrective pigments to neutralize cool tones — not add new color.",

    lip_brightening_faq_q2: "How much improvement after one session?",
    lip_brightening_faq_a2:
      "30–60% depending on initial pigmentation. Mild dark lips improve 50–60% in one session. Severe cool-tone lips need 2–3 sessions.",

    lip_brightening_faq_q3: "Does it hurt or swell?",
    lip_brightening_faq_a3:
      "No. The technique is very shallow and numbing is used, so the session is comfortable.",

    lip_brightening_faq_q4: "Will it peel?",
    lip_brightening_faq_a4:
      "No heavy peeling. Only mild dryness for 1–2 days and gradual brightening in 7–14 days.",

    lip_brightening_faq_q5: "When can I get lip blushing?",
    lip_brightening_faq_a5:
      "After 7–14 days when the base has brightened and warmed. Baby lip color will heal better, more vibrant, and longer-lasting.",

    lip_brightening_faq_q6: "Do I need to avoid water?",
    lip_brightening_faq_a6:
      "Avoid water for the first 24 hours. After that you can wash normally but avoid scrubbing. Avoid hot showers/saunas for 7 days.",

    lip_brightening_faq_q7: "Any food restrictions?",
    lip_brightening_faq_a7:
      "Avoid spicy, hot, sour, and salty foods for 7 days. Drink with a straw. Stay hydrated and limit coffee/tea for 5 days.",

    lip_brightening_faq_q8: "Is it suitable for men?",
    lip_brightening_faq_a8:
      "Yes. Neutralizing Pigment works for both men and women. Pigments are adjusted to suit each client naturally.",

    lip_brightening_faq_q9: "Can severe cool-tone lips improve?",
    lip_brightening_faq_a9:
      "Yes. Severe blue–purple–grey lips need 2–3 sessions for optimal results. After warming, lips brighten 30–60%. Baby lip can then enhance the final color.",

    lip_brightening_faq_q10: "Can I wear makeup afterward?",
    lip_brightening_faq_a10:
      "Clear lip balm after 7 days is fine. Avoid lead-based or long-wear lipsticks for 14 days.",

    lip_brightening_expert_title: "Lumi Beauty’s Expert Advice",

    lip_brightening_expert_advice1:
      "Neutralizing Pigment is essential before lip blushing for cool-tone lips. Skipping this step leads to incorrect healed colors.",

    lip_brightening_expert_advice2:
      "With shallow technique and professional pigments, lips brighten clearly without pain or swelling. This is not lip tattooing — only pigment warming.",

    lip_brightening_expert_advice3:
      "Once the base is warm, baby lip blushing will appear vibrant and long-lasting. Each client receives a customized treatment plan.",

    lip_brightening_expert_signature: "— Lumi Beauty",

    lip_brightening_cta_title: "Ready to Reveal Naturally Pink, Brighter Lips?",
    lip_brightening_cta_desc:
      "Book your 1-on-1 consultation today for a personalized neutralizing plan.",
    // Why Choose Us
    why_choose_title: "Why Do So Many Clients Trust Lumi Beauty?",

    feature_personalized_title: "Private 1-on-1 PMU Service",
    feature_personalized_desc:
      "Every client receives exclusive care with the artist following the entire process.",

    feature_expert_title: "Highly Skilled Artists",
    feature_expert_desc: "Professionally trained with years of experience.",

    feature_organic_title: "Safe Organic Pigments",
    feature_organic_desc:
      "No swelling, no discomfort, no color shifting over time.",

    feature_space_title: "Clean & Private Studio",
    feature_space_desc:
      "A relaxing, comfortable environment throughout your beauty session.",

    feature_feedback_title: "Hundreds of Happy Clients",
    feature_feedback_desc: "Real feedback – real results.",

    // Contact Methods
    contact_intro:
      "✨ Want to enhance your natural beauty while keeping your unique features? Let Lumi Beauty accompany you on your personalized 1-on-1 PMU journey.",

    contact_methods_title:
      "Don't hesitate – choose the contact method that suits you best.",

    contact_call_title: "Call Directly",
    contact_call_description: "Tap to connect with Lumi Beauty immediately",
    contact_call_button: "CALL NOW",

    contact_facebook_title: "Facebook Chat",
    contact_facebook_description:
      "Get instant consultation via Lumi Beauty’s Messenger",
    contact_facebook_button: "OPEN MESSENGER",

    contact_zalo_title: "Zalo Chat",
    contact_zalo_description:
      "Connect via Zalo for support and exclusive offers",
    contact_zalo_button: "OPEN ZALO",

    contact_email_title: "Send Email",
    contact_email_description:
      "Leave a detailed message — we will respond within 24 hours",
    contact_email_button: "SEND EMAIL",

    contact_free_button: "Free Consultation",

    // Zalo Contact Modal
    zalo_contact_modal_title: "Contact Us Directly",
    zalo_contact_modal_desc:
      "You are interested in {service}. Please contact us via Zalo for detailed consultation.",
    zalo_contact_phone_label: "Zalo Phone Number:",
    zalo_contact_open_button: "OPEN ZALO NOW",

    // Contact Form
    contact_form_title:
      "Leave your phone number — we’ll help you choose the service that best suits your face.",
    phone_placeholder: "Enter your phone number",
    send: "SEND",

    contact_form_success: "Thank you! We will contact you as soon as possible.",
    contact_form_error: "An error occurred. Please try again.",
    contact_form_phone_required: "Please enter your phone number.",

    // Gallery
    real_images: "Real Results",
    lip_tattoo_label: "Lip PMU",
    eyebrow_tattoo_label: "Brow PMU",

    // Testimonials
    customer_reviews: "Client Reviews",
    scroll_hint: "Swipe to see more",

    testimonial1:
      "Amazing service! My lips look so natural and beautiful. The staff was very professional and caring.",
    testimonial2:
      "Very satisfied with my brows. The shape was designed to match my face and the color looks natural.",
    testimonial3:
      "The process was painless as promised. After lip blushing, the color healed evenly and beautifully. I will definitely return!",

    // Blog
    learn_more_title: "Learn More About PMU & Beauty",
    blog1_title: "How Long Until Lip Blushing Heals Beautifully?",
    blog2_title: "What Should You Avoid After Getting Brows Done?",
    blog3_title:
      "Baby Lip vs. Collagen Lip vs. Ombre — Which One Should You Choose?",
    read_more: "Read More",
    view_more_gallery: "VIEW MORE IMAGES",
    view_more_feedback: "VIEW MORE FEEDBACK",

    // Footer
    footer_tagline: "Natural PMU – Enhance Your Unique Beauty",
    footer_address: "151 Tran Duy Hung, Cau Giay, Ha Noi",

    services_title: "Services",
    lip_service: "Lip PMU",
    eyebrow_service: "Brow PMU",
    lip_removal_service: "Lip Brightening",

    contact_title: "Contact",
    about_us_contact: "About Us & Contact",

    consultation_title: "Consultation",
    connect_with_us: "Connect With Us",

    footer_line1: "💋 Experts in Natural Brows – Lips – Eyeliner PMU",
    footer_line2: "💋 Dedicated consultation & aftercare",
    footer_address_detail: "Vo Quy Huan, FPT City Urban Area, Da Nang, Vietnam",

    footer_tiktok: "TikTok: @lumibeautyphunxam",
    footer_facebook: "Facebook: facebook.com/lumibeautypmubrowlip",

    facebook_iframe_title: "Lumi Beauty Facebook Page",

    footer_copyright: "© 2025 Lumi Beauty. All rights reserved.",

    // Booking Modal
    booking_title: "Book an Appointment",
    booking_description:
      "Fill in your information and Lumi Beauty will contact you shortly.",

    booking_name_label: "Full Name",
    booking_name_placeholder: "Nguyen Thi Anh",

    booking_phone_label: "Phone Number",
    booking_phone_placeholder: "0900 067 832",

    booking_service_label: "Interested Service",
    booking_service_option_lip: "Lip PMU",
    booking_service_option_eyebrow: "Brow PMU",
    booking_service_option_lip_removal: "Lip Brightening",
    booking_service_option_other: "Other",

    booking_time_label: "Preferred Time",
    booking_notes_label: "Additional Notes",
    booking_notes_placeholder: "Share your needs or questions",

    booking_submit: "SUBMIT REQUEST",
    booking_sending: "Sending...",

    booking_success:
      "Thank you! Lumi Beauty will contact you as soon as possible.",
    booking_error:
      "Submission failed. Please try again or contact us directly.",

    copyright: "© 2023 Lumi Beauty. All rights reserved.",
  },

  ko: {
    // General
    page_title:
      "루미 뷰티 - 다낭 자연스러운 반영구 시술 - 전문가 브로우, 입술 & 아이라인",

    close_modal: "닫기",

    floating_contact_zalo: "Zalo로 채팅하기",
    floating_contact_facebook: "Facebook으로 채팅하기",
    floating_contact_tiktok: "TikTok",

    meta_description:
      "루미 뷰티 다낭은 최신 부드러운 기법과 의료적으로 안전한 절차를 사용하여 브로우, 입술, 아이라인의 자연스러운 반영구 시술을 제공합니다.",

    meta_keywords: "다낭 pmu, 자연 옴브레 브로우, 립 블러싱, 루미 뷰티 다낭",

    og_title: "루미 뷰티 - 다낭 자연스러운 반영구 시술",

    og_description:
      "루미 뷰티 다낭에서 자연스럽고 오래 지속되는 브로우, 입술, 아이라인을 경험하세요 – 부드러운 기법, 붓기 없음, 통증 없음, 아름다운 힐링 결과.",

    twitter_title: "루미 뷰티 - 다낭 반영구 시술",

    twitter_description:
      "루미 뷰티는 1:1 맞춤 서비스와 자연스럽고 부드러운 결과를 제공하는 최신 PMU 브로우, 입술, 아이라인 시술을 제공합니다.",

    business_name: "루미 뷰티",

    business_description:
      "루미 뷰티 다낭은 부드러운 기법과 세심한 고객 케어를 기반으로 브로우, 입술, 아이라인의 프리미엄 반영구 시술을 제공합니다.",

    // Navigation
    beauty_services: "PMU 서비스",
    beauty_guide: "뷰티 지식",
    gallery: "갤러리",
    feedback: "고객 후기",
    contact: "문의하기",
    offers: "후기",
    book_now: "예약하기",
    about_us_contact: "소개 & 문의",

    // Hero Section
    main_title: "반영구 시술",
    natural_beauty: "자연스럽게 아름답게",
    enhance_features: "당신의 개성을 더욱 돋보이게",

    hero_description:
      "루미 뷰티는 <strong>1:1 맞춤 PMU 시술</strong>을 통해 얼굴에 가장 조화로운 디자인을 제공합니다. 자연스러운 핑크립, 세련된 브로우, 맑고 또렷한 아이라인을 경험해보세요. 모든 고객은 숙련된 아티스트의 섬세한 케어를 통해 가장 자연스럽고 조화로운 결과를 얻을 수 있습니다.",

    contact_now: "지금 문의하기",

    // Feature Tags
    no_pain: "무통증",
    no_swelling: "붓기 없음",
    no_diet: "금기 없음",

    // Stats
    years_experience: "년 경력",
    potential_customers: "잠재 고객",
    five_star_reviews: "5성급 고객 후기",
    certifications: "전문 자격증 보유",

    // Help Section
    greeting: "안녕하세요!",
    how_can_help: "루미 뷰티를 1분 안에 소개해드릴까요?",

    help_intro:
      "루미 뷰티는 다낭에서 신뢰받는 PMU 스튜디오로, 프라이빗 1:1 서비스와 부드럽고 세심한 접근 방식으로 사랑받고 있습니다.",

    help_quote:
      '우리는 이렇게 믿습니다: "모든 얼굴에는 고유한 아름다움이 있으며, 그것은 가장 섬세하고 자연스럽게 돋보여야 합니다."',

    help_commitment:
      "그래서 루미 뷰티는 고객 한 분 한 분의 이야기를 듣고, 상담하고, 가장 잘 맞는 브로우·립·아이라인 디자인을 만들어드립니다. 의료적으로 안전한 절차와 유기농 색소를 사용하여 붓기 없음, 통증 없음, 자연스럽고 오래가는 색감을 약속드립니다.",

    book_description: "지금 바로 상담 및 특별 혜택 예약이 가능합니다.",

    contact_description:
      "피드백 또는 맞춤 상담이 필요하시면 언제든지 문의해주세요.",

    book_appointment: "지금 예약하기",
    want_to_book: "예약하고 싶어요",
    contact_us: "문의하기",
    need_consultation: "상담이 필요해요",

    // Services
    our_services: "루미 뷰티 서비스",

    lip_tattoo_title: "콜라겐 립 블러싱",
    lip_tattoo_benefit1:
      "부드럽고 장밋빛, 자연스럽게 도톰해 보이는 입술을 만들어줍니다.",
    lip_tattoo_benefit2:
      "초미세 니들을 사용한 1:1 테크닉으로 거의 통증 없이 치유 후에도 고르게 예쁜 색감을 구현합니다.",
    lip_tattoo_benefit3:
      "건조하거나 어두운 톤, 혹은 혈색이 옅은 입술에 적합합니다.",

    eyebrow_tattoo_title: "쉐이딩 옴브레 브로우",
    eyebrow_tattoo_benefit1:
      "얼굴의 조화를 살려주는 부드럽고 자연스러운 브로우를 디자인합니다.",
    eyebrow_tattoo_benefit2:
      "시술 전 정밀한 얼굴 비율 측정과 함께 1:1 맞춤 브로우 매핑을 진행합니다.",
    eyebrow_tattoo_benefit3:
      "진하거나 인위적인 선 없이 균형 잡힌 브로우를 완성합니다.",

    eyeliner_tattoo_title: "래쉬라인 인핸스먼트",
    eyeliner_tattoo_benefit1:
      "자연스럽게 또렷한 속눈썹 라인으로 더 크고 밝아 보이는 눈을 만들어줍니다.",
    eyeliner_tattoo_benefit2:
      "수술 없이 진행되는 부드럽고 무통증의 시술입니다.",
    eyeliner_tattoo_benefit3:
      "자연스러움을 유지하면서 은은한 눈매 보정을 원하는 분들에게 적합합니다.",

    lip_removal_title: "남녀 립 뉴트럴라이징",
    lip_removal_benefit1:
      "어두운 입술 톤을 밝게 개선하여 자연스럽고 균일한 색으로 되돌립니다.",
    lip_removal_benefit2:
      "1:1 맞춤 뉴트럴라이징 기법으로 안전하고 효과적이며 한 번의 시술 후에도 눈에 띄는 개선을 제공합니다.",
    lip_removal_benefit3:
      "인위적인 붉은색 없이 건강해 보이는 입술을 원하는 남성에게도 좋은 솔루션입니다.",

    discover_more: "더 알아보기",

    // Service Detail - Lip Tattoo
    lip_detail_page_title: "루미 뷰티 콜라겐 립 블러싱 – 다낭 의료 표준 기법",
    lip_detail_meta_description:
      "루미 뷰티 다낭 콜라겐 립 블러싱: 의료 표준 기법, 1:1 전문가 7년 이상 경력, 색상 18-36개월 지속, 빠른 회복 1-2일. 유기농 색소 수입, 4개월 보증.",
    lip_detail_badge: "인기 서비스",
    lip_detail_hero_heading: "루미 뷰티 콜라겐 립 블러싱",
    lip_detail_hero_subheading: "48시간 후 핑크빛, 볼륨감 있는 입술",
    lip_detail_hero_highlight1:
      "한 번의 시술로 어두운 톤과 입술 색상이 눈에 띄게 개선됩니다",
    lip_detail_hero_highlight2:
      "투명하고 부드러운 입술 색상, 테두리 없음 – 진하거나 얼룩 없음",
    lip_detail_hero_highlight3:
      "부드러운 느낌, 거의 통증 없음 – 1–2일 후 빠른 회복",
    lip_detail_hero_highlight4:
      "색상 18–36개월 지속, 정확한 색상 발현 및 번짐 없음",
    lip_detail_hero_paragraph1:
      "우리는 각 고객에게 맞춤 색소 측정 프로토콜과 함께 콜라겐 베이비립 블러싱 기술을 결합합니다. 100% 유기농 수입 색소, 납 없음, 건조나 갈라짐 없음, 18-36개월 동안 정확한 색상 유지.",
    lip_detail_hero_paragraph2:
      "의료 자격증을 가진 전문가가 시술하며, 표준 무균 프로세스, 통증 없음, 붓기 없음, 빠른 회복을 약속합니다.",
    lip_detail_hero_stat_label: "첫 터치업 후 만족한 고객",
    lip_detail_highlights_title: "왜 루미 뷰티의 립 블러싱이 다른가요?",
    lip_detail_highlight1_title: "콜라겐 베이비립 기술",
    lip_detail_highlight1_desc:
      "초미세 색소 입자와 내인성 콜라겐 세럼이 결합되어 빠른 회복, 부드럽고 윤기 있는 자연스러운 입술을 만듭니다.",
    lip_detail_highlight2_title: "개인 맞춤 색소 프로토콜",
    lip_detail_highlight2_desc:
      "분석 기계로 피부와 입술 색소를 측정하여 정확한 색상을 혼합하고, 톤 불일치나 각질 탈락 후 재착색을 방지합니다.",
    lip_detail_highlight3_title: "무통증 - 무붓기",
    lip_detail_highlight3_desc:
      "2단계 의료 마취와 표면에 밀착되는 나노 니들 기술로 고객이 시술 내내 편안하게 쉴 수 있고, 입술에 멍이 생기지 않습니다.",
    lip_detail_highlight4_title: "12개월 보증",
    lip_detail_highlight4_desc:
      "시술 후 밀착 모니터링, 무료 1회 터치업 및 12개월간 홈케어 세트 제공.",
    lip_detail_process_title: "90분 내 의료 표준 프로세스",
    lip_detail_process_intro:
      "모든 단계는 무균 관리 준수, 부드러운 경험과 정확한 결과 보장.",
    lip_detail_process_step1_title: "상담 & 개인 평가",
    lip_detail_process_step1_desc:
      "전문가가 입술 상태, 피부 색소 및 고객의 요구사항을 평가하여 적합한 톤과 기법을 선택합니다.",
    lip_detail_process_step2_title: "클렌징 & 안전 마취",
    lip_detail_process_step2_desc:
      "입술과 주변 부위를 깨끗이 하고, 전문 마취를 적용하여 부드럽고 통증 없는 립 블러싱 과정을 보장합니다.",
    lip_detail_process_step3_title: "색소 혼합 및 도구 준비",
    lip_detail_process_step3_desc:
      "유기농 색소를 개인 톤에 맞게 혼합하고, 의료 표준 무균 도구로 절대 안전을 보장합니다.",
    lip_detail_process_step4_title: "전문 PMU 기기로 립 블러싱",
    lip_detail_process_step4_desc:
      "콜라겐 기술로 입술이 정확한 색상으로 발현되고, 부드럽고 테두리 없이 자연스럽게 볼륨감 있게 됩니다.",
    lip_detail_process_step5_title: "립 케어 및 완료",
    lip_detail_process_step5_desc:
      "콜라겐 에센스로 케어하고, 결과를 다시 확인하며, 색상이 고르고 오래 지속되도록 홈케어 가이드를 제공합니다.",
    lip_detail_process_step6_title: "시술 후 케어 & 지원",
    lip_detail_process_step6_desc:
      "입술 케어 방법을 자세히 안내하고, 필요시 색상 터치업을 지원하여 장기적인 결과와 항상 부드러운 입술을 보장합니다.",
    process_step1_alt: "상담 & 개인 평가",
    process_step2_alt: "클렌징 & 안전 마취",
    process_step3_alt: "색소 혼합 및 도구 준비",
    process_step4_alt: "전문 PMU 기기로 립 블러싱",
    process_step5_alt: "립 케어 및 완료",
    process_step6_alt: "시술 후 케어 & 지원",
    why_choose_image_alt: "루미 뷰티 콜라겐 립 블러싱",
    lip_detail_results_outcome_title: "받게 되는 결과",
    lip_detail_results_outcome_item1:
      "48시간 후 핑크빛 입술, 7일 후 정확한 색상 발현.",
    lip_detail_results_outcome_item2:
      "선천적 어두운 입술이 시술 직후 60-80% 개선됩니다.",
    lip_detail_results_outcome_item3:
      "립스틱 없이도 볼륨감 있고 생기 있는 입술 모서리.",
    lip_detail_results_aftercare_title: "간단한 홈케어",
    lip_detail_results_aftercare_item1:
      "첫 7일 동안 독점 립 케어를 아침-저녁으로 도포.",
    lip_detail_results_aftercare_item2:
      "3일간 뜨거운 물, 매우 매운 음식 또는 진한 색 음식 피하기.",
    lip_detail_results_aftercare_item3:
      "30일 후 색상 지속성을 확인하기 위한 무료 재방문.",
    lip_detail_pricing_title: "콜라겐 립 블러싱 가격 & 패키지",
    lip_detail_pricing_intro:
      "입술 유형과 개별 상태에 따라 2,000,000₫ – 3,000,000₫",
    lip_detail_pricing_title_main: "콜라겐 립 블러싱",
    lip_detail_pricing_subtitle:
      "가격은 입술 상태와 선택한 색상에 따라 달라집니다",
    lip_detail_pricing_item1:
      "의료 표준 콜라겐 기법 – 자연스러운 색상 발현, 부드러움",
    lip_detail_pricing_item2: "각 고객은 프라이빗 공간에서 1:1 케어를 받습니다",
    lip_detail_pricing_item3: "4개월 내 무료 1회 터치업",
    lip_detail_pricing_item5:
      "100% 유기농 수입 색소, 납 없음, 모든 유형의 입술에 안전",
    lip_detail_pricing_option1_title: "베이비립 블러싱 패키지",
    lip_detail_pricing_option1_item1: "의료 표준 콜라겐 베이비립 블러싱.",
    lip_detail_pricing_option1_item2: "7일 보습 세럼 제공.",
    lip_detail_pricing_option1_item3: "6개월 보증.",
    lip_detail_pricing_option2_badge: "가장 인기",
    lip_detail_pricing_option2_title: "콜라겐 럭셔리 패키지",
    lip_detail_pricing_option2_item1: "피부 톤에 맞춘 브로우 & 립 블러싱.",
    lip_detail_pricing_option2_item2: "14일 케어 세트 & 색상 고정 세럼 제공.",
    lip_detail_pricing_option2_item3: "12개월 내 무료 1회 터치업.",
    lip_detail_pricing_option3_title: "심한 어두운 입술 처리 패키지",
    lip_detail_pricing_option3_item1:
      "어두운 입술 중화와 베이비립 블러싱 2회 세션 결합.",
    lip_detail_pricing_option3_item2: "3개월마다 정기 모니터링.",
    lip_detail_pricing_option3_item3: "색소 개선을 위한 영양 상담.",
    lip_detail_pricing_note:
      "가격에는 1회용 무균 도구 세트 및 VAT 포함. 구체적인 가격은 입술 상태와 선택한 색상에 따라 달라집니다. 그룹 할인 또는 현재 프로모션을 받으려면 문의하세요.",
    lip_detail_faq_title: "자주 묻는 질문",
    lip_detail_faq_q1: "콜라겐 립 블러싱이 아픈가요?",
    lip_detail_faq_a1:
      "프로세스는 전문 마취를 사용하며, 부드러운 기법으로 거의 통증이 없고 붓기가 적습니다.",
    lip_detail_faq_q2: "입술 색상이 얼마나 오래 지속되나요?",
    lip_detail_faq_a2:
      "색상은 체질에 따라 18–36개월 동안 정확하게 발현되고 지속되어 자연스러운 핑크 입술을 오래 유지할 수 있습니다.",
    lip_detail_faq_q3: "입술이 완전히 회복되는 데 얼마나 걸리나요?",
    lip_detail_faq_a3:
      "일반적으로 처음 1–2일 동안 입술이 약간 부어오르고, 5–7일 후 색상이 안정되고 입술이 부드럽고 자연스러워집니다.",
    lip_detail_faq_q4: "시술 후 휴식이 필요한가요?",
    lip_detail_faq_a4:
      "휴식이 필요 없습니다. 평소대로 생활하시면 됩니다. 색상이 가장 예쁘게 발현되도록 입술 케어 가이드를 따르시면 됩니다.",
    lip_detail_faq_q5: "개인 톤 색상을 선택할 수 있나요?",
    lip_detail_faq_a5:
      "물론입니다. 전문가가 피부 톤과 요구사항에 맞는 톤을 상담하여 자연스러운 색상 발현을 보장합니다.",
    lip_detail_faq_q6: "입술 색상이 바래거나 수정이 필요하면 어떻게 하나요?",
    lip_detail_faq_a6:
      "4개월 내 무료 1회 터치업을 받으실 수 있어 입술이 항상 아름답고 고른 색상을 유지합니다.",
    lip_problems_title: "입술 문제",
    lip_problems_intro: "우리가 해결할 수 있는 일반적인 입술 문제들",
    lip_problem1_title: "어두운, 칙칙한 입술",
    lip_problem1_desc:
      "어두운 입술 색상으로 얼굴이 생기 없어 보이고 항상 립스틱으로 결점을 가려야 합니다.",
    lip_problem1_alt: "어두운, 칙칙한 입술",
    lip_problem2_title: "불균일한 입술 색상",
    lip_problem2_desc:
      "일부 입술 부위는 진하고 일부는 옅어서 메이크업이 어렵고 입술 색상이 조화롭지 않습니다.",
    lip_problem2_alt: "불균일한 입술 색상",
    lip_problem4_title: "비대칭 입술, 불균형 립 라인",
    lip_problem4_desc:
      "양쪽이 고르지 않은 입술로 미소가 조화롭지 않고 대화 시 자신감이 떨어집니다.",
    lip_problem4_alt: "비대칭 입술, 불균형 립 라인",
    lip_problem5_title: "시간이 지나면서 톤이 어두워지는 입술",
    lip_problem5_desc:
      "케어를 잘 해도 입술 색상이 시간이 지나면서 바래고 생기를 잃어 장기적인 해결책이 필요합니다.",
    lip_problem5_alt: "시간이 지나면서 톤이 어두워지는 입술",
    why_choose_title: "왜 많은 고객이 루미 뷰티에서 립 블러싱을 선택할까요?",
    why_choose_item1_title: "1:1 립 블러싱 – 7년 이상 경력 전문가",
    why_choose_item1_desc:
      "루미 뷰티에서는 7년 경력을 가진 립 블러싱 전문가가 각 고객에게 프라이빗 1:1 케어를 제공하여 섬세하고 조화로운 입술 색상을 보장하며 각 얼굴에 맞게 디자인합니다.",
    why_choose_item2_title: "콜라겐 기술",
    why_choose_item2_desc:
      "고급 기법으로 입술이 자연스럽고 부드럽고 볼륨감 있게 색상이 발현되며 어두운 톤을 효과적으로 감소시킵니다.",
    why_choose_item3_title: "수입 유기농 색소, 절대 안전",
    why_choose_item3_desc:
      "100% 납 없는 유기농 색소, 자극 없음, 모든 피부 유형과 민감한 입술에 적합합니다.",
    why_choose_item4_title: "부드러운 프로세스, 무통증, 빠른 회복",
    why_choose_item4_desc:
      "전문 PMU 기기로 립 블러싱, 최대한의 붓기와 통증 감소, 1–2일 후 회복.",
    why_choose_item5_title: "장기 지속 색상 결과",
    why_choose_item5_desc:
      "입술 색상이 18–36개월 동안 안정적으로 유지되며, 정확한 톤으로 발현되고 시간이 지나도 자연스러운 효과를 유지합니다.",
    why_choose_item6_title: "세심한 케어, 시술 후 보증",
    why_choose_item6_desc:
      "자세한 케어 가이드, 무료 색상 터치업 지원으로 항상 완벽한 입술을 유지합니다.",
    service_commitment_title: "서비스 약속",
    service_commitment_intro:
      "루미 뷰티는 명확한 보장과 함께 최고의 서비스를 제공하기로 약속합니다",
    commitment1_title: "절대 안전",
    commitment1_desc:
      "의료 표준 프로세스, 무균 도구, 수입 유기농 색소로 입술 건강을 보호합니다.",
    commitment2_title: "자연스러운 결과 – 지속 색상",
    commitment2_desc:
      "립 블러싱이 정확한 색상으로 발현되고, 부드럽게, 18–36개월 동안 유지되며, 얼굴과 조화롭습니다.",
    commitment3_title: "세심한 케어, 1:1",
    commitment3_desc:
      "각 고객은 개별 상담과 케어를 받으며, 시술 후 자세한 가이드를 제공하여 입술이 항상 아름답게 유지됩니다.",
    commitment4_title: "보증 & 색상 터치업 지원",
    commitment4_desc:
      "필요시 무료 1회 색상 터치업 지원으로 초기 약속대로 완벽한 입술을 보장합니다.",
    lip_detail_cta_title: "생기 있는 입술 색상을 갖고 싶으신가요?",
    lip_detail_cta_desc:
      "오늘 바로 예약하고 루미 뷰티에서 색상 톤 측정 및 개인 맞춤 케어 프로토콜을 받아보세요.",
    color_development_title: "색상 발현 과정",
    color_development_intro: "립 블러싱 후 회복 및 색상 발현 과정",
    timeline_day1_title: "방금 블러싱한 입술",
    timeline_day1_desc:
      "손상과 마취로 인해 입술이 약간 당기고, 가벼운 따가움은 정상입니다.",
    timeline_day2_title: "입술이 건조하고 각질 준비 중",
    timeline_day2_desc:
      "입술이 건조해지기 시작하며, 자연스러운 각질 탈락 과정을 지원하기 위해 재생 케어가 필요합니다.",
    timeline_day3_title: "가벼운 각질, 색상이 아직 고르지 않음",
    timeline_day3_desc:
      "각질이 완전히 탈락하고, 색상이 옅고, 테두리가 진하며, 입술 안쪽이 옅습니다. 이 기간 동안 정기적인 케어와 신중한 주의가 필요합니다.",
    timeline_day10_title: "입술 색상이 점차 안정화",
    timeline_day10_desc:
      "색상은 체질과 케어 방법에 따라 진하거나 옅을 수 있습니다. 이것은 정상적인 단계이며 걱정할 필요가 없습니다. 규칙적으로 케어를 도포하세요.",
    timeline_day30_title: "생기 있고 부드러운 입술",
    timeline_day30_desc:
      "입술 색상이 고르게 시작되고, 입술이 더 부드러워집니다. 계속 규칙적으로 케어를 도포하세요.",
    timeline_day50_title: "완전히 안정화된 색상",
    timeline_day50_desc:
      "입술 색상이 안정화되며, 색상이 원하는 대로 나오지 않으면 고객이 다시 터치업할 수 있습니다.",
    before_after_title: "시술 전후 사진",
    before_after_intro: "루미 뷰티 고객들의 실제 결과",
    before_after_alt1: "립 블러싱 시술 전후 결과",
    before_after_alt2: "립 블러싱 시술 전후 결과",
    before_after_alt3: "립 블러싱 시술 전후 결과",
    before_after_alt4: "립 블러싱 시술 전후 결과",
    before_after_alt5: "립 블러싱 시술 전후 결과",
    before_after_alt6: "립 블러싱 시술 전후 결과",

    // Service Detail - Brow Tattoo
    brow_detail_page_title:
      "루미 뷰티 쉐이딩 브로우 – 부드러운 파우더 효과, 18–36개월 동안 자연스럽게 유지",

    brow_detail_meta_description:
      "루미 뷰티 쉐이딩 브로우: 부드러운 파우더 효과, 18–36개월 지속되는 자연스러운 마무리. 자연스러운 앞머리, 매끄러운 바디, 선명한 꼬리로 은은한 메이크업 느낌 구현.",

    brow_detail_badge: "브로우 디자인",

    brow_detail_hero_heading: "루미 뷰티 쉐이딩 브로우",
    brow_detail_hero_subheading:
      "쉐이딩 브로우 – 부드러운 파우더 효과, 18–36개월 자연 유지",

    brow_detail_hero_paragraph1:
      "쉐이딩 기술은 부드러운 앞머리, 매끄러운 브로우 바디, 자연스럽게 정돈된 꼬리를 만들어주며, 과하지 않은 은은한 메이크업 효과를 제공합니다.",

    brow_detail_hero_paragraph2:
      "쉐이딩은 얼굴형의 98%에 잘 어울리며, 편안하고 통증이 거의 없고 색감도 균일하게 유지됩니다. 유럽 유기농 색소는 출산 6개월 이후의 엄마들도 안전하게 시술할 수 있습니다. 4개월간의 모양 & 색상 보증 포함.",

    brow_detail_hero_stat_label: "18개월 동안 눈썹을 그릴 필요가 없어요",

    brow_before_after_title: "시술 전후 비교",
    brow_before_after_intro:
      "루미 뷰티에서 쉐이딩 브로우를 선택한 고객들의 아름다운 변화를 확인하세요",

    brow_before_after_image1_alt: "루미 뷰티 쉐이딩 브로우 결과",
    brow_before_after_image2_alt: "루미 뷰티 쉐이딩 브로우 결과",
    brow_before_after_image3_alt: "루미 뷰티 쉐이딩 브로우 결과",
    brow_before_after_image4_alt: "루미 뷰티 쉐이딩 브로우 결과",
    brow_before_after_image5_alt: "루미 뷰티 쉐이딩 브로우 결과",
    brow_before_after_image6_alt: "루미 뷰티 쉐이딩 브로우 결과",
    brow_before_after_image7_alt: "루미 뷰티 쉐이딩 브로우 결과",
    brow_before_after_image8_alt: "루미 뷰티 쉐이딩 브로우 결과",
    brow_before_after_image9_alt: "루미 뷰티 쉐이딩 브로우 결과",
    brow_before_after_image10_alt: "루미 뷰티 쉐이딩 브로우 결과",
    brow_before_after_image11_alt: "루미 뷰티 쉐이딩 브로우 결과",
    brow_before_after_image12_alt: "루미 뷰티 쉐이딩 브로우 결과",

    brow_before_after_cta_text:
      "내 얼굴에 어떤 브로우 디자인이 맞는지 알고 싶나요?",
    brow_before_after_cta_button: "무료 상담 받기",

    brow_who_suitable_title: "쉐이딩 브로우가 잘 맞는 사람",
    brow_who_suitable_intro: "다음과 같은 경우에 적합합니다:",

    brow_who_suitable_image1_alt: "짧은 눈썹",
    brow_who_suitable_item1: "눈썹이 너무 짧은 경우",

    brow_who_suitable_image2_alt: "옅은 눈썹",
    brow_who_suitable_item2: "눈썹이 옅거나 거의 보이지 않는 경우",

    brow_who_suitable_image3_alt: "성근 눈썹",
    brow_who_suitable_item3: "성근·얇은·짧은 눈썹",

    brow_who_suitable_image4_alt: "비대칭 눈썹",
    brow_who_suitable_item4: "눈썹이 비대칭이거나 균형이 맞지 않는 경우",

    brow_who_suitable_note:
      "👉 쉐이딩은 얼굴형의 98%에 잘 어울리며, 부드럽고 통증이 거의 없으며 색감도 고르게 유지됩니다.",

    brow_standards_title: "아름다운 쉐이딩 브로우 기준",
    brow_standards_intro: "쉐이딩 브로우 전용 기준",

    brow_standard1_image_alt: "균형 잡힌 비율 – 부드러운 앞머리, 선명한 꼬리",
    brow_standard1_title: "균형 잡힌 비율 – 부드러운 앞머리, 정돈된 꼬리",
    brow_standard1_desc:
      "쉐이딩은 타투처럼 진하지도, 헤어스트로크처럼 선이 뚜렷하지도 않습니다. 앞머리는 그라데이션처럼 부드럽게, 꼬리는 선명하고 정돈되게 표현합니다.",

    brow_standard2_image_alt: "부드러운 컬러 – 진한 어둠 없음",
    brow_standard2_title: "부드러운 컬러 – 과한 톤 없이 자연스럽게",
    brow_standard2_desc:
      "쉐이딩은 일상적인 아이브로우 파우더처럼 부드럽고 조화로운 색감일 때 가장 아름답습니다.",

    brow_standard3_image_alt: "얼굴형 기반 브로우 디자인",
    brow_standard3_title: "얼굴형에 맞춘 브로우 형태",
    brow_standard3_desc:
      "직선형, 소프트 아치형, 클래식 아치형 등 얼굴형에 따라 가장 조화로운 쉐이딩 스타일을 적용합니다.",

    brow_shapes_title: "쉐이딩 브로우가 잘 어울리는 얼굴형",
    brow_shapes_intro:
      "각 얼굴형에 가장 잘 맞는 쉐이딩 스타일이 있습니다. 루미 뷰티가 안내해드립니다.",

    brow_shape1_image_alt: "둥근 얼굴 – 소프트 앵글 쉐이딩",
    brow_shape1_title: "둥근 얼굴 – 부드러운 각도의 쉐이딩",
    brow_shape1_desc: "얼굴이 더 슬림해 보이도록 도움을 줍니다.",

    brow_shape2_image_alt: "긴 얼굴 – 자연스러운 직선 쉐이딩",
    brow_shape2_title: "긴 얼굴 – 내추럴 스트레이트 쉐이딩",
    brow_shape2_desc: "얼굴 길이를 균형 있게 보이도록 합니다.",

    brow_shape3_image_alt: "각진 얼굴 – 소프트 곡선 쉐이딩",
    brow_shape3_title: "각진 얼굴 – 부드러운 곡선 쉐이딩",
    brow_shape3_desc: "각진 느낌을 완화하고 여성스러움을 더해줍니다.",

    brow_shape4_image_alt: "타원형 얼굴 – 자연 쉐이딩",
    brow_shape4_title: "타원형 얼굴 – 내추럴 쉐이딩",
    brow_shape4_desc: "원래의 조화를 자연스럽게 유지합니다.",

    brow_detail_process_title: "쉐이딩 브로우 시술 과정",
    brow_detail_process_intro: "75분 – 국제 표준 프로세스",

    brow_detail_process_step1_title: "상담 & 평가",
    brow_detail_process_step1_desc:
      "아티스트가 피부 상태를 확인하고, 원하는 스타일을 듣고, 가장 잘 어울리는 모양과 색소를 추천합니다.",

    brow_detail_process_step2_title: "클렌징 & 살균",
    brow_detail_process_step2_desc:
      "자극이나 감염을 방지하기 위해 눈썹을 꼼꼼하게 세척하고 살균합니다.",

    brow_detail_process_step3_title: "마취 & 색소 준비",
    brow_detail_process_step3_desc:
      "편안함을 위해 연고 마취를 적용하며, 동시에 맞춤 색소를 준비합니다.",

    brow_detail_process_step4_title: "브로우 매핑",
    brow_detail_process_step4_desc:
      "정확한 측정과 스케치를 통해 얼굴 비율에 완벽히 맞는 눈썹 모양을 설계합니다.",

    brow_detail_process_step5_title: "쉐이딩 시술",
    brow_detail_process_step5_desc:
      "초미세 니들을 사용하는 PMU 기기로 피부에 색소를 픽셀처럼 부드럽게 쌓아 자연스러운 쉐이딩 효과를 만듭니다.",

    brow_commitment_title: "서비스 약속",
    brow_commitment_intro: "루미 뷰티가 드리는 보장",

    brow_commitment1_title: "10–14일 내 자연색 완성",
    brow_commitment2_title: "푸르거나 붉게 변색 없음",
    brow_commitment3_title: "18–36개월 유지",
    brow_commitment4_title: "유럽산 유기농 색소 사용",
    brow_commitment5_title: "100% 1회용 도구 사용",
    brow_commitment6_title: "4개월 보증 – 무료 리터치 포함",

    why_lumi_brow_title: "왜 루미 뷰티의 쉐이딩 브로우인가?",
    why_lumi_brow_intro: "짧지만 강력한 이유",

    why_lumi_brow0_title: "1:1 프라이빗 케어 – 7년 이상 경력 아티스트",
    why_lumi_brow0_desc:
      "루미 뷰티에서는 7년 이상 경력을 가진 브로우 전문가가 고객 한 분마다 1:1 맞춤 케어를 제공하여 얼굴형에 가장 조화로운 브로우를 디자인합니다.",

    why_lumi_brow1_title: "30% 희석 색소 – 자연 치유",
    why_lumi_brow1_desc: "치유 후 자연스럽고 부드러운 색감 유지",

    why_lumi_brow2_title: "초부드러운 니들 기술",
    why_lumi_brow2_desc: "무통증, 붓기 없음, 빠른 회복",

    why_lumi_brow3_title: "개인 맞춤 브로우 디자인",
    why_lumi_brow3_desc: "템플릿 사용 없이 100% 맞춤 설계",

    why_lumi_brow4_title: "출산 6개월 이후 엄마도 안전",

    brow_detail_pricing_title: "쉐이딩 브로우 가격",
    brow_detail_pricing_intro:
      "가격은 기존 눈썹 상태와 원하는 디자인에 따라 달라집니다",

    brow_detail_pricing_single_title: "쉐이딩 브로우",
    brow_detail_pricing_single_subtitle:
      "상담 및 평가 이후 최종 비용이 결정됩니다",

    brow_detail_pricing_single_item1: "맞춤 브로우 디자인",
    brow_detail_pricing_single_item2: "부드럽고 매끄러운 쉐이딩 기술",
    brow_detail_pricing_single_item3: "7일 관리용 세럼 제공",
    brow_detail_pricing_single_item4: "4개월 보증",
    brow_detail_pricing_single_item5: "무료 리터치 포함",

    brow_detail_pricing_note:
      "가격에는 1회용 도구 및 VAT 포함. 2인 이상 방문 시 5% 추가 할인.",

    brow_reviews_title: "고객 후기",

    brow_review1_name: "Lan Anh",
    brow_review1_age: "28세",
    brow_review1_text:
      '"예전 눈썹이 파랗게 변색됐어요. 루미에서 쉐이딩한 후 색이 너무 부드럽고 예쁘게 자리 잡아서 모두가 어디서 했냐고 물어봐요."',

    brow_review2_name: "Kim Ngan",
    brow_review2_age: "31세",
    brow_review2_text:
      '"헤어스트로크 스타일을 좋아하지 않아서 쉐이딩을 선택했어요. 부드럽고 매끄럽고, 제가 원하던 스타일 그대로예요."',

    brow_detail_faq_title: "자주 묻는 질문",
    brow_detail_faq_intro: "쉐이딩 중심의 간단하고 명확한 안내",

    brow_detail_faq_q1: "시술 직후 눈썹이 너무 진해 보이나요?",
    brow_detail_faq_a1: "아니요. 색소는 30% 희석되어 자연스럽게 치유됩니다.",

    brow_detail_faq_q2: "언제 가장 예쁘게 자리 잡나요?",
    brow_detail_faq_a2: "10–14일 후 자연스럽고 완성된 색감이 됩니다.",

    brow_detail_faq_q3: "아픈가요?",
    brow_detail_faq_a3:
      "거의 없습니다. 쉐이딩은 매우 부드러운 기법으로 통증이 두려운 분들도 편하게 받을 수 있습니다.",

    brow_detail_cta_title: "부드럽고 파우더 같은 눈썹 원하시나요?",
    brow_detail_cta_desc:
      "지금 예약하고 루미 뷰티에서 무료 브로우 매핑을 받아보세요.",

    // Service Detail - Lip Brightening (Neutralizing Pigment)
    lip_removal_detail_page_title:
      "루미 뷰티 고급 립 브라이트닝 – 자연스러운 입술 색 되찾기",

    lip_removal_detail_meta_description:
      "루미 뷰티의 뉴트럴라이징 색소를 이용한 립 브라이트닝: 어두운 톤(블루·퍼플·그레이)을 따뜻하게 중화, 1회 시술로 30–60% 개선, 무통증·무붓기, 6–12개월 보증 포함.",

    lip_removal_detail_badge: "뉴트럴라이징 색소",

    lip_removal_detail_hero_heading:
      "입술 어둡기 중화 – 한 번의 시술로 더 밝아진 입술",

    lip_removal_detail_hero_subheading:
      "뉴트럴라이징 기법은 따뜻한 색소(오렌지/피치/코랄)를 사용해 차가운 톤을 중화하며, 색을 과하게 추가하지 않습니다 — 통증 없음, 붓기 없음. 7–14일 후 50–80% 밝아지고 자연스러운 균일 톤 완성.",

    lip_removal_detail_hero_paragraph1:
      "다음 세대 콜드 레이저와 고농축 비타민 C + B5 세럼을 결합하여 벗겨짐이나 화상 없이 어두운 색소를 분해합니다. 유전적 요인, 오래된 립스틱, 호르몬 변화로 인한 입술 어둡기에 적합합니다.",

    lip_removal_detail_hero_paragraph2:
      "모든 고객에게 1–2회의 뉴트럴라이징과 자연스럽고 오래가는 분홍빛을 위한 베이비립 세션을 포함한 개인 맞춤 플랜을 제공합니다.",

    lip_removal_detail_hero_stat_label: "첫 세션 후 색소 침착 감소",
    lip_removal_detail_hero_benefit1: "푸른빛·보라빛·회색빛 입술 톤 완화",
    lip_removal_detail_hero_benefit2: "각질 벗겨짐 없음 – 초고속 회복",
    lip_removal_detail_hero_benefit3: "남녀 모두 가능",
    lip_removal_detail_why_choose_title:
      "1:1 립 브라이트닝 – 7년 이상 전문가 케어",
    lip_removal_detail_why_choose_desc:
      "루미 뷰티에서는 모든 고객이 7년 이상의 경험을 가진 전문가와 1:1 프라이빗 케어를 받습니다. 가장 전문적이고 안전하며 효과적인 서비스를 약속드립니다.",

    lip_removal_detail_highlights_title:
      "루미 뷰티 립 브라이트닝이 효과적인 이유",

    lip_removal_detail_highlight1_title: "650nm 콜드 레이저 기술",
    lip_removal_detail_highlight1_desc:
      "열 손상 없이 어두운 색소만 정확히 타깃팅합니다.",

    lip_removal_detail_highlight2_title: "독점 비타민 세럼",
    lip_removal_detail_highlight2_desc:
      "치유 속도를 높이고 깊은 보습과 즉각적인 수분 잠금을 제공합니다.",

    lip_removal_detail_highlight3_title: "맞춤 시술 플랜",
    lip_removal_detail_highlight3_desc:
      "선천적/생활습관에 따른 색소 침착 정도에 맞게 에너지·세션 수를 조절합니다.",

    lip_removal_detail_highlight4_title: "베이비립 시술 포함",
    lip_removal_detail_highlight4_desc:
      "뉴트럴라이징 후 베이비립을 적용하면 최소 18개월 동안 생기 있는 분홍빛 유지.",

    lip_removal_detail_process_title: "안전한 립 브라이트닝 과정",
    lip_removal_detail_process_intro:
      "60–75분 소요 – 뉴트럴라이징 + 집중 회복 포함.",

    lip_removal_detail_process_step1_title: "색소 분석",
    lip_removal_detail_process_step1_desc:
      "전문 조명을 이용해 어두운 톤과 원인을 평가합니다.",

    lip_removal_detail_process_step2_title: "효소 각질 제거",
    lip_removal_detail_process_step2_desc:
      "부드러운 파파인 효소로 각질을 제거하여 색소 평가를 더 정확하게 합니다.",

    lip_removal_detail_process_step3_title: "콜드 레이저 뉴트럴라이징",
    lip_removal_detail_process_step3_desc:
      "650nm 레이저가 주변 조직 손상 없이 멜라닌을 분해합니다.",

    lip_removal_detail_process_step4_title: "비타민 주입 & 회복 마스크",
    lip_removal_detail_process_step4_desc:
      "비타민 C·E·B5 세럼 + 펩타이드 마스크로 즉각 진정 및 건조 완화.",

    lip_removal_detail_process_step5_title: "베이비립 컬러 (옵션)",
    lip_removal_detail_process_step5_desc:
      "7–10일 후 회복이 완료되면 자연 핑크빛을 위한 베이비립 시술 진행.",

    lip_removal_detail_results_outcome_title: "기대되는 결과",
    lip_removal_detail_results_outcome_item1:
      "립스틱 착색으로 인한 어두운 입술은 1회 시술 후 50–70% 개선.",

    lip_removal_detail_results_outcome_item2:
      "선천적 어두운 입술은 2회 시술 후 30–40% 개선, 이후 4주간 점진적 밝아짐.",

    lip_removal_detail_results_outcome_item3:
      "베이비립 적용 시 18–24개월 동안 자연스러운 분홍빛 유지.",

    lip_removal_detail_results_aftercare_title: "사후 관리 방법",
    lip_removal_detail_results_aftercare_item1:
      "루미 케어 립밤을 하루 3회, 7일간 바르기.",
    lip_removal_detail_results_aftercare_item2:
      "매일 물 2L 마시기, 5일간 커피·진한 차 줄이기.",
    lip_removal_detail_results_aftercare_item3:
      "14일간 직사광선 및 납 성분 립스틱 피하기.",

    lip_removal_detail_pricing_title: "시술 패키지 & 가격",
    lip_removal_detail_pricing_intro:
      "홈케어 제품 및 사후 체크 포함 올인원 패키지.",

    lip_removal_detail_pricing_option1_title: "베이직 브라이트닝 패키지",
    lip_removal_detail_pricing_option1_item1:
      "콜드 레이저 1회 + 홈케어 립 키트",
    lip_removal_detail_pricing_option1_item2: "14일 사후 체크",
    lip_removal_detail_pricing_option1_item3:
      "립스틱 착색으로 인한 가벼운 어두운 입술에 적합",

    lip_removal_detail_pricing_option2_badge: "가장 인기",
    lip_removal_detail_pricing_option2_title: "브라이트닝 + 베이비립 패키지",
    lip_removal_detail_pricing_option2_item1: "뉴트럴라이징 2회 + 베이비립 1회",
    lip_removal_detail_pricing_option2_item2:
      "14일 홈케어 키트 & 컬러 고정 세럼",
    lip_removal_detail_pricing_option2_item3: "12개월 색상 보증",

    lip_removal_detail_pricing_option3_title: "심한 색소 침착 패키지",
    lip_removal_detail_pricing_option3_item1: "콜드 레이저 3회 + 집중 케어",
    lip_removal_detail_pricing_option3_item2:
      "색소 회복을 돕는 영양·비타민 가이드 포함",
    lip_removal_detail_pricing_option3_item3: "베이비립 무료 포함",

    lip_removal_detail_pricing_note:
      "모든 패키지 이용 시 390,000₫ 상당 루미 케어 립 트리트먼트 무료 제공. 재방문 고객 10% 할인.",

    lip_removal_detail_faq_title: "자주 묻는 질문",

    lip_removal_detail_faq_q1: "립 브라이트닝이 아픈가요?",
    lip_removal_detail_faq_a1:
      "전혀 아닙니다. 저에너지 콜드 레이저 + 의료용 마취로 편안하며, 처음 2–3분 동안 약한 따뜻함만 느껴집니다.",

    lip_removal_detail_faq_q2: "언제 립 컬러를 할 수 있나요?",
    lip_removal_detail_faq_a2:
      "7–10일 후 입술이 회복되고 어두운 색이 줄어들면 베이비립 시술이 가능합니다.",

    lip_removal_detail_faq_q3: "입술이 건조해지지 않나요?",
    lip_removal_detail_faq_a3:
      "아니요. 비타민과 펩타이드 마스크가 깊이 보습해주며, 사후 관리만 잘 지키면 됩니다.",

    lip_removal_detail_cta_title:
      "자연스럽고 밝은 핑크빛 입술을 되찾을 준비 되셨나요?",
    lip_removal_detail_cta_desc:
      "지금 예약하고 개인 맞춤 색소 중화 플랜을 받아보세요.",

    // Lip Brightening - Neutralizing Pigment
    lip_brightening_intro_title: "립 뉴트럴라이징이란?",
    lip_brightening_intro_what:
      "립 뉴트럴라이징은 오렌지/피치/코랄 같은 따뜻한 보정 색소를 아주 얕게 도포하여 파란·보라·회색 등의 차가운 톤을 따뜻하게 중화하는 방식입니다. 새로운 입술 색을 추가하지 않으며, 입술 구조를 바꾸지 않고, 립 블러싱과는 다릅니다. 뉴트럴라이징 후에는 50–80% 밝아지고 톤이 균일해지며 자연스러운 핑크빛으로 보입니다.",

    lip_brightening_intro_who_title: "누구에게 적합한가요? (뉴트럴라이징 기준)",
    lip_brightening_intro_who1: "파란/보라/회색의 쿨톤 입술",
    lip_brightening_intro_who2: "선천적으로 어두운 입술",
    lip_brightening_intro_who3: "장기간 립스틱 사용으로 어두워진 입술",
    lip_brightening_intro_who4: "호르몬 변화로 인한 입술 착색",
    lip_brightening_intro_who5:
      "타투 시술 시 색이 잘 붙지 않는 입술 — 먼저 워밍업이 필요",

    lip_brightening_intro_benefits_title: "주요 장점",
    lip_brightening_benefit1_title: "쿨톤을 따뜻하게 워밍",
    lip_brightening_benefit1_desc:
      "뉴트럴라이징 색소가 쿨 언더톤을 부드럽게 중화해 더 밝고 부드러운 입술로.",
    lip_brightening_benefit2_title: "1회 시술 후 30–60% 밝아짐",
    lip_brightening_benefit2_desc:
      "개선 폭은 초기 착색 정도에 따라 달라집니다.",
    lip_brightening_benefit3_title: "무통증 – 무붓기",
    lip_brightening_benefit3_desc:
      "립 블러싱과 달리 매우 얕은 테크닉을 사용합니다.",
    lip_brightening_benefit4_title: "7–14일 내 가시적인 밝아짐",
    lip_brightening_benefit4_desc: "각질 벗겨짐 없이 빠르고 부드럽게 회복.",
    lip_brightening_benefit5_title: "베이비립 블러싱의 완벽한 베이스",
    lip_brightening_benefit5_desc:
      "베이스가 따뜻해지면 베이비립 컬러가 더 선명하고 오래갑니다.",

    lip_brightening_commitment_title: "우리의 약속",
    lip_brightening_commitment1: "입술 색을 추가하지 않음 — 오직 색소 중화만",
    lip_brightening_commitment2: "민감한 입술에도 적합한 안전한 기법",
    lip_brightening_commitment3: "착색 정도에 따른 개인 맞춤 플랜",
    lip_brightening_commitment4: "7–14일간 일일 팔로업",
    lip_brightening_commitment5: "6–12개월 결과 보증",

    lip_brightening_results_title: "시술 후 결과",
    lip_brightening_results_intro:
      "뉴트럴라이징 후에는 50–80% 밝아지고, 파란·보라·회색 톤이 크게 감소하며, 입술이 더 부드럽고 균일해져 자연스러운 핑크빛을 띱니다. 착색이 심한 경우 2–3회가 필요할 수 있습니다. 밝아진 후 베이비립 블러싱을 적용하면 오래가는 핑크 톤을 얻을 수 있습니다.",

    lip_brightening_process_title: "뉴트럴라이징 색소 시술 과정",
    lip_brightening_process_intro:
      "절대 안전을 위한 국제 멸균 기준을 적용한 40–60분 세션.",

    lip_brightening_process_step1_title: "입술 색소 분석",
    lip_brightening_process_step1_desc:
      "쿨톤, 기본 언더톤, 피부 타입을 평가합니다.",
    lip_brightening_process_step2_title: "적합한 뉴트럴라이저 선택",
    lip_brightening_process_step2_desc:
      "파란·보라·회색 언더톤에 따라 오렌지/피치/코랄을 선택.",
    lip_brightening_process_step3_title: "메디컬 마취",
    lip_brightening_process_step3_desc: "시술 중 편안함을 제공합니다.",
    lip_brightening_process_step4_title: "뉴트럴라이징 색소 도포",
    lip_brightening_process_step4_desc:
      "초얕은 니들 테크닉으로 따뜻한 색소를 균일하게 분산하되, 새로운 입술 색을 추가하지 않습니다.",
    lip_brightening_process_step5_title: "체크 & 사후 관리 안내",
    lip_brightening_process_step5_desc:
      "1–2일 가벼운 건조감, 7–14일에 걸쳐 점진적 밝아짐.",

    lip_brightening_advantages_title: "이 기법이 효과적인 이유",
    lip_brightening_advantages_intro:
      "루미 뷰티의 고품질 립 뉴트럴라이징이 사랑받는 강점",

    lip_brightening_advantage1_title: "1회 시술 후 50–80% 밝아짐",
    lip_brightening_advantage1_desc:
      "개선 폭은 초기 착색에 따라 다르지만 1회차부터 눈에 띕니다.",
    lip_brightening_advantage2_title: "최소 각질",
    lip_brightening_advantage2_desc: "가벼운 건조만 있고 심한 각질 탈락 없음.",
    lip_brightening_advantage3_title: "입술을 얇게 만들지 않음",
    lip_brightening_advantage3_desc:
      "매우 얕은 깊이로 자연스러운 입술 결을 해치지 않습니다.",
    lip_brightening_advantage4_title: "립 라인 자국 없음",
    lip_brightening_advantage4_desc:
      "뉴트럴라이징만 진행 — 색 추가·외곽 라인 작업 없음.",
    lip_brightening_advantage5_title: "얼룩 없이 균일한 워밍",
    lip_brightening_advantage5_desc:
      "전문 테크닉으로 고르게 톤을 따뜻하게 합니다.",
    lip_brightening_advantage6_title: "립 블러싱을 위한 최적의 베이스 형성",
    lip_brightening_advantage6_desc:
      "따뜻해진 베이스로 색이 더 잘 붙고 더 오래 지속됩니다.",
    lip_brightening_advantage7_title: "남녀 모두 가능",
    lip_brightening_advantage7_desc:
      "성별 취향과 자연스러움에 맞춘 테크닉 적용.",
    lip_brightening_advantage8_title: "심한 쿨톤에도 효과적",
    lip_brightening_advantage8_desc:
      "파란·보라·회색 톤은 최적 결과를 위해 2–3회가 필요할 수 있습니다.",

    lip_brightening_pricing_title: "서비스 가격",
    lip_brightening_pricing_intro: "홈케어와 사후 체크가 포함된 올인원 패키지.",

    lip_brightening_pricing_main_title: "립 뉴트럴라이징 – 색소 교정",
    lip_brightening_pricing_subtitle:
      "가격은 쿨톤 강도(파랑/보라/회색)와 필요한 세션 수에 따라 달라집니다",

    lip_brightening_pricing_item1: "프로페셔널 뉴트럴라이징 색소",
    lip_brightening_pricing_item2: "메디컬 마취",
    lip_brightening_pricing_item3: "1회용 멸균 도구",
    lip_brightening_pricing_item4: "24/7 지원",
    lip_brightening_pricing_item5: "4개월 보증 – 2차 뉴트럴라이징 무료",

    lip_brightening_pricing_note:
      "가격에는 VAT와 멸균 도구가 포함됩니다. 비용은 착색 정도와 세션 수에 따라 변동됩니다.",

    lip_brightening_warranty_title: "보증 정책",
    lip_brightening_warranty_intro: "루미 뷰티의 결과 보장",

    lip_brightening_warranty1_title: "4개월 보증 – 2차 뉴트럴라이징 무료",
    lip_brightening_warranty1_desc:
      "초기 착색 상태에 따라 시술 완료일로부터 4개월간 결과를 보증합니다.",
    lip_brightening_warranty2_title: "두 번째 세션 무료",
    lip_brightening_warranty2_desc: "보증 기간 내 색이 부족한 경우 무료 보정.",
    lip_brightening_warranty3_title: "밀착 모니터링",
    lip_brightening_warranty3_desc:
      "14–30일 후 사후 점검 및 맞춤 관리 가이드 제공.",
    lip_brightening_warranty4_title: "24/7 지원",
    lip_brightening_warranty4_desc:
      "전화, Zalo, Facebook으로 언제든지 문의 가능.",

    lip_brightening_precautions_title: "시술 전 유의사항",
    lip_brightening_precautions_intro:
      "안전하고 효과적인 시술을 위한 중요 안내",

    lip_brightening_precaution1_title: "카페인 6시간 금지",
    lip_brightening_precaution1_desc:
      "시술 6시간 전 커피·진한 차·알코올 금지(마취 효과 최적화).",
    lip_brightening_precaution2_title: "아스피린 금지",
    lip_brightening_precaution2_desc:
      "7일 전부터 아스피린 및 항응고제 복용 금지.",
    lip_brightening_precaution3_title: "몸이 아프면 시술 금지",
    lip_brightening_precaution3_desc:
      "발열, 독감, 입술 감염, 급성 질환 시 연기하세요.",
    lip_brightening_precaution4_title: "의료 이력 알리기",
    lip_brightening_precaution4_desc:
      "알레르기, 피부질환, 임신/수유 여부를 루미 뷰티에 알려주세요.",
    lip_brightening_precaution5_title: "7일간 입술 시술 피하기",
    lip_brightening_precaution5_desc: "시술 7일 전 립 타투, 표백, 필링 금지.",
    lip_brightening_precaution6_title: "수분 충분히 섭취",
    lip_brightening_precaution6_desc: "시술 전 3일간 하루 2L 수분 섭취.",

    lip_brightening_aftercare_title: "사후 관리 안내 (뉴트럴라이징 색소)",
    lip_brightening_aftercare_intro:
      "뉴트럴라이징 색소 시술 후 상세 관리 가이드",

    // Day 1
    lip_brightening_aftercare_day1_title: "가장 중요한 단계",
    lip_brightening_aftercare_day1_item1:
      "세안 시 물 사용 금지; 물티슈로 부드럽게 닦기",
    lip_brightening_aftercare_day1_item2: "루미 케어 립밤을 2–3시간마다 도포",
    lip_brightening_aftercare_day1_item3:
      "말을 과하게 하지 말고 입술을 만지지 않기",
    lip_brightening_aftercare_day1_item4:
      "빨대를 사용해 물 마시기; 매운/뜨거운 음식 피하기",

    // Day 3–6
    lip_brightening_aftercare_day3_title: "관리 지속",
    lip_brightening_aftercare_day3_item1: "하루 3–4회 립밤 도포로 보습 유지",
    lip_brightening_aftercare_day3_item2: "불소 치약 사용 피하기",
    lip_brightening_aftercare_day3_item3: "직사광선 피하고 외출 시 입술 보호",
    lip_brightening_aftercare_day3_item4: "각질을 떼지 말고 자연스럽게 두기",

    // Day 7–14
    lip_brightening_aftercare_day7_title: "관리 유지",
    lip_brightening_aftercare_day7_item1: "하루 2–3회 립밤 도포",
    lip_brightening_aftercare_day7_item2: "7일 후 투명 립밤 사용 가능",
    lip_brightening_aftercare_day7_item3:
      "14일간 납 성분 또는 지속형 립스틱 금지",
    lip_brightening_aftercare_day7_item4: "수분 섭취와 과일·채소 섭취 유지",

    lip_brightening_aftercare_day14_title: "색 안정화",
    lip_brightening_aftercare_day14_item1: "색이 다시 나타나며 안정화되기 시작",
    lip_brightening_aftercare_day14_item2: "일상적인 립 케어 지속",
    lip_brightening_aftercare_day14_item3: "필요 시 립 전용 자외선 차단 사용",
    lip_brightening_aftercare_day14_item4: "30일 후 팔로업 체크",

    lip_brightening_aftercare_note_title: "피해야 할 것",
    lip_brightening_aftercare_avoid1: "7일간 매운·뜨거운·신 음식 피하기",
    lip_brightening_aftercare_avoid2: "키스 또는 식기 공유 금지",
    lip_brightening_aftercare_avoid3: "7일간 뜨거운 샤워/스팀 금지",
    lip_brightening_aftercare_avoid4: "입술 문지르거나 벗기지 않기",

    lip_brightening_faq_title: "자주 묻는 질문",

    lip_brightening_faq_q1: "이건 립 타투인가요?",
    lip_brightening_faq_a1:
      "아닙니다. 이 시술은 색소 중화 기법이며 립 타투가 아닙니다. 따뜻한 보정 색소로 쿨톤을 중화할 뿐, 새로운 색을 추가하지 않습니다.",

    lip_brightening_faq_q2: "1회 시술 후 얼마나 개선되나요?",
    lip_brightening_faq_a2:
      "초기 착색에 따라 30–60% 개선됩니다. 가벼운 어두움은 1회에 50–60% 개선되며, 심한 쿨톤은 2–3회가 필요합니다.",

    lip_brightening_faq_q3: "아프거나 붓나요?",
    lip_brightening_faq_a3:
      "아닙니다. 매우 얕은 테크닉과 마취를 사용하여 편안합니다.",
    lip_brightening_faq_q4: "각질이 벗겨지나요?",
    lip_brightening_faq_a4:
      "심한 각질 탈락은 없습니다. 1–2일 가벼운 건조 후 7–14일에 걸쳐 서서히 밝아집니다.",
    lip_brightening_faq_q5: "언제 립 블러싱을 받을 수 있나요?",
    lip_brightening_faq_a5:
      "베이스가 밝아지고 따뜻해지는 7–14일 후 가능합니다. 베이비립은 더 잘 치유되고 선명하며 오래갑니다.",
    lip_brightening_faq_q6: "물은 피해야 하나요?",
    lip_brightening_faq_a6:
      "첫 24시간은 물을 피하세요. 이후에는 평소대로 세안 가능하나 문지르지 마세요. 7일간 뜨거운 샤워/사우나는 피하세요.",
    lip_brightening_faq_q7: "음식 제한이 있나요?",
    lip_brightening_faq_a7:
      "7일간 매운/뜨거운/신/짠 음식은 피하고, 빨대로 마시며, 수분을 유지하세요. 커피/차는 5일간 줄이세요.",
    lip_brightening_faq_q8: "남성도 받을 수 있나요?",
    lip_brightening_faq_a8:
      "네. 뉴트럴라이징 색소는 남녀 모두에게 적용되며, 각 고객의 자연스러움에 맞춰 색소를 조정합니다.",
    lip_brightening_faq_q9: "심한 쿨톤도 개선되나요?",
    lip_brightening_faq_a9:
      "네. 파란·보라·회색이 심한 경우 2–3회가 필요할 수 있습니다. 워밍 후 30–60% 밝아지고, 베이비립으로 최종 컬러를 강화할 수 있습니다.",
    lip_brightening_faq_q10: "시술 후 메이크업이 가능한가요?",
    lip_brightening_faq_a10:
      "7일 후 투명 립밤은 가능합니다. 14일간 납 성분 또는 지속형 립스틱은 피하세요.",

    lip_brightening_expert_title: "루미 뷰티 전문가의 조언",

    lip_brightening_expert_advice1:
      "쿨톤 입술은 립 블러싱 전 뉴트럴라이징이 필수입니다. 이 단계를 생략하면 치유 후 색이 정확하지 않을 수 있습니다.",
    lip_brightening_expert_advice2:
      "얕은 테크닉과 전문 색소로 통증과 붓기 없이 확실한 밝아짐을 얻을 수 있습니다. 이는 립 타투가 아니라 오직 색소 워밍입니다.",
    lip_brightening_expert_advice3:
      "베이스가 따뜻해지면 베이비립 블러싱이 더 선명하고 오래가며, 모든 고객에게 맞춤 플랜을 제공합니다.",
    lip_brightening_expert_signature: "— 루미 뷰티",

    lip_brightening_cta_title:
      "자연스러운 핑크빛, 더 밝은 입술을 준비되셨나요?",
    lip_brightening_cta_desc:
      "오늘 1:1 상담을 예약하고 개인 맞춤 뉴트럴라이징 플랜을 받아보세요.",

    // Why Choose Us
    why_choose_title: "왜 많은 고객이 루미 뷰티를 신뢰할까요?",

    feature_personalized_title: "프라이빗 1:1 PMU 서비스",
    feature_personalized_desc:
      "아티스트가 전 과정을 동행하며 각 고객에게 전담 케어를 제공합니다.",
    feature_expert_title: "숙련된 아티스트",
    feature_expert_desc: "전문 교육을 받은 다년간의 경력을 보유.",
    feature_organic_title: "안전한 유기농 색소",
    feature_organic_desc:
      "붓기 없음, 불편함 없음, 시간 경과에 따른 색 변형 없음.",
    feature_space_title: "청결하고 프라이빗한 스튜디오",
    feature_space_desc: "시술 내내 편안하고 휴식 같은 환경을 제공합니다.",
    feature_feedback_title: "수백 건의 만족 후기",
    feature_feedback_desc: "리얼 피드백 – 리얼 결과.",

    // Contact Methods
    contact_intro:
      "✨ 고유한 개성을 살리면서 자연스러운 아름다움을 더하고 싶으신가요? 루미 뷰티가 1:1 맞춤 PMU 여정을 함께합니다.",

    contact_methods_title: "망설이지 말고 가장 편한 연락 방법을 선택하세요.",

    contact_call_title: "전화하기",
    contact_call_description: "탭하여 루미 뷰티와 즉시 연결",
    contact_call_button: "지금 전화하기",

    contact_facebook_title: "페이스북 채팅",
    contact_facebook_description: "루미 뷰티 메신저로 즉시 상담 받기",
    contact_facebook_button: "메신저 열기",

    contact_zalo_title: "Zalo 채팅",
    contact_zalo_description: "Zalo로 연결하여 지원 및 단독 혜택 받기",
    contact_zalo_button: "Zalo 열기",

    contact_email_title: "이메일 보내기",
    contact_email_description:
      "자세한 메시지를 남겨주세요 — 24시간 내에 답변드립니다",
    contact_email_button: "이메일 보내기",

    contact_free_button: "무료 상담",

    // Zalo Contact Modal
    zalo_contact_modal_title: "직접 문의하기",
    zalo_contact_modal_desc:
      "{service}에 관심이 있으시군요. 자세한 상담을 위해 Zalo로 문의해주세요.",
    zalo_contact_phone_label: "Zalo 전화번호:",
    zalo_contact_open_button: "지금 Zalo 열기",

    // Contact Form
    contact_form_title:
      "전화번호를 남겨주세요 — 얼굴에 가장 잘 맞는 서비스를 함께 선택해드립니다.",
    phone_placeholder: "전화번호를 입력하세요",
    send: "전송",

    contact_form_success: "감사합니다! 최대한 빨리 연락드리겠습니다.",
    contact_form_error: "오류가 발생했습니다. 다시 시도해주세요.",
    contact_form_phone_required: "전화번호를 입력해주세요.",

    // Gallery
    real_images: "실제 결과",
    lip_tattoo_label: "립 PMU",
    eyebrow_tattoo_label: "브로우 PMU",

    // Testimonials
    customer_reviews: "고객 후기",
    scroll_hint: "스와이프하여 더 보기",

    testimonial1:
      "서비스가 정말 훌륭해요! 입술이 자연스럽고 예뻐졌습니다. 스태프도 매우 전문적이고 세심했어요.",
    testimonial2:
      "눈썹에 매우 만족합니다. 얼굴형에 맞춰 디자인해 주셔서 색도 자연스러워요.",
    testimonial3:
      "약속대로 무통증이었어요. 립 블러싱 후 색이 고르게 예쁘게 자리 잡았습니다. 꼭 다시 방문할게요!",

    // Blog
    learn_more_title: "PMU & 뷰티 더 알아보기",
    blog1_title: "립 블러싱 후 예쁘게 자리 잡는 데 얼마나 걸릴까요?",
    blog2_title: "브로우 시술 후 피해야 할 것들은?",
    blog3_title: "베이비립 vs 콜라겐 립 vs 옴브레 — 나는 무엇을 선택해야 할까?",
    read_more: "더 읽기",
    view_more_gallery: "이미지 더 보기",
    view_more_feedback: "후기 더 보기",

    // Footer
    footer_tagline: "내추럴 PMU – 당신의 고유한 아름다움을 돋보이게",
    footer_address: "151 Tran Duy Hung, Cau Giay, Ha Noi",

    services_title: "서비스",
    lip_service: "립 PMU",
    eyebrow_service: "브로우 PMU",
    lip_removal_service: "립 브라이트닝",

    contact_title: "문의",
    about_us_contact: "소개 & 문의",

    consultation_title: "상담",
    connect_with_us: "함께 연결해요",

    footer_line1: "💋 내추럴 브로우·립·아이라인 PMU 전문가",
    footer_line2: "💋 꼼꼼한 상담 & 사후 관리",
    footer_address_detail: "Vo Quy Huan, FPT City Urban Area, Da Nang, Vietnam",

    footer_tiktok: "TikTok: @lumibeautyphunxam",
    footer_facebook: "Facebook: facebook.com/lumibeautypmubrowlip",

    facebook_iframe_title: "루미 뷰티 페이스북 페이지",

    footer_copyright: "© 2025 루미 뷰티. All rights reserved.",

    // Booking Modal
    booking_title: "예약하기",
    booking_description: "정보를 입력해 주세요. 곧 루미 뷰티에서 연락드립니다.",

    booking_name_label: "성함",
    booking_name_placeholder: "Nguyen Thi Anh",

    booking_phone_label: "전화번호",
    booking_phone_placeholder: "0900 067 832",

    booking_service_label: "관심 서비스",
    booking_service_option_lip: "립 PMU",
    booking_service_option_eyebrow: "브로우 PMU",
    booking_service_option_lip_removal: "립 브라이트닝",
    booking_service_option_other: "기타",

    booking_time_label: "희망 시간",
    booking_notes_label: "추가 메모",
    booking_notes_placeholder: "필요 사항이나 질문을 작성해주세요",

    booking_submit: "요청 제출",
    booking_sending: "전송 중...",

    booking_success: "감사합니다! 최대한 빠르게 연락드리겠습니다.",
    booking_error: "전송에 실패했습니다. 다시 시도하시거나 직접 문의해주세요.",

    copyright: "© 2023 루미 뷰티. All rights reserved.",

    // Contact Page
    contact_page_title: "문의하기 - 루미 뷰티 | 다낭 반영구 시술",
    contact_page_description:
      "루미 뷰티 다낭 문의 - 브로우, 입술, 아이라인 반영구 시술 전문. 전화: 0364759261. 주소: Vo Quy Huan, FPT City Urban Area, Da Nang.",
    contact_page_keywords:
      "루미 뷰티 문의, 다낭 반영구, 루미 뷰티 다낭, 반영구 주소, 다낭 반영구 스튜디오",
    contact_address_title: "루미 뷰티 주소",
    contact_info_title: "연락처 정보",
    contact_address_label: "주소:",
    contact_phone_label: "전화번호:",
    contact_social_label: "소셜 미디어:",
    contact_hours_label: "운영 시간:",
    contact_hours_value: "월요일 - 일요일: 9:00 - 18:00",
    contact_map_title: "지도",

    // Gallery & Feedback Pages
    gallery_page_title: "갤러리 - 루미 뷰티",
    feedback_page_title: "고객 후기 - 루미 뷰티",
    gallery_back_link: "⟵ 홈으로 돌아가기",
  },
};

const DEFAULT_LANGUAGE = "vi";
const PREVIEW_IMAGE_PATH = "images/lumi-preview-image.jpg";
const FAVICON_PATH = "icons/fav_icon.png";

// Expose translations globally for blog translation files to access
window.translations = translations;

let currentLanguage = (() => {
  try {
    // Get language from path (/vi, /en, /ko)
    const path = window.location.pathname;
    if (path.startsWith("/vi/") || path === "/vi" || path.endsWith("/vi")) {
      return "vi";
    } else if (
      path.startsWith("/en/") ||
      path === "/en" ||
      path.endsWith("/en")
    ) {
      return "en";
    } else if (
      path.startsWith("/ko/") ||
      path === "/ko" ||
      path.endsWith("/ko")
    ) {
      return "ko";
    }

    // Fallback to stored preference or default
    const stored = localStorage.getItem("selectedLanguage");
    if (stored && stored in translations) {
      return stored;
    }
  } catch (error) {
    console.warn("Unable to access stored language preference:", error);
  }
  return DEFAULT_LANGUAGE;
})();

// Expose currentLanguage globally for blog translations
window.currentLanguage = currentLanguage;

function getDictionary(lang) {
  return translations[lang] || translations[DEFAULT_LANGUAGE] || {};
}

function getTranslation(lang, key) {
  const dict = translations[lang];
  if (dict && dict[key]) {
    return dict[key];
  }
  const fallbackDict = translations[DEFAULT_LANGUAGE];
  if (fallbackDict && fallbackDict[key]) {
    return fallbackDict[key];
  }
  return key;
}

function t(key) {
  return getTranslation(currentLanguage, key);
}

function getAbsoluteUrl(path) {
  try {
    return new URL(path, window.location.origin).href;
  } catch (error) {
    console.warn("Unable to resolve absolute url for:", path, error);
    return path;
  }
}

function buildLanguageUrl(lang) {
  try {
    const currentUrl = window.location.href;
    const url = new URL(currentUrl);
    const currentPath = url.pathname;

    // For file:// protocol, handle absolute paths differently
    if (url.protocol === "file:") {
      // file:// URLs have absolute paths like: /Users/duckie2910/Documents/lumi-beauty-website/vi/index.html
      // Split path into parts
      const pathParts = currentPath.split("/").filter((p) => p);

      // Find the language folder (vi, en, or ko) and replace it
      let langIndex = -1;
      for (let i = 0; i < pathParts.length; i++) {
        if (
          pathParts[i] === "vi" ||
          pathParts[i] === "en" ||
          pathParts[i] === "ko"
        ) {
          langIndex = i;
          break;
        }
      }

      if (langIndex >= 0) {
        // Replace the language folder
        pathParts[langIndex] = lang;
      } else {
        // If no language folder found, try to insert it before the last part (filename)
        // This handles edge cases where path doesn't have language folder yet
        const lastIndex = pathParts.length - 1;
        if (lastIndex >= 0 && pathParts[lastIndex].endsWith(".html")) {
          pathParts.splice(lastIndex, 0, lang);
        } else {
          pathParts.push(lang);
        }
      }

      // Reconstruct the file:// URL
      const newPath = "/" + pathParts.join("/");
      return `file://${newPath}`;
    }

    // For http/https protocols, handle relative paths
    let filePath = currentPath;

    // Remove current language prefix if exists
    if (currentPath.startsWith("/vi/")) {
      filePath = currentPath.substring(3); // Remove /vi
    } else if (currentPath.startsWith("/en/")) {
      filePath = currentPath.substring(3); // Remove /en
    } else if (currentPath.startsWith("/ko/")) {
      filePath = currentPath.substring(3); // Remove /ko
    } else if (
      currentPath === "/vi" ||
      currentPath === "/en" ||
      currentPath === "/ko"
    ) {
      filePath = "/index.html";
    } else if (currentPath === "/" || currentPath === "") {
      filePath = "/index.html";
    }

    // Ensure filePath starts with /
    if (!filePath.startsWith("/")) {
      filePath = "/" + filePath;
    }

    // Build new path with target language
    const newPath = `/${lang}${filePath}`;
    url.pathname = newPath;
    url.search = ""; // Remove query params
    url.hash = "";

    return url.toString();
  } catch (error) {
    console.warn("Unable to build language url:", error);
    return window.location.href;
  }
}

function updateSeoLinks(lang) {
  const canonical = document.getElementById("canonicalLink");
  if (canonical) {
    canonical.setAttribute("href", buildLanguageUrl(lang));
  }

  const hreflangLinks = document.querySelectorAll("[data-hreflang]");
  hreflangLinks.forEach((link) => {
    const target = link.getAttribute("data-hreflang");
    const resolvedTarget = target === "x-default" ? DEFAULT_LANGUAGE : target;
    link.setAttribute("href", buildLanguageUrl(resolvedTarget));
  });

  const ogUrl = document.querySelector('meta[property="og:url"]');
  if (ogUrl) {
    ogUrl.setAttribute("content", buildLanguageUrl(lang));
  }

  const previewUrl = getAbsoluteUrl(PREVIEW_IMAGE_PATH);
  const ogImage = document.querySelector('meta[property="og:image"]');
  if (ogImage) {
    ogImage.setAttribute("content", previewUrl);
  }
  const twitterImage = document.querySelector('meta[name="twitter:image"]');
  if (twitterImage) {
    twitterImage.setAttribute("content", previewUrl);
  }

  const faviconUrl = getAbsoluteUrl(FAVICON_PATH);
  const favicon = document.querySelector('link[rel="icon"]');
  if (favicon) {
    favicon.setAttribute("href", faviconUrl);
  }
  const appleIcon = document.querySelector('link[rel="apple-touch-icon"]');
  if (appleIcon) {
    appleIcon.setAttribute("href", faviconUrl);
  }
}

function updateStructuredData(lang) {
  const script = document.getElementById("structuredData");
  if (!script) {
    return;
  }

  const dict = getDictionary(lang);
  const fallbackDict = getDictionary(DEFAULT_LANGUAGE);
  const name =
    dict.business_name || fallbackDict.business_name || "Lumi Beauty";
  const description =
    dict.business_description ||
    fallbackDict.business_description ||
    "Lumi Beauty beauty salon";
  const address =
    dict.footer_address_detail ||
    fallbackDict.footer_address_detail ||
    "Vo Quy Huan, FPT City Urban Area, Da Nang, Vietnam";

  const data = {
    "@context": "https://schema.org",
    "@type": "BeautySalon",
    name,
    description,
    url: buildLanguageUrl(lang),
    image: getAbsoluteUrl(PREVIEW_IMAGE_PATH),
    telephone: "+84-364-759-261",
    priceRange: "$$",
    address: {
      "@type": "PostalAddress",
      streetAddress: address,
      addressLocality: "Da Nang",
      addressRegion: "Da Nang",
      addressCountry: "VN",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 16.0025,
      longitude: 108.2636,
    },
    areaServed: "Da Nang, Vietnam",
    sameAs: [
      "https://www.facebook.com/lumibeautypmubrowlip",
      "https://www.tiktok.com/@lumibeautyphunxam",
      "https://zalo.me/84364759261",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+84-364-759-261",
      contactType: "customer service",
      availableLanguage: ["vi", "en", "ko"],
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
        ],
        opens: "09:00",
        closes: "20:00",
      },
    ],
  };

  script.textContent = JSON.stringify(data, null, 2);
}

// Language switching functionality
function initLanguageSwitcher() {
  const dropdownBtn = document.getElementById("langDropdownBtn");
  const dropdownMenu = document.getElementById("langDropdownMenu");
  const langOptions = document.querySelectorAll(".lang-option");

  // Initialize language without redirecting (skipRedirect = true)
  setLanguage(currentLanguage, true);

  if (!dropdownBtn || !dropdownMenu) {
    return;
  }

  updateDropdownButton(currentLanguage);

  // Toggle dropdown
  dropdownBtn.addEventListener("click", function (e) {
    e.stopPropagation();
    dropdownMenu.classList.toggle("active");
    dropdownBtn.classList.toggle("active");
  });

  // Close dropdown when clicking outside
  document.addEventListener("click", function (e) {
    if (!dropdownBtn.contains(e.target) && !dropdownMenu.contains(e.target)) {
      dropdownMenu.classList.remove("active");
      dropdownBtn.classList.remove("active");
    }
  });

  // Handle language selection
  langOptions.forEach((option) => {
    option.addEventListener("click", function () {
      const lang = this.getAttribute("data-lang");
      if (!lang || lang === currentLanguage) {
        dropdownMenu.classList.remove("active");
        dropdownBtn.classList.remove("active");
        return;
      }

      setLanguage(lang);
      updateDropdownButton(currentLanguage);

      // Update active option
      langOptions.forEach((opt) => opt.classList.remove("active"));
      this.classList.add("active");

      // Close dropdown
      dropdownMenu.classList.remove("active");
      dropdownBtn.classList.remove("active");
    });
  });
}

function updateDropdownButton(lang) {
  const dropdownBtn = document.getElementById("langDropdownBtn");
  if (!dropdownBtn) return;

  const codeSpan = dropdownBtn.querySelector(".lang-code");
  if (!codeSpan) return;

  const langData = {
    vi: { code: "VN" },
    en: { code: "EN" },
    ko: { code: "KR" },
  };

  if (langData[lang]) {
    codeSpan.textContent = langData[lang].code;
  }
}

function setLanguage(lang, skipRedirect = false) {
  const fallbackDict = translations[DEFAULT_LANGUAGE] || {};
  const resolvedLang = translations[lang] ? lang : DEFAULT_LANGUAGE;
  const activeDict = translations[resolvedLang] || fallbackDict;
  currentLanguage = resolvedLang;
  window.currentLanguage = resolvedLang; // Expose globally for blog translations

  const elements = document.querySelectorAll("[data-translate]");

  elements.forEach((element) => {
    const key = element.getAttribute("data-translate");
    if (!key) return;

    let translation =
      (activeDict && activeDict[key]) || (fallbackDict && fallbackDict[key]);
    if (!translation) return;

    // Special handling for natural_beauty to preserve HTML structure
    if (key === "natural_beauty") {
      if (resolvedLang === "vi") {
        element.innerHTML =
          '<span class="title-script-part">Đẹp</span> <span class="title-script-bold">TỰ NHIÊN</span>';
      } else if (resolvedLang === "en") {
        element.innerHTML =
          '<span class="title-script-part">Natural</span> <span class="title-script-bold">BEAUTY</span>';
      } else if (resolvedLang === "ko") {
        element.innerHTML =
          '<span class="title-script-part">자연스러운</span> <span class="title-script-bold">아름다움</span>';
      }
      return;
    }

    const attrList = element.getAttribute("data-translate-attr");
    if (attrList) {
      attrList.split(",").forEach((attr) => {
        const attrName = attr.trim();
        if (!attrName) return;

        if (attrName === "innerHTML") {
          element.innerHTML = translation;
        } else {
          element.setAttribute(attrName, translation);
        }
      });

      if (!element.hasAttribute("data-translate-text")) {
        return;
      }
    }

    // Special handling for zalo contact modal description
    if (
      key === "zalo_contact_modal_desc" &&
      element.hasAttribute("data-zalo-service-desc")
    ) {
      const zaloModal = document.getElementById("zaloContactModal");
      if (zaloModal) {
        // Get stored service key from the modal's closure
        const serviceKey = zaloModal.dataset.currentServiceKey;
        if (serviceKey) {
          // Update with service name
          const serviceMap = {
            vi: {
              "eyebrow-tattoo": "phun mày",
              "phun-may-shading": "phun mày shading",
              "eyeliner-tattoo": "phun mí mở tròng",
              "lip-brightening": "khử thâm môi",
            },
            en: {
              "eyebrow-tattoo": "eyebrow PMU",
              "phun-may-shading": "eyebrow shading PMU",
              "eyeliner-tattoo": "eyeliner PMU",
              "lip-brightening": "lip brightening",
            },
            ko: {
              "eyebrow-tattoo": "눈썹 반영구",
              "phun-may-shading": "눈썹 쉐이딩 반영구",
              "eyeliner-tattoo": "아이라인 반영구",
              "lip-brightening": "입술 톤 브라이트닝",
            },
          };
          const serviceName =
            serviceMap[resolvedLang] && serviceMap[resolvedLang][serviceKey]
              ? serviceMap[resolvedLang][serviceKey]
              : null;
          if (serviceName) {
            translation = translation.replace("{service}", serviceName);
          }
        }
      }
      element.textContent = translation;
      return;
    }

    if (element.hasAttribute("data-translate-html")) {
      element.innerHTML = translation;
    } else {
      // For nav links with dropdown arrows, preserve the arrow
      if (element.classList.contains("nav-link-with-dropdown")) {
        const arrow = element.querySelector(".nav-dropdown-arrow");
        if (arrow) {
          element.innerHTML = `<span>${translation}</span>`;
          element.appendChild(arrow);
        } else {
          element.innerHTML = `<span>${translation}</span>`;
        }
      } else {
        element.textContent = translation;
      }
    }
  });

  document.documentElement.lang = resolvedLang;
  document.documentElement.dir = "ltr";

  const langOptions = document.querySelectorAll(".lang-option");
  langOptions.forEach((option) => {
    option.classList.toggle(
      "active",
      option.getAttribute("data-lang") === resolvedLang
    );
  });

  const customTitleEl = document.querySelector("title[data-translate]");
  if (customTitleEl) {
    const titleKey = customTitleEl.getAttribute("data-translate");
    const translatedTitle =
      (activeDict && activeDict[titleKey]) ||
      (fallbackDict && fallbackDict[titleKey]);
    if (translatedTitle) {
      document.title = translatedTitle;
    }
  } else if (
    translations[resolvedLang] &&
    translations[resolvedLang].page_title
  ) {
    document.title = translations[resolvedLang].page_title;
  }

  // Update URL to reflect language change (redirect to correct path)
  // Only redirect if skipRedirect is false (i.e., user explicitly changed language)
  if (!skipRedirect) {
    try {
      const langUrl = buildLanguageUrl(resolvedLang);
      // Only redirect if the URL actually changed
      if (langUrl !== window.location.href) {
        window.location.href = langUrl;
        return; // Exit early since we're redirecting
      }
    } catch (error) {
      console.warn("Unable to update URL for language change:", error);
    }
  }

  updateSeoLinks(resolvedLang);
  updateStructuredData(resolvedLang);

  try {
    localStorage.setItem("selectedLanguage", resolvedLang);
  } catch (error) {
    console.warn("Unable to persist language preference:", error);
  }
}

// Expose setLanguage globally for blog translation files
window.setLanguage = setLanguage;

function initBlogScroller() {
  const scrollContainer = document.querySelector("[data-blog-scroll]");
  if (!scrollContainer) return;

  const prevBtn = document.querySelector("[data-blog-prev]");
  const nextBtn = document.querySelector("[data-blog-next]");

  const scrollByAmount = () => {
    const card = scrollContainer.querySelector(".blog-card");
    return card ? card.offsetWidth + 24 : 320;
  };

  const scrollNext = () => {
    scrollContainer.scrollBy({
      left: scrollByAmount(),
      behavior: "smooth",
    });
  };

  const scrollPrev = () => {
    scrollContainer.scrollBy({
      left: -scrollByAmount(),
      behavior: "smooth",
    });
  };

  if (nextBtn) {
    nextBtn.addEventListener("click", scrollNext);
  }

  if (prevBtn) {
    prevBtn.addEventListener("click", scrollPrev);
  }

  scrollContainer.addEventListener(
    "wheel",
    (event) => {
      if (Math.abs(event.deltaY) > Math.abs(event.deltaX)) {
        event.preventDefault();
        scrollContainer.scrollBy({
          left: event.deltaY,
        });
      }
    },
    { passive: false }
  );
}

// Lightbox functionality for before/after images
(function () {
  const lightbox = document.getElementById("imageLightbox");
  if (!lightbox) return;

  const lightboxImage = lightbox.querySelector(".lightbox-image");
  const lightboxCurrent = lightbox.querySelector(".lightbox-current");
  const lightboxTotal = lightbox.querySelector(".lightbox-total");
  const closeButtons = lightbox.querySelectorAll("[data-lightbox-close]");
  const prevButton = lightbox.querySelector("[data-lightbox-prev]");
  const nextButton = lightbox.querySelector("[data-lightbox-next]");

  let currentIndex = 0;
  let images = [];

  // Get all images from before-after section
  function initLightbox() {
    const beforeAfterItems = document.querySelectorAll(
      ".before-after-item[data-lightbox-image]"
    );
    images = Array.from(beforeAfterItems).map((item) => {
      const img = item.querySelector("img");
      return {
        src: img.src,
        alt: img.alt,
      };
    });

    if (images.length > 0) {
      lightboxTotal.textContent = images.length;

      // Add click handlers to images
      beforeAfterItems.forEach((item, index) => {
        item.addEventListener("click", () => openLightbox(index));
      });
    }
  }

  function openLightbox(index) {
    currentIndex = index;
    updateLightboxImage();
    lightbox.classList.add("active");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function closeLightbox() {
    lightbox.classList.remove("active");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  function updateLightboxImage() {
    if (images[currentIndex]) {
      lightboxImage.src = images[currentIndex].src;
      lightboxImage.alt = images[currentIndex].alt;
      lightboxCurrent.textContent = currentIndex + 1;
    }
  }

  function showNext() {
    currentIndex = (currentIndex + 1) % images.length;
    updateLightboxImage();
  }

  function showPrev() {
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    updateLightboxImage();
  }

  // Event listeners
  closeButtons.forEach((btn) => {
    btn.addEventListener("click", closeLightbox);
  });

  if (prevButton) prevButton.addEventListener("click", showPrev);
  if (nextButton) nextButton.addEventListener("click", showNext);

  // Keyboard navigation
  document.addEventListener("keydown", (e) => {
    if (!lightbox.classList.contains("active")) return;

    if (e.key === "Escape") {
      closeLightbox();
    } else if (e.key === "ArrowLeft") {
      showPrev();
    } else if (e.key === "ArrowRight") {
      showNext();
    }
  });

  // Initialize on DOM ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initLightbox);
  } else {
    initLightbox();
  }
})();
