// Smooth scrolling and animations for Lumi Beauty website

document.addEventListener("DOMContentLoaded", function () {
  // Initialize all animations and interactions
  initScrollAnimations();
  initMobileMenu();
  initContactForm();
  initBookingModal();
  initImageGallery();
  initCounterAnimations();
  initParallaxEffects();
  initLanguageSwitcher();
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
  const galleryItems = document.querySelectorAll(
    ".gallery-item img, .feedback-track img"
  );

  galleryItems.forEach((img) => {
    img.addEventListener("click", function () {
      createLightbox(this.src, this.alt);
    });
  });
}

function createLightbox(src, alt) {
  const lightbox = document.createElement("div");
  lightbox.className = "lightbox";
  lightbox.innerHTML = `
        <div class="lightbox-content">
            <span class="lightbox-close">&times;</span>
            <img src="${src}" alt="${alt}">
        </div>
    `;

  document.body.appendChild(lightbox);

  // Close lightbox
  const closeBtn = lightbox.querySelector(".lightbox-close");
  closeBtn.addEventListener("click", () => {
    document.body.removeChild(lightbox);
  });

  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) {
      document.body.removeChild(lightbox);
    }
  });

  // Add lightbox styles
  const style = document.createElement("style");
  style.textContent = `
        .lightbox {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.9);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            animation: fadeIn 0.3s ease;
        }
        .lightbox-content {
            position: relative;
            max-width: 100%;
            max-height: 100%;
            padding: 40px;
        }
        .lightbox-content img {
            max-width: calc(100vw - 80px);
            max-height: calc(100vh - 80px);
            width: auto;
            height: auto;
            border-radius: 12px;
            object-fit: contain;
        }
        .lightbox-close {
            position: absolute;
            top: 10px;
            right: 10px;
            color: white;
            font-size: 30px;
            cursor: pointer;
            background: rgba(0, 0, 0, 0.5);
            width: 40px;
            height: 40px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
    `;
  document.head.appendChild(style);
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

  if (heroImage) {
    window.addEventListener("scroll", () => {
      const scrolled = window.pageYOffset;
      const rate = scrolled * -0.5;

      heroImage.style.transform = `translateY(${rate}px)`;

      overlayItems.forEach((item, index) => {
        const itemRate = scrolled * (-0.3 - index * 0.1);
        item.style.transform = `translateY(${itemRate}px)`;
      });
    });
  }
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

// Loading animation
window.addEventListener("load", () => {
  document.body.classList.add("loaded");
});

// Add loading styles
const loadingStyle = document.createElement("style");
loadingStyle.textContent = `
    body:not(.loaded) {
        overflow: hidden;
    }
    
    body:not(.loaded)::before {
        content: '';
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: white;
        z-index: 9999;
        animation: fadeOut 0.5s ease 1s forwards;
    }
    
    @keyframes fadeOut {
        to {
            opacity: 0;
            visibility: hidden;
        }
    }
`;
document.head.appendChild(loadingStyle);

