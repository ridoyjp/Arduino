"use strict";

document.addEventListener("DOMContentLoaded", () => {

  /* =========================================================
     BASIC SELECTORS
  ========================================================= */

  const $ = (selector, parent = document) =>
    parent.querySelector(selector);

  const $$ = (selector, parent = document) =>
    [...parent.querySelectorAll(selector)];


  /* =========================================================
     PAGE LOADED
  ========================================================= */

  document.documentElement.classList.add("js");

  window.addEventListener("load", () => {
    document.body.classList.add("page-loaded");
  });


  /* =========================================================
     MOBILE MENU
  ========================================================= */

  const menuBtn = $("#menuBtn");
  const nav = $("#nav");

  const closeMenu = () => {
    if (!menuBtn || !nav) return;

    nav.classList.remove("open");
    menuBtn.setAttribute("aria-expanded", "false");
    menuBtn.textContent = "☰";
  };

  if (menuBtn && nav) {
    menuBtn.addEventListener("click", () => {
      const isOpen = nav.classList.toggle("open");

      menuBtn.setAttribute("aria-expanded", String(isOpen));
      menuBtn.textContent = isOpen ? "✕" : "☰";
    });

    $$("a", nav).forEach((link) => {
      link.addEventListener("click", closeMenu);
    });
  }


  /* =========================================================
     HEADER SCROLL EFFECT
  ========================================================= */

  const header = $(".header");

  const updateHeader = () => {
    if (!header) return;

    header.classList.toggle("scrolled", window.scrollY > 30);
  };

  updateHeader();

  window.addEventListener("scroll", updateHeader, {
    passive: true
  });


  /* =========================================================
     SMOOTH SCROLL
  ========================================================= */

  $$('a[href^="#"]').forEach((link) => {

    link.addEventListener("click", (event) => {

      const targetId = link.getAttribute("href");

      if (!targetId || targetId === "#") return;

      const target = $(targetId);

      if (!target) return;

      event.preventDefault();

      const headerHeight = header
        ? header.offsetHeight
        : 0;

      const targetPosition =
        target.getBoundingClientRect().top +
        window.scrollY -
        headerHeight -
        10;

      window.scrollTo({
        top: targetPosition,
        behavior: "smooth"
      });

      closeMenu();

    });

  });


  /* =========================================================
     ACTIVE NAVIGATION
  ========================================================= */

  const sections = $$("main section");
  const navLinks = nav ? $$("a", nav) : [];

  const updateActiveNav = () => {

    if (!sections.length || !navLinks.length) return;

    let currentId = "";

    sections.forEach((section) => {

      const sectionTop =
        section.offsetTop - 180;

      const sectionBottom =
        sectionTop + section.offsetHeight;

      if (
        window.scrollY >= sectionTop &&
        window.scrollY < sectionBottom
      ) {
        currentId = section.id;
      }

    });

    navLinks.forEach((link) => {

      const href = link.getAttribute("href");

      link.classList.toggle(
        "current",
        href === `#${currentId}`
      );

    });

  };

  updateActiveNav();

  window.addEventListener(
    "scroll",
    updateActiveNav,
    { passive: true }
  );


  /* =========================================================
     SCROLL REVEAL
  ========================================================= */

  const revealElements = $$(".reveal");

  const revealElement = (element) => {
    element.classList.add("active", "visible");
  };

  if ("IntersectionObserver" in window) {

    const revealObserver = new IntersectionObserver(
      (entries, observer) => {

        entries.forEach((entry) => {

          if (!entry.isIntersecting) return;

          revealElement(entry.target);
          observer.unobserve(entry.target);

        });

      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -40px 0px"
      }
    );

    revealElements.forEach((element) => {
      revealObserver.observe(element);
    });

  } else {

    revealElements.forEach(revealElement);

  }


  /* =========================================================
     REVEAL ZOOM
  ========================================================= */

  const zoomElements = $$(".reveal-zoom");

  const revealZoom = (element) => {
    element.classList.add("is-visible");
  };

  if ("IntersectionObserver" in window) {

    const zoomObserver = new IntersectionObserver(
      (entries, observer) => {

        entries.forEach((entry) => {

          if (!entry.isIntersecting) return;

          revealZoom(entry.target);
          observer.unobserve(entry.target);

        });

      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -40px 0px"
      }
    );

    zoomElements.forEach((element) => {
      zoomObserver.observe(element);
    });

  } else {

    zoomElements.forEach(revealZoom);

  }


  /* =========================================================
     SAFETY FALLBACK
     Content never remains hidden
  ========================================================= */

  setTimeout(() => {

    revealElements.forEach(revealElement);
    zoomElements.forEach(revealZoom);

  }, 1500);


  /* =========================================================
     TYPING TEXT
  ========================================================= */

 /* =========================================================
   TYPING TEXT
   Text change হলেও RIGHT PHOTO MOVE হবে না
========================================================= */

const typingText = $("#typingText");

if (typingText) {

  const words = (typingText.dataset.texts || "")
    .split("|")
    .map((text) => text.trim())
    .filter(Boolean);

  if (words.length > 0) {

    /*
      Longest text-এর width calculate করা হচ্ছে।
      তাই auto typing-এর text ছোট/বড় হলেও
      layout বারবার resize হবে না।
    */
    const measureText = document.createElement("span");

    measureText.style.position = "absolute";
    measureText.style.visibility = "hidden";
    measureText.style.whiteSpace = "nowrap";
    measureText.style.pointerEvents = "none";

    const computedStyle = window.getComputedStyle(typingText);

    measureText.style.fontFamily = computedStyle.fontFamily;
    measureText.style.fontSize = computedStyle.fontSize;
    measureText.style.fontWeight = computedStyle.fontWeight;
    measureText.style.letterSpacing = computedStyle.letterSpacing;

    document.body.appendChild(measureText);

    let maxWidth = 0;

    words.forEach((word) => {
      measureText.textContent = word;
      maxWidth = Math.max(maxWidth, measureText.offsetWidth);
    });

    measureText.remove();

    /*
      Desktop layout stable রাখা।
      CSS-এর max-width-এর বেশি হলে parent অনুযায়ী থাকবে।
    */
    typingText.style.setProperty(
      "--typing-max-width",
      `${Math.ceil(maxWidth + 20)}px`
    );


    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    const type = () => {

      const currentWord = words[wordIndex];

      typingText.textContent =
        currentWord.substring(0, charIndex);

      let speed = 80;

      if (!isDeleting) {

        if (charIndex < currentWord.length) {

          charIndex++;
          speed = 80;

        } else {

          isDeleting = true;
          speed = 1800;

        }

      } else {

        if (charIndex > 0) {

          charIndex--;
          speed = 40;

        } else {

          isDeleting = false;

          wordIndex =
            (wordIndex + 1) % words.length;

          speed = 350;

        }

      }

      setTimeout(type, speed);

    };

    /*
      প্রথম text শুরু হওয়ার আগে
      fixed layout তৈরি করা
    */
    type();

  }

}

  /* =========================================================
     PROJECT FILTER
  ========================================================= */

  const filterButtons = $$(".project-filter");
  const projectItems =
    $$(".portfolio-item[data-category]");

  filterButtons.forEach((button) => {

    button.addEventListener("click", () => {

      const selectedFilter =
        button.dataset.filter || "all";

      filterButtons.forEach((filterButton) => {

        const isActive =
          filterButton === button;

        filterButton.classList.toggle(
          "is-active",
          isActive
        );

        filterButton.setAttribute(
          "aria-pressed",
          String(isActive)
        );

      });

      projectItems.forEach((project) => {

        const category =
          project.dataset.category;

        const shouldShow =
          selectedFilter === "all" ||
          category === selectedFilter;

        project.classList.toggle(
          "is-hidden",
          !shouldShow
        );

        project.setAttribute(
          "aria-hidden",
          String(!shouldShow)
        );

        if (shouldShow) {

          project.classList.remove("is-visible");

          requestAnimationFrame(() => {
            project.classList.add("is-visible");
          });

        }

      });

    });

  });


  /* =========================================================
     PROJECT CARD OPEN
  ========================================================= */

  const openProject = (card) => {

    const url = card.dataset.link;

    if (!url) return;

    if (/^https?:\/\//i.test(url)) {

      window.open(
        url,
        "_blank",
        "noopener,noreferrer"
      );

    } else {

      window.location.href = url;

    }

  };

  $$(".portfolio-item[data-link]").forEach((card) => {

    card.addEventListener("click", (event) => {

      if (
        event.target.closest("a, button")
      ) {
        return;
      }

      openProject(card);

    });

    card.addEventListener("keydown", (event) => {

      if (
        event.key !== "Enter" &&
        event.key !== " "
      ) {
        return;
      }

      event.preventDefault();

      openProject(card);

    });

  });


  /* =========================================================
     PROJECT GLOW POSITION
  ========================================================= */

  $$(".portfolio-item").forEach((card) => {

    card.addEventListener("pointermove", (event) => {

      const rect =
        card.getBoundingClientRect();

      const x =
        ((event.clientX - rect.left) /
          rect.width) * 100;

      const y =
        ((event.clientY - rect.top) /
          rect.height) * 100;

      card.style.setProperty(
        "--mouse-x",
        `${x}%`
      );

      card.style.setProperty(
        "--mouse-y",
        `${y}%`
      );

    });

  });


  /* =========================================================
     VIDEO MODAL
  ========================================================= */

  const videoModal = $("#videoModal");
  const videoPlayer = $("#projectVideo");

  /* HTML has two .video-close buttons,
     so we safely select all of them */
  const videoCloseButtons =
    videoModal
      ? $$(".video-close", videoModal)
      : [];

  let lastVideoTrigger = null;


  const openProjectVideo = (source, trigger) => {

    if (
      !videoModal ||
      !videoPlayer ||
      !source
    ) {
      return;
    }

    lastVideoTrigger =
      trigger || document.activeElement;

    videoPlayer.pause();

    videoPlayer.src = source;
    videoPlayer.load();

    videoModal.classList.add("is-open");
    videoModal.setAttribute(
      "aria-hidden",
      "false"
    );

    document.body.style.overflow = "hidden";

  };


  const closeProjectVideo = () => {

    if (
      !videoModal ||
      !videoPlayer
    ) {
      return;
    }

    videoPlayer.pause();
    videoPlayer.currentTime = 0;

    videoPlayer.removeAttribute("src");
    videoPlayer.load();

    videoModal.classList.remove("is-open");

    videoModal.setAttribute(
      "aria-hidden",
      "true"
    );

    document.body.style.overflow = "";

    if (
      lastVideoTrigger &&
      typeof lastVideoTrigger.focus === "function"
    ) {
      lastVideoTrigger.focus();
    }

    lastVideoTrigger = null;

  };


  /* Open buttons */

  $$("[data-video]").forEach((button) => {

    button.addEventListener("click", (event) => {

      event.preventDefault();
      event.stopPropagation();

      openProjectVideo(
        button.dataset.video,
        button
      );

    });

  });


  /* Close buttons */

  videoCloseButtons.forEach((button) => {

    button.addEventListener(
      "click",
      closeProjectVideo
    );

  });


  /* Close when clicking outside */

  videoModal?.addEventListener(
    "click",
    (event) => {

      if (event.target === videoModal) {
        closeProjectVideo();
      }

    }
  );


  /* ESC close */

  document.addEventListener(
    "keydown",
    (event) => {

      if (
        event.key === "Escape" &&
        videoModal?.classList.contains("is-open")
      ) {
        closeProjectVideo();
      }

    }
  );


  /* =========================================================
     VIDEO ERROR
  ========================================================= */

  videoPlayer?.addEventListener("error", () => {

    console.error(
      "Video could not be loaded:",
      videoPlayer.currentSrc
    );

  });


  /* =========================================================
     PROJECT BUTTON RIPPLE
  ========================================================= */

  const createRipple = (button, event) => {

    const rect =
      button.getBoundingClientRect();

    const size =
      Math.max(rect.width, rect.height);

    const ripple =
      document.createElement("span");

    ripple.className = "ripple";

    ripple.style.width = `${size}px`;
    ripple.style.height = `${size}px`;

    ripple.style.left =
      `${event.clientX - rect.left - size / 2}px`;

    ripple.style.top =
      `${event.clientY - rect.top - size / 2}px`;

    button.querySelector(".ripple")?.remove();

    button.appendChild(ripple);

    ripple.addEventListener(
      "animationend",
      () => ripple.remove()
    );

  };


  $$(".project-btn, .project-play").forEach(
    (button) => {

      button.addEventListener("click", (event) => {

        createRipple(button, event);

      });

    }
  );


  /* =========================================================
     CONTACT FORM
     Opens default mail application
  ========================================================= */

  const contactForm = $("#contactForm");
  const formStatus = $("#formStatus");

  if (contactForm) {

    contactForm.addEventListener(
      "submit",
      (event) => {

        event.preventDefault();

        const name =
          $("#name")?.value.trim() || "";

        const email =
          $("#email")?.value.trim() || "";

        const message =
          $("#message")?.value.trim() || "";


        if (!name || !email || !message) {

          if (formStatus) {

            formStatus.textContent =
              "すべての必須項目を入力してください。";

            formStatus.className =
              "form-status error";

          }

          return;

        }


        const subject = encodeURIComponent(
          `Portfolio Contact from ${name}`
        );

        const body = encodeURIComponent(
          `お名前: ${name}\n` +
          `メールアドレス: ${email}\n\n` +
          `お問い合わせ内容:\n${message}`
        );


        if (formStatus) {

          formStatus.textContent =
            "メールアプリを開いています...";

          formStatus.className =
            "form-status success";

        }


        window.location.href =
          "mailto:mr25304046@ga.ttc.ac.jp" +
          `?subject=${subject}` +
          `&body=${body}`;


        setTimeout(() => {

          contactForm.reset();

        }, 500);

      }
    );

  }


});

/* =========================================================
   ULTRA SMOOTH SCROLL REVEAL
========================================================= */

const scrollReveal = document.querySelectorAll(
  ".reveal, .reveal-left, .reveal-right, .reveal-zoom"
);

const revealOnScroll = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        requestAnimationFrame(() => {
          entry.target.classList.add("active");
        });

        revealOnScroll.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.08,
    rootMargin: "0px 0px -80px 0px"
  }
);

scrollReveal.forEach((element) => {
  revealOnScroll.observe(element);
});
