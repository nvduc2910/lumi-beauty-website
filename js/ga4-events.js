/**
 * Google Analytics 4 (GA4) Event Tracking
 * Lumi Beauty - Comprehensive event tracking for beauty services website
 */

(function () {
  "use strict";

  // Check if gtag is available
  if (typeof gtag === "undefined") {
    console.warn("[GA4 Events] gtag not found. Make sure GA4 is loaded.");
    return;
  }

  // Helper function to send GA4 events
  function trackEvent(eventName, eventParams = {}) {
    if (typeof gtag !== "undefined") {
      gtag("event", eventName, eventParams);
      console.log("[GA4 Event]", eventName, eventParams);
    }
  }

  // ============================================
  // 1. EVENT NỀN TẢNG - PHẢI CÓ
  // ============================================

  // Page View - Enhanced tracking (avoid double tracking with GA4 default page_view)
  function trackPageView() {
    const pagePath = window.location.pathname;
    const pageTitle = document.title;
    const pageReferrer = document.referrer || "";

    trackEvent("page_view_enhanced", {
      page_path: pagePath,
      page_title: pageTitle,
      page_referrer: pageReferrer,
      page_location: window.location.href,
    });
  }

  // Scroll tracking - Track when user scrolls > 90%
  function initScrollTracking() {
    let scrollTracked = false;
    const scrollThreshold = 0.9; // 90%

    function trackScroll() {
      if (scrollTracked) return;

      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop =
        window.pageYOffset || document.documentElement.scrollTop;
      const scrollPercentage = (scrollTop + windowHeight) / documentHeight;

      if (scrollPercentage >= scrollThreshold) {
        scrollTracked = true;
        trackEvent("scroll", {
          scroll_depth: Math.round(scrollPercentage * 100),
          page_path: window.location.pathname,
        });
      }
    }

    let scrollTimer = null;
    window.addEventListener(
      "scroll",
      () => {
        clearTimeout(scrollTimer);
        scrollTimer = setTimeout(trackScroll, 100);
      },
      { passive: true }
    );
  }

  // View Search Results - Track when users search for services
  function trackSearchResults(searchQuery) {
    trackEvent("view_search_results", {
      search_term: searchQuery,
      page_path: window.location.pathname,
    });
  }

  // Expose search tracking function globally
  window.trackGASearchResults = trackSearchResults;

  // ============================================
  // 2. EVENT CHO TRANG DỊCH VỤ
  // ============================================

  // View Service - Track when user opens service detail page
  function trackViewService() {
    // Check if current page is a service page
    const isServicePage = window.location.pathname.includes("/services/");
    if (!isServicePage) return;

    const serviceName = document.title.split(" - ")[0] || "";
    const pagePath = window.location.pathname;

    trackEvent("view_service", {
      service_name: serviceName,
      page_path: pagePath,
      page_title: document.title,
    });
  }

  // View Pricing - Track when user views pricing table
  function initPricingTracking() {
    const pricingSection = document.querySelector(
      ".service-pricing, .pricing-section, .pricing-grid"
    );

    if (!pricingSection) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
            const serviceName = document.title.split(" - ")[0] || "";
            trackEvent("view_pricing", {
              service_name: serviceName,
              page_path: window.location.pathname,
            });
            observer.unobserve(entry.target); // Only track once
          }
        });
      },
      { threshold: 0.5 }
    );

    observer.observe(pricingSection);
  }

  // View Gallery - Track when user views before/after gallery
  function initGalleryTracking() {
    const gallerySections = document.querySelectorAll(
      ".service-before-after, .before-after-grid, .gallery-section"
    );

    if (!gallerySections.length) return;

    gallerySections.forEach((gallerySection) => {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
              const serviceName = document.title.split(" - ")[0] || "";
              trackEvent("view_gallery", {
                service_name: serviceName,
                page_path: window.location.pathname,
              });
              observer.unobserve(entry.target); // Only track once
            }
          });
        },
        { threshold: 0.5 }
      );

      observer.observe(gallerySection);
    });

    // Also track when user clicks on gallery images (lightbox opens)
    const galleryImages = document.querySelectorAll(
      ".before-after-item, .gallery-item img, [data-lightbox-image]"
    );

    galleryImages.forEach((image) => {
      image.addEventListener("click", () => {
        const serviceName = document.title.split(" - ")[0] || "";
        trackEvent("view_gallery", {
          service_name: serviceName,
          action: "image_click",
          page_path: window.location.pathname,
        });
      });
    });
  }

  // View Reviews - Track when user views customer reviews
  function initReviewsTracking() {
    const reviewsSection = document.querySelector(
      ".service-faq, .feedback-section, .reviews-section"
    );

    if (!reviewsSection) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
            const serviceName = document.title.split(" - ")[0] || "";
            trackEvent("view_reviews", {
              service_name: serviceName,
              page_path: window.location.pathname,
            });
            observer.unobserve(entry.target); // Only track once
          }
        });
      },
      { threshold: 0.5 }
    );

    observer.observe(reviewsSection);
  }

  // ============================================
  // 3. EVENT CHO CTA (RẤT QUAN TRỌNG)
  // ============================================

  // Click Call - Track phone call button clicks (only once per session)
  function initCallTracking() {
    const callLinks = document.querySelectorAll('a[href^="tel:"]');

    callLinks.forEach((link) => {
      link.addEventListener("click", () => {
        // Check if already tracked in this session
        if (link.dataset.gaTracked) return;

        const phoneNumber = link.getAttribute("href").replace("tel:", "");
        trackEvent("click_call", {
          phone_number: phoneNumber,
          page_path: window.location.pathname,
          page_title: document.title,
        });

        // Mark as tracked
        link.dataset.gaTracked = "true";
      });
    });
  }

  // Click Zalo - Track Zalo button clicks (only once per session)
  function initZaloTracking() {
    const zaloLinks = document.querySelectorAll(
      'a[href*="zalo.me"], a[href*="zalo"]'
    );

    zaloLinks.forEach((link) => {
      link.addEventListener("click", (e) => {
        // Check if already tracked in this session
        if (link.dataset.gaTracked) return;

        const zaloUrl = link.getAttribute("href");
        trackEvent("click_zalo", {
          page_path: window.location.pathname,
          page_title: document.title,
          link_url: zaloUrl,
        });

        // Mark as tracked
        link.dataset.gaTracked = "true";
      });
    });
  }

  // Click Messenger - Track Messenger/Facebook button clicks (only once per session)
  function initMessengerTracking() {
    const messengerLinks = document.querySelectorAll(
      'a[href*="facebook.com"], a[href*="messenger"], .floating-contact__item[href*="facebook"]'
    );

    messengerLinks.forEach((link) => {
      // Only track messenger/chat links, not all Facebook links
      const href = link.getAttribute("href") || "";
      if (
        href.includes("messenger") ||
        href.includes("facebook.com") ||
        link.textContent.toLowerCase().includes("messenger")
      ) {
        link.addEventListener("click", () => {
          // Check if already tracked in this session
          if (link.dataset.gaTracked) return;

          trackEvent("click_messenger", {
            page_path: window.location.pathname,
            page_title: document.title,
            link_url: href,
          });

          // Mark as tracked
          link.dataset.gaTracked = "true";
        });
      }
    });
  }

  // Click Book - Track booking button clicks (both popup and button)
  function initBookTracking() {
    const bookButtons = document.querySelectorAll(
      '[data-action="open-booking"], .btn-booking, button[class*="booking"], a[href*="booking"]'
    );

    bookButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const serviceName = document.title.split(" - ")[0] || "";
        const buttonText = button.textContent.trim();

        trackEvent("click_book", {
          page_path: window.location.pathname,
          page_title: document.title,
          service_name: serviceName,
          button_text: buttonText,
        });
      });
    });
  }

  // Click Map - Track map/address view clicks
  function initMapTracking() {
    // Track when user views the map iframe (on contact page)
    const mapIframe = document.querySelector(
      'iframe[src*="google.com/maps"], iframe[src*="maps"]'
    );

    if (mapIframe) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting && entry.intersectionRatio > 0.3) {
              trackEvent("click_map", {
                action: "view_map",
                page_path: window.location.pathname,
              });
              observer.unobserve(entry.target); // Only track once
            }
          });
        },
        { threshold: 0.3 }
      );

      observer.observe(mapIframe);
    }

    // Track clicks on address links or "view directions" buttons
    const addressLinks = document.querySelectorAll(
      'a[href*="maps"], a[href*="google.com"], [data-action="view-map"]'
    );

    addressLinks.forEach((link) => {
      const href = link.getAttribute("href") || "";
      if (href.includes("maps") || href.includes("google.com")) {
        link.addEventListener("click", () => {
          trackEvent("click_map", {
            action: "click_directions",
            page_path: window.location.pathname,
            link_url: href,
          });
        });
      }
    });
  }

  // ============================================
  // 4. EVENT ĐẶT LỊCH - QUAN TRỌNG NHẤT
  // ============================================

  // Track booking form interactions
  function initBookingFormTracking() {
    const bookingForm = document.querySelector(".booking-form");
    if (!bookingForm) return;

    let formStarted = false;
    let contactInfoAdded = false;
    let appointmentTimeAdded = false;

    // Track when form modal opens (begin_checkout)
    const bookingModal = document.getElementById("bookingModal");
    if (bookingModal) {
      // Function to track begin_checkout
      function trackBeginCheckout() {
        if (!formStarted) {
          formStarted = true;
          const serviceName = document.title.split(" - ")[0] || "";

          trackEvent("begin_checkout", {
            page_path: window.location.pathname,
            page_title: document.title,
            service_name: serviceName,
          });
        }
      }

      // Use MutationObserver with debounce to detect when modal opens
      let debounceTimer = null;
      const observer = new MutationObserver((mutations) => {
        // Debounce to avoid spam from animation classes
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
          // Early return if already tracked
          if (formStarted) return;

          mutations.forEach((mutation) => {
            if (mutation.type === "attributes") {
              const isOpen =
                bookingModal.classList.contains("is-open") &&
                bookingModal.getAttribute("aria-hidden") !== "true";

              if (isOpen) {
                trackBeginCheckout();
              }
            }
          });
        }, 150); // Debounce 150ms
      });

      observer.observe(bookingModal, {
        attributes: true,
        attributeFilter: ["aria-hidden", "class"],
        subtree: false,
      });

      // Also track on modal open buttons directly
      document
        .querySelectorAll('[data-action="open-booking"]')
        .forEach((button) => {
          button.addEventListener(
            "click",
            () => {
              // Small delay to ensure modal opens
              setTimeout(() => {
                trackBeginCheckout();
              }, 300);
            },
            { once: false }
          );
        });
    }

    // Track when user enters contact info (name or phone)
    const nameInput = bookingForm.querySelector(
      'input[name="name"], #bookingName'
    );
    const phoneInput = bookingForm.querySelector(
      'input[name="phone"], #bookingPhone'
    );

    function trackContactInfo() {
      if (contactInfoAdded) return;

      const name = nameInput ? nameInput.value.trim() : "";
      const phone = phoneInput ? phoneInput.value.trim() : "";

      if (name.length >= 2 || phone.length >= 8) {
        contactInfoAdded = true;
        trackEvent("add_contact_info", {
          page_path: window.location.pathname,
          has_name: name.length > 0,
          has_phone: phone.length > 0,
        });
      }
    }

    if (nameInput) {
      nameInput.addEventListener("blur", trackContactInfo);
      nameInput.addEventListener("input", () => {
        setTimeout(trackContactInfo, 500);
      });
    }

    if (phoneInput) {
      phoneInput.addEventListener("blur", trackContactInfo);
      phoneInput.addEventListener("input", () => {
        setTimeout(trackContactInfo, 500);
      });
    }

    // Track when user selects appointment time
    const timeInput = bookingForm.querySelector(
      'input[name="preferred_time"], #bookingTime'
    );

    if (timeInput) {
      timeInput.addEventListener("change", () => {
        if (!appointmentTimeAdded && timeInput.value) {
          appointmentTimeAdded = true;
          trackEvent("add_appointment_time", {
            page_path: window.location.pathname,
            preferred_time: timeInput.value,
          });
        }
      });
    }

    // Track form submission (book_appointment - conversion event)
    bookingForm.addEventListener("submit", (e) => {
      const formData = new FormData(bookingForm);
      const name = formData.get("name") || "";
      const phone = formData.get("phone") || "";
      const service = formData.get("service") || "";
      const preferredTime = formData.get("preferred_time") || "";

      // Track form validation errors
      const nameInput = bookingForm.querySelector(
        'input[name="name"], #bookingName'
      );
      const phoneInput = bookingForm.querySelector(
        'input[name="phone"], #bookingPhone'
      );

      if (nameInput && !nameInput.checkValidity()) {
        trackEvent("form_error", {
          form_type: "booking",
          error_field: "name",
          error_type: nameInput.validationMessage || "invalid",
          page_path: window.location.pathname,
        });
      }

      if (phoneInput && !phoneInput.checkValidity()) {
        trackEvent("form_error", {
          form_type: "booking",
          error_field: "phone",
          error_type: phoneInput.validationMessage || "invalid",
          page_path: window.location.pathname,
        });
      }

      // Only track conversion if form is valid
      if (bookingForm.checkValidity()) {
        // Track conversion event
        trackEvent("book_appointment", {
          value: 1,
          currency: "VND",
          page_path: window.location.pathname,
          page_title: document.title,
          service_name: service,
          has_phone: phone.length > 0,
          has_time: preferredTime.length > 0,
        });

        // Note: For Google Ads conversion tracking, add your conversion ID in GA4
        // or set up conversion events in GA4 admin panel
      }
    });
  }

  // ============================================
  // 5. EVENT CHO FORM LIÊN HỆ / TƯ VẤN
  // ============================================

  // Track contact/consultation forms
  function initContactFormTracking() {
    // Look for contact forms (not booking forms)
    const contactForms = document.querySelectorAll(
      ".contact-form:not(.booking-form), form[action*='contact'], form[action*='consultation']"
    );

    contactForms.forEach((form) => {
      let formStarted = false;
      let formCompleted = false;
      let filledFields = 0;
      const totalFields = form.querySelectorAll(
        "input[required], textarea[required], select[required]"
      ).length;

      // Track form start
      const formInputs = form.querySelectorAll("input, textarea, select");
      formInputs.forEach((input) => {
        input.addEventListener("focus", () => {
          if (!formStarted) {
            formStarted = true;
            trackEvent("form_start", {
              form_name: "contact_form",
              page_path: window.location.pathname,
            });
          }
        });
      });

      // Track form completion (all required fields filled)
      function checkFormCompletion() {
        if (formCompleted) return;

        const requiredInputs = form.querySelectorAll(
          "input[required], textarea[required], select[required]"
        );
        let completedFields = 0;

        requiredInputs.forEach((input) => {
          if (
            (input.type === "checkbox" && input.checked) ||
            (input.type !== "checkbox" && input.value.trim().length > 0)
          ) {
            completedFields++;
          }
        });

        if (completedFields === requiredInputs.length && !formCompleted) {
          formCompleted = true;
          trackEvent("form_complete", {
            form_name: "contact_form",
            page_path: window.location.pathname,
            fields_completed: completedFields,
          });
        }
      }

      formInputs.forEach((input) => {
        input.addEventListener("blur", checkFormCompletion);
        input.addEventListener("change", checkFormCompletion);
        input.addEventListener("input", () => {
          setTimeout(checkFormCompletion, 300);
        });
      });

      // Track form submission
      form.addEventListener("submit", (e) => {
        const formData = new FormData(form);
        const formName = formData.get("form-name") || "contact_form";

        // Track form validation errors
        if (!form.checkValidity()) {
          const invalidInputs = form.querySelectorAll(":invalid");
          invalidInputs.forEach((input) => {
            trackEvent("form_error", {
              form_type: "contact",
              form_name: formName,
              error_field: input.name || input.id || "unknown",
              error_type: input.validationMessage || "invalid",
              page_path: window.location.pathname,
            });
          });
          return; // Don't track conversion if form is invalid
        }

        // generate_lead event (standard GA4 lead event - only one needed)
        trackEvent("generate_lead", {
          value: 1,
          currency: "VND",
          page_path: window.location.pathname,
          page_title: document.title,
          form_name: formName,
        });
      });
    });
  }

  // ============================================
  // INITIALIZATION
  // ============================================

  function init() {
    // Wait for DOM to be ready
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", init);
      return;
    }

    // Enhanced page view tracking
    trackPageView();

    // Platform events
    initScrollTracking();

    // Service page events
    trackViewService();
    initPricingTracking();
    initGalleryTracking();
    initReviewsTracking();

    // CTA events
    initCallTracking();
    initZaloTracking();
    initMessengerTracking();
    initBookTracking();
    initMapTracking();

    // Booking form events
    initBookingFormTracking();

    // Contact form events
    initContactFormTracking();

    console.log("[GA4 Events] Initialized successfully");
  }

  // Start initialization
  init();

  // Expose utility functions globally if needed
  window.trackGA4Event = trackEvent;
})();