// Language switching functionality
const translations = {
  vi: {
    // General
    page_title: "Lumi Beauty - Phun Xăm Thẩm Mỹ Đẹp Tự Nhiên Tại Đà Nẵng - Chuyên Phun Mày Môi Mí Chuyên Nghiệp",
    close_modal: "Đóng",
    floating_contact_zalo: "Chat Zalo",
    floating_contact_facebook: "Chat Facebook",
    floating_contact_tiktok: "TikTok",

    // Navigation
    beauty_services: "Dịch vụ làm đẹp",
    beauty_guide: "Cẩm nang làm đẹp",
    contact: "Liên hệ",
    offers: "Cảm nhận khách hàng",
    book_now: "ĐẶT LỊCH NGAY",

    // Hero Section
    main_title: "PHUN XĂM THẨM MỸ",
    natural_beauty: "Đẹp TỰ NHIÊN",
    enhance_features: "Tôn nét riêng của bạn",
    hero_description:
      "Lumi Beauty chuyên về phun mày môi với công nghệ hiện đại và tay nghề cao, đảm bảo kết quả tự nhiên và bền đẹp. Chúng tôi cam kết mang đến cho bạn vẻ đẹp hoàn hảo với quy trình chuẩn y khoa.",
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
    how_can_help: "Lumi Beauty có thể giúp được gì cho bạn?",
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
    lip_tattoo_title: "Phun Môi Tự Nhiên",
    lip_tattoo_benefit1: "Màu môi chuẩn đẹp từ 2-3 năm",
    lip_tattoo_benefit2: "Giúp môi đều màu, giảm thâm sạm",
    lip_tattoo_benefit3: "Tiết kiệm thời gian trang điểm mỗi ngày",
    eyebrow_tattoo_title:
      "Phun Mày Tự Nhiên – Nét Đẹp Hài Hòa, Thần Thái Rạng Ngời",
    eyebrow_tattoo_benefit1: "Không đau, không sưng",
    eyebrow_tattoo_benefit2: "Lên màu đều, bền 2-3 năm",
    eyebrow_tattoo_benefit3: "Dáng mày được đo tỉ lệ vàng gương mặt",
    lip_removal_title: "Khử Thâm Môi – Trả Lại Sắc Môi Tươi Hồng Tự Nhiên",
    lip_removal_benefit1: "Loại bỏ thâm sạm hiệu quả",
    lip_removal_benefit2: "Màu môi tự nhiên, tươi sáng",
    lip_removal_benefit3: "An toàn tuyệt đối cho da môi",
    discover_more: "KHÁM PHÁ THÊM",

    // Why Choose Us
    why_choose_title: "Vì Sao Hàng Ngàn Khách Hàng Tin Chọn Lumi Beauty?",
    medical_process: "Quy Trình Chuẩn Y Khoa",
    medical_process_desc: "Không Đau, Không Sưng, Hồi Màu Nhanh",
    skilled_technicians: "Kỹ Thuật Viên Tay Nghề Cao",
    skilled_technicians_desc: "Tận Tâm Trong Từng Đường Nét",
    warranty: "Bảo Hành & Dặm Miễn Phí",
    warranty_desc: "Cam Kết Hài Lòng Tuyệt Đối",
    organic_pigments: "Mực Phun Hữu Cơ Cao Cấp",
    organic_pigments_desc: "Màu Chuẩn, Bền, An Toàn Tuyệt Đối",

    // Contact Methods
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
    footer_facebook: "Facebook: facebook.com/profile.php?id=61579821760714",
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

    // Navigation
    beauty_services: "Beauty Services",
    beauty_guide: "Beauty Guide",
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
    how_can_help: "What can Lumi Beauty help you with?",
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
    lip_tattoo_title: "Natural Lip Tattoo - Natural as if not done",
    lip_tattoo_benefit1: "Standard beautiful lip color for 1-3 years",
    lip_tattoo_benefit2: "Helps even lip color, reduces dark spots",
    lip_tattoo_benefit3: "Saves daily makeup time",
    eyebrow_tattoo_title:
      "Natural Eyebrow Tattoo – Harmonious Beauty, Radiant Spirit",
    eyebrow_tattoo_benefit1: "No pain, no swelling",
    eyebrow_tattoo_benefit2: "Even color, lasts 2-3 years",
    eyebrow_tattoo_benefit3:
      "Eyebrow shape measured to golden ratio of the face",
    lip_removal_title:
      "Lip Dark Spot Removal – Restoring Natural Pink Lip Color",
    lip_removal_benefit1: "Effectively removes dark spots",
    lip_removal_benefit2: "Natural, bright lip color",
    lip_removal_benefit3: "Absolutely safe for lip skin",
    discover_more: "DISCOVER MORE",

    // Why Choose Us
    why_choose_title: "Why Do Thousands of Customers Trust Lumi Beauty?",
    medical_process: "Medical Standard Procedure",
    medical_process_desc: "No Pain, No Swelling, Fast Color Recovery",
    skilled_technicians: "Highly Skilled Technicians",
    skilled_technicians_desc: "Dedicated in Every Stroke",
    warranty: "Warranty & Free Touch-ups",
    warranty_desc: "Absolute Satisfaction Guarantee",
    organic_pigments: "Premium Organic Pigments",
    organic_pigments_desc: "Standard Color, Durable, Absolutely Safe",

    // Contact Methods
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
    footer_facebook: "Facebook: facebook.com/profile.php?id=61579821760714",
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

    copyright: "© 2023 Lumi Beauty. All rights reserved.",
  },

  ko: {
    // General
    page_title: "루미 뷰티 - 자연스러운 입술 & 눈썹 타투",
    close_modal: "닫기",
    floating_contact_zalo: "자লো 채팅",
    floating_contact_facebook: "페이스북 채팅",
    floating_contact_tiktok: "틱톡",

    // Navigation
    beauty_services: "뷰티 서비스",
    beauty_guide: "뷰티 가이드",
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
    how_can_help: "루미 뷰티가 어떻게 도와드릴까요?",
    book_description: "오늘 예약하여 상담을 받고 매력적인 혜택을 받으세요",
    contact_description:
      "피드백이나 상담이 필요한 질문이 있으시면 즉시 연락해 주세요",
    book_appointment: "오늘 예약하기",
    want_to_book: "예약하고 싶습니다",
    contact_us: "연락처",
    need_consultation: "상담이 필요합니다",

    // Services
    our_services: "우리 서비스",
    lip_tattoo_title: "자연스러운 입술 타투 - 타투하지 않은 것처럼 자연스럽게",
    lip_tattoo_benefit1: "1-3년간 표준 아름다운 입술 색상",
    lip_tattoo_benefit2: "입술 색상을 고르게 하고 어두운 반점을 줄입니다",
    lip_tattoo_benefit3: "매일 메이크업 시간을 절약합니다",
    eyebrow_tattoo_title:
      "자연스러운 눈썹 타투 – 조화로운 아름다움, 빛나는 정신",
    eyebrow_tattoo_benefit1: "통증 없음, 부종 없음",
    eyebrow_tattoo_benefit2: "고른 색상, 2-3년 지속",
    eyebrow_tattoo_benefit3: "얼굴의 황금 비율에 맞춰 측정된 눈썹 모양",
    lip_removal_title: "입술 어두운 반점 제거 – 자연스러운 핑크 입술 색상 복원",
    lip_removal_benefit1: "어두운 반점을 효과적으로 제거",
    lip_removal_benefit2: "자연스럽고 밝은 입술 색상",
    lip_removal_benefit3: "입술 피부에 절대적으로 안전",
    discover_more: "더 알아보기",

    // Why Choose Us
    why_choose_title: "수천 명의 고객이 루미 뷰티를 신뢰하는 이유는?",
    medical_process: "의료 표준 절차",
    medical_process_desc: "통증 없음, 부종 없음, 빠른 색상 회복",
    skilled_technicians: "고도의 기술을 가진 기술자",
    skilled_technicians_desc: "모든 획에 정성을 다합니다",
    warranty: "보증 & 무료 터치업",
    warranty_desc: "절대적인 만족 보장",
    organic_pigments: "프리미엄 유기 색소",
    organic_pigments_desc: "표준 색상, 내구성, 절대적으로 안전",

    // Contact Methods
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
    footer_facebook: "페이스북: facebook.com/profile.php?id=61579821760714",
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

    copyright: "© 2023 루미 뷰티. 모든 권리 보유.",
  },
};

const DEFAULT_LANGUAGE = "vi";
let currentLanguage = (() => {
  try {
    const stored = localStorage.getItem("selectedLanguage");
    if (stored && stored in translations) {
      return stored;
    }
  } catch (error) {
    console.warn("Unable to access stored language preference:", error);
  }
  return DEFAULT_LANGUAGE;
})();

function t(key) {
  const fallbackDict = translations[DEFAULT_LANGUAGE] || {};
  const activeDict = translations[currentLanguage] || fallbackDict;
  return (
    (activeDict && activeDict[key]) ||
    (fallbackDict && fallbackDict[key]) ||
    key
  );
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

    if (element.hasAttribute("data-translate-html")) {
      element.innerHTML = translation;
    } else {
      element.textContent = translation;
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

  if (translations[resolvedLang] && translations[resolvedLang].page_title) {
    document.title = translations[resolvedLang].page_title;
  }

  try {
    localStorage.setItem("selectedLanguage", resolvedLang);
  } catch (error) {
    console.warn("Unable to persist language preference:", error);
  }
}
