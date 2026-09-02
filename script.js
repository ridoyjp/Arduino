"use strict";

document.addEventListener("DOMContentLoaded", () => {
  /* =========================================================
     HELPERS
  ========================================================= */

  const $ = (selector, parent = document) =>
    parent.querySelector(selector);

  const $$ = (selector, parent = document) =>
    [...parent.querySelectorAll(selector)];


  /* =========================================================
     PAGE READY
  ========================================================= */

  document.documentElement.classList.add("js");

  const handlePageLoad = () => {
    document.body.classList.add(
      "page-loaded",
      "site-ready"
    );

    const header = $(".header");

    if (header) {
      header.classList.add("header-open");
    }

    const hero =
      $(".profile-hero") ||
      $(".hero");

    if (hero) {
      hero.classList.add("hero-open");
    }
  };

  if (document.readyState === "complete") {
    handlePageLoad();
  } else {
    window.addEventListener(
      "load",
      handlePageLoad,
      { once: true }
    );
  }


  /* =========================================================
     MOBILE MENU
  ========================================================= */

  const menuBtn = $("#menuBtn");
  const nav = $("#nav");

  const closeMenu = () => {
    if (!menuBtn || !nav) return;

    nav.classList.remove("open");

    menuBtn.setAttribute(
      "aria-expanded",
      "false"
    );

    menuBtn.textContent = "☰";
  };

  if (menuBtn && nav) {
    menuBtn.addEventListener(
      "click",
      () => {
        const isOpen =
          nav.classList.toggle("open");

        menuBtn.setAttribute(
          "aria-expanded",
          String(isOpen)
        );

        menuBtn.textContent =
          isOpen ? "✕" : "☰";
      }
    );

    $$("a", nav).forEach((link) => {
      link.addEventListener(
        "click",
        closeMenu
      );
    });
  }


  /* =========================================================
     HEADER SCROLL EFFECT
  ========================================================= */

  const header = $(".header");

  const updateHeader = () => {
    if (!header) return;

    header.classList.toggle(
      "scrolled",
      window.scrollY > 30
    );
  };


  /* =========================================================
     SCROLL PROGRESS BAR
  ========================================================= */

  const progress =
    $(".scroll-progress") ||
    $("#progress");

  const updateProgress = () => {
    if (!progress) return;

    const scrollTop = window.scrollY;

    const scrollHeight =
      document.documentElement.scrollHeight -
      window.innerHeight;

    const percent =
      scrollHeight > 0
        ? (scrollTop / scrollHeight) * 100
        : 0;

    progress.style.width =
      `${Math.min(percent, 100)}%`;
  };


  /* =========================================================
     BACK TO TOP
  ========================================================= */

  const backToTop =
    $("#backToTop");

  const updateBackToTop = () => {
    if (!backToTop) return;

    backToTop.classList.toggle(
      "show",
      window.scrollY > 500
    );
  };

  if (backToTop) {
    backToTop.addEventListener(
      "click",
      () => {
        window.scrollTo({
          top: 0,
          behavior: "smooth"
        });
      }
    );
  }


  /* =========================================================
     OPTIMIZED SCROLL EVENTS
  ========================================================= */

  let scrollTicking = false;

  const handleScroll = () => {
    if (!scrollTicking) {
      window.requestAnimationFrame(() => {
        updateHeader();
        updateProgress();
        updateBackToTop();
        updateActiveNav();

        scrollTicking = false;
      });

      scrollTicking = true;
    }
  };

  updateHeader();
  updateProgress();
  updateBackToTop();

  window.addEventListener(
    "scroll",
    handleScroll,
    { passive: true }
  );


  /* =========================================================
     ULTRA SMOOTH ANCHOR SCROLL
  ========================================================= */

  $$('a[href^="#"]').forEach((link) => {
    link.addEventListener(
      "click",
      (event) => {
        const targetId =
          link.getAttribute("href");

        if (
          !targetId ||
          targetId === "#"
        ) {
          return;
        }

        let target;

        try {
          target = $(targetId);
        } catch {
          return;
        }

        if (!target) return;

        event.preventDefault();

        const headerHeight =
          header
            ? header.offsetHeight
            : 0;

        const targetPosition =
          target.getBoundingClientRect().top +
          window.scrollY -
          headerHeight -
          12;

        window.scrollTo({
          top: Math.max(0, targetPosition),
          behavior: "smooth"
        });

        closeMenu();
      }
    );
  });


  /* =========================================================
     ACTIVE NAVIGATION
  ========================================================= */

  const sections =
    $$("main section[id]");

  const navLinks =
    nav
      ? $$('a[href^="#"]', nav)
      : [];

  const updateActiveNav = () => {
    if (
      !sections.length ||
      !navLinks.length
    ) {
      return;
    }

    const scrollPosition =
      window.scrollY + 180;

    let currentId =
      sections[0]?.id || "";

    sections.forEach((section) => {
      if (
        scrollPosition >= section.offsetTop
      ) {
        currentId = section.id;
      }
    });

    navLinks.forEach((link) => {
      const href =
        link.getAttribute("href");

      link.classList.toggle(
        "current",
        href === `#${currentId}`
      );
    });
  };

  updateActiveNav();


  /* =========================================================
     SINGLE SMOOTH SCROLL REVEAL
     ONLY ONE OBSERVER - NO DUPLICATE
  ========================================================= */

  const animatedElements = $$(
    ".reveal, " +
    ".reveal-left, " +
    ".reveal-right, " +
    ".reveal-zoom, " +
    ".scroll-animate, " +
    ".scroll-left, " +
    ".scroll-right"
  );

  const showElement = (element) => {
    element.classList.add(
      "active",
      "visible",
      "is-visible",
      "show"
    );
  };

  if (
    "IntersectionObserver" in window &&
    animatedElements.length
  ) {
    const animationObserver =
      new IntersectionObserver(
        (entries, observer) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) {
              return;
            }

            requestAnimationFrame(() => {
              showElement(entry.target);
            });

            observer.unobserve(entry.target);
          });
        },
        {
          threshold: 0.08,
          rootMargin:
            "0px 0px -30px 0px"
        }
      );

    animatedElements.forEach((element) => {
      animationObserver.observe(element);
    });

  } else {
    animatedElements.forEach(showElement);
  }

  /* Safety fallback */

  setTimeout(() => {
    animatedElements.forEach(showElement);
  }, 2000);


  /* =========================================================
     TYPING TEXT
  ========================================================= */

  const typingText =
    $("#typingText");

  if (typingText) {
    const words =
      (typingText.dataset.texts || "")
        .split("|")
        .map((text) => text.trim())
        .filter(Boolean);

    if (words.length > 0) {
      let wordIndex = 0;
      let charIndex = 0;
      let isDeleting = false;

      const type = () => {
        const currentWord =
          words[wordIndex];

        typingText.textContent =
          currentWord.substring(
            0,
            charIndex
          );

        let speed;

        if (!isDeleting) {
          if (
            charIndex <
            currentWord.length
          ) {
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
              (wordIndex + 1) %
              words.length;

            speed = 350;
          }
        }

        setTimeout(type, speed);
      };

      type();
    }
  }


  /* =========================================================
     PROJECT FILTER
  ========================================================= */

  const filterButtons =
    $$(".project-filter");

  const projectItems =
    $$(".portfolio-item[data-category]");

  filterButtons.forEach((button) => {
    button.addEventListener(
      "click",
      () => {
        const selectedFilter =
          button.dataset.filter || "all";

        filterButtons.forEach(
          (filterButton) => {
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
          }
        );

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
            project.classList.remove(
              "active",
              "visible",
              "is-visible",
              "show"
            );

            requestAnimationFrame(() => {
              showElement(project);
            });
          }
        });
      }
    );
  });


  /* =========================================================
     PROJECT CARD CLICK
  ========================================================= */

  const openProject = (card) => {
    const url =
      card.dataset.link;

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

  $$(".portfolio-item[data-link]").forEach(
    (card) => {
      card.addEventListener(
        "click",
        (event) => {
          if (
            event.target.closest(
              "a, button"
            )
          ) {
            return;
          }

          openProject(card);
        }
      );

      card.addEventListener(
        "keydown",
        (event) => {
          if (
            event.key !== "Enter" &&
            event.key !== " "
          ) {
            return;
          }

          event.preventDefault();
          openProject(card);
        }
      );
    }
  );


  /* =========================================================
     PROJECT MOUSE GLOW
  ========================================================= */

  $$(".portfolio-item").forEach((card) => {
    card.addEventListener(
      "pointermove",
      (event) => {
        const rect =
          card.getBoundingClientRect();

        const x =
          ((event.clientX - rect.left) /
            rect.width) *
          100;

        const y =
          ((event.clientY - rect.top) /
            rect.height) *
          100;

        card.style.setProperty(
          "--mouse-x",
          `${x}%`
        );

        card.style.setProperty(
          "--mouse-y",
          `${y}%`
        );
      }
    );
  });


  /* =========================================================
     VIDEO MODAL
  ========================================================= */

  const videoModal =
    $("#videoModal");

  const videoPlayer =
    $("#projectVideo");

  const videoCloseButtons =
    videoModal
      ? $$(".video-close", videoModal)
      : [];

  let lastVideoTrigger = null;


  const openProjectVideo = (
    source,
    trigger
  ) => {
    if (
      !videoModal ||
      !videoPlayer ||
      !source
    ) {
      return;
    }

    lastVideoTrigger =
      trigger ||
      document.activeElement;

    videoPlayer.pause();

    videoPlayer.src = source;

    videoModal.classList.add(
      "is-open"
    );

    videoModal.setAttribute(
      "aria-hidden",
      "false"
    );

    document.body.style.overflow =
      "hidden";

    videoPlayer.load();

    const playVideo = () => {
      videoPlayer.play().catch(() => {
        console.log(
          "Video autoplay blocked."
        );
      });
    };

    videoPlayer.addEventListener(
      "canplay",
      playVideo,
      { once: true }
    );
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

    videoModal.classList.remove(
      "is-open"
    );

    videoModal.setAttribute(
      "aria-hidden",
      "true"
    );

    document.body.style.overflow = "";

    if (
      lastVideoTrigger &&
      typeof lastVideoTrigger.focus ===
        "function"
    ) {
      lastVideoTrigger.focus();
    }

    lastVideoTrigger = null;
  };


  $$("[data-video]").forEach((button) => {
    button.addEventListener(
      "click",
      (event) => {
        event.preventDefault();
        event.stopPropagation();

        openProjectVideo(
          button.dataset.video,
          button
        );
      }
    );
  });


  videoCloseButtons.forEach((button) => {
    button.addEventListener(
      "click",
      closeProjectVideo
    );
  });


  if (videoModal) {
    videoModal.addEventListener(
      "click",
      (event) => {
        if (
          event.target === videoModal
        ) {
          closeProjectVideo();
        }
      }
    );
  }


  document.addEventListener(
    "keydown",
    (event) => {
      if (
        event.key === "Escape" &&
        videoModal?.classList.contains(
          "is-open"
        )
      ) {
        closeProjectVideo();
      }
    }
  );


  /* =========================================================
     VIDEO ERROR
  ========================================================= */

  if (videoPlayer) {
    videoPlayer.addEventListener(
      "error",
      () => {
        console.error(
          "Video could not be loaded:",
          videoPlayer.currentSrc
        );
      }
    );
  }


  /* =========================================================
     RIPPLE EFFECT
  ========================================================= */

  const createRipple = (
    button,
    event
  ) => {
    const rect =
      button.getBoundingClientRect();

    const size =
      Math.max(
        rect.width,
        rect.height
      );

    const ripple =
      document.createElement("span");

    ripple.className = "ripple";

    ripple.style.width =
      `${size}px`;

    ripple.style.height =
      `${size}px`;

    ripple.style.left =
      `${event.clientX - rect.left - size / 2}px`;

    ripple.style.top =
      `${event.clientY - rect.top - size / 2}px`;

    button
      .querySelector(".ripple")
      ?.remove();

    button.appendChild(ripple);

    ripple.addEventListener(
      "animationend",
      () => ripple.remove()
    );
  };


  $$(".project-btn, .project-play").forEach(
    (button) => {
      button.addEventListener(
        "click",
        (event) => {
          createRipple(
            button,
            event
          );
        }
      );
    }
  );


  /* =========================================================
     CONTACT FORM
  ========================================================= */

  const contactForm =
    $("#contactForm");

  const formStatus =
    $("#formStatus");

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

        if (
          !name ||
          !email ||
          !message
        ) {
          if (formStatus) {
            formStatus.textContent =
              "すべての必須項目を入力してください。";

            formStatus.className =
              "form-status error";
          }

          return;
        }

        const subject =
          encodeURIComponent(
            `Portfolio Contact from ${name}`
          );

        const body =
          encodeURIComponent(
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