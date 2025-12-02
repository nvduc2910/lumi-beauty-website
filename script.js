// Smooth scrolling and animations for Lumi Beauty website

// Zalo Contact Modal handling
function initZaloContactModal() {
  const modal = document.getElementById("zaloContactModal");
  if (!modal) return;

  const openLinks = document.querySelectorAll("[data-open-zalo-modal], [data-action='open-zalo']");
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
    const currentLang = getCurrentLanguage();
    const serviceName =
      serviceMap[currentLang] && serviceMap[currentLang][serviceKey]
        ? serviceMap[currentLang][serviceKey]
        : null;

    if (!serviceName) return;

    // Use hardcoded descriptions based on language
    const descriptions = {
      vi: "Bạn đang quan tâm tới dịch vụ {service}. Vui lòng liên hệ với chúng tôi qua Zalo để được tư vấn chi tiết.",
      en: "You are interested in {service} service. Please contact us via Zalo for detailed consultation.",
      ko: "{service} 서비스에 관심이 있으시군요. 자세한 상담을 위해 Zalo로 연락해 주세요.",
    };

    let desc = descriptions[currentLang] || descriptions.vi;
    desc = desc.replace("{service}", serviceName);
    descElement.textContent = desc;
  };

  const openModal = (event, linkElement) => {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    // Detect service name from the link or page context
    const href = linkElement
      ? linkElement.getAttribute("href") || linkElement.textContent.trim()
      : null;
    
    // Also check current page URL for service context
    const currentUrl = window.location.pathname;
    let serviceKey = getServiceKey(href || currentUrl);
    
    // If no service key found, try to detect from page context (for blog pages)
    if (!serviceKey && currentUrl.includes("khu-tham-moi")) {
      serviceKey = "lip-brightening";
    }

    // Update modal description with service name
    if (serviceKey) {
      updateModalDescription(serviceKey);
    } else if (descElement) {
      // Default description if no service detected
      const currentLang = getCurrentLanguage();
      const descriptions = {
        vi: "Bạn đang quan tâm tới dịch vụ Khử thâm môi cho nam. Vui lòng liên hệ với chúng tôi qua Zalo để được tư vấn chi tiết.",
        en: "You are interested in Lip Brightening for Men service. Please contact us via Zalo for detailed consultation.",
        ko: "남성 입술 색소 제거 서비스에 관심이 있으시군요. 자세한 상담을 위해 Zalo로 연락해 주세요.",
      };
      descElement.textContent = descriptions[currentLang] || descriptions.vi;
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
  // Load header and footer components first
  loadComponents();

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
  initBlogScroller();
  initHeroVideo();
  initLanguageSwitcher();
  initNavigationLinks();
});

