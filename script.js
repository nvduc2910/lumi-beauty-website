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
      "eyeliner-tattoo": "phun mí mở tròng",
      "lip-brightening": "khử thâm môi",
    },
    en: {
      "eyebrow-tattoo": "eyebrow PMU",
      "eyeliner-tattoo": "eyeliner PMU",
      "lip-brightening": "lip brightening",
    },
    ko: {
      "eyebrow-tattoo": "눈썹 반영구",
      "eyeliner-tattoo": "아이라인 반영구",
      "lip-brightening": "입술 톤 브라이트닝",
    },
  };

  const getServiceKey = (href) => {
    const url = href || "";

    if (url.includes("eyebrow-tattoo")) {
      return "eyebrow-tattoo";
    } else if (url.includes("eyeliner-tattoo")) {
      return "eyeliner-tattoo";
    } else if (url.includes("lip-brightening")) {
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

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  });
});

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
    beauty_guide: "Cẩm nang phun xăm",
    contact: "Liên hệ",
    offers: "Cảm nhận khách hàng",
    book_now: "ĐẶT LỊCH NGAY",

    // Hero Section
    main_title: "PHUN XĂM THẨM MỸ",
    natural_beauty: "Đẹp TỰ NHIÊN",
    enhance_features: "Tôn nét riêng của bạn",
    hero_description:
      "Lumi Beauty mang đến trải nghiệm phun xăm 1-1 chuyên biệt cho từng gương mặt, giúp bạn sở hữu đôi môi hồng hào, cặp mày thanh thoát và ánh nhìn tự nhiên. Mỗi khách hàng được chăm sóc riêng biệt bởi chuyên viên phun xăm có kinh nghiệm, đảm bảo kết quả tinh tế và hài hòa nhất.",
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
      "Đặt lịch ngay hôm nay để được chuyên gia Lumi Beauty đo tông màu và lên phác đồ chăm sóc riêng cho bạn.",
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
      "Phun Mày Tơ Ombre Lumi Beauty - Tạo khung mày hài hòa chuẩn gương mặt",
    brow_detail_meta_description:
      "Phun mày tơ ombre tại Lumi Beauty định hình tỉ lệ vàng, đi sợi nano, không sưng đau, bảo hành 18 tháng và chăm sóc riêng từng kiểu mày.",
    brow_detail_badge: "Định hình chân mày",
    brow_detail_hero_heading: "Phun Mày Tơ Ombre Lumi Beauty",
    brow_detail_hero_subheading:
      "Tạo khung mày hài hòa, nâng thần thái chuẩn tỉ lệ vàng",
    brow_detail_hero_paragraph1:
      "Dựa trên chuẩn vàng 1/3 khuôn mặt và cấu trúc xương hốc mắt, chúng tôi thiết kế dáng mày riêng cho từng khách. Kỹ thuật đi sợi nano kết hợp ombre giúp mày đậm ở đuôi, mềm ở đầu, hiệu ứng như kẻ chì hàng ngày.",
    brow_detail_hero_paragraph2:
      "Dụng cụ kim siêu mảnh 0.18mm, mực hữu cơ thuần châu Âu, an toàn với phụ nữ sau sinh từ 6 tháng. Bảo hành dáng và màu trong 18 tháng.",
    brow_detail_hero_stat_label: "Khách không cần kẻ mày trong 18 tháng",
    brow_detail_highlights_title: "Điểm khác biệt của phun mày Lumi Beauty",
    brow_detail_highlight1_title: "Định hình tỉ lệ vàng 1/3",
    brow_detail_highlight1_desc:
      "Đo chiều cao trán, gò má, đuôi mắt để tạo form mày nâng thần sắc mà vẫn cân đối tự nhiên.",
    brow_detail_highlight2_title: "Đi sợi nano vi điểm",
    brow_detail_highlight2_desc:
      "Phác thảo từng sợi theo chiều mọc thật, tạo hiệu ứng 3D đầy đặn mà không gây tổn thương chân mày cũ.",
    brow_detail_highlight3_title: "Mực hữu cơ thuần lạnh",
    brow_detail_highlight3_desc:
      "Loại bỏ nguy cơ trổ đỏ - trổ xanh, màu ombre mịn chuyển sắc nhẹ nhàng, phù hợp cả da dầu.",
    brow_detail_highlight4_title: "Chăm sóc trọn vòng đời",
    brow_detail_highlight4_desc:
      "Tặng gói điều chỉnh dáng sau 30 ngày và hỗ trợ dặm miễn phí nếu dáng lệch do phun cũ.",
    brow_detail_process_title: "Quy trình thực hiện phun mày tơ ombre",
    brow_detail_process_intro:
      "Thời gian 75 phút, áp dụng chuẩn vô trùng quốc tế, phù hợp cả làn da nhạy cảm.",
    brow_detail_process_step1_title: "Phân tích khuôn mặt",
    brow_detail_process_step1_desc:
      "Đo góc mắt - cánh mũi - đỉnh mày, xác định dáng phù hợp với phong cách cá nhân.",
    brow_detail_process_step2_title: "Vẽ phác thảo 3 lớp",
    brow_detail_process_step2_desc:
      "Dùng bút chuyên dụng tạo form mày và cân chỉnh từng mm trước khi thực hiện.",
    brow_detail_process_step3_title: "Ủ tê lạnh & khử trùng",
    brow_detail_process_step3_desc:
      "Ủ tê lạnh không gây bít lỗ chân lông, làm sạch vùng da mày bằng dung dịch dịu nhẹ.",
    brow_detail_process_step4_title: "Đi sợi nano kết hợp ombre",
    brow_detail_process_step4_desc:
      "Đi vi kim từng sợi ở đầu mày, phủ ombre mịn ở thân và đuôi, đảm bảo mật độ tự nhiên.",
    brow_detail_process_step5_title: "Khóa màu & hướng dẫn",
    brow_detail_process_step5_desc:
      "Phủ serum khóa màu, hướng dẫn chăm sóc tại nhà và đặt lịch tái khám sau 30 ngày.",
    brow_detail_results_outcome_title: "Kết quả đạt được",
    brow_detail_results_outcome_item1:
      "Form mày chuẩn nét, đuôi sắc nhưng không cứng.",
    brow_detail_results_outcome_item2:
      "Hiệu ứng sợi tơ đan xen, nhìn gần vẫn tự nhiên.",
    brow_detail_results_outcome_item3:
      "Giữ màu 18-24 tháng, không trổ xanh đỏ.",
    brow_detail_results_aftercare_title: "Chăm sóc sau phun",
    brow_detail_results_aftercare_item1:
      "Giữ vùng mày khô trong 48 giờ, lau nhẹ bằng nước muối sinh lý.",
    brow_detail_results_aftercare_item2:
      "Không tự ý cậy mày bong, để bong tự nhiên sau 5-7 ngày.",
    brow_detail_results_aftercare_item3:
      "Tránh nắng gắt, xông hơi trong 10 ngày đầu.",
    brow_detail_pricing_title: "Gói dịch vụ & ưu đãi",
    brow_detail_pricing_intro:
      "Áp dụng giá niêm yết, tặng kèm cặp serum dưỡng mày và phiếu dặm miễn phí.",
    brow_detail_pricing_option1_title: "Gói Phun Mày Ombre",
    brow_detail_pricing_option1_item1:
      "Tạo form mày cá nhân hóa, phủ ombre mềm mại.",
    brow_detail_pricing_option1_item2: "Tặng serum dưỡng mày 7 ngày.",
    brow_detail_pricing_option1_item3: "Bảo hành 12 tháng.",
    brow_detail_pricing_option2_badge: "Được yêu thích",
    brow_detail_pricing_option2_title: "Gói Đi Sợi Nano Mix Ombre",
    brow_detail_pricing_option2_item1:
      "Đi sợi nano đầu mày, ombre đuôi cho hiệu ứng makeup.",
    brow_detail_pricing_option2_item2: "Theo dõi 2 lần trong 60 ngày.",
    brow_detail_pricing_option2_item3: "Miễn phí dặm trong 18 tháng.",
    brow_detail_pricing_option3_title: "Gói Tái Cấu Trúc Chân Mày",
    brow_detail_pricing_option3_item1:
      "Xử lý nền cũ trổ xanh đỏ, tạo dáng mới hoàn toàn.",
    brow_detail_pricing_option3_item2: "Bao gồm 2 buổi chỉnh sửa chuyên sâu.",
    brow_detail_pricing_option3_item3: "Hỗ trợ xóa laser nhẹ nếu cần.",
    brow_detail_pricing_note:
      "Giá đã gồm vật tư dùng một lần và thuế VAT. Nhóm từ 2 người giảm thêm 5%.",
    brow_detail_faq_title: "Câu hỏi thường gặp",
    brow_detail_faq_q1: "Sau phun mày có bị đậm quá không?",
    brow_detail_faq_a1:
      "Lumi Beauty luôn pha màu nhạt hơn 30% so với yêu cầu ban đầu. Sau bong 5-7 ngày màu sẽ lên đúng tông, không bị đậm mất tự nhiên.",
    brow_detail_faq_q2: "Bao lâu thì cần dặm lại?",
    brow_detail_faq_a2:
      "Thông thường 18-24 tháng mới cần dặm. Riêng da dầu hoặc khách thường xuyên tiếp xúc nắng có thể cần sớm hơn và đã bao gồm trong bảo hành.",
    brow_detail_faq_q3: "Có phù hợp với dáng mày đã phun trước đó?",
    brow_detail_faq_a3:
      "Chúng tôi đánh giá nền cũ trước khi thực hiện. Nếu mày trổ xanh đỏ sẽ xử lý nhẹ trước, sau đó tái cấu trúc để dáng mới mềm mại, không bị chồng chéo.",
    brow_detail_cta_title: "Sẵn sàng nâng tầm thần thái?",
    brow_detail_cta_desc:
      "Đặt lịch ngay để được chuyên gia Lumi Beauty đo phác và tư vấn dáng mày hoàn hảo cho gương mặt bạn.",

    // Service Detail - Lip Brightening
    lip_removal_detail_page_title:
      "Khử Thâm Môi Chuyên Sâu Lumi Beauty - Trả lại sắc môi tươi sáng",
    lip_removal_detail_meta_description:
      "Liệu trình khử thâm môi Lumi Beauty kết hợp laser lạnh và serum vitamin, cải thiện thâm bẩm sinh 70%, an toàn cho da nhạy cảm, bảo hành màu 12 tháng.",
    lip_removal_detail_badge: "Xử lý thâm môi",
    lip_removal_detail_hero_heading: "Khử Thâm Môi Chuyên Sâu Lumi Beauty",
    lip_removal_detail_hero_subheading:
      "Trả lại sắc môi tươi sáng, mềm mịn sau 14 ngày",
    lip_removal_detail_hero_paragraph1:
      "Liệu trình kết hợp laser lạnh thế hệ mới và serum vitamin C + B5 đậm đặc, phá hủy sắc tố thâm mà không gây bong tróc hay bỏng rát. Phù hợp với môi thâm do bẩm sinh, thâm do dùng son chì hoặc do nội tiết.",
    lip_removal_detail_hero_paragraph2:
      "Mỗi khách hàng được xây dựng phác đồ riêng gồm 1-2 buổi khử thâm và 1 buổi phun baby lip hoàn thiện, đảm bảo lên màu tự nhiên, lâu bền.",
    lip_removal_detail_hero_stat_label: "Giảm sắc tố thâm sau buổi đầu tiên",
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
      "Tùy tình trạng bẩm sinh hay do thói quen, chuyên gia điều chỉnh năng lượng và số buổi phù hợp.",
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
    lip_removal_detail_cta_title: "Đánh thức sắc môi hồng tự nhiên",
    lip_removal_detail_cta_desc:
      "Đăng ký lịch ngay để được chuyên gia Lumi Beauty thăm khám và xây dựng phác đồ khử thâm dành riêng cho bạn.",

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
    contact_call_description: "Nhấn để kết nối ngay với chuyên gia Lumi Beauty",
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

    // Footer
    footer_tagline: "Phun xăm đẹp tự nhiên - Tôn nét riêng của bạn",
    footer_address: "151 Trần Duy Hưng, Cầu Giấy, Hà Nội",
    services_title: "Dịch vụ",
    lip_service: "Phun xăm môi",
    eyebrow_service: "Phun xăm mày",
    lip_removal_service: "Khử thâm môi",
    contact_title: "Liên hệ",
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
    page_title: "Lumi Beauty - Natural Lip & Brow Tattoo",
    close_modal: "Close",
    floating_contact_zalo: "Chat on Zalo",
    floating_contact_facebook: "Chat on Facebook",
    floating_contact_tiktok: "TikTok",
    meta_description:
      "Lumi Beauty in Da Nang delivers premium lip, brow, and eyeliner tattoo services with medical-grade processes, gentle techniques, and devoted care.",
    meta_keywords:
      "lip tattoo da nang, eyebrow tattoo vietnam, permanent makeup, Lumi Beauty",
    og_title: "Lumi Beauty - Natural Lip & Brow Tattoo in Da Nang",
    og_description:
      "Discover Lumi Beauty's gentle lip, brow, and eyeliner tattoo services in Da Nang. Medical-standard procedures, long-lasting color, and caring experts.",
    twitter_title: "Lumi Beauty - Natural Permanent Makeup in Da Nang",
    twitter_description:
      "Experience natural lip and brow tattoos with Lumi Beauty's skilled artists in Da Nang, Vietnam.",
    business_name: "Lumi Beauty",
    business_description:
      "Lumi Beauty in Da Nang specializes in natural-looking lip, brow, and eyeliner tattoos using medical-standard techniques and attentive aftercare.",

    // Navigation
    beauty_services: "Tattoo Services",
    beauty_guide: "Tattoo Guide",
    contact: "Contact",
    offers: "Customer Reviews",
    book_now: "BOOK NOW",

    // Hero Section
    main_title: "LIP & EYEBROW TATTOO",
    natural_beauty: "NATURAL BEAUTY",
    enhance_features: "Enhance your unique features",
    hero_description:
      "Lumi Beauty specializes in lip and eyebrow tattooing with modern technology, ensuring natural and long-lasting results. We are committed to bringing you perfect beauty with medical standard procedures.",
    contact_now: "CONTACT NOW",

    // Feature Tags
    no_pain: "NO PAIN",
    no_swelling: "NO SWELLING",
    no_diet: "NO DIETARY RESTRICTIONS",

    // Stats
    years_experience: "years of experience",
    potential_customers: "potential customers",
    five_star_reviews: "5-star reviews from customers",
    certifications: "professional certifications",

    // Help Section
    greeting: "Hello!",
    how_can_help: "Could Lumi Beauty introduce ourselves in just one minute?",
    help_intro:
      "Lumi Beauty is a trusted cosmetic tattoo studio in Da Nang, known for private one-on-one sessions and heartfelt care.",
    help_quote:
      'We believe that "Every face is unique and deserves to be enhanced with subtle, natural detail."',
    help_commitment:
      "That is why we devote our full time to listening, consulting, and designing lips, brows, and eyeliner that complement each client. With medical-grade protocols and safe organic pigments, Lumi Beauty delivers natural results with no swelling, minimal discomfort, and long-lasting color.",
    book_description:
      "Book an appointment today to get consultation and receive attractive offers",
    contact_description:
      "Contact us immediately if you have feedback or any questions that need consultation",
    book_appointment: "Book an appointment today",
    want_to_book: "I WANT TO BOOK AN APPOINTMENT",
    contact_us: "Contact",
    need_consultation: "I NEED CONSULTATION",

    // Services
    our_services: "Our Services",
    lip_tattoo_title: "Collagen Baby Lip Tattoo",
    lip_tattoo_benefit1: "Boosts rosy, plump, naturally radiant lips.",
    lip_tattoo_benefit2:
      "One-on-one technique with ultra-fine needles for minimal discomfort and flawless color after healing.",
    lip_tattoo_benefit3: "Ideal for dry, dark, or pale lips.",
    eyebrow_tattoo_title: "Shading / Powder Brows",
    eyebrow_tattoo_benefit1:
      "Creates soft, natural brows that lift and refine facial contours.",
    eyebrow_tattoo_benefit2:
      "Personalized one-on-one mapping to your facial proportions before tattooing.",
    eyebrow_tattoo_benefit3: "Balanced brow structure—never harsh or blocky.",
    eyeliner_tattoo_title: "Lash-Line Enhancement",
    eyeliner_tattoo_benefit1:
      "Opens the eyes with subtle depth while keeping a natural look.",
    eyeliner_tattoo_benefit2:
      "Gentle, surgery-free process with virtually no pain.",
    eyeliner_tattoo_benefit3:
      "Perfect for clients seeking definition but retaining a bare-faced feel.",
    lip_removal_title: "Lip Brightening for Men & Women",
    lip_removal_benefit1:
      "Restores an even, soft pink tone for smooth, hydrated lips.",
    lip_removal_benefit2:
      "One-on-one brightening protocol that delivers visible results in a single course.",
    lip_removal_benefit3:
      "Solutions tailored for men who want brighter lips without an artificial red tint.",
    discover_more: "DISCOVER MORE",

    // Why Choose Us
    why_choose_title: "Why Do Thousands of Customers Trust Lumi Beauty?",
    feature_personalized_title: "Private 1-on-1 Sessions",
    feature_personalized_desc:
      "Every guest receives a dedicated artist who follows the entire process.",
    feature_expert_title: "Expert, Well-Trained Artists",
    feature_expert_desc:
      "Formally trained professionals with years of experience.",
    feature_organic_title: "Safe Organic Pigments",
    feature_organic_desc:
      "No swelling, no discomfort, and no color shifting over time.",
    feature_space_title: "Clean & Private Studio",
    feature_space_desc:
      "A relaxing, comfortable space from consultation to finish.",
    feature_feedback_title: "Hundreds of Happy Clients",
    feature_feedback_desc: "Authentic feedback and proven results.",

    // Contact Methods
    contact_intro:
      "✨ Want a refined, natural look that still feels like you? Let Lumi Beauty guide you through a personalized 1-on-1 permanent makeup experience.",
    contact_methods_title:
      "Don't hesitate – choose the contact option that fits you best.",
    contact_call_title: "Call us directly",
    contact_call_description:
      "Tap to connect instantly with a Lumi Beauty specialist",
    contact_call_button: "CALL NOW",
    contact_facebook_title: "Chat on Facebook",
    contact_facebook_description: "Get quick advice via Lumi Beauty Messenger",
    contact_facebook_button: "OPEN MESSENGER",
    contact_zalo_title: "Chat on Zalo",
    contact_zalo_description:
      "Connect on Zalo for support and exclusive offers",
    contact_zalo_button: "OPEN ZALO",
    contact_email_title: "Send an email",
    contact_email_description:
      "Leave a detailed message and we'll reply within 24 hours",
    contact_email_button: "SEND EMAIL",

    // Zalo Contact Modal
    zalo_contact_modal_title: "Contact us directly",
    zalo_contact_modal_desc:
      "You are interested in {service} service. Please contact us via Zalo for detailed consultation.",
    zalo_contact_phone_label: "Zalo Phone Number:",
    zalo_contact_open_button: "OPEN ZALO NOW",

    // Contact Form
    contact_form_title:
      "Don't hesitate - leave your phone number, we will help you choose the most suitable service for your face.",
    phone_placeholder: "Enter your phone number",
    send: "SEND",
    contact_form_success:
      "Thank you! We'll get back to you as soon as possible.",
    contact_form_error: "Something went wrong. Please try again.",
    contact_form_phone_required: "Please enter your phone number.",

    // Gallery
    real_images: "Real Images",
    lip_tattoo_label: "Lip Tattoo",
    eyebrow_tattoo_label: "Eyebrow Tattoo",

    // Testimonials
    customer_reviews: "Customer Reviews",
    scroll_hint: "Swipe to see more",
    testimonial1:
      "Excellent service! My lips look natural and much more beautiful. The staff is very professional and dedicated.",
    testimonial2:
      "Very satisfied with the eyebrow tattoo results. The eyebrow shape was designed to suit my face, with natural colors.",
    testimonial3:
      "The process was not painful as expected. After lip tattooing, the color came up evenly and naturally. Will come back next time!",

    // Blog
    learn_more_title: "Learn more about beauty - tattooing",
    blog1_title: "How long does it take for lip tattoo to show natural color?",
    blog2_title:
      "What to avoid after eyebrow tattoo for good shape and even color?",
    blog3_title:
      "Distinguish between baby lip tattoo, collagen, and ombre - which one to choose?",
    read_more: "Read more",

    // Footer
    footer_tagline: "Natural permanent makeup - Enhance your unique features",
    footer_address: "151 Tran Duy Hung, Cau Giay, Hanoi",
    services_title: "Services",
    lip_service: "Lip Tattoo",
    eyebrow_service: "Eyebrow Tattoo",
    lip_removal_service: "Lip Dark Spot Removal",
    contact_title: "Contact",
    consultation_title: "Consultation",
    connect_with_us: "Connect with us",
    footer_line1: "💋 Natural lip, brow, and eyeliner tattoo specialists",
    footer_line2: "💋 Dedicated consultation and care",
    footer_address_detail: "Vo Quy Huan, FPT City Urban Area, Da Nang, Vietnam",
    footer_tiktok: "TikTok: @lumibeautyphunxam",
    footer_facebook: "Facebook: facebook.com/lumibeautypmubrowlip",
    facebook_iframe_title: "Lumi Beauty Facebook Page",
    footer_copyright: "© 2025 Lumi Beauty. All rights reserved.",

    // Booking Modal
    booking_title: "Book an appointment now",
    booking_description:
      "Fill in your details so Lumi Beauty can contact you promptly.",
    booking_name_label: "Full name",
    booking_name_placeholder: "Anna Nguyen",
    booking_phone_label: "Phone number",
    booking_phone_placeholder: "0900 067 832",
    booking_service_label: "Service of interest",
    booking_service_option_lip: "Lip Tattoo",
    booking_service_option_eyebrow: "Eyebrow Tattoo",
    booking_service_option_lip_removal: "Lip Dark Spot Removal",
    booking_service_option_other: "Other",
    booking_time_label: "Preferred time",
    booking_notes_label: "Additional notes",
    booking_notes_placeholder: "Share your needs or questions",
    booking_submit: "SEND REQUEST",
    booking_sending: "Sending your information...",
    booking_success: "Thank you! Lumi Beauty will contact you shortly.",
    booking_error:
      "Submission failed. Please try again or contact us directly.",
    contact_free_button: "Contact for free consultation",

    // Service Detail - Lip Tattoo
    lip_detail_page_title:
      "Collagen Lip PMU Da Nang - Lumi Beauty | Medical-Grade Technique",
    lip_detail_meta_description:
      "Collagen lip PMU at Lumi Beauty Da Nang: medical-grade technique, 1-on-1 with 7+ years experienced specialist, color lasts 18-36 months, fast recovery 1-2 days. Imported organic ink, 4-month warranty.",
    lip_detail_hero_heading: "Collagen Lip PMU Lumi Beauty",
    lip_detail_hero_subheading: "Rosy, plump lips in just 48 hours",
    lip_detail_hero_highlight1:
      "Visible dark spot reduction and lip tone improvement after one session",
    lip_detail_hero_highlight2:
      "Clear, soft lip color, no harsh edges – no darkening or smudging",
    lip_detail_hero_highlight3:
      "Gentle experience, virtually painless – quick recovery in 1–2 days",
    lip_detail_hero_highlight4:
      "Color lasts 18–36 months, true tone development without fading",
    lip_problems_title: "Common Lip Issues",
    lip_problems_intro: "Common lip problems we can solve",
    lip_problem1_title: "Dark, dull lips",
    lip_problem1_desc:
      "Dark lips make the face lack vitality and you always need lipstick to cover imperfections.",
    lip_problem1_alt: "Dark, dull lips",
    lip_problem2_title: "Uneven lip color",
    lip_problem2_desc:
      "Some areas are dark, some are light, making makeup difficult and lip color lack harmony.",
    lip_problem2_alt: "Uneven lip color",
    lip_problem4_title: "Asymmetric lips, uneven lip line",
    lip_problem4_alt: "Asymmetric lips, uneven lip line",
    lip_problem4_desc:
      "Uneven lips on both sides make the smile lack harmony and reduce confidence in communication.",
    lip_problem5_title: "Lip color fades over time",
    lip_problem5_desc:
      "Despite careful care, lip color still fades and loses vitality over time, requiring a long-term solution.",
    lip_problem5_alt: "Lip color fades over time",
    why_choose_title: "Why many customers choose lip PMU at Lumi Beauty",
    why_choose_item1_title:
      "1-on-1 Lip PMU – Specialist with 7+ years experience",
    why_choose_item1_desc:
      "At Lumi Beauty, each customer receives private, 1-on-1 care from a lip PMU specialist with 7 years of experience, ensuring lips develop subtle, harmonious color that suits each face.",
    why_choose_item2_title: "Collagen Technology",
    why_choose_item2_desc:
      "Advanced technique helps lips develop natural color, soft and plump, effectively reducing dark spots.",
    why_choose_item3_title: "Imported organic ink, absolutely safe",
    why_choose_item3_desc:
      "100% lead-free organic ink, non-irritating, suitable for all skin types and sensitive lips.",
    why_choose_item4_title: "Gentle process, no pain, fast recovery",
    why_choose_item4_desc:
      "PMU machine lip tattooing, maximum pain and swelling reduction, recovery in just 1–2 days.",
    why_choose_item5_title: "Long-lasting color results",
    why_choose_item5_desc:
      "Lip color stable for 18–36 months, develops correct tone and maintains natural effect over time.",
    why_choose_item6_title: "Caring service, post-treatment warranty",
    why_choose_item6_desc:
      "Detailed care instructions, free color touch-up support so you always have perfect lips.",
    why_choose_image_alt: "Collagen Lip PMU at Lumi Beauty",
    service_commitment_title: "Service Commitment",
    service_commitment_intro:
      "Lumi Beauty commits to bringing you the best service with clear guarantees",
    commitment1_title: "Absolute safety",
    commitment1_desc:
      "Medical-grade process, sterile tools, imported organic ink, protecting your lip health.",
    commitment2_title: "Natural results – long-lasting color",
    commitment2_desc:
      "Lip PMU develops true color, soft and smooth, lasts 18–36 months, harmonizes with the face.",
    commitment3_title: "Caring service, 1-on-1",
    commitment3_desc:
      "Each customer receives private consultation and care, detailed post-treatment guidance so lips always look beautiful.",
    commitment4_title: "Warranty & color touch-up support",
    commitment4_desc:
      "Free 1-time color touch-up if needed, ensuring perfect lips as initially promised.",
    lip_detail_process_title: "Medical-grade process in 90 minutes",
    lip_detail_process_intro:
      "Each step follows sterile control, ensuring gentle experience and accurate results.",
    lip_detail_process_step1_title: "Consultation & personal assessment",
    lip_detail_process_step1_desc:
      "Specialist evaluates lip condition, skin tone and client's wishes to select suitable color tone and technique.",
    lip_detail_process_step2_title: "Cleansing & safe numbing",
    lip_detail_process_step2_desc:
      "Clean lips and surrounding area, apply professional numbing to ensure gentle, painless lip PMU process.",
    lip_detail_process_step3_title: "Color mixing & tool preparation",
    lip_detail_process_step3_desc:
      "Organic ink mixed to personal tone, sterile medical-grade tools, ensuring absolute safety.",
    lip_detail_process_step4_title: "Lip PMU with professional PMU machine",
    lip_detail_process_step4_desc:
      "Collagen technique helps lips develop true color, soft and smooth, no edges and naturally plump.",
    lip_detail_process_step5_title: "Lip care & completion",
    lip_detail_process_step5_desc:
      "Apply collagen essence, check results, guide home care for even and long-lasting color.",
    lip_detail_process_step6_title: "Care & post-treatment support",
    lip_detail_process_step6_desc:
      "Detailed lip care instructions, color touch-up support if needed, ensuring long-term results and always soft lips.",
    process_step1_alt: "Consultation & personal assessment",
    process_step2_alt: "Cleansing & safe numbing",
    process_step3_alt: "Color mixing & tool preparation",
    process_step4_alt: "Lip PMU with professional PMU machine",
    process_step5_alt: "Lip care & completion",
    process_step6_alt: "Care & post-treatment support",
    color_development_title: "Color development process",
    color_development_intro: "Recovery and color development after lip PMU",
    timeline_day1_title: "Just after lip PMU",
    timeline_day1_desc:
      "Lips slightly tight due to trauma and numbing, mild burning sensation is normal.",
    timeline_day2_title: "Lips dry and preparing to peel",
    timeline_day2_desc:
      "Lips begin to dry, need to use restorative care to support natural peeling process.",
    timeline_day3_title: "Lips peel lightly, color not even",
    timeline_day3_desc:
      "Peeling layer completely, light color, dark edges, light inner lips. During this time, need regular care and careful restrictions.",
    timeline_day10_title: "Lip color gradually stabilizes",
    timeline_day10_desc:
      "Color may be darker or lighter depending on body type and care method. This is a normal stage, no need to worry. Apply care regularly.",
    timeline_day30_title: "Fresh, smooth lips",
    timeline_day30_desc:
      "Lip color begins to even out, lips become smoother. Continue to apply care regularly.",
    timeline_day50_title: "Color completely stable",
    timeline_day50_desc:
      "Lip color is stable, customers can get touch-up if color hasn't reached desired level.",
    before_after_title: "Before and after images",
    before_after_intro: "Real results from Lumi Beauty customers",
    before_after_alt1: "Lip PMU results before and after",
    before_after_alt2: "Lip PMU results before and after",
    before_after_alt3: "Lip PMU results before and after",
    before_after_alt4: "Lip PMU results before and after",
    before_after_alt5: "Lip PMU results before and after",
    before_after_alt6: "Lip PMU results before and after",
    lip_detail_pricing_title:
      "Pricing & Promotional Packages - Collagen Lip PMU",
    lip_detail_pricing_intro:
      "Price from 2,000,000đ – 3,000,000đ, depending on lip type and your specific condition.",
    lip_detail_pricing_title_main: "Collagen Lip PMU",
    lip_detail_pricing_subtitle:
      "Price depends on lip condition and color choice",
    lip_detail_pricing_item1:
      "Medical-grade Collagen technique – natural color development, soft and smooth",
    lip_detail_pricing_item2:
      "Each client receives 1-on-1 care in private space",
    lip_detail_pricing_item3: "Free 1-time color touch-up within 04 months",
    lip_detail_pricing_item5:
      "100% imported organic ink, lead-free, safe for all lip types",
    lip_detail_pricing_note:
      "Price includes one-time sterile tool kit and VAT. Specific price depends on lip condition and color choice. Contact for group offers or current promotions.",
    lip_detail_faq_title: "Frequently Asked Questions",
    lip_detail_faq_q1: "Does collagen lip PMU hurt?",
    lip_detail_faq_a1:
      "Process uses professional numbing, gentle technique, virtually painless and minimal swelling.",
    lip_detail_faq_q2: "How long will lip color last?",
    lip_detail_faq_a2:
      "Color develops true and lasts 18–36 months depending on body type, you'll have naturally rosy lips long-term.",
    lip_detail_faq_q3: "How long until lips fully recover?",
    lip_detail_faq_a3:
      "Usually 1–2 days initially lips slightly swollen, after 5–7 days color stabilizes, lips soft and natural.",
    lip_detail_faq_q4: "Do I need rest after treatment?",
    lip_detail_faq_a4:
      "No rest needed, you can live normally. Just follow lip care instructions for best color development.",
    lip_detail_faq_q5: "Can I choose my own color tone?",
    lip_detail_faq_a5:
      "Absolutely, specialist will consult tone suitable for skin tone and wishes, ensuring natural color development.",
    lip_detail_faq_q6: "What if lip color fades or needs adjustment?",
    lip_detail_faq_a6:
      "You get free 1-time color touch-up within 04 months, ensuring lips always look beautiful and even.",
    lip_detail_cta_title: "Ready to own fresh, youthful lips?",
    lip_detail_cta_desc:
      "Book today to have Lumi Beauty specialist measure your tone and create a personalized care plan for you.",

    copyright: "© 2023 Lumi Beauty. All rights reserved.",
  },

  ko: {
    // General
    page_title: "루미 뷰티 - 자연스러운 입술 & 눈썹 타투",
    close_modal: "닫기",
    floating_contact_zalo: "자লো 채팅",
    floating_contact_facebook: "페이스북 채팅",
    floating_contact_tiktok: "틱톡",
    meta_description:
      "루미 뷰티 다낭은 의료 표준 절차로 입술, 눈썹, 아이라인 타투를 제공하며 통증과 붓기 없이 자연스러운 결과를 선사합니다.",
    meta_keywords: "입술 타투 다낭, 눈썹 타투 베트남, 반영구 화장, 루미 뷰티",
    og_title: "루미 뷰티 - 다낭 자연스러운 반영구 메이크업",
    og_description:
      "루미 뷰티에서 의료 표준 절차와 섬세한 케어로 자연스러운 입술·눈썹 타투를 경험하세요.",
    twitter_title: "루미 뷰티 - 다낭 반영구 메이크업",
    twitter_description:
      "루미 뷰티 다낭은 통증 없이 오래 지속되는 입술, 눈썹 타투 서비스를 제공합니다.",
    business_name: "루미 뷰티",
    business_description:
      "루미 뷰티 다낭은 의료 표준 절차와 세심한 케어로 자연스럽고 오래 지속되는 입술·눈썹 타투 서비스를 제공합니다.",

    // Navigation
    beauty_services: "타투 서비스",
    beauty_guide: "타투 가이드",
    contact: "연락처",
    offers: "고객 리뷰",
    book_now: "예약하기",

    // Hero Section
    main_title: "입술 & 눈썹 타투",
    natural_beauty: "자연스러운 아름다움",
    enhance_features: "당신만의 매력을 강조하세요",
    hero_description:
      "루미 뷰티는 현대 기술을 사용한 입술과 눈썹 타투 전문으로, 자연스럽고 오래 지속되는 결과를 보장합니다. 의료 표준 절차로 완벽한 아름다움을 선사하겠습니다.",
    contact_now: "지금 연락하기",

    // Feature Tags
    no_pain: "통증 없음",
    no_swelling: "부종 없음",
    no_diet: "식이 제한 없음",

    // Stats
    years_experience: "년 경험",
    potential_customers: "잠재 고객",
    five_star_reviews: "고객 5성 리뷰",
    certifications: "전문 자격증",

    // Help Section
    greeting: "안녕하세요!",
    how_can_help: "루미 뷰티가 1분 안에 자신을 소개해도 될까요?",
    help_intro:
      "루미 뷰티는 다낭에서 1:1 프라이빗 상담과 세심한 케어로 사랑받는 반영구 전문 숍입니다.",
    help_quote:
      '우리는 "모든 얼굴은 고유한 아름다움을 지니며, 섬세하고 자연스럽게 살려야 한다"고 믿습니다.',
    help_commitment:
      "그래서 고객 한 분 한 분의 이야기를 듣고 가장 잘 어울리는 입술·눈썹·아이라인을 설계합니다. 의료 표준 프로세스와 안전한 유기농 색소로 붓거나 아프지 않으며 오래 지속되는 자연스러운 결과를 약속드립니다.",
    book_description: "오늘 예약하여 상담을 받고 매력적인 혜택을 받으세요",
    contact_description:
      "피드백이나 상담이 필요한 질문이 있으시면 즉시 연락해 주세요",
    book_appointment: "오늘 예약하기",
    want_to_book: "예약하고 싶습니다",
    contact_us: "연락처",
    need_consultation: "상담이 필요합니다",

    // Services
    our_services: "우리 서비스",
    lip_tattoo_title: "콜라겐 / 베이비 립 타투",
    lip_tattoo_benefit1: "입술을 자연스럽고 생기 있게, 촉촉하게 연출합니다.",
    lip_tattoo_benefit2:
      "초미세 니들을 사용하는 1:1 맞춤 시술로 통증을 최소화하고, 벗겨진 후에도 선명한 컬러를 유지합니다.",
    lip_tattoo_benefit3: "건조하거나 어둡고 옅은 입술에 적합한 솔루션입니다.",
    eyebrow_tattoo_title: "쉐이딩 / 파우더 브로우",
    eyebrow_tattoo_benefit1:
      "부드럽고 자연스러운 눈썹 라인으로 얼굴을 더 세련되게 보완합니다.",
    eyebrow_tattoo_benefit2:
      "시술 전 얼굴 비율을 정밀 측정하여 1:1 맞춤으로 디자인합니다.",
    eyebrow_tattoo_benefit3:
      "자연스러운 균형감을 유지하며, 각지고 딱딱해 보이지 않습니다.",
    eyeliner_tattoo_title: "미 오픈 아이라인",
    eyeliner_tattoo_benefit1:
      "눈을 또렷하고 깊이감 있게 만들어 주면서 자연스러운 분위기를 유지합니다.",
    eyeliner_tattoo_benefit2:
      "부드럽고 편안한 시술로, 통증과 수술적 개입 없이 진행됩니다.",
    eyeliner_tattoo_benefit3:
      "자연스러운 인상을 유지하면서 눈매를 또렷하게 하고 싶은 분들에게 추천합니다.",
    lip_removal_title: "남녀 입술 톤 브라이트닝",
    lip_removal_benefit1:
      "밝고 균일한 핑크빛 입술로 회복시키고 촉촉한 질감을 유지합니다.",
    lip_removal_benefit2:
      "1:1 맞춤 기법으로 한 번의 코스 후에도 즉각적인 변화를 느낄 수 있습니다.",
    lip_removal_benefit3:
      "남성 고객도 자연스럽게 입술 톤을 개선할 수 있도록 설계된 솔루션입니다.",
    discover_more: "더 알아보기",

    // Why Choose Us
    why_choose_title: "수천 명의 고객이 루미 뷰티를 신뢰하는 이유는?",
    feature_personalized_title: "1:1 프라이빗 시술",
    feature_personalized_desc:
      "모든 고객을 전담 전문가가 처음부터 끝까지 케어합니다.",
    feature_expert_title: "고숙련 전문 아티스트",
    feature_expert_desc: "체계적인 교육과 다년간의 노하우를 보유한 팀.",
    feature_organic_title: "안전한 유기농 색소",
    feature_organic_desc:
      "붓기와 통증을 줄이고, 시간이 지나도 색이 변하지 않습니다.",
    feature_space_title: "청결하고 프라이빗한 공간",
    feature_space_desc:
      "상담부터 시술까지 편안하고 휴식 같은 경험을 제공합니다.",
    feature_feedback_title: "수백 건의 만족 후기",
    feature_feedback_desc: "실제 고객의 피드백과 눈에 보이는 결과.",

    // Contact Methods
    contact_intro:
      "✨ 자연스럽고 섬세한 아름다움과 당신만의 개성을 지키고 싶으신가요? 루미 뷰티와 함께 1:1 맞춤 반영구 여정을 시작해 보세요.",
    contact_methods_title:
      "망설이지 마세요 - 가장 편한 연락 방법을 선택하세요.",
    contact_call_title: "전화 상담",
    contact_call_description: "루미 뷰티 전문가와 바로 연결하세요",
    contact_call_button: "바로 전화하기",
    contact_facebook_title: "페이스북 채팅",
    contact_facebook_description: "루미 뷰티 메신저에서 빠르게 상담받으세요",
    contact_facebook_button: "메신저 열기",
    contact_zalo_title: "자লো 채팅",
    contact_zalo_description: "자লো로 연결하여 지원과 특별 혜택을 받으세요",
    contact_zalo_button: "자লো 열기",
    contact_email_title: "이메일 보내기",
    contact_email_description:
      "상세한 메시지를 남겨주시면 24시간 이내에 답변드릴게요",
    contact_email_button: "이메일 보내기",

    // Zalo Contact Modal
    zalo_contact_modal_title: "직접 연락하기",
    zalo_contact_modal_desc:
      "{service} 서비스에 관심이 있으시군요. 자세한 상담을 위해 자로로 연락해 주세요.",
    zalo_contact_phone_label: "자로 전화번호:",
    zalo_contact_open_button: "지금 자로 열기",

    // Contact Form
    contact_form_title:
      "주저하지 마세요 - 전화번호를 남겨주시면 얼굴에 가장 적합한 서비스를 선택하는 데 도움을 드리겠습니다.",
    phone_placeholder: "전화번호를 입력하세요",
    send: "보내기",
    contact_form_success: "감사합니다! 최대한 빠르게 연락드리겠습니다.",
    contact_form_error: "오류가 발생했습니다. 다시 시도해 주세요.",
    contact_form_phone_required: "전화번호를 입력해 주세요.",

    // Gallery
    real_images: "실제 이미지",
    lip_tattoo_label: "입술 타투",
    eyebrow_tattoo_label: "눈썹 타투",

    // Testimonials
    customer_reviews: "고객 리뷰",
    scroll_hint: "옆으로 밀어 더 보기",
    testimonial1:
      "훌륭한 서비스! 제 입술이 자연스럽고 훨씬 더 아름다워 보입니다. 직원들이 매우 전문적이고 헌신적입니다.",
    testimonial2:
      "눈썹 타투 결과에 매우 만족합니다. 눈썹 모양이 제 얼굴에 맞게 디자인되었고 자연스러운 색상입니다.",
    testimonial3:
      "예상했던 것보다 통증이 없었습니다. 입술 타투 후 색상이 고르고 자연스럽게 나타났습니다. 다음에도 다시 올 예정입니다!",

    // Blog
    learn_more_title: "뷰티 - 타투에 대해 더 알아보기",
    blog1_title: "입술 타투가 자연스러운 색상을 보이기까지 얼마나 걸리나요?",
    blog2_title: "좋은 모양과 고른 색상을 위해 눈썹 타투 후 피해야 할 것들은?",
    blog3_title:
      "베이비 입술 타투, 콜라겐, 옴브레를 구분하는 방법 - 어떤 것을 선택해야 할까요?",
    read_more: "더 보기",

    // Footer
    footer_tagline: "자연스러운 반영구 메이크업 - 당신만의 매력을 강조하세요",
    footer_address: "하노이 카우자이 트란 두이 흥 151",
    services_title: "서비스",
    lip_service: "입술 타투",
    eyebrow_service: "눈썹 타투",
    lip_removal_service: "입술 어두운 반점 제거",
    contact_title: "연락처",
    consultation_title: "상담",
    connect_with_us: "우리와 연결하세요",
    footer_line1: "💋 자연스러운 입술·눈썹·아이라인 타투 전문",
    footer_line2: "💋 정성 어린 상담과 케어",
    footer_address_detail: "다낭 FPT 시티 도시 지역 보 꾸이 후안",
    footer_tiktok: "틱톡: @lumibeautyphunxam",
    footer_facebook: "페이스북: facebook.com/lumibeautypmubrowlip",
    facebook_iframe_title: "루미 뷰티 페이스북 페이지",
    footer_copyright: "© 2025 루미 뷰티. 모든 권리 보유.",

    // Booking Modal
    booking_title: "지금 예약하세요",
    booking_description:
      "정보를 입력해 주시면 루미 뷰티가 신속하게 연락드립니다.",
    booking_name_label: "이름",
    booking_name_placeholder: "김하늘",
    booking_phone_label: "전화번호",
    booking_phone_placeholder: "0900 067 832",
    booking_service_label: "관심 있는 서비스",
    booking_service_option_lip: "입술 타투",
    booking_service_option_eyebrow: "눈썹 타투",
    booking_service_option_lip_removal: "입술 어두운 반점 제거",
    booking_service_option_other: "기타",
    booking_time_label: "희망 시간",
    booking_notes_label: "추가 메모",
    booking_notes_placeholder: "필요 사항이나 질문을 공유해 주세요",
    booking_submit: "요청 보내기",
    booking_sending: "정보를 전송하고 있습니다...",
    booking_success: "감사합니다! 곧 루미 뷰티에서 연락드리겠습니다.",
    booking_error: "전송에 실패했습니다. 다시 시도하시거나 직접 연락해 주세요.",
    contact_free_button: "무료 상담 문의",

    // Service Detail - Lip Tattoo
    lip_detail_page_title: "콜라겐 립 반영구 다낭 - 루미 뷰티 | 의료 표준 기법",
    lip_detail_meta_description:
      "루미 뷰티 다낭 콜라겐 립 반영구: 의료 표준 기법, 7년 이상 경력 전문가 1:1 시술, 색상 지속 18-36개월, 빠른 회복 1-2일. 수입 유기농 잉크, 4개월 보증.",
    lip_detail_hero_heading: "콜라겐 립 반영구 루미 뷰티",
    lip_detail_hero_subheading: "48시간 만에 생기 있는 촉촉한 입술",
    lip_detail_hero_highlight1:
      "한 번의 시술 후 어두운 반점 감소 및 입술 톤 개선 효과",
    lip_detail_hero_highlight2:
      "맑고 부드러운 입술 색상, 거친 가장자리 없음 – 어둡거나 번지지 않음",
    lip_detail_hero_highlight3:
      "부드러운 경험, 거의 통증 없음 – 1–2일 내 빠른 회복",
    lip_detail_hero_highlight4:
      "색상 지속 18–36개월, 정확한 톤 발색 및 퇴색 없음",
    lip_problems_title: "입술의 문제점",
    lip_problems_intro: "우리가 해결할 수 있는 일반적인 입술 문제",
    lip_problem1_title: "어둡고 칙칙한 입술",
    lip_problem1_desc:
      "어두운 입술은 얼굴에 생기를 없게 만들고 항상 립스틱으로 결점을 가려야 합니다.",
    lip_problem1_alt: "어둡고 칙칙한 입술",
    lip_problem2_title: "고르지 않은 입술 색상",
    lip_problem2_desc:
      "일부 영역은 어둡고 일부는 밝아서 메이크업이 어렵고 입술 색상이 조화롭지 않습니다.",
    lip_problem2_alt: "고르지 않은 입술 색상",
    lip_problem4_title: "비대칭 입술, 고르지 않은 입술 라인",
    lip_problem4_alt: "비대칭 입술, 고르지 않은 입술 라인",
    lip_problem4_desc:
      "양쪽이 고르지 않은 입술은 미소를 조화롭지 않게 만들고 소통 시 자신감을 떨어뜨립니다.",
    lip_problem5_title: "시간이 지나면서 입술 색상 퇴색",
    lip_problem5_desc:
      "신중하게 관리해도 입술 색상은 시간이 지나면서 퇴색하고 생기를 잃어 장기적인 해결책이 필요합니다.",
    lip_problem5_alt: "시간이 지나면서 입술 색상 퇴색",
    why_choose_title: "많은 고객이 루미 뷰티에서 립 반영구를 선택하는 이유",
    why_choose_item1_title: "1:1 립 반영구 – 7년 이상 경력 전문가",
    why_choose_item1_desc:
      "루미 뷰티에서는 각 고객이 7년 경력의 립 반영구 전문가로부터 프라이빗 1:1 케어를 받아, 각 얼굴에 맞는 섬세하고 조화로운 색상 발색을 보장합니다.",
    why_choose_item2_title: "콜라겐 기술",
    why_choose_item2_desc:
      "첨단 기법으로 입술이 자연스러운 색상을 발색하고 부드럽고 촉촉하며 어두운 반점을 효과적으로 감소시킵니다.",
    why_choose_item3_title: "수입 유기농 잉크, 절대 안전",
    why_choose_item3_desc:
      "100% 무연 유기농 잉크, 자극 없음, 모든 피부 타입과 민감한 입술에 적합합니다.",
    why_choose_item4_title: "부드러운 과정, 통증 없음, 빠른 회복",
    why_choose_item4_desc:
      "반영구 기계 립 타투, 통증 및 붓기 최대 감소, 단 1–2일 내 회복.",
    why_choose_item5_title: "오래 지속되는 색상 결과",
    why_choose_item5_desc:
      "입술 색상 18–36개월 안정, 정확한 톤 발색 및 시간이 지나도 자연스러운 효과 유지.",
    why_choose_item6_title: "정성스러운 서비스, 시술 후 보증",
    why_choose_item6_desc:
      "상세한 케어 지침, 무료 색상 보정 지원으로 항상 완벽한 입술을 유지할 수 있습니다.",
    why_choose_image_alt: "루미 뷰티 콜라겐 립 반영구",
    service_commitment_title: "서비스 약속",
    service_commitment_intro:
      "루미 뷰티는 명확한 보장과 함께 최고의 서비스를 제공하겠다고 약속합니다",
    commitment1_title: "절대 안전",
    commitment1_desc:
      "의료 표준 프로세스, 멸균 도구, 수입 유기농 잉크, 입술 건강 보호.",
    commitment2_title: "자연스러운 결과 – 오래 지속되는 색상",
    commitment2_desc:
      "립 반영구는 정확한 색상 발색, 부드럽고 매끄러움, 18–36개월 지속, 얼굴과 조화.",
    commitment3_title: "정성스러운 서비스, 1:1",
    commitment3_desc:
      "각 고객은 프라이빗 상담 및 케어를 받으며, 시술 후 상세한 지침으로 입술이 항상 아름답게 유지됩니다.",
    commitment4_title: "보증 및 색상 보정 지원",
    commitment4_desc:
      "필요 시 무료 1회 색상 보정, 처음 약속한 대로 완벽한 입술 보장.",
    lip_detail_process_title: "90분 내 의료 표준 프로세스",
    lip_detail_process_intro:
      "각 단계는 멸균 관리 준수, 부드러운 경험과 정확한 결과 보장.",
    lip_detail_process_step1_title: "상담 및 개인 평가",
    lip_detail_process_step1_desc:
      "전문가가 입술 상태, 피부 톤 및 고객의 희망을 평가하여 적합한 색상 톤과 기법을 선택합니다.",
    lip_detail_process_step2_title: "청소 및 안전한 마취",
    lip_detail_process_step2_desc:
      "입술 및 주변 영역 청소, 전문 마취 적용으로 부드럽고 통증 없는 립 반영구 과정 보장.",
    lip_detail_process_step3_title: "색상 혼합 및 도구 준비",
    lip_detail_process_step3_desc:
      "개인 톤에 맞춘 유기농 잉크, 멸균 의료 표준 도구, 절대 안전 보장.",
    lip_detail_process_step4_title: "전문 반영구 기계로 립 반영구",
    lip_detail_process_step4_desc:
      "콜라겐 기법으로 입술이 정확한 색상을 발색하고 부드럽고 매끄러우며 가장자리 없이 자연스럽게 촉촉합니다.",
    lip_detail_process_step5_title: "입술 케어 및 완료",
    lip_detail_process_step5_desc:
      "콜라겐 에센스 적용, 결과 확인, 고르고 오래 지속되는 색상을 위한 홈 케어 안내.",
    lip_detail_process_step6_title: "케어 및 시술 후 지원",
    lip_detail_process_step6_desc:
      "상세한 입술 케어 지침, 필요 시 색상 보정 지원, 장기적인 결과 및 항상 부드러운 입술 보장.",
    process_step1_alt: "상담 및 개인 평가",
    process_step2_alt: "청소 및 안전한 마취",
    process_step3_alt: "색상 혼합 및 도구 준비",
    process_step4_alt: "전문 반영구 기계로 립 반영구",
    process_step5_alt: "입술 케어 및 완료",
    process_step6_alt: "케어 및 시술 후 지원",
    color_development_title: "색상 발색 과정",
    color_development_intro: "립 반영구 후 회복 및 색상 발색",
    timeline_day1_title: "립 반영구 직후",
    timeline_day1_desc:
      "외상 및 마취로 인해 입술이 약간 당기고 가벼운 작열감은 정상입니다.",
    timeline_day2_title: "입술 건조 및 벗겨짐 준비",
    timeline_day2_desc:
      "입술이 건조하기 시작하며, 자연스러운 벗겨짐 과정을 지원하기 위해 재생 케어를 사용해야 합니다.",
    timeline_day3_title: "입술 가볍게 벗겨짐, 색상 고르지 않음",
    timeline_day3_desc:
      "벗겨짐 층 완전히, 밝은 색상, 어두운 가장자리, 밝은 내부 입술. 이 기간 동안 정기적인 케어와 신중한 제한이 필요합니다.",
    timeline_day10_title: "입술 색상 점진적으로 안정화",
    timeline_day10_desc:
      "색상은 체질과 케어 방법에 따라 더 어둡거나 밝을 수 있습니다. 이것은 정상적인 단계이므로 걱정할 필요가 없습니다. 정기적으로 케어를 적용하세요.",
    timeline_day30_title: "신선하고 매끄러운 입술",
    timeline_day30_desc:
      "입술 색상이 고르게 되기 시작하고 입술이 더 매끄러워집니다. 정기적으로 케어를 계속 적용하세요.",
    timeline_day50_title: "색상 완전히 안정화",
    timeline_day50_desc:
      "입술 색상이 안정적이며, 색상이 원하는 수준에 도달하지 않은 경우 고객은 보정을 받을 수 있습니다.",
    before_after_title: "시술 전후 이미지",
    before_after_intro: "루미 뷰티 고객의 실제 결과",
    before_after_alt1: "립 반영구 결과 시술 전후",
    before_after_alt2: "립 반영구 결과 시술 전후",
    before_after_alt3: "립 반영구 결과 시술 전후",
    before_after_alt4: "립 반영구 결과 시술 전후",
    before_after_alt5: "립 반영구 결과 시술 전후",
    before_after_alt6: "립 반영구 결과 시술 전후",
    lip_detail_pricing_title: "가격 및 프로모션 패키지 - 콜라겐 립 반영구",
    lip_detail_pricing_intro:
      "입술 타입 및 특정 상태에 따라 2,000,000đ – 3,000,000đ부터.",
    lip_detail_pricing_title_main: "콜라겐 립 반영구",
    lip_detail_pricing_subtitle: "가격은 입술 상태 및 색상 선택에 따라 다름",
    lip_detail_pricing_item1:
      "의료 표준 콜라겐 기법 – 자연스러운 색상 발색, 부드럽고 매끄러움",
    lip_detail_pricing_item2: "각 고객은 프라이빗 공간에서 1:1 케어를 받습니다",
    lip_detail_pricing_item3: "04개월 내 무료 1회 색상 보정",
    lip_detail_pricing_item5:
      "100% 수입 유기농 잉크, 무연, 모든 입술 타입에 안전",
    lip_detail_pricing_note:
      "가격에는 일회용 멸균 도구 키트 및 VAT가 포함됩니다. 구체적인 가격은 입술 상태 및 색상 선택에 따라 다릅니다. 그룹 혜택 또는 현재 프로모션은 문의하세요.",
    lip_detail_faq_title: "자주 묻는 질문",
    lip_detail_faq_q1: "콜라겐 립 반영구는 아픈가요?",
    lip_detail_faq_a1:
      "프로세스는 전문 마취 사용, 부드러운 기법, 거의 통증 없음 및 최소 붓기.",
    lip_detail_faq_q2: "입술 색상은 얼마나 지속되나요?",
    lip_detail_faq_a2:
      "색상은 체질에 따라 정확하게 발색되고 18–36개월 지속되며, 장기적으로 자연스럽게 장밋빛 입술을 갖게 됩니다.",
    lip_detail_faq_q3: "입술이 완전히 회복되기까지 얼마나 걸리나요?",
    lip_detail_faq_a3:
      "일반적으로 처음 1–2일 동안 입술이 약간 부어오르고, 5–7일 후 색상이 안정화되고 입술이 부드럽고 자연스러워집니다.",
    lip_detail_faq_q4: "시술 후 휴식이 필요한가요?",
    lip_detail_faq_a4:
      "휴식이 필요 없으며 정상적으로 생활할 수 있습니다. 최고의 색상 발색을 위해 입술 케어 지침을 따르기만 하면 됩니다.",
    lip_detail_faq_q5: "자신만의 색상 톤을 선택할 수 있나요?",
    lip_detail_faq_a5:
      "물론입니다, 전문가가 피부 톤과 희망에 맞는 톤을 상담하여 자연스러운 색상 발색을 보장합니다.",
    lip_detail_faq_q6: "입술 색상이 퇴색하거나 조정이 필요한 경우는?",
    lip_detail_faq_a6:
      "04개월 내 무료 1회 색상 보정을 받을 수 있어 입술이 항상 아름답고 고르게 유지됩니다.",
    lip_detail_cta_title: "신선하고 젊은 입술을 갖고 싶으신가요?",
    lip_detail_cta_desc:
      "오늘 예약하여 루미 뷰티 전문가가 톤을 측정하고 개인 맞춤 케어 계획을 수립해 드립니다.",

    copyright: "© 2023 루미 뷰티. 모든 권리 보유.",
  },
};

