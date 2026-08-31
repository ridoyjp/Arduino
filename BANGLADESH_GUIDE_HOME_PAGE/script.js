(() => {
  'use strict';

  const header = document.querySelector('[data-header]');
  const menuButton = document.querySelector('[data-menu-button]');
  const menu = document.querySelector('[data-menu]');
  const toTop = document.querySelector('[data-to-top]');

  const setHeaderState = () => {
    const scrolled = window.scrollY > 24;
    header?.classList.toggle('is-scrolled', scrolled);
    toTop?.classList.toggle('is-visible', window.scrollY > 520);
  };

  setHeaderState();
  window.addEventListener('scroll', setHeaderState, { passive: true });

  const closeMenu = () => {
    if (!menuButton || !menu) return;
    menuButton.setAttribute('aria-expanded', 'false');
    menu.classList.remove('is-open');
    document.body.classList.remove('menu-open');
  };

  menuButton?.addEventListener('click', () => {
    const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
    menuButton.setAttribute('aria-expanded', String(!isOpen));
    menu?.classList.toggle('is-open', !isOpen);
    document.body.classList.toggle('menu-open', !isOpen);
  });

  menu?.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));
  window.addEventListener('resize', () => {
    if (window.innerWidth > 980) closeMenu();
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && menu?.classList.contains('is-open')) {
      closeMenu();
      menuButton?.focus();
    }
  });

  document.querySelectorAll('[data-year]').forEach((element) => {
    element.textContent = new Date().getFullYear();
  });

  toTop?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  const tabs = Array.from(document.querySelectorAll('[data-tab]'));
  if (tabs.length > 0) {
    const activateTab = (selectedTab) => {
      tabs.forEach((tab) => {
        const selected = tab === selectedTab;
        tab.classList.toggle('is-active', selected);
        tab.setAttribute('aria-selected', String(selected));
        const panel = document.getElementById(tab.dataset.tab || '');
        if (panel) panel.hidden = !selected;
      });
    };

    tabs.forEach((tab, index) => {
      tab.addEventListener('click', () => activateTab(tab));
      tab.addEventListener('keydown', (event) => {
        if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
        event.preventDefault();
        let nextIndex = index;
        if (event.key === 'ArrowRight') nextIndex = (index + 1) % tabs.length;
        if (event.key === 'ArrowLeft') nextIndex = (index - 1 + tabs.length) % tabs.length;
        if (event.key === 'Home') nextIndex = 0;
        if (event.key === 'End') nextIndex = tabs.length - 1;
        tabs[nextIndex].focus();
        activateTab(tabs[nextIndex]);
      });
    });
  }

  const carousel = document.querySelector('[data-carousel]');
  const previousButton = document.querySelector('[data-carousel-prev]');
  const nextButton = document.querySelector('[data-carousel-next]');

  if (carousel && previousButton && nextButton) {
    const scrollAmount = () => Math.min(carousel.clientWidth * 0.85, 650);
    const updateCarouselButtons = () => {
      const maxScroll = carousel.scrollWidth - carousel.clientWidth - 2;
      previousButton.disabled = carousel.scrollLeft <= 2;
      nextButton.disabled = carousel.scrollLeft >= maxScroll;
    };

    previousButton.addEventListener('click', () => {
      carousel.scrollBy({ left: -scrollAmount(), behavior: 'smooth' });
    });
    nextButton.addEventListener('click', () => {
      carousel.scrollBy({ left: scrollAmount(), behavior: 'smooth' });
    });
    carousel.addEventListener('scroll', updateCarouselButtons, { passive: true });
    window.addEventListener('resize', updateCarouselButtons);
    updateCarouselButtons();
  }

  const revealElements = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12 });
    revealElements.forEach((element) => observer.observe(element));
  } else {
    revealElements.forEach((element) => element.classList.add('is-visible'));
  }

  const galleryButtons = Array.from(document.querySelectorAll('[data-lightbox-src]'));
  const lightbox = document.querySelector('[data-lightbox]');
  const lightboxImage = document.querySelector('[data-lightbox-image]');
  const lightboxCaption = document.querySelector('[data-lightbox-caption]');
  const lightboxClose = document.querySelector('[data-lightbox-close]');
  let activeGalleryButton = null;

  const closeLightbox = () => {
    if (!lightbox) return;
    lightbox.classList.remove('is-open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('menu-open');
    activeGalleryButton?.focus();
  };

  galleryButtons.forEach((button) => {
    button.addEventListener('click', () => {
      if (!lightbox || !lightboxImage || !lightboxCaption) return;
      activeGalleryButton = button;
      lightboxImage.src = button.dataset.lightboxSrc || '';
      lightboxImage.alt = button.dataset.lightboxAlt || '';
      lightboxCaption.textContent = button.dataset.lightboxCaption || '';
      lightbox.classList.add('is-open');
      lightbox.setAttribute('aria-hidden', 'false');
      document.body.classList.add('menu-open');
      lightboxClose?.focus();
    });
  });

  lightboxClose?.addEventListener('click', closeLightbox);
  lightbox?.addEventListener('click', (event) => {
    if (event.target === lightbox) closeLightbox();
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && lightbox?.classList.contains('is-open')) closeLightbox();
  });
})();