// Load header and footer components
function loadComponents() {
  const currentLang = getCurrentLanguage();

  // Check if we're using file:// protocol (won't work with fetch)
  if (window.location.protocol === "file:") {
    console.warn(
      "⚠️ File:// protocol detected. Components need HTTP server to load."
    );
    console.warn("💡 Please use a local server:");
    console.warn("   python3 -m http.server 8000");
    console.warn("   Then open: http://localhost:8000/vi/index.html");

    const headerPlaceholder = document.getElementById("header-placeholder");
    const footerPlaceholder = document.getElementById("footer-placeholder");

    if (headerPlaceholder) {
      headerPlaceholder.innerHTML = `
        <div style="background: #fff3cd; border: 2px solid #ffc107; padding: 20px; margin: 20px; border-radius: 8px;">
          <h3 style="margin: 0 0 10px 0; color: #856404;">⚠️ Local Development Notice</h3>
          <p style="margin: 0; color: #856404;">
            Components require a local server. Please run:<br>
            <code style="background: #fff; padding: 4px 8px; border-radius: 4px; display: inline-block; margin-top: 8px;">python3 -m http.server 8000</code><br>
            Then open: <code style="background: #fff; padding: 4px 8px; border-radius: 4px;">http://localhost:8000/vi/index.html</code>
          </p>
        </div>
      `;
    }

    if (footerPlaceholder) {
      footerPlaceholder.innerHTML = `
        <div style="background: #fff3cd; border: 2px solid #ffc107; padding: 20px; margin: 20px; border-radius: 8px; text-align: center;">
          <p style="margin: 0; color: #856404;">⚠️ Footer component requires HTTP server</p>
        </div>
      `;
    }
    return;
  }

  // Determine base path for components based on current file location
  let componentBasePath = "../components/";
  const path = window.location.pathname;
  const pathParts = path.split("/").filter((p) => p);

  // If we're in a subdirectory (services, blogs), need to go up one more level
  if (
    pathParts.length > 2 &&
    (pathParts[pathParts.length - 2] === "services" ||
      pathParts[pathParts.length - 2] === "blogs")
  ) {
    componentBasePath = "../../components/";
  }

  // Load header
  const headerPlaceholder = document.getElementById("header-placeholder");
  if (headerPlaceholder) {
    const headerPath = `${componentBasePath}header-${currentLang}.html`;
    console.log(
      `[Components] Loading header for language "${currentLang}" from: ${headerPath}`
    );
    fetch(headerPath)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.text();
      })
      .then((html) => {
        if (html && html.trim()) {
          console.log(
            `[Components] Header loaded successfully for "${currentLang}"`
          );
          headerPlaceholder.outerHTML = html;
          // Re-initialize after header is loaded
          setTimeout(() => {
            if (typeof initLanguageSwitcher === "function") {
              initLanguageSwitcher();
            }
            if (typeof initNavigationLinks === "function") {
              initNavigationLinks();
            }
            if (typeof initMobileMenu === "function") {
              initMobileMenu();
            }
            if (typeof initServicesDropdown === "function") {
              initServicesDropdown();
            }
            if (typeof initBookingModal === "function") {
              initBookingModal();
            }
            // Dispatch event for other scripts
            document.dispatchEvent(new CustomEvent("componentsLoaded"));
          }, 10);
        } else {
          console.warn(
            `[Components] Header HTML is empty for "${currentLang}"`
          );
        }
      })
      .catch((error) => {
        console.error(
          `[Components] Failed to load header from ${headerPath}:`,
          error
        );
        headerPlaceholder.innerHTML = `<p style="color: red; padding: 20px;">Error loading header (${currentLang}): ${error.message}</p>`;
      });
  } else {
    console.warn("[Components] Header placeholder not found in DOM");
  }

  // Load footer
  const footerPlaceholder = document.getElementById("footer-placeholder");
  if (footerPlaceholder) {
    const footerPath = `${componentBasePath}footer-${currentLang}.html`;
    console.log(
      `[Components] Loading footer for language "${currentLang}" from: ${footerPath}`
    );
    fetch(footerPath)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.text();
      })
      .then((html) => {
        if (html && html.trim()) {
          console.log(
            `[Components] Footer loaded successfully for "${currentLang}"`
          );
          footerPlaceholder.outerHTML = html;
          // Fix footer links after loading
          setTimeout(() => {
            if (typeof initNavigationLinks === "function") {
              initNavigationLinks();
            }
          }, 10);
        } else {
          console.warn(
            `[Components] Footer HTML is empty for "${currentLang}"`
          );
        }
      })
      .catch((error) => {
        console.error(
          `[Components] Failed to load footer from ${footerPath}:`,
          error
        );
        footerPlaceholder.innerHTML = `<p style="color: red; padding: 20px;">Error loading footer (${currentLang}): ${error.message}</p>`;
      });
  } else {
    console.warn("[Components] Footer placeholder not found in DOM");
  }
}

