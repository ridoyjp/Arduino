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

    const pageHeader = $(".header");

    if (pageHeader) {
      pageHeader.classList.add("header-open");
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
     HEADER
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
     SCROLL PROGRESS
  ========================================================= */

  const progress =
    $(".scroll-progress") ||
    $("#progress");

  const updateProgress = () => {

    if (!progress) return;

    const scrollTop =
      window.scrollY;

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


  /* =========================================================
     OPTIMIZED SCROLL EVENTS
  ========================================================= */

  let scrollTicking = false;

  const handleScroll = () => {

    if (scrollTicking) return;

    scrollTicking = true;

    window.requestAnimationFrame(() => {

      updateHeader();
      updateProgress();
      updateBackToTop();
      updateActiveNav();

      scrollTicking = false;

    });

  };


  updateHeader();
  updateProgress();
  updateBackToTop();
  updateActiveNav();


  window.addEventListener(
    "scroll",
    handleScroll,
    { passive: true }
  );


  /* =========================================================
     SMOOTH ANCHOR SCROLL
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

          top: Math.max(
            0,
            targetPosition
          ),

          behavior: "smooth"

        });


        closeMenu();

      }
    );

  });


  /* =========================================================
     SCROLL REVEAL
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

            showElement(entry.target);

            observer.unobserve(entry.target);

          });

        },
        {
          threshold: 0.08,
          rootMargin: "0px 0px -30px 0px"
        }
      );


    animatedElements.forEach((element) => {

      animationObserver.observe(element);

    });

  } else {

    animatedElements.forEach(showElement);

  }


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


        let speed = 80;


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


        setTimeout(
          type,
          speed
        );

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
      (event) => {

        event.stopPropagation();

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

            requestAnimationFrame(() => {

              showElement(project);

            });

          }

        });

      }
    );

  });


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
          (
            (event.clientX - rect.left) /
            rect.width
          ) * 100;

        const y =
          (
            (event.clientY - rect.top) /
            rect.height
          ) * 100;


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

  const videoError =
    $("#videoError");

  const videoCloseButtons =
    videoModal
      ? $$(".video-close", videoModal)
      : [];


  let lastVideoTrigger = null;


  /* =========================================================
     VIDEO SOURCE NORMALIZATION
  ========================================================= */

  const getVideoURL = (source) => {

    if (!source) return "";

    try {

      return new URL(
        source,
        window.location.href
      ).href;

    } catch {

      return source;

    }

  };


  /* =========================================================
     SHOW VIDEO ERROR
  ========================================================= */

  const showVideoError = (message) => {

    console.error(
      "Video error:",
      message
    );


    if (videoError) {

      videoError.hidden = false;

      videoError.textContent =
        "動画を読み込めませんでした。動画ファイルのパスを確認してください。";

    }

  };


  /* =========================================================
     OPEN VIDEO
  ========================================================= */

  const openProjectVideo = (
    source,
    trigger
  ) => {

    if (
      !videoModal ||
      !videoPlayer ||
      !source
    ) {

      console.warn(
        "Video source not found:",
        source
      );

      return;

    }


    lastVideoTrigger =
      trigger || document.activeElement;


    const videoURL =
      getVideoURL(source);


    console.log(
      "Opening video:",
      videoURL
    );


    /* Clear previous error */

    if (videoError) {

      videoError.hidden = true;

      videoError.textContent =
        "動画を読み込めませんでした。";

    }


    /* Stop old video */

    try {

      videoPlayer.pause();

    } catch {}


    /*
      IMPORTANT:
      Direct src assignment works more reliably
      on Android/iPhone than repeatedly injecting
      <source> elements.
    */

    videoPlayer.removeAttribute("src");

    videoPlayer.load();


    /*
      Mobile compatibility
    */

    videoPlayer.setAttribute(
      "playsinline",
      ""
    );

    videoPlayer.setAttribute(
      "webkit-playsinline",
      ""
    );

    videoPlayer.setAttribute(
      "controls",
      ""
    );


    /*
      We DO NOT force autoplay.
      Some mobile browsers block autoplay.
    */

    videoPlayer.muted = false;


    /* Set new video */

    videoPlayer.src = videoURL;


    /* Open modal */

    videoModal.classList.add(
      "is-open"
    );

    videoModal.setAttribute(
      "aria-hidden",
      "false"
    );


    document.body.style.overflow =
      "hidden";


    /* Load video */

    videoPlayer.load();


    /*
      Try to start after metadata
      has loaded.

      If mobile browser blocks it,
      user can simply press ▶.
    */

    const tryPlay = () => {

      const playPromise =
        videoPlayer.play();


      if (
        playPromise &&
        typeof playPromise.catch ===
        "function"
      ) {

        playPromise.catch((error) => {

          console.log(
            "Autoplay blocked:",
            error
          );

        });

      }

    };


    if (
      videoPlayer.readyState >= 2
    ) {

      tryPlay();

    } else {

      videoPlayer.addEventListener(
        "loadeddata",
        tryPlay,
        { once: true }
      );

    }

  };


  /* =========================================================
     CLOSE VIDEO
  ========================================================= */

  const closeProjectVideo = () => {

    if (
      !videoModal ||
      !videoPlayer
    ) {

      return;

    }


    try {

      videoPlayer.pause();

    } catch {}


    try {

      videoPlayer.currentTime = 0;

    } catch {}


    videoPlayer.removeAttribute(
      "src"
    );

    videoPlayer.load();


    videoModal.classList.remove(
      "is-open"
    );

    videoModal.setAttribute(
      "aria-hidden",
      "true"
    );


    document.body.style.overflow =
      "";


    if (videoError) {

      videoError.hidden = true;

    }


    if (
      lastVideoTrigger &&
      typeof lastVideoTrigger.focus ===
      "function"
    ) {

      try {

        lastVideoTrigger.focus();

      } catch {}

    }


    lastVideoTrigger = null;

  };


  /* =========================================================
     GET PROJECT VIDEO
  ========================================================= */

  const getCardVideoSource = (card) => {

    if (card.dataset.video) {

      return card.dataset.video;

    }


    const videoElement =
      card.querySelector(
        "[data-video]"
      );


    if (
      videoElement &&
      videoElement.dataset.video
    ) {

      return videoElement.dataset.video;

    }


    return "";

  };


  /* =========================================================
     GET PROJECT LINK
  ========================================================= */

  const getCardLink = (card) => {

    if (card.dataset.link) {

      return card.dataset.link;

    }


    const projectLink =
      card.querySelector(
        "a.project-btn[href]"
      );


    if (projectLink) {

      return projectLink.href;

    }


    return "";

  };


  /* =========================================================
     OPEN PROJECT LINK
  ========================================================= */

  const openProjectLink = (
    link,
    card
  ) => {

    if (!link) return;


    const anchor =
      card.querySelector(
        "a.project-btn[href]"
      );


    const shouldOpenNewTab =
      anchor &&
      anchor.target === "_blank";


    if (shouldOpenNewTab) {

      window.open(
        link,
        "_blank",
        "noopener,noreferrer"
      );

    } else {

      window.location.href =
        link;

    }

  };


  /* =========================================================
     OPEN PROJECT
     VIDEO > LINK
  ========================================================= */

  const openProject = (
    card,
    trigger
  ) => {

    const videoSource =
      getCardVideoSource(card);

    const projectLink =
      getCardLink(card);


    if (videoSource) {

      openProjectVideo(
        videoSource,
        trigger || card
      );

      return;

    }


    if (projectLink) {

      openProjectLink(
        projectLink,
        card
      );

    }

  };


  /* =========================================================
     PROJECT CARD CLICK
  ========================================================= */

  $$(".portfolio-item").forEach((card) => {

    const videoSource =
      getCardVideoSource(card);

    const projectLink =
      getCardLink(card);


    if (
      !videoSource &&
      !projectLink
    ) {

      return;

    }


    card.style.cursor =
      "pointer";


    if (
      !card.hasAttribute(
        "tabindex"
      )
    ) {

      card.setAttribute(
        "tabindex",
        "0"
      );

    }


    card.addEventListener(
      "click",
      (event) => {

        const clickedLink =
          event.target.closest(
            "a[href]"
          );


        if (clickedLink) {

          return;

        }


        const clickedVideoButton =
          event.target.closest(
            "[data-video]"
          );


        if (clickedVideoButton) {

          return;

        }


        event.preventDefault();


        openProject(
          card,
          card
        );

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


        openProject(
          card,
          card
        );

      }
    );

  });


  /* =========================================================
     VIDEO BUTTON CLICK
  ========================================================= */

  $$("[data-video]").forEach((button) => {

    button.addEventListener(
      "click",
      (event) => {

        event.preventDefault();

        event.stopPropagation();


        const videoSource =
          button.dataset.video;


        openProjectVideo(
          videoSource,
          button
        );

      }
    );

  });


  /* =========================================================
     NORMAL PROJECT LINKS
  ========================================================= */

  $$(".portfolio-item a[href]").forEach((link) => {

    link.addEventListener(
      "click",
      (event) => {

        event.stopPropagation();

      }
    );

  });


  /* =========================================================
     CLOSE VIDEO BUTTON
  ========================================================= */

  videoCloseButtons.forEach((button) => {

    button.addEventListener(
      "click",
      (event) => {

        event.preventDefault();

        event.stopPropagation();

        closeProjectVideo();

      }
    );

  });


  /* =========================================================
     CLICK OUTSIDE VIDEO
  ========================================================= */

  if (videoModal) {

    videoModal.addEventListener(
      "click",
      (event) => {

        if (
          event.target ===
          videoModal
        ) {

          closeProjectVideo();

        }

      }
    );

  }


  /* =========================================================
     ESC → CLOSE VIDEO
  ========================================================= */

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
     VIDEO EVENTS
  ========================================================= */

  if (videoPlayer) {

    videoPlayer.addEventListener(
      "loadedmetadata",
      () => {

        console.log(
          "Video metadata loaded:",
          videoPlayer.currentSrc
        );

      }
    );


    videoPlayer.addEventListener(
      "canplay",
      () => {

        console.log(
          "Video can play:",
          videoPlayer.currentSrc
        );

      }
    );


    videoPlayer.addEventListener(
      "error",
      () => {

        const mediaError =
          videoPlayer.error;


        console.error(
          "Video could not be loaded:",
          videoPlayer.currentSrc,
          mediaError
        );


        showVideoError(
          mediaError
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
      document.createElement(
        "span"
      );


    ripple.className =
      "ripple";


    ripple.style.width =
      `${size}px`;

    ripple.style.height =
      `${size}px`;


    ripple.style.left =
      `${event.clientX -
        rect.left -
        size / 2}px`;


    ripple.style.top =
      `${event.clientY -
        rect.top -
        size / 2}px`;


    button
      .querySelector(".ripple")
      ?.remove();


    button.appendChild(
      ripple
    );


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
          $("#name")?.value.trim() ||
          "";

        const email =
          $("#email")?.value.trim() ||
          "";

        const message =
          $("#message")?.value.trim() ||
          "";


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