document.addEventListener("DOMContentLoaded", function () {
    const modal = document.getElementById("themeModal");
    const cards = document.querySelectorAll(".theme-card-clickable");

    if (!modal || cards.length === 0) {
      return;
    }

    const modalCategory =
      document.getElementById("themeModalCategory");

    const modalTitle =
      document.getElementById("themeModalTitle");

    const modalImage =
      document.getElementById("themeModalImage");

    const modalDescription =
      document.getElementById("themeModalDescription");

    const modalSpots =
      document.getElementById("themeModalSpots");

    const modalSeason =
      document.getElementById("themeModalSeason");

    const modalArea =
      document.getElementById("themeModalArea");

    const modalStyle =
      document.getElementById("themeModalStyle");

    const closeElements =
      modal.querySelectorAll("[data-theme-close]");

    const closeButton = modal.querySelector(".theme-modal-close");
    const modalScroll = modal.querySelector(".theme-modal-scroll");

    let lastFocusedElement = null;


    function openThemeModal(card) {
      lastFocusedElement = document.activeElement;

      modalCategory.textContent =
        card.dataset.category || "";

      modalTitle.textContent =
        card.dataset.title || "";

      modalDescription.textContent =
        card.dataset.description || "";

      modalSpots.textContent =
        card.dataset.spots || "";

      modalSeason.textContent =
        card.dataset.season || "";

      modalArea.textContent =
        card.dataset.area || "";

      modalStyle.textContent =
        card.dataset.style || "";

      modalImage.src =
        card.dataset.image ||
        "assets/images/lalbagh-fort.webp";

      modalImage.alt =
        card.dataset.alt ||
        card.dataset.title ||
        "旅行テーマの画像";

      modalScroll?.scrollTo({ top: 0 });
      modal.classList.add("is-open");
      modal.setAttribute("aria-hidden", "false");
      document.body.classList.add("theme-modal-open");

      window.setTimeout(function () {
        closeButton?.focus();
      }, 100);
    }


    function closeThemeModal() {
      modal.classList.remove("is-open");
      modal.setAttribute("aria-hidden", "true");

      document.body.classList.remove("theme-modal-open");

      if (lastFocusedElement) {
        lastFocusedElement.focus();
      }
    }


    cards.forEach(function (card) {
      card.addEventListener("click", function () {
        openThemeModal(card);
      });

      card.addEventListener("keydown", function (event) {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          openThemeModal(card);
        }
      });
    });


    closeElements.forEach(function (element) {
      element.addEventListener("click", function () {
        closeThemeModal();
      });
    });


    document.addEventListener("keydown", function (event) {
      if (!modal.classList.contains("is-open")) return;

      if (event.key === "Escape") {
        closeThemeModal();
        return;
      }

      if (event.key === "Tab") {
        const focusable = Array.from(
          modal.querySelectorAll('button:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])')
        ).filter((element) => element.offsetParent !== null);

        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    });
  });

  document.addEventListener("DOMContentLoaded", function () {
    const divisionData = {
      rangpur: {
        category: "行政管区",
        title: "ランプル管区",
        description:
          "バングラデシュ北部に位置し、農業、歴史的建築、静かな田園風景で知られています。",
        location: "バングラデシュ北部",
        highlight: "タジハット宮殿、カントジ寺院、田園風景",
        season: "10月〜3月"
      },

      rajshahi: {
        category: "行政管区",
        title: "ラジシャヒ管区",
        description:
          "歴史的遺跡やマンゴーの産地として有名です。世界遺産のパハルプール仏教遺跡があります。",
        location: "バングラデシュ西部",
        highlight: "パハルプール仏教遺跡、プティア寺院群",
        season: "10月〜3月"
      },

      mymensingh: {
        category: "行政管区",
        title: "マイメンシン管区",
        description:
          "川、森林、丘陵などの自然が広がり、ビリシリやマドゥプル国立公園を楽しめます。",
        location: "バングラデシュ中北部",
        highlight: "ビリシリ、マドゥプル国立公園",
        season: "10月〜3月"
      },

      sylhet: {
        category: "行政管区",
        title: "シレット管区",
        description:
          "美しい茶園、湿地林、透明度の高い川など、緑豊かな自然で知られています。",
        location: "バングラデシュ北東部",
        highlight: "シュリーモンゴル、ラタルグル湿地林、ジャフロン",
        season: "10月〜4月"
      },

      dhaka: {
        category: "行政管区",
        title: "ダッカ管区",
        description:
          "首都ダッカを中心に、歴史的な要塞、宮殿、博物館、市場などを楽しめます。",
        location: "バングラデシュ中央部",
        highlight: "ラルバグ要塞、アーサン・マンジル、ショナールガオン",
        season: "10月〜3月"
      },

      khulna: {
        category: "行政管区",
        title: "クルナ管区",
        description:
          "世界最大級のマングローブ林であるスンダルバンスへの玄関口として知られています。",
        location: "バングラデシュ南西部",
        highlight: "スンダルバンス、バゲルハートのモスク都市",
        season: "11月〜3月"
      },

      barisal: {
        category: "行政管区",
        title: "バリサル管区",
        description:
          "多くの川と水路が広がり、クアカタでは朝日と夕日の両方を楽しめます。",
        location: "バングラデシュ南部",
        highlight: "クアカタ、水上マーケット、河川風景",
        season: "11月〜3月"
      },

      chattogram: {
        category: "行政管区",
        title: "チッタゴン管区",
        description:
          "海岸、島、丘陵地帯が集まる、バングラデシュを代表する観光地域です。",
        location: "バングラデシュ南東部",
        highlight:
          "コックスバザール、サジェック、バンダルバン、セント・マーティン島",
        season: "11月〜3月"
      }
    };


    const placeData = {
      dhaka: {
        category: "都市・歴史",
        title: "ダッカ",
        description:
          "バングラデシュの首都です。歴史的建築、活気ある市場、博物館、伝統料理を楽しめます。",
        location: "ダッカ管区",
        highlight:
          "ラルバグ要塞、アーサン・マンジル、国会議事堂",
        season: "10月〜3月"
      },

      paharpur: {
        category: "世界遺産",
        title: "パハルプール",
        description:
          "古代仏教寺院の遺跡で、バングラデシュを代表する世界文化遺産です。",
        location: "ラジシャヒ管区",
        highlight: "ソーマプラ大僧院、博物館、考古学遺跡",
        season: "10月〜3月"
      },

      srimangal: {
        category: "茶園・自然",
        title: "シュリーモンゴル",
        description:
          "広大な茶園と静かな自然風景で知られ、バングラデシュの茶の都と呼ばれています。",
        location: "シレット管区",
        highlight: "茶園、ラワチャラ国立公園、七層茶",
        season: "10月〜4月"
      },

      sundarbans: {
        category: "世界自然遺産",
        title: "スンダルバンス",
        description:
          "世界最大級のマングローブ林です。船で森林や野生動物を観察できます。",
        location: "クルナ管区",
        highlight: "マングローブ林、ボートツアー、野生動物",
        season: "11月〜3月"
      },

      kuakata: {
        category: "海岸",
        title: "クアカタ",
        description:
          "同じ海岸から朝日と夕日の両方を眺められることで知られる静かなビーチです。",
        location: "バリサル管区",
        highlight: "砂浜、朝日、夕日、海鮮料理",
        season: "11月〜3月"
      },

      sajek: {
        category: "丘陵・自然",
        title: "サジェック・バレー",
        description:
          "雲に包まれた丘陵と美しい朝日を楽しめる人気の高原観光地です。",
        location: "チッタゴン管区",
        highlight: "丘陵、雲海、朝日、先住民族文化",
        season: "10月〜3月"
      },

      cox: {
        category: "海岸",
        title: "コックスバザール",
        description:
          "長い天然砂浜で有名な、バングラデシュを代表する海岸リゾートです。",
        location: "チッタゴン管区",
        highlight:
          "コックスバザール海岸、イナニ・ビーチ、ヒムチョリ",
        season: "11月〜3月"
      },

      "saint-martin": {
        category: "島",
        title: "セント・マーティン島",
        description:
          "青い海とサンゴで知られる、バングラデシュ唯一のサンゴ島です。",
        location: "チッタゴン管区",
        highlight: "サンゴ、海岸、ボート、海鮮料理",
        season: "11月〜2月"
      }
    };


    const detailCategory =
      document.getElementById("mapDetailCategory");

    const detailTitle =
      document.getElementById("mapDetailTitle");

    const detailDescription =
      document.getElementById("mapDetailDescription");

    const detailLocation =
      document.getElementById("mapDetailLocation");

    const detailHighlight =
      document.getElementById("mapDetailHighlight");

    const detailSeason =
      document.getElementById("mapDetailSeason");

    const divisionShapes =
      document.querySelectorAll(".division-shape");

    const mapMarkers =
      document.querySelectorAll(".map-marker");

    const resetButton =
      document.getElementById("mapResetButton");


    function updateDetail(data) {
      detailCategory.textContent = data.category;
      detailTitle.textContent = data.title;
      detailDescription.textContent = data.description;
      detailLocation.textContent = data.location;
      detailHighlight.textContent = data.highlight;
      detailSeason.textContent = data.season;
    }


    function clearActiveState() {
      divisionShapes.forEach(function (shape) {
        shape.classList.remove("is-active");
      });

      mapMarkers.forEach(function (marker) {
        marker.classList.remove("is-active");
      });
    }


    divisionShapes.forEach(function (shape) {
      shape.addEventListener("click", function () {
        const divisionName = shape.dataset.division;
        const data = divisionData[divisionName];

        if (!data) {
          return;
        }

        clearActiveState();
        shape.classList.add("is-active");
        updateDetail(data);
      });
    });


    mapMarkers.forEach(function (marker) {
      function selectMarker() {
        const placeName = marker.dataset.place;
        const data = placeData[placeName];

        if (!data) {
          return;
        }

        clearActiveState();
        marker.classList.add("is-active");
        updateDetail(data);
      }

      marker.addEventListener("click", selectMarker);

      marker.addEventListener("keydown", function (event) {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          selectMarker();
        }
      });
    });


    resetButton.addEventListener("click", function () {
      clearActiveState();

      updateDetail({
        category: "日本語観光マップ",
        title: "地図をクリックしてください",
        description:
          "行政管区または観光地を選択すると、この場所に詳しい説明が表示されます。",
        location: "バングラデシュ",
        highlight: "歴史、自然、海岸、文化",
        season: "10月〜3月"
      });
    });
  });