const DEFAULT_LANGUAGE = "vi";
const PREVIEW_IMAGE_PATH = "images/lumi-preview-image.jpg";
const FAVICON_PATH = "icons/fav_icon.png";
let currentLanguage = (() => {
  try {
    const urlParams = new URL(window.location.href).searchParams;
    const queryLang = urlParams.get("lang");
    if (queryLang && queryLang in translations) {
      return queryLang;
    }

    const stored = localStorage.getItem("selectedLanguage");
    if (stored && stored in translations) {
      return stored;
    }
  } catch (error) {
    console.warn("Unable to access stored language preference:", error);
  }
  return DEFAULT_LANGUAGE;
})();

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
    const url = new URL(window.location.href);
    if (lang === DEFAULT_LANGUAGE) {
      url.searchParams.delete("lang");
    } else {
      url.searchParams.set("lang", lang);
    }
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

  setLanguage(currentLanguage);

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

function setLanguage(lang) {
  const fallbackDict = translations[DEFAULT_LANGUAGE] || {};
  const resolvedLang = translations[lang] ? lang : DEFAULT_LANGUAGE;
  const activeDict = translations[resolvedLang] || fallbackDict;
  currentLanguage = resolvedLang;

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
              "eyeliner-tattoo": "phun mí mở tròng",
              "lip-brightening": "khử thâm môi",
            },
            en: {
              "eyebrow-tattoo": "eyebrow PMU",
              "eyeliner-tattoo": "eyeliner PMU",
              "lip-brightening": "lip brightening",
            },
            ko: {
              "eyebrow-tattoo": "눈썹 반영구",
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

  try {
    const langUrl = buildLanguageUrl(resolvedLang);
    if (window.history && window.history.replaceState) {
      window.history.replaceState({}, "", langUrl);
    }
  } catch (error) {
    console.warn("Unable to update URL for language change:", error);
  }

  updateSeoLinks(resolvedLang);
  updateStructuredData(resolvedLang);

  try {
    localStorage.setItem("selectedLanguage", resolvedLang);
  } catch (error) {
    console.warn("Unable to persist language preference:", error);
  }
}

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
