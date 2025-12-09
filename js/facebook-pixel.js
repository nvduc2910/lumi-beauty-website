/**
 * Lumi Beauty – Facebook Pixel + CAPI Integration
 */

(function () {
  "use strict";

  const CONFIG = {
    pixelId: "1826377334661720",
    capiEndpoint: "https://lumibeauty.studio/api/capi",
  };

  const state = {
    pixelLoaded: false,
    returningUserCount: null,
    fingerprint: null,
    pageStartTime: Date.now(),
    scrollDepth: { 50: false, 70: false },
    engagedSent: false,
    scrollPercent: 0,
    readTime: 0,
  };

  function getFingerprint() {
    if (!state.fingerprint) {
      let fp = localStorage.getItem("lumi_fp");
      if (!fp) {
        fp = btoa(navigator.userAgent + Date.now()).slice(0, 32);
        localStorage.setItem("lumi_fp", fp);
      }
      state.fingerprint = fp;
    }
    return state.fingerprint;
  }

  function getReturningUser() {
    if (state.returningUserCount !== null) return state.returningUserCount;

    let c = parseInt(localStorage.getItem("lumi_visits") || "0", 10);
    localStorage.setItem("lumi_visits", String(c + 1));
    state.returningUserCount = c;
    return c;
  }

  function getPageType() {
    const path = location.pathname.toLowerCase();
    if (path.includes("/blog")) return "blog";
    if (path.includes("/services")) return "service";
    if (path.includes("/contact")) return "contact";
    if (path.includes("/gallery")) return "gallery";
    if (path.includes("/feedback")) return "feedback";
    if (path === "/" || path.match(/^\/(vi|en|ko)\/?$/)) return "home";
    return "other";
  }

  function getBlogTitle() {
    return (
      document
        .querySelector("h1, .blog-title, [data-blog-title]")
        ?.textContent?.trim() || ""
    );
  }

  function generateEventId() {
    return `${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
  }

  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
    return "";
  }

  function getUserData() {
    return {
      client_user_agent: navigator.userAgent,
      client_ip_address: "",
      fbp: getCookie("_fbp") || "",
      fbc: getCookie("_fbc") || "",
      em: "",
      ph: "",
    };
  }

  function initPixel() {
    if (state.pixelLoaded) return;

    !(function (f, b, e, v, n, t, s) {
      if (f.fbq) return;
      n = f.fbq = function () {
        n.callMethod
          ? n.callMethod.apply(n, arguments)
          : n.queue.push(arguments);
      };
      if (!f._fbq) f._fbq = n;
      n.push = n;
      n.loaded = true;
      n.version = "2.0";
      n.queue = [];
      t = b.createElement(e);
      t.async = true;
      t.src = v;
      s = b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t, s);
    })(
      window,
      document,
      "script",
      "https://connect.facebook.net/en_US/fbevents.js"
    );

    fbq("init", CONFIG.pixelId);

    const eid = generateEventId();
    // Use correct format: fbq("track", eventName, data, options)
    // eventID must be in options object (3rd parameter)
    fbq("track", "PageView", {}, { eventID: eid });
    sendToCAPI("PageView", {}, eid);

    state.pixelLoaded = true;
  }

  function sendToCAPI(eventName, custom = {}, eventId = null) {
    const eid = eventId || generateEventId();

    // Facebook CAPI only accepts custom_data (not custom_properties)
    const customData = {
      ...(custom.custom_data || {}),
      // Standard page metadata
      page_type: getPageType(),
      fingerprint: getFingerprint(),
      returning_user_count: getReturningUser(),
      scroll_percentage: state.scrollPercent,
      read_time: state.readTime, // Already in seconds (incremented every 1000ms)
      blog_title: getBlogTitle(),
      duration: Math.floor((Date.now() - state.pageStartTime) / 1000),
    };

    const payload = {
      data: [
        {
          event_name: eventName,
          event_time: Math.floor(Date.now() / 1000),
          event_id: eid,
          event_source_url: location.href,
          action_source: "website",
          user_data: getUserData(),
          custom_data: customData,
        },
      ],
      ...(CONFIG.testEventCode
        ? { test_event_code: CONFIG.testEventCode }
        : {}),
    };

    if (!CONFIG.capiEndpoint) {
      console.error("[FB Pixel] capiEndpoint not configured!");
      return;
    }

    console.log(
      "[FB Pixel] Sending event:",
      eventName,
      "to:",
      CONFIG.capiEndpoint
    );

    fetch(CONFIG.capiEndpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then((res) => {
        console.log("[FB Pixel] Event sent:", eventName, "Status:", res.status);
        return res.json();
      })
      .then((data) => {
        console.log("[FB Pixel] Response:", data);
      })
      .catch((err) => {
        console.error("[FB Pixel] Send failed:", eventName, err);
      });
  }

  function sendToDataset(eventName, data = {}) {
    const customData = {
      content_name: data.content_name || eventName,
      content_type: "custom_event",
      custom_event_type: eventName,
      // Dataset metadata (all in custom_data, not custom_properties)
      dataset_type: eventName,
      dataset_data: JSON.stringify(data),
      timestamp: new Date().toISOString(),
      page_url: location.href,
      ...data,
    };

    const eventMapping = {
      high_quality_read: "CustomEvent",
      service_view_intent: "ViewContent",
      price_viewer: "ViewContent",
      contact_click: "Contact",
      returning_user: "CustomEvent",
      pre_lead_intent: "Lead",
      lead_submit: "Lead",
      scroll_depth: "CustomEvent",
      engaged_view: "CustomEvent",
      read_blog: "CustomEvent",
      click_hotline: "Contact",
      click_zalo: "Contact",
      click_messenger: "Contact",
      click_booking: "Lead",
      service_view: "ViewContent",
    };

    const capiEventName = eventMapping[eventName] || "CustomEvent";

    sendToCAPI(capiEventName, {
      custom_data: customData,
    });
  }

  function trackScroll() {
    const top = window.pageYOffset || document.documentElement.scrollTop || 0;
    const docHeight =
      document.documentElement.scrollHeight - window.innerHeight;

    if (docHeight <= 0) return;

    const percent = Math.round((top / docHeight) * 100);
    state.scrollPercent = percent;

    if (percent >= 50 && !state.scrollDepth[50]) {
      state.scrollDepth[50] = true;
      const eid = generateEventId();
      fbq("trackCustom", "scroll_depth", { depth: 50 }, { eventID: eid });
      sendToCAPI(
        "CustomEvent",
        {
          custom_data: {
            custom_event_type: "scroll_depth",
            depth: 50,
          },
        },
        eid
      );
    }

    if (percent >= 70 && !state.scrollDepth[70]) {
      state.scrollDepth[70] = true;
      const eid = generateEventId();
      fbq("trackCustom", "scroll_depth", { depth: 70 }, { eventID: eid });
      sendToCAPI(
        "CustomEvent",
        {
          custom_data: {
            custom_event_type: "scroll_depth",
            depth: 70,
          },
        },
        eid
      );
    }
  }

  let engagedInterval = null;
  engagedInterval = setInterval(() => {
    if (state.engagedSent) {
      if (engagedInterval) clearInterval(engagedInterval);
      return;
    }
    const t = Date.now() - state.pageStartTime;
    if (t >= 20000) {
      state.engagedSent = true;
      if (engagedInterval) clearInterval(engagedInterval);
      const eid = generateEventId();
      fbq(
        "trackCustom",
        "engaged_view",
        { duration: Math.floor(t / 1000) },
        { eventID: eid }
      );
      sendToCAPI(
        "CustomEvent",
        {
          custom_data: {
            custom_event_type: "engaged_view",
            duration: Math.floor(t / 1000),
          },
        },
        eid
      );
    }
  }, 3000);

  let readTimeInterval = null;
  function trackReadTime() {
    if (getPageType() !== "blog") return;
    if (readTimeInterval) return;

    readTimeInterval = setInterval(() => {
      if (document.visibilityState === "visible") {
        state.readTime += 1;

        if (state.readTime % 30 === 0) {
          const eid = generateEventId();
          fbq(
            "trackCustom",
            "read_blog",
            {
              blog_title: getBlogTitle(),
              read_time: state.readTime,
            },
            { eventID: eid }
          );
          sendToCAPI(
            "CustomEvent",
            {
              custom_data: {
                custom_event_type: "read_blog",
                blog_title: getBlogTitle(),
                read_time: state.readTime,
              },
            },
            eid
          );
        }
      }
    }, 1000);
  }

  function setupClickTracking() {
    let lastClick = 0;
    document.addEventListener(
      "click",
      (e) => {
        const now = Date.now();
        if (now - lastClick < 500) return;
        lastClick = now;

        const hotline = e.target.closest(
          'a[href^="tel:"], [data-track="hotline"]'
        );
        if (hotline) {
          // Use Contact event (mapped from click_hotline)
          const eid = generateEventId();
          fbq("track", "Contact", {}, { eventID: eid });
          sendToCAPI(
            "Contact",
            {
              custom_data: { contact_type: "hotline" },
            },
            eid
          );
        }

        const zalo = e.target.closest(
          '[data-track="zalo"], a[href*="zalo"], [data-open-zalo-modal], .btn-zalo, .floating-contact__item[href*="zalo"]'
        );
        if (zalo) {
          // Use Contact event (mapped from click_zalo)
          const eid = generateEventId();
          fbq("track", "Contact", {}, { eventID: eid });
          sendToCAPI(
            "Contact",
            {
              custom_data: { contact_type: "zalo" },
            },
            eid
          );
        }

        const ms = e.target.closest(
          'a[href*="m.me"], [data-track="messenger"]'
        );
        if (ms) {
          // Use Contact event (mapped from click_messenger)
          const eid = generateEventId();
          fbq("track", "Contact", {}, { eventID: eid });
          sendToCAPI(
            "Contact",
            {
              custom_data: { contact_type: "messenger" },
            },
            eid
          );
        }

        const booking = e.target.closest(
          '[data-track="booking"], [data-action="open-booking"]'
        );
        if (booking) {
          // Use Lead event (mapped from click_booking)
          const eid = generateEventId();
          fbq("track", "Lead", {}, { eventID: eid });
          sendToCAPI(
            "Lead",
            {
              custom_data: { lead_type: "booking_click" },
            },
            eid
          );
        }
      },
      true
    );
  }

  function autoViewContent() {
    if (getPageType() !== "service") return;

    const serviceName = document.querySelector("h1")?.textContent?.trim() || "";
    const eid = generateEventId();

    // Use correct format: fbq("track", eventName, data, options)
    fbq(
      "track",
      "ViewContent",
      {
        content_name: serviceName,
        content_type: "service",
      },
      {
        eventID: eid,
      }
    );

    sendToCAPI(
      "ViewContent",
      {
        custom_data: {
          content_name: serviceName,
          content_type: "service",
        },
      },
      eid
    );
  }

  function init() {
    if (window.FB_PIXEL_CONFIG) Object.assign(CONFIG, window.FB_PIXEL_CONFIG);

    const scriptTag = document.querySelector("script[data-fb-pixel]");
    if (scriptTag) Object.assign(CONFIG, scriptTag.dataset);

    console.log("[FB Pixel] Initialized with config:", {
      pixelId: CONFIG.pixelId,
      capiEndpoint: CONFIG.capiEndpoint,
    });

    if (!CONFIG.capiEndpoint) {
      console.error("[FB Pixel] ERROR: capiEndpoint not configured!");
      return;
    }

    initPixel();
    autoViewContent();
    trackReadTime();
    setupClickTracking();

    let scrollTimer = null;
    window.addEventListener(
      "scroll",
      () => {
        clearTimeout(scrollTimer);
        scrollTimer = setTimeout(trackScroll, 100);
      },
      { passive: true }
    );

    window.trackFBPixelEvent = function (name, data = {}) {
      const eid = generateEventId();
      // Use correct format: fbq("trackCustom", eventName, data, options)
      fbq("trackCustom", name, data, { eventID: eid });
      sendToCAPI(name, data, eid);
    };

    window.trackFBLeadSubmit = function (data = {}) {
      const eid = generateEventId();
      // Use correct format: fbq("track", eventName, data, options)
      fbq("track", "Lead", data, { eventID: eid });
      sendToCAPI(
        "Lead",
        {
          custom_data: {
            lead_type: "form_submit",
            ...data,
          },
        },
        eid
      );
    };
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
