// Smooth scrolling and animations for Lumi Beauty website

document.addEventListener("DOMContentLoaded", function () {
  // Initialize all animations and interactions
  initScrollAnimations();
  initMobileMenu();
  initContactForm();
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
        showNotification(
          "Cảm ơn bạn! Chúng tôi sẽ liên hệ lại sớm nhất có thể.",
          "success"
        );
        phoneInput.value = "";

        // Here you would typically send the data to a server
        console.log("Phone number submitted:", phoneNumber);
      } else {
        showNotification("Vui lòng nhập số điện thoại của bạn.", "error");
      }
    });
  }
}

// Image gallery with lightbox effect
function initImageGallery() {
  const galleryItems = document.querySelectorAll(".gallery-item img");

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
            max-width: 90%;
            max-height: 90%;
        }
        .lightbox-content img {
            width: 100%;
            height: auto;
            border-radius: 12px;
        }
        .lightbox-close {
            position: absolute;
            top: -40px;
            right: 0;
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
            z-index: 999;
        }
        
        .nav.active {
            display: flex;
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
    // Navigation
    beauty_services: "Dịch vụ làm đẹp",
    beauty_guide: "Cẩm nang làm đẹp",
    contact: "Liên hệ",
    offers: "Cảm nhận khách hàng",
    book_now: "ĐẶT LỊCH NGAY",

    // Hero Section
    main_title: "PHUN MÔI MÀY",
    natural_beauty: "Đẹp TỰ NHIÊN",
    enhance_features: "Tôn nét riêng của bạn",
    hero_description:
      "Lumi Beauty chuyên về phun môi mày với công nghệ hiện đại, đảm bảo kết quả tự nhiên và bền đẹp. Chúng tôi cam kết mang đến cho bạn vẻ đẹp hoàn hảo với quy trình chuẩn y khoa.",
    contact_now: "LIÊN HỆ NGAY",

    // Feature Tags
    no_pain: "KHÔNG ĐAU",
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
    lip_tattoo_title: "Phun Môi Tự Nhiên - Tự Nhiên Như Không Phun",
    lip_tattoo_benefit1: "Màu môi chuẩn đẹp từ 1-3 năm",
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

    // Contact Form
    contact_form_title:
      "Đừng ngần ngại - để lại số điện thoại, chúng tôi sẽ giúp bạn chọn dịch vụ phù hợp nhất với khuôn mặt của mình.",
    phone_placeholder: "Nhập số điện thoại của bạn",
    send: "GỬI ĐI",

    // Gallery
    real_images: "Hình Ảnh Thực Tế",
    lip_tattoo_label: "Phun xăm môi",
    eyebrow_tattoo_label: "Phun mày",

    // Testimonials
    customer_reviews: "Đánh Giá Từ Khách Hàng",
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
    copyright: "© 2023 Lumi Beauty. All rights reserved.",
  },

  en: {
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

    // Contact Form
    contact_form_title:
      "Don't hesitate - leave your phone number, we will help you choose the most suitable service for your face.",
    phone_placeholder: "Enter your phone number",
    send: "SEND",

    // Gallery
    real_images: "Real Images",
    lip_tattoo_label: "Lip Tattoo",
    eyebrow_tattoo_label: "Eyebrow Tattoo",

    // Testimonials
    customer_reviews: "Customer Reviews",
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
    copyright: "© 2023 Lumi Beauty. All rights reserved.",
  },

  ko: {
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

    // Contact Form
    contact_form_title:
      "주저하지 마세요 - 전화번호를 남겨주시면 얼굴에 가장 적합한 서비스를 선택하는 데 도움을 드리겠습니다.",
    phone_placeholder: "전화번호를 입력하세요",
    send: "보내기",

    // Gallery
    real_images: "실제 이미지",
    lip_tattoo_label: "입술 타투",
    eyebrow_tattoo_label: "눈썹 타투",

    // Testimonials
    customer_reviews: "고객 리뷰",
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
    copyright: "© 2023 루미 뷰티. 모든 권리 보유.",
  },
};

// Language switching functionality
function initLanguageSwitcher() {
  const dropdownBtn = document.getElementById("langDropdownBtn");
  const dropdownMenu = document.getElementById("langDropdownMenu");
  const langOptions = document.querySelectorAll(".lang-option");
  let currentLang = localStorage.getItem("selectedLanguage") || "vi";

  // Set initial language
  setLanguage(currentLang);
  updateDropdownButton(currentLang);

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
      setLanguage(lang);
      updateDropdownButton(lang);

      // Update active option
      langOptions.forEach((opt) => opt.classList.remove("active"));
      this.classList.add("active");

      // Close dropdown
      dropdownMenu.classList.remove("active");
      dropdownBtn.classList.remove("active");

      // Save to localStorage
      localStorage.setItem("selectedLanguage", lang);
    });
  });
}

function updateDropdownButton(lang) {
  const dropdownBtn = document.getElementById("langDropdownBtn");
  const codeSpan = dropdownBtn.querySelector(".lang-code");

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
  const elements = document.querySelectorAll("[data-translate]");

  elements.forEach((element) => {
    const key = element.getAttribute("data-translate");
    if (translations[lang] && translations[lang][key]) {
      // Special handling for natural_beauty to preserve HTML structure
      if (key === "natural_beauty") {
        if (lang === "vi") {
          element.innerHTML =
            '<span class="title-script-part">Đẹp</span> <span class="title-script-bold">TỰ NHIÊN</span>';
        } else if (lang === "en") {
          element.innerHTML =
            '<span class="title-script-part">Natural</span> <span class="title-script-bold">BEAUTY</span>';
        } else if (lang === "ko") {
          element.innerHTML =
            '<span class="title-script-part">자연스러운</span> <span class="title-script-bold">아름다움</span>';
        }
      } else {
        element.textContent = translations[lang][key];
      }
    }
  });

  // Update HTML lang attribute
  document.documentElement.lang = lang;

  // Update page direction for Korean (if needed)
  if (lang === "ko") {
    document.documentElement.dir = "ltr";
  } else {
    document.documentElement.dir = "ltr";
  }
}