// Listen for components loaded event (for blog posts with dynamic header/footer)
document.addEventListener("componentsLoaded", function () {
  // Components loaded - any initialization can go here if needed
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
    // Remove any existing event listeners by cloning
    const newMobileToggle = mobileToggle.cloneNode(true);
    mobileToggle.parentNode.replaceChild(newMobileToggle, mobileToggle);

    newMobileToggle.addEventListener("click", function (e) {
      e.stopPropagation();
      nav.classList.toggle("active");
      newMobileToggle.classList.toggle("active");
    });

    // Close menu when clicking on regular links (not dropdown parent)
    const navLinks = document.querySelectorAll(
      ".nav-list > li > a:not(.nav-link-with-dropdown)"
    );
    navLinks.forEach((link) => {
      link.addEventListener("click", () => {
        nav.classList.remove("active");
        newMobileToggle.classList.remove("active");
      });
    });

    // Close menu when clicking on dropdown submenu links
    const dropdownLinks = document.querySelectorAll(".nav-dropdown-menu a");
    dropdownLinks.forEach((link) => {
      link.addEventListener("click", () => {
        nav.classList.remove("active");
        newMobileToggle.classList.remove("active");
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

  // Remove any existing event listeners by cloning and replacing
  const newDropdownLink = dropdownLink.cloneNode(true);
  dropdownLink.parentNode.replaceChild(newDropdownLink, dropdownLink);

  // Toggle dropdown on click (for mobile/touch devices)
  newDropdownLink.addEventListener("click", function (e) {
    // Check if we're on mobile or if it's a touch device
    const isMobile = window.innerWidth <= 768 || "ontouchstart" in window;

    // Always prevent default for anchor links to avoid scrolling
    if (
      this.getAttribute("href") &&
      this.getAttribute("href").startsWith("#")
    ) {
      e.preventDefault();
    }

    if (isMobile) {
      e.stopPropagation();
      dropdownItem.classList.toggle("active");
    }
    // On desktop, dropdown opens on hover (CSS handles it)
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
        // Get language-specific messages
        const lang = getCurrentLanguage();
        const messages = {
          vi: {
            sending: "Đang gửi...",
            success: "Cảm ơn bạn! Chúng tôi sẽ liên hệ với bạn sớm nhất.",
            error:
              "Có lỗi xảy ra. Vui lòng thử lại hoặc liên hệ trực tiếp qua Zalo.",
          },
          en: {
            sending: "Sending...",
            success: "Thank you! We will contact you soon.",
            error:
              "An error occurred. Please try again or contact us directly via Zalo.",
          },
          ko: {
            sending: "전송 중...",
            success: "감사합니다! 곧 연락드리겠습니다.",
            error:
              "오류가 발생했습니다. 다시 시도하거나 Zalo로 직접 연락해 주세요.",
          },
        };

        const msg = messages[lang] || messages.vi;

        responseEl.textContent = msg.sending;
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

        responseEl.textContent = msg.success;
        form.reset();

        setTimeout(() => {
          closeModal();
        }, 2000);
      } catch (error) {
        console.error("Booking form submit error:", error);
        const lang = getCurrentLanguage();
        const messages = {
          vi: {
            error:
              "Có lỗi xảy ra. Vui lòng thử lại hoặc liên hệ trực tiếp qua Zalo.",
          },
          en: {
            error:
              "An error occurred. Please try again or contact us directly via Zalo.",
          },
          ko: {
            error:
              "오류가 발생했습니다. 다시 시도하거나 Zalo로 직접 연락해 주세요.",
          },
        };
        const msg = messages[lang] || messages.vi;
        responseEl.textContent = msg.error;
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
  const href = window.location.href;

  // Split path into parts and find language folder
  // This works for both file:// and http/https protocols
  const pathParts = path.split("/").filter((p) => p);

  // Look for language folder in the path
  for (let i = 0; i < pathParts.length; i++) {
    if (pathParts[i] === "vi") {
      return "vi";
    } else if (pathParts[i] === "en") {
      return "en";
    } else if (pathParts[i] === "ko") {
      return "ko";
    }
  }

  // Fallback: check if path starts with language prefix (for http/https)
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
// Helper function to get the correct relative path based on current file location
function getRelativePath(targetPath) {
  const path = window.location.pathname;
  const pathParts = path.split("/").filter((p) => p);
  const lang = getCurrentLanguageFromPath();

  // Determine depth: root level or subdirectory (services, blogs)
  const isSubdirectory =
    pathParts.length > 2 &&
    (pathParts[pathParts.length - 2] === "services" ||
      pathParts[pathParts.length - 2] === "blogs");

  // If target path is already absolute or external, return as is
  if (
    targetPath.startsWith("http://") ||
    targetPath.startsWith("https://") ||
    targetPath.startsWith("//") ||
    targetPath.startsWith("#")
  ) {
    return targetPath;
  }

  // If target path starts with /, check if it already has a language prefix
  if (targetPath.startsWith("/")) {
    // Check if path already starts with a language prefix (/vi/, /en/, /ko/)
    if (
      targetPath.startsWith("/vi/") ||
      targetPath.startsWith("/en/") ||
      targetPath.startsWith("/ko/")
    ) {
      // Already has language prefix, return as is
      return targetPath;
    }
    // Remove leading slash and add language prefix
    const relativePath = targetPath.substring(1);
    return `/${lang}/${relativePath}`;
  }

  // Handle relative paths
  // If we're in subdirectory and target is root level file, go up one level
  if (
    isSubdirectory &&
    !targetPath.startsWith("../") &&
    !targetPath.includes("/")
  ) {
    // Root level file from subdirectory
    return `../${targetPath}`;
  }

  // If target is services/ or blogs/ from root, add ../ if we're in subdirectory
  if (
    isSubdirectory &&
    (targetPath.startsWith("services/") || targetPath.startsWith("blogs/"))
  ) {
    return `../${targetPath}`;
  }

  // If already has ../, it should be correct
  if (targetPath.startsWith("../")) {
    return targetPath;
  }

  // Default: return as is (should work for same-level files)
  return targetPath;
}

function initNavigationLinks() {
  const lang = getCurrentLanguageFromPath();
  const basePath = getLanguageBasePath();

  // Fix logo link
  const logoLink = document.querySelector(".logo a");
  if (logoLink) {
    const logoHref = logoLink.getAttribute("href");
    if (logoHref === "/" || logoHref === "" || logoHref === "index.html") {
      logoLink.setAttribute("href", getRelativePath("index.html"));
    } else if (logoHref.startsWith("/") && !logoHref.startsWith(`/${lang}/`)) {
      logoLink.setAttribute("href", getRelativePath(logoHref));
    } else if (!logoHref.startsWith("http") && !logoHref.startsWith("#")) {
      logoLink.setAttribute("href", getRelativePath(logoHref));
    }
  }

  // Fix icon/image paths in header and footer
  const allImages = document.querySelectorAll(
    "header img[src], footer img[src]"
  );
  allImages.forEach((img) => {
    const src = img.getAttribute("src");
    if (src && !src.startsWith("http") && !src.startsWith("data:")) {
      // Extract icon filename
      let iconName = null;
      if (src.includes("icons/")) {
        iconName = src.split("icons/")[1];
      } else if (img.hasAttribute("data-icon-path")) {
        iconName = img.getAttribute("data-icon-path");
      }

      if (iconName) {
        const path = window.location.pathname;
        const pathParts = path.split("/").filter((p) => p);
        const isSubdirectory =
          pathParts.length > 2 &&
          (pathParts[pathParts.length - 2] === "services" ||
            pathParts[pathParts.length - 2] === "blogs");
        if (isSubdirectory) {
          img.setAttribute("src", `../../icons/${iconName}`);
        } else {
          img.setAttribute("src", `../icons/${iconName}`);
        }
      }
    }
  });

  // Smooth scroll for anchor links on the same page (but NOT for navigation menu links)
  document
    .querySelectorAll('a[href^="#"]:not(.nav a):not(.nav-dropdown-menu a)')
    .forEach((anchor) => {
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

  // For navigation menu anchor links, prevent default scroll behavior
  document
    .querySelectorAll(
      'header .nav a[href^="#"], header .nav-dropdown-menu a[href^="#"]'
    )
    .forEach((anchor) => {
      anchor.addEventListener("click", function (e) {
        // Just prevent default scroll, don't scroll
        e.preventDefault();
        // Update URL hash without scrolling
        const href = this.getAttribute("href");
        if (window.history && window.history.replaceState) {
          window.history.replaceState(null, null, href);
        }
      });
    });

  // Fix all navigation links in header
  const navLinks = document.querySelectorAll(
    "header .nav a[href], header .nav-dropdown-menu a[href]"
  );
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

    // Skip links that already have the correct language prefix
    if (
      href &&
      (href.startsWith(`/${lang}/`) ||
        href.startsWith("/vi/") ||
        href.startsWith("/en/") ||
        href.startsWith("/ko/"))
    ) {
      return;
    }

    // Fix relative links
    if (href && !href.startsWith("http") && !href.startsWith("#")) {
      link.setAttribute("href", getRelativePath(href));
    }
  });

  // Fix all footer links
  const footerLinks = document.querySelectorAll("footer a[href]");
  footerLinks.forEach((link) => {
    const href = link.getAttribute("href");

    // Skip external links and anchor links
    if (
      !href ||
      href.startsWith("http://") ||
      href.startsWith("https://") ||
      href.startsWith("//") ||
      href.startsWith("#") ||
      href.startsWith("tel:") ||
      href.startsWith("mailto:")
    ) {
      return;
    }

    // Skip links that already have the correct language prefix
    if (
      href &&
      (href.startsWith(`/${lang}/`) ||
        href.startsWith("/vi/") ||
        href.startsWith("/en/") ||
        href.startsWith("/ko/"))
    ) {
      return;
    }

    // Fix relative links in footer
    link.setAttribute("href", getRelativePath(href));
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

// Constants for SEO and structured data
const PREVIEW_IMAGE_PATH = "images/lumi-preview-image.jpg";
const FAVICON_PATH = "icons/fav_icon.png";

// Get current language - this will be recalculated when needed
// We'll use a function to get it dynamically instead of a constant
function getCurrentLanguage() {
  return getCurrentLanguageFromPath();
}

// Language switcher functionality
function initLanguageSwitcher() {
  const dropdownBtn = document.getElementById("langDropdownBtn");
  const dropdownMenu = document.getElementById("langDropdownMenu");
  const langOptions = document.querySelectorAll(".lang-option");

  if (!dropdownBtn || !dropdownMenu) {
    return;
  }

  // Get current language dynamically
  const currentLanguage = getCurrentLanguage();

  // Language code mapping
  const langCodes = {
    vi: "VN",
    en: "EN",
    ko: "KR",
  };

  // Set the correct language code in the dropdown button
  const codeSpan = dropdownBtn.querySelector(".lang-code");
  if (codeSpan && langCodes[currentLanguage]) {
    codeSpan.textContent = langCodes[currentLanguage];
  }

  // Set active class on the correct language option
  langOptions.forEach((option) => {
    const lang = option.getAttribute("data-lang");
    if (lang === currentLanguage) {
      option.classList.add("active");
    } else {
      option.classList.remove("active");
    }
  });

  // Save current language to localStorage
  try {
    localStorage.setItem("selectedLanguage", currentLanguage);
  } catch (error) {
    console.warn("Unable to save language preference:", error);
  }

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
      const currentLang = getCurrentLanguage();
      if (!lang || lang === currentLang) {
        dropdownMenu.classList.remove("active");
        dropdownBtn.classList.remove("active");
        return;
      }

      // Build URL for the selected language
      const langUrl = buildLanguageUrl(lang);
      if (langUrl && langUrl !== window.location.href) {
        window.location.href = langUrl;
      }
    });
  });
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
