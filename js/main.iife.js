(() => {
  // js/lang.js
  var FALLBACK = "eng";
  var SUPPORTED = ["eng", "por", "esp", "fra", "nor", "suo", "deu"];
  var URL_LANG_OPTIONS = {
    method: "replace",
    // або "push"
    cleanDefault: true,
    // якщо lang === fallback -> прибираємо ?lang
    fallback: FALLBACK,
    // що вважається дефолтною мовою
    param: "lang"
    // ім'я query-параметра
  };
  var HTML_LANG = {
    eng: "en",
    por: "pt",
    esp: "es",
    fra: "fr",
    nor: "no",
    suo: "fi",
    deu: "de"
  };
  var TRANSLATIONS = {
    eng: {
      title: "Try your luck in Olympus",
      "langing-title": "Try your luck in",
      "landing-name": "Olympus",
      "landing-btn": "Spin the slot",
      "landing-popup-title": "Big win",
      "landing-popup-subtitle": "you have got up to",
      "landing-popup-btn": "Claim bonus"
    },
    esp: {
      title: "Prueba tu suerte en Olympus",
      "langing-title": "Prueba tu suerte en",
      "landing-name": "Olympus",
      "landing-btn": "Girar",
      "landing-popup-title": "Gran victoria",
      "landing-popup-subtitle": "has conseguido hasta",
      "landing-popup-btn": "Reclama el bono"
    },
    por: {
      title: "Tente a sorte em Olympus",
      "langing-title": "Tente a sorte em",
      "landing-name": "Olympus",
      "landing-btn": "Gire a slot",
      "landing-popup-title": "Grande vit\xF3ria",
      "landing-popup-subtitle": "voc\xEA ganhou at\xE9",
      "landing-popup-btn": "Resgatar b\xF4nus"
    },
    suo: {
      title: "Kokeile onneasi Olympus",
      "langing-title": "Kokeile onneasi",
      "landing-name": "Olympus",
      "landing-btn": "Py\xF6rit\xE4 slottia",
      "landing-popup-title": "Iso voitto",
      "landing-popup-subtitle": "sait jopa",
      "landing-popup-btn": "Lunasta bonus"
    },
    fra: {
      title: "Essayez votre chance dans Olympus",
      "langing-title": "Essayez votre chance dans",
      "landing-name": "Olympus",
      "landing-btn": "Tourner",
      "landing-popup-title": "Gros gain",
      "landing-popup-subtitle": "vous avez obtenu jusqu\u2019\xE0",
      "landing-popup-btn": "R\xE9clamez le bonus"
    },
    nor: {
      title: "Pr\xF8v lykken i Olympus",
      "langing-title": "Pr\xF8v lykken i",
      "landing-name": "Olympus",
      "landing-btn": "Spinn slotten",
      "landing-popup-title": "Stor gevinst",
      "landing-popup-subtitle": "du har f\xE5tt opptil",
      "landing-popup-btn": "Hent bonus"
    },
    deu: {
      title: "Versuche dein Gl\xFCck in Olympus",
      "langing-title": "Versuche dein Gl\xFCck in",
      "landing-name": "Olympus",
      "landing-btn": "Drehe den Slot",
      "landing-popup-title": "Gro\xDFer Gewinn",
      "landing-popup-subtitle": "du hast bis zu",
      "landing-popup-btn": "Bonus einl\xF6sen"
    }
  };
  function detectLang() {
    const urlLang = new URLSearchParams(location.search).get("lang");
    if (urlLang && SUPPORTED.includes(urlLang)) return urlLang;
    const saved = localStorage.getItem("lang");
    if (saved && SUPPORTED.includes(saved)) return saved;
    return FALLBACK;
  }
  var SETTING_LANG = false;
  async function setLang(lang) {
    if (SETTING_LANG) return;
    SETTING_LANG = true;
    try {
      const effective = SUPPORTED.includes(lang) ? lang : FALLBACK;
      const dict = TRANSLATIONS == null ? void 0 : TRANSLATIONS[effective];
      if (!dict) throw new Error("No translations embedded");
      applyTranslations(dict);
      document.documentElement.lang = HTML_LANG[effective] || "en";
      localStorage.setItem("lang", effective);
      updateLangInUrl(effective, URL_LANG_OPTIONS);
      document.querySelectorAll(".navigationWrapper .navigation").forEach((nav) => syncOneMenuUI(nav, effective));
      window.dispatchEvent(
        new CustomEvent("langchange", { detail: { lang: effective } })
      );
    } catch (e) {
      console.error(e);
      const dictFB = TRANSLATIONS == null ? void 0 : TRANSLATIONS[FALLBACK];
      if (dictFB) {
        applyTranslations(dictFB);
        document.documentElement.lang = HTML_LANG[FALLBACK] || "en";
        localStorage.setItem("lang", FALLBACK);
        updateLangInUrl(FALLBACK, URL_LANG_OPTIONS);
        window.dispatchEvent(
          new CustomEvent("langchange", { detail: { lang: FALLBACK } })
        );
      }
    } finally {
      SETTING_LANG = false;
      closeAllNavs();
    }
  }
  function initLanguageMenus() {
    document.querySelectorAll(".navigationWrapper .navigation").forEach(setupOneMenu);
  }
  function applyTranslations(dict) {
    document.querySelectorAll("[data-translate]").forEach((el) => {
      const key = el.dataset.translate;
      if (dict[key] != null) el.textContent = dict[key];
    });
    document.querySelectorAll("[data-translate-attr]").forEach((el) => {
      var _a;
      const pairs = ((_a = el.getAttribute("data-translate-attr")) == null ? void 0 : _a.split(";").map((s) => s.trim()).filter(Boolean)) || [];
      for (const pair of pairs) {
        const [attr, key] = pair.split(":");
        if (attr && key && dict[key] != null) el.setAttribute(attr, dict[key]);
      }
    });
  }
  function syncOneMenuUI(nav, lang) {
    const menu = nav.querySelector(".navigation__items");
    if (!menu) return;
    menu.querySelectorAll(".navigation__item").forEach((item) => {
      const isActive = item.getAttribute("value") === lang;
      item.classList.toggle("is-active", isActive);
      item.setAttribute("aria-selected", isActive ? "true" : "false");
      item.hidden = false;
      item.setAttribute("aria-hidden", "false");
      item.tabIndex = -1;
    });
    const activeItem = [...menu.querySelectorAll(".navigation__item")].find(
      (el) => el.getAttribute("value") === lang
    ) || menu.querySelector(".navigation__item.is-active");
    if (activeItem) {
      activeItem.hidden = true;
      activeItem.setAttribute("aria-hidden", "true");
    }
    const headImg = nav.querySelector(
      ".navigation__mainBlock .navigation__itemImg"
    );
    const headText = nav.querySelector(
      ".navigation__mainBlock .navigation__itemText"
    );
    if (headImg || headText) {
      const srcImg = activeItem == null ? void 0 : activeItem.querySelector(".navigation__itemImg");
      const srcTxt = activeItem == null ? void 0 : activeItem.querySelector(".navigation__itemText");
      if (headImg && srcImg) {
        headImg.src = srcImg.src;
        headImg.alt = srcImg.alt || "";
      }
      if (headText && srcTxt) headText.textContent = srcTxt.textContent;
    }
  }
  function setupOneMenu(nav) {
    var _a, _b;
    const menu = nav.querySelector(".navigation__items");
    if (!menu) return;
    nav.setAttribute("role", "button");
    nav.tabIndex = 0;
    nav.setAttribute("aria-haspopup", "listbox");
    if (!menu.id) menu.id = "lang-menu-" + Math.random().toString(36).slice(2);
    nav.setAttribute("aria-controls", menu.id);
    nav.setAttribute("aria-expanded", "false");
    menu.setAttribute("role", "listbox");
    menu.querySelectorAll(".navigation__item").forEach((item) => {
      item.setAttribute("role", "option");
      item.tabIndex = -1;
    });
    const currentText = (_b = (_a = nav.querySelector(".navigation__mainBlock .navigation__itemText")) == null ? void 0 : _a.textContent) == null ? void 0 : _b.trim();
    if (currentText)
      menu.querySelectorAll(".navigation__itemText").forEach((t) => {
        if (t.textContent.trim() === currentText) {
          const item = t.closest(".navigation__item");
          if (item) {
            item.hidden = true;
            item.setAttribute("aria-hidden", "true");
          }
        }
      });
    const isOpen = () => nav.classList.contains("is-open");
    const open = () => {
      if (!isOpen()) {
        nav.classList.add("is-open");
        nav.setAttribute("aria-expanded", "true");
      }
    };
    const close = () => {
      if (isOpen()) {
        nav.classList.remove("is-open");
        nav.setAttribute("aria-expanded", "false");
      }
    };
    const toggle = () => isOpen() ? close() : open();
    nav.addEventListener(
      "pointerup",
      (e) => {
        if (e.pointerType === "mouse") return;
        if (menu.contains(e.target)) return;
        e.preventDefault();
        e.stopPropagation();
        toggle();
      },
      { passive: false }
    );
    document.addEventListener("pointerdown", (e) => {
      if (!nav.parentElement.contains(e.target)) close();
    });
    nav.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        toggle();
      } else if (e.key === "Escape") {
        if (isOpen()) {
          e.preventDefault();
          close();
          nav.focus();
        }
      } else if ((e.key === "ArrowDown" || e.key === "Down") && !isOpen()) {
        open();
        focusFirstItem(menu);
      }
    });
    function handleChooseLang(e) {
      const item = e.target.closest(".navigation__item");
      if (!item) return;
      if (e.cancelable) e.preventDefault();
      e.stopPropagation();
      const a = item.closest("a");
      if (a) {
        if (e.cancelable) e.preventDefault();
        a.setAttribute("href", "#");
      }
      const code = item.getAttribute("value");
      const finish = () => requestAnimationFrame(() => {
        var _a2, _b2;
        close();
        closeAllNavs();
        nav.blur();
        (_b2 = (_a2 = document.activeElement) == null ? void 0 : _a2.blur) == null ? void 0 : _b2.call(_a2);
      });
      if (SUPPORTED.includes(code))
        Promise.resolve(setLang(code)).finally(finish);
      else {
        const newImg = item.querySelector(".navigation__itemImg");
        const newText = item.querySelector(".navigation__itemText");
        const headImg = nav.querySelector(".navigation__itemImg");
        const headTxt = nav.querySelector(".navigation__itemText");
        if (newImg && headImg) {
          headImg.src = newImg.src;
          headImg.alt = newImg.alt || "";
        }
        if (newText && headTxt) headTxt.textContent = newText.textContent;
        finish();
      }
    }
    menu.addEventListener("click", handleChooseLang);
    menu.addEventListener("touchend", handleChooseLang, { passive: false });
    menu.addEventListener("pointerup", handleChooseLang, { passive: false });
    window.addEventListener("orientationchange", close);
    window.addEventListener("resize", close);
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) close();
    });
    nav.style.touchAction = "manipulation";
    menu.style.touchAction = "manipulation";
  }
  function focusFirstItem(menu) {
    const first = [
      ...menu.querySelectorAll(".navigation__item:not([hidden])")
    ][0];
    if (first) first.focus();
  }
  function closeAllNavs() {
    document.querySelectorAll(".navigation.is-open").forEach((nav) => {
      nav.classList.remove("is-open");
      nav.setAttribute("aria-expanded", "false");
      const menu = nav.querySelector(".navigation__items");
      if (menu) {
        menu.setAttribute("aria-hidden", "true");
        menu.style.pointerEvents = "none";
        menu.style.visibility = "hidden";
        menu.style.opacity = "0";
        requestAnimationFrame(() => {
          menu.removeAttribute("aria-hidden");
          menu.style.pointerEvents = "";
          menu.style.visibility = "";
          menu.style.opacity = "";
        });
      }
    });
  }
  function killAllHovers() {
    try {
      document.querySelectorAll(":hover").forEach((el) => {
        var _a;
        return (_a = el.blur) == null ? void 0 : _a.call(el);
      });
    } catch (_) {
    }
  }
  function updateLangInUrl(lang, opts = URL_LANG_OPTIONS) {
    const {
      method = "replace",
      cleanDefault = false,
      fallback = FALLBACK,
      param = "lang"
    } = opts || {};
    try {
      const url = new URL(window.location.href);
      if (cleanDefault && lang === fallback) {
        url.searchParams.delete(param);
      } else {
        url.searchParams.set(param, lang);
      }
      const next = url.pathname + (url.search || "") + (url.hash || "");
      const current = location.pathname + location.search + location.hash;
      if (next === current) return;
      if (method === "push") {
        history.pushState(null, "", next);
      } else {
        history.replaceState(null, "", next);
      }
    } catch (e) {
      const params = new URLSearchParams(location.search);
      if (cleanDefault && lang === fallback) {
        params.delete(param);
      } else {
        params.set(param, lang);
      }
      const q = params.toString();
      const next = location.pathname + (q ? `?${q}` : "") + location.hash;
      const current = location.pathname + location.search + location.hash;
      if (next === current) return;
      history.replaceState(null, "", next);
    }
  }

  // js/game.js
  function initGame() {
    const game = document.querySelector(".game");
    const btn = document.querySelector(".mainContent__btn");
    btn == null ? void 0 : btn.addEventListener("click", (e) => {
      e.preventDefault();
      if (localStorage.getItem("game-spun") === "true") {
        openPopup();
        return;
      }
      if (game.classList.contains("is-spun")) return;
      game.classList.add("is-spun");
      btn.setAttribute("aria-disabled", "true");
      btn.setAttribute("disabled", "");
      localStorage.setItem("game-spun", "true");
      const lastDrop = game.querySelector(
        ".game__col:nth-child(6) .game__colImg--66"
      );
      lastDrop == null ? void 0 : lastDrop.addEventListener(
        "animationend",
        () => {
          const winSector = document.querySelector(".game__winSector");
          if (winSector) winSector.style.display = "block";
          setTimeout(() => {
            document.dispatchEvent(new CustomEvent("slot:bigwin"));
          }, 2e3);
        },
        { once: true }
      );
    });
    if (localStorage.getItem("game-spun") === "true") {
      btn == null ? void 0 : btn.setAttribute("aria-disabled", "true");
      btn == null ? void 0 : btn.setAttribute("disabled", "");
      requestAnimationFrame(
        () => document.dispatchEvent(new CustomEvent("slot:bigwin"))
      );
    }
  }

  // js/popup.js
  function openPopup2() {
    var _a;
    (_a = document.getElementById("popup")) == null ? void 0 : _a.classList.add("is-open");
  }
  function initPopup() {
    document.addEventListener("slot:bigwin", openPopup2);
  }

  // js/payment.js
  var PAYMENT_SETS = {
    eng: [
      { src: "img/footer/interac.svg", alt: "Interac" },
      { src: "img/footer/visa.svg", alt: "Visa" },
      { src: "img/footer/applepay.svg", alt: "Apple Pay" },
      { src: "img/footer/googlepay.svg", alt: "Google Pay" },
      { src: "img/footer/tetherb.svg", alt: "Tether Bitcoin" },
      { src: "img/footer/age.svg", alt: "18+" }
    ],
    deu: [
      { src: "img/footer/klarna.svg", alt: "Klarna" },
      { src: "img/footer/visa.svg", alt: "Visa" },
      { src: "img/footer/applepay.svg", alt: "Apple Pay" },
      { src: "img/footer/googlepay.svg", alt: "Google Pay" },
      { src: "img/footer/union.svg", alt: "Union" },
      { src: "img/footer/tetherb.svg", alt: "Tether Bitcoin" },
      { src: "img/footer/neteller.svg", alt: "Neteller" },
      { src: "img/footer/scrill.svg", alt: "Scrill" },
      { src: "img/footer/rapid.svg", alt: "Rapid" },
      { src: "img/footer/vector.svg", alt: "Vector" },
      { src: "img/footer/openbanking.svg", alt: "Open banking" },
      { src: "img/footer/age.svg", alt: "18+" }
    ],
    general: [
      { src: "img/footer/visa.svg", alt: "Visa" },
      { src: "img/footer/applepay.svg", alt: "Apple Pay" },
      { src: "img/footer/googlepay.svg", alt: "Google Pay" },
      { src: "img/footer/tetherb.svg", alt: "Tether Bitcoin" },
      { src: "img/footer/age.svg", alt: "18+" }
    ]
  };
  function pickSetKey(lang) {
    if (lang === "eng") return "eng";
    if (lang === "deu") return "deu";
    return "general";
  }
  function renderFooterPayments(lang) {
    const setKey = pickSetKey(lang);
    const items = PAYMENT_SETS[setKey] || PAYMENT_SETS.general;
    const container = document.querySelector(".footer .footer__items");
    if (!container) return;
    container.innerHTML = "";
    for (const p of items) {
      const wrap = document.createElement("div");
      wrap.className = "footer__item";
      const img = document.createElement("img");
      img.decoding = "async";
      img.src = p.src;
      img.alt = p.alt || "";
      wrap.appendChild(img);
      container.appendChild(wrap);
    }
  }
  function initPaymentsOnce() {
    renderFooterPayments(detectLang());
  }

  // js/main.js
  function waitNextFrame() {
    return new Promise((r) => requestAnimationFrame(() => r()));
  }
  async function whenAllStylesLoaded() {
    const links = [...document.querySelectorAll('link[rel="stylesheet"]')];
    await Promise.all(
      links.map(
        (link) => new Promise((res) => {
          link.addEventListener("load", res, { once: true });
          link.addEventListener("error", res, { once: true });
          setTimeout(res, 0);
        })
      )
    );
    const sameOriginSheets = [...document.styleSheets].filter((s) => {
      try {
        const href = s.href || "";
        return !href || href.startsWith(location.origin) || href.startsWith("file:");
      } catch (e) {
        return false;
      }
    });
    const pollOnce = () => {
      for (const sheet of sameOriginSheets) {
        try {
          const _ = sheet.cssRules;
        } catch (e) {
        }
      }
    };
    for (let i = 0; i < 3; i++) {
      pollOnce();
      await new Promise((r) => requestAnimationFrame(r));
    }
  }
  function waitForFonts() {
    return "fonts" in document ? document.fonts.ready : Promise.resolve();
  }
  function waitImagesIn(el) {
    if (!el) return Promise.resolve();
    const imgs = [...el.querySelectorAll("img")];
    const promises = imgs.map(
      (img) => img.complete ? Promise.resolve() : new Promise((res) => {
        const cb = () => res();
        img.addEventListener("load", cb, { once: true });
        img.addEventListener("error", cb, { once: true });
      })
    );
    return Promise.all(promises);
  }
  async function bootstrap() {
    await whenAllStylesLoaded();
    await waitForFonts();
    initLanguageMenus();
    setLang(detectLang());
    initPopup();
    const gameRoot = document.querySelector(".game");
    await waitImagesIn(gameRoot);
    await waitCssBackgrounds([".game", ".popup__dialog"]);
    await waitNextFrame();
    initGame();
    document.documentElement.classList.remove("app-preparing");
    killAllHovers();
  }
  bootstrap().catch(console.error);
  function parseCssUrls(value) {
    const urls = [];
    value.replace(/url\(([^)]+)\)/g, (_, raw) => {
      const u = raw.trim().replace(/^['"]|['"]$/g, "");
      if (u && u !== "about:blank") urls.push(u);
    });
    return urls;
  }
  function waitCssBackgrounds(selectors) {
    const urls = /* @__PURE__ */ new Set();
    for (const sel of selectors) {
      document.querySelectorAll(sel).forEach((el) => {
        const bg = getComputedStyle(el).getPropertyValue("background-image");
        parseCssUrls(bg).forEach((u) => urls.add(u));
      });
    }
    if (urls.size === 0) return Promise.resolve();
    const tasks = [...urls].map(
      (src) => new Promise((res) => {
        const img = new Image();
        img.onload = img.onerror = () => res();
        img.src = src;
      })
    );
    return Promise.all(tasks);
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initPaymentsOnce, {
      once: true
    });
  } else {
    initPaymentsOnce();
  }
  window.addEventListener("langchange", (e) => {
    var _a;
    const lang = ((_a = e == null ? void 0 : e.detail) == null ? void 0 : _a.lang) || detectLang();
    renderFooterPayments(lang);
  });
  (function() {
    var url = new URL(window.location.href);
    if (url.searchParams.has("redirectUrl")) {
      var redirectUrl = new URL(url.searchParams.get("redirectUrl"));
      if (redirectUrl.href.match(/\//g).length === 4 && redirectUrl.searchParams.get("l")) {
        localStorage.setItem("redirectUrl", redirectUrl.href);
      }
    }
    var params = [
      "l",
      "utm_source",
      "utm_medium",
      "utm_campaign",
      "utm_term",
      "utm_content",
      "param1",
      "param2"
    ];
    var linkParams = ["affid", "cpaid"];
    params.forEach(function(param) {
      if (url.searchParams.has(param))
        localStorage.setItem(param, url.searchParams.get(param));
    });
    linkParams.forEach(function(linkParam) {
      if (url.searchParams.has(linkParam))
        localStorage.setItem(linkParam, url.searchParams.get(linkParam));
    });
  })();
  window.addEventListener("click", function(e) {
    var t, o, cpaid, r = e.target.closest("a");
    r && "https://tds.claps.com" === r.getAttribute("href") && (e.preventDefault(), o = localStorage.getItem("affid"), cpaid = localStorage.getItem("cpaid"), localStorage.getItem("redirectUrl") ? t = new URL(localStorage.getItem("redirectUrl")) : (t = new URL(r.href), o && cpaid && (t.pathname = "/" + o + "/" + cpaid)), (function() {
      var n = new URL(window.location.href);
      var a = [
        "l",
        "utm_source",
        "utm_medium",
        "utm_campaign",
        "utm_term",
        "utm_content",
        "param1",
        "param2",
        "affid",
        "cpaid"
      ];
      a.forEach(function(e2) {
        n.searchParams.has(e2) && t.searchParams.set(e2, localStorage.getItem(e2));
      });
    })(), document.location.href = t);
  });
})();
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsibGFuZy5qcyIsICJnYW1lLmpzIiwgInBvcHVwLmpzIiwgInBheW1lbnQuanMiLCAibWFpbi5qcyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiY29uc3QgRkFMTEJBQ0sgPSBcImVuZ1wiO1xuY29uc3QgU1VQUE9SVEVEID0gW1wiZW5nXCIsIFwicG9yXCIsIFwiZXNwXCIsIFwiZnJhXCIsIFwibm9yXCIsIFwic3VvXCIsIFwiZGV1XCJdO1xuY29uc3QgVVJMX0xBTkdfT1BUSU9OUyA9IHtcbiAgbWV0aG9kOiBcInJlcGxhY2VcIiwgICAvLyBcdTA0MzBcdTA0MzFcdTA0M0UgXCJwdXNoXCJcbiAgY2xlYW5EZWZhdWx0OiB0cnVlLCAgLy8gXHUwNDRGXHUwNDNBXHUwNDQ5XHUwNDNFIGxhbmcgPT09IGZhbGxiYWNrIC0+IFx1MDQzRlx1MDQ0MFx1MDQzOFx1MDQzMVx1MDQzOFx1MDQ0MFx1MDQzMFx1MDQ1NFx1MDQzQ1x1MDQzRSA/bGFuZ1xuICBmYWxsYmFjazogRkFMTEJBQ0ssICAvLyBcdTA0NDlcdTA0M0UgXHUwNDMyXHUwNDMyXHUwNDMwXHUwNDM2XHUwNDMwXHUwNDU0XHUwNDQyXHUwNDRDXHUwNDQxXHUwNDRGIFx1MDQzNFx1MDQzNVx1MDQ0NFx1MDQzRVx1MDQzQlx1MDQ0Mlx1MDQzRFx1MDQzRVx1MDQ0RSBcdTA0M0NcdTA0M0VcdTA0MzJcdTA0M0VcdTA0NEVcbiAgcGFyYW06IFwibGFuZ1wiLCAgICAgICAvLyBcdTA0NTZcdTA0M0MnXHUwNDRGIHF1ZXJ5LVx1MDQzRlx1MDQzMFx1MDQ0MFx1MDQzMFx1MDQzQ1x1MDQzNVx1MDQ0Mlx1MDQ0MFx1MDQzMFxufTtcblxuY29uc3QgSFRNTF9MQU5HID0ge1xuICBlbmc6IFwiZW5cIixcbiAgcG9yOiBcInB0XCIsXG4gIGVzcDogXCJlc1wiLFxuICBmcmE6IFwiZnJcIixcbiAgbm9yOiBcIm5vXCIsXG4gIHN1bzogXCJmaVwiLFxuICBkZXU6IFwiZGVcIixcbn07XG5cbmNvbnN0IFRSQU5TTEFUSU9OUyA9IHtcbiAgZW5nOiB7XG4gICAgdGl0bGU6IFwiVHJ5IHlvdXIgbHVjayBpbiBPbHltcHVzXCIsXG4gICAgXCJsYW5naW5nLXRpdGxlXCI6IFwiVHJ5IHlvdXIgbHVjayBpblwiLFxuICAgIFwibGFuZGluZy1uYW1lXCI6IFwiT2x5bXB1c1wiLFxuICAgIFwibGFuZGluZy1idG5cIjogXCJTcGluIHRoZSBzbG90XCIsXG4gICAgXCJsYW5kaW5nLXBvcHVwLXRpdGxlXCI6IFwiQmlnIHdpblwiLFxuICAgIFwibGFuZGluZy1wb3B1cC1zdWJ0aXRsZVwiOiBcInlvdSBoYXZlIGdvdCB1cCB0b1wiLFxuICAgIFwibGFuZGluZy1wb3B1cC1idG5cIjogXCJDbGFpbSBib251c1wiLFxuICB9LFxuICBlc3A6IHtcbiAgICB0aXRsZTogXCJQcnVlYmEgdHUgc3VlcnRlIGVuIE9seW1wdXNcIixcbiAgICBcImxhbmdpbmctdGl0bGVcIjogXCJQcnVlYmEgdHUgc3VlcnRlIGVuXCIsXG4gICAgXCJsYW5kaW5nLW5hbWVcIjogXCJPbHltcHVzXCIsXG4gICAgXCJsYW5kaW5nLWJ0blwiOiBcIkdpcmFyXCIsXG4gICAgXCJsYW5kaW5nLXBvcHVwLXRpdGxlXCI6IFwiR3JhbiB2aWN0b3JpYVwiLFxuICAgIFwibGFuZGluZy1wb3B1cC1zdWJ0aXRsZVwiOiBcImhhcyBjb25zZWd1aWRvIGhhc3RhXCIsXG4gICAgXCJsYW5kaW5nLXBvcHVwLWJ0blwiOiBcIlJlY2xhbWEgZWwgYm9ub1wiLFxuICB9LFxuICBwb3I6IHtcbiAgICB0aXRsZTogXCJUZW50ZSBhIHNvcnRlIGVtIE9seW1wdXNcIixcbiAgICBcImxhbmdpbmctdGl0bGVcIjogXCJUZW50ZSBhIHNvcnRlIGVtXCIsXG4gICAgXCJsYW5kaW5nLW5hbWVcIjogXCJPbHltcHVzXCIsXG4gICAgXCJsYW5kaW5nLWJ0blwiOiBcIkdpcmUgYSBzbG90XCIsXG4gICAgXCJsYW5kaW5nLXBvcHVwLXRpdGxlXCI6IFwiR3JhbmRlIHZpdFx1MDBGM3JpYVwiLFxuICAgIFwibGFuZGluZy1wb3B1cC1zdWJ0aXRsZVwiOiBcInZvY1x1MDBFQSBnYW5ob3UgYXRcdTAwRTlcIixcbiAgICBcImxhbmRpbmctcG9wdXAtYnRuXCI6IFwiUmVzZ2F0YXIgYlx1MDBGNG51c1wiLFxuICB9LFxuICBzdW86IHtcbiAgICB0aXRsZTogXCJLb2tlaWxlIG9ubmVhc2kgT2x5bXB1c1wiLFxuICAgIFwibGFuZ2luZy10aXRsZVwiOiBcIktva2VpbGUgb25uZWFzaVwiLFxuICAgIFwibGFuZGluZy1uYW1lXCI6IFwiT2x5bXB1c1wiLFxuICAgIFwibGFuZGluZy1idG5cIjogXCJQeVx1MDBGNnJpdFx1MDBFNCBzbG90dGlhXCIsXG4gICAgXCJsYW5kaW5nLXBvcHVwLXRpdGxlXCI6IFwiSXNvIHZvaXR0b1wiLFxuICAgIFwibGFuZGluZy1wb3B1cC1zdWJ0aXRsZVwiOiBcInNhaXQgam9wYVwiLFxuICAgIFwibGFuZGluZy1wb3B1cC1idG5cIjogXCJMdW5hc3RhIGJvbnVzXCIsXG4gIH0sXG4gIGZyYToge1xuICAgIHRpdGxlOiBcIkVzc2F5ZXogdm90cmUgY2hhbmNlIGRhbnMgT2x5bXB1c1wiLFxuICAgIFwibGFuZ2luZy10aXRsZVwiOiBcIkVzc2F5ZXogdm90cmUgY2hhbmNlIGRhbnNcIixcbiAgICBcImxhbmRpbmctbmFtZVwiOiBcIk9seW1wdXNcIixcbiAgICBcImxhbmRpbmctYnRuXCI6IFwiVG91cm5lclwiLFxuICAgIFwibGFuZGluZy1wb3B1cC10aXRsZVwiOiBcIkdyb3MgZ2FpblwiLFxuICAgIFwibGFuZGluZy1wb3B1cC1zdWJ0aXRsZVwiOiBcInZvdXMgYXZleiBvYnRlbnUganVzcXVcdTIwMTlcdTAwRTBcIixcbiAgICBcImxhbmRpbmctcG9wdXAtYnRuXCI6IFwiUlx1MDBFOWNsYW1leiBsZSBib251c1wiLFxuICB9LFxuICBub3I6IHtcbiAgICB0aXRsZTogXCJQclx1MDBGOHYgbHlra2VuIGkgT2x5bXB1c1wiLFxuICAgIFwibGFuZ2luZy10aXRsZVwiOiBcIlByXHUwMEY4diBseWtrZW4gaVwiLFxuICAgIFwibGFuZGluZy1uYW1lXCI6IFwiT2x5bXB1c1wiLFxuICAgIFwibGFuZGluZy1idG5cIjogXCJTcGlubiBzbG90dGVuXCIsXG4gICAgXCJsYW5kaW5nLXBvcHVwLXRpdGxlXCI6IFwiU3RvciBnZXZpbnN0XCIsXG4gICAgXCJsYW5kaW5nLXBvcHVwLXN1YnRpdGxlXCI6IFwiZHUgaGFyIGZcdTAwRTV0dCBvcHB0aWxcIixcbiAgICBcImxhbmRpbmctcG9wdXAtYnRuXCI6IFwiSGVudCBib251c1wiLFxuICB9LFxuICBkZXU6IHtcbiAgICB0aXRsZTogXCJWZXJzdWNoZSBkZWluIEdsXHUwMEZDY2sgaW4gT2x5bXB1c1wiLFxuICAgIFwibGFuZ2luZy10aXRsZVwiOiBcIlZlcnN1Y2hlIGRlaW4gR2xcdTAwRkNjayBpblwiLFxuICAgIFwibGFuZGluZy1uYW1lXCI6IFwiT2x5bXB1c1wiLFxuICAgIFwibGFuZGluZy1idG5cIjogXCJEcmVoZSBkZW4gU2xvdFwiLFxuICAgIFwibGFuZGluZy1wb3B1cC10aXRsZVwiOiBcIkdyb1x1MDBERmVyIEdld2lublwiLFxuICAgIFwibGFuZGluZy1wb3B1cC1zdWJ0aXRsZVwiOiBcImR1IGhhc3QgYmlzIHp1XCIsXG4gICAgXCJsYW5kaW5nLXBvcHVwLWJ0blwiOiBcIkJvbnVzIGVpbmxcdTAwRjZzZW5cIixcbiAgfSxcbn07XG5cbmV4cG9ydCBmdW5jdGlvbiBkZXRlY3RMYW5nKCkge1xuICBjb25zdCB1cmxMYW5nID0gbmV3IFVSTFNlYXJjaFBhcmFtcyhsb2NhdGlvbi5zZWFyY2gpLmdldChcImxhbmdcIik7XG4gIGlmICh1cmxMYW5nICYmIFNVUFBPUlRFRC5pbmNsdWRlcyh1cmxMYW5nKSkgcmV0dXJuIHVybExhbmc7XG4gIGNvbnN0IHNhdmVkID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJsYW5nXCIpO1xuICBpZiAoc2F2ZWQgJiYgU1VQUE9SVEVELmluY2x1ZGVzKHNhdmVkKSkgcmV0dXJuIHNhdmVkO1xuICByZXR1cm4gRkFMTEJBQ0s7XG59XG5cbmxldCBTRVRUSU5HX0xBTkcgPSBmYWxzZTtcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBzZXRMYW5nKGxhbmcpIHtcbiAgaWYgKFNFVFRJTkdfTEFORykgcmV0dXJuO1xuICBTRVRUSU5HX0xBTkcgPSB0cnVlO1xuXG4gIHRyeSB7XG4gICAgY29uc3QgZWZmZWN0aXZlID0gU1VQUE9SVEVELmluY2x1ZGVzKGxhbmcpID8gbGFuZyA6IEZBTExCQUNLO1xuXG4gICAgY29uc3QgZGljdCA9IFRSQU5TTEFUSU9OUz8uW2VmZmVjdGl2ZV07XG4gICAgaWYgKCFkaWN0KSB0aHJvdyBuZXcgRXJyb3IoXCJObyB0cmFuc2xhdGlvbnMgZW1iZWRkZWRcIik7XG4gICAgYXBwbHlUcmFuc2xhdGlvbnMoZGljdCk7XG5cbiAgICBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQubGFuZyA9IEhUTUxfTEFOR1tlZmZlY3RpdmVdIHx8IFwiZW5cIjtcblxuICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKFwibGFuZ1wiLCBlZmZlY3RpdmUpO1xuXG4gICAgdXBkYXRlTGFuZ0luVXJsKGVmZmVjdGl2ZSwgVVJMX0xBTkdfT1BUSU9OUyk7XG5cbiAgICBkb2N1bWVudFxuICAgICAgLnF1ZXJ5U2VsZWN0b3JBbGwoXCIubmF2aWdhdGlvbldyYXBwZXIgLm5hdmlnYXRpb25cIilcbiAgICAgIC5mb3JFYWNoKChuYXYpID0+IHN5bmNPbmVNZW51VUkobmF2LCBlZmZlY3RpdmUpKTtcblxuICAgIHdpbmRvdy5kaXNwYXRjaEV2ZW50KFxuICAgICAgbmV3IEN1c3RvbUV2ZW50KFwibGFuZ2NoYW5nZVwiLCB7IGRldGFpbDogeyBsYW5nOiBlZmZlY3RpdmUgfSB9KVxuICAgICk7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICBjb25zb2xlLmVycm9yKGUpO1xuICAgIGNvbnN0IGRpY3RGQiA9IFRSQU5TTEFUSU9OUz8uW0ZBTExCQUNLXTtcbiAgICBpZiAoZGljdEZCKSB7XG4gICAgICBhcHBseVRyYW5zbGF0aW9ucyhkaWN0RkIpO1xuICAgICAgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmxhbmcgPSBIVE1MX0xBTkdbRkFMTEJBQ0tdIHx8IFwiZW5cIjtcbiAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKFwibGFuZ1wiLCBGQUxMQkFDSyk7XG4gICAgICB1cGRhdGVMYW5nSW5VcmwoRkFMTEJBQ0ssIFVSTF9MQU5HX09QVElPTlMpO1xuXG4gICAgICB3aW5kb3cuZGlzcGF0Y2hFdmVudChcbiAgICAgICAgbmV3IEN1c3RvbUV2ZW50KFwibGFuZ2NoYW5nZVwiLCB7IGRldGFpbDogeyBsYW5nOiBGQUxMQkFDSyB9IH0pXG4gICAgICApO1xuICAgIH1cbiAgfSBmaW5hbGx5IHtcbiAgICBTRVRUSU5HX0xBTkcgPSBmYWxzZTtcbiAgICBjbG9zZUFsbE5hdnMoKTtcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gaW5pdExhbmd1YWdlTWVudXMoKSB7XG4gIGRvY3VtZW50XG4gICAgLnF1ZXJ5U2VsZWN0b3JBbGwoXCIubmF2aWdhdGlvbldyYXBwZXIgLm5hdmlnYXRpb25cIilcbiAgICAuZm9yRWFjaChzZXR1cE9uZU1lbnUpO1xufVxuXG5mdW5jdGlvbiBhcHBseVRyYW5zbGF0aW9ucyhkaWN0KSB7XG4gIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCJbZGF0YS10cmFuc2xhdGVdXCIpLmZvckVhY2goKGVsKSA9PiB7XG4gICAgY29uc3Qga2V5ID0gZWwuZGF0YXNldC50cmFuc2xhdGU7XG4gICAgaWYgKGRpY3Rba2V5XSAhPSBudWxsKSBlbC50ZXh0Q29udGVudCA9IGRpY3Rba2V5XTtcbiAgfSk7XG4gIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCJbZGF0YS10cmFuc2xhdGUtYXR0cl1cIikuZm9yRWFjaCgoZWwpID0+IHtcbiAgICBjb25zdCBwYWlycyA9XG4gICAgICBlbFxuICAgICAgICAuZ2V0QXR0cmlidXRlKFwiZGF0YS10cmFuc2xhdGUtYXR0clwiKVxuICAgICAgICA/LnNwbGl0KFwiO1wiKVxuICAgICAgICAubWFwKChzKSA9PiBzLnRyaW0oKSlcbiAgICAgICAgLmZpbHRlcihCb29sZWFuKSB8fCBbXTtcbiAgICBmb3IgKGNvbnN0IHBhaXIgb2YgcGFpcnMpIHtcbiAgICAgIGNvbnN0IFthdHRyLCBrZXldID0gcGFpci5zcGxpdChcIjpcIik7XG4gICAgICBpZiAoYXR0ciAmJiBrZXkgJiYgZGljdFtrZXldICE9IG51bGwpIGVsLnNldEF0dHJpYnV0ZShhdHRyLCBkaWN0W2tleV0pO1xuICAgIH1cbiAgfSk7XG59XG5cbmZ1bmN0aW9uIHN5bmNPbmVNZW51VUkobmF2LCBsYW5nKSB7XG4gIGNvbnN0IG1lbnUgPSBuYXYucXVlcnlTZWxlY3RvcihcIi5uYXZpZ2F0aW9uX19pdGVtc1wiKTtcbiAgaWYgKCFtZW51KSByZXR1cm47XG4gIG1lbnUucXVlcnlTZWxlY3RvckFsbChcIi5uYXZpZ2F0aW9uX19pdGVtXCIpLmZvckVhY2goKGl0ZW0pID0+IHtcbiAgICBjb25zdCBpc0FjdGl2ZSA9IGl0ZW0uZ2V0QXR0cmlidXRlKFwidmFsdWVcIikgPT09IGxhbmc7XG4gICAgaXRlbS5jbGFzc0xpc3QudG9nZ2xlKFwiaXMtYWN0aXZlXCIsIGlzQWN0aXZlKTtcbiAgICBpdGVtLnNldEF0dHJpYnV0ZShcImFyaWEtc2VsZWN0ZWRcIiwgaXNBY3RpdmUgPyBcInRydWVcIiA6IFwiZmFsc2VcIik7XG4gICAgaXRlbS5oaWRkZW4gPSBmYWxzZTtcbiAgICBpdGVtLnNldEF0dHJpYnV0ZShcImFyaWEtaGlkZGVuXCIsIFwiZmFsc2VcIik7XG4gICAgaXRlbS50YWJJbmRleCA9IC0xO1xuICB9KTtcbiAgY29uc3QgYWN0aXZlSXRlbSA9XG4gICAgWy4uLm1lbnUucXVlcnlTZWxlY3RvckFsbChcIi5uYXZpZ2F0aW9uX19pdGVtXCIpXS5maW5kKFxuICAgICAgKGVsKSA9PiBlbC5nZXRBdHRyaWJ1dGUoXCJ2YWx1ZVwiKSA9PT0gbGFuZ1xuICAgICkgfHwgbWVudS5xdWVyeVNlbGVjdG9yKFwiLm5hdmlnYXRpb25fX2l0ZW0uaXMtYWN0aXZlXCIpO1xuICBpZiAoYWN0aXZlSXRlbSkge1xuICAgIGFjdGl2ZUl0ZW0uaGlkZGVuID0gdHJ1ZTtcbiAgICBhY3RpdmVJdGVtLnNldEF0dHJpYnV0ZShcImFyaWEtaGlkZGVuXCIsIFwidHJ1ZVwiKTtcbiAgfVxuICBjb25zdCBoZWFkSW1nID0gbmF2LnF1ZXJ5U2VsZWN0b3IoXG4gICAgXCIubmF2aWdhdGlvbl9fbWFpbkJsb2NrIC5uYXZpZ2F0aW9uX19pdGVtSW1nXCJcbiAgKTtcbiAgY29uc3QgaGVhZFRleHQgPSBuYXYucXVlcnlTZWxlY3RvcihcbiAgICBcIi5uYXZpZ2F0aW9uX19tYWluQmxvY2sgLm5hdmlnYXRpb25fX2l0ZW1UZXh0XCJcbiAgKTtcbiAgaWYgKGhlYWRJbWcgfHwgaGVhZFRleHQpIHtcbiAgICBjb25zdCBzcmNJbWcgPSBhY3RpdmVJdGVtPy5xdWVyeVNlbGVjdG9yKFwiLm5hdmlnYXRpb25fX2l0ZW1JbWdcIik7XG4gICAgY29uc3Qgc3JjVHh0ID0gYWN0aXZlSXRlbT8ucXVlcnlTZWxlY3RvcihcIi5uYXZpZ2F0aW9uX19pdGVtVGV4dFwiKTtcbiAgICBpZiAoaGVhZEltZyAmJiBzcmNJbWcpIHtcbiAgICAgIGhlYWRJbWcuc3JjID0gc3JjSW1nLnNyYztcbiAgICAgIGhlYWRJbWcuYWx0ID0gc3JjSW1nLmFsdCB8fCBcIlwiO1xuICAgIH1cbiAgICBpZiAoaGVhZFRleHQgJiYgc3JjVHh0KSBoZWFkVGV4dC50ZXh0Q29udGVudCA9IHNyY1R4dC50ZXh0Q29udGVudDtcbiAgfVxufVxuXG5mdW5jdGlvbiBzZXR1cE9uZU1lbnUobmF2KSB7XG4gIGNvbnN0IG1lbnUgPSBuYXYucXVlcnlTZWxlY3RvcihcIi5uYXZpZ2F0aW9uX19pdGVtc1wiKTtcbiAgaWYgKCFtZW51KSByZXR1cm47XG4gIG5hdi5zZXRBdHRyaWJ1dGUoXCJyb2xlXCIsIFwiYnV0dG9uXCIpO1xuICBuYXYudGFiSW5kZXggPSAwO1xuICBuYXYuc2V0QXR0cmlidXRlKFwiYXJpYS1oYXNwb3B1cFwiLCBcImxpc3Rib3hcIik7XG4gIGlmICghbWVudS5pZCkgbWVudS5pZCA9IFwibGFuZy1tZW51LVwiICsgTWF0aC5yYW5kb20oKS50b1N0cmluZygzNikuc2xpY2UoMik7XG4gIG5hdi5zZXRBdHRyaWJ1dGUoXCJhcmlhLWNvbnRyb2xzXCIsIG1lbnUuaWQpO1xuICBuYXYuc2V0QXR0cmlidXRlKFwiYXJpYS1leHBhbmRlZFwiLCBcImZhbHNlXCIpO1xuICBtZW51LnNldEF0dHJpYnV0ZShcInJvbGVcIiwgXCJsaXN0Ym94XCIpO1xuICBtZW51LnF1ZXJ5U2VsZWN0b3JBbGwoXCIubmF2aWdhdGlvbl9faXRlbVwiKS5mb3JFYWNoKChpdGVtKSA9PiB7XG4gICAgaXRlbS5zZXRBdHRyaWJ1dGUoXCJyb2xlXCIsIFwib3B0aW9uXCIpO1xuICAgIGl0ZW0udGFiSW5kZXggPSAtMTtcbiAgfSk7XG5cbiAgY29uc3QgY3VycmVudFRleHQgPSBuYXZcbiAgICAucXVlcnlTZWxlY3RvcihcIi5uYXZpZ2F0aW9uX19tYWluQmxvY2sgLm5hdmlnYXRpb25fX2l0ZW1UZXh0XCIpXG4gICAgPy50ZXh0Q29udGVudD8udHJpbSgpO1xuICBpZiAoY3VycmVudFRleHQpXG4gICAgbWVudS5xdWVyeVNlbGVjdG9yQWxsKFwiLm5hdmlnYXRpb25fX2l0ZW1UZXh0XCIpLmZvckVhY2goKHQpID0+IHtcbiAgICAgIGlmICh0LnRleHRDb250ZW50LnRyaW0oKSA9PT0gY3VycmVudFRleHQpIHtcbiAgICAgICAgY29uc3QgaXRlbSA9IHQuY2xvc2VzdChcIi5uYXZpZ2F0aW9uX19pdGVtXCIpO1xuICAgICAgICBpZiAoaXRlbSkge1xuICAgICAgICAgIGl0ZW0uaGlkZGVuID0gdHJ1ZTtcbiAgICAgICAgICBpdGVtLnNldEF0dHJpYnV0ZShcImFyaWEtaGlkZGVuXCIsIFwidHJ1ZVwiKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuXG4gIGNvbnN0IGlzT3BlbiA9ICgpID0+IG5hdi5jbGFzc0xpc3QuY29udGFpbnMoXCJpcy1vcGVuXCIpO1xuICBjb25zdCBvcGVuID0gKCkgPT4ge1xuICAgIGlmICghaXNPcGVuKCkpIHtcbiAgICAgIG5hdi5jbGFzc0xpc3QuYWRkKFwiaXMtb3BlblwiKTtcbiAgICAgIG5hdi5zZXRBdHRyaWJ1dGUoXCJhcmlhLWV4cGFuZGVkXCIsIFwidHJ1ZVwiKTtcbiAgICB9XG4gIH07XG4gIGNvbnN0IGNsb3NlID0gKCkgPT4ge1xuICAgIGlmIChpc09wZW4oKSkge1xuICAgICAgbmF2LmNsYXNzTGlzdC5yZW1vdmUoXCJpcy1vcGVuXCIpO1xuICAgICAgbmF2LnNldEF0dHJpYnV0ZShcImFyaWEtZXhwYW5kZWRcIiwgXCJmYWxzZVwiKTtcbiAgICB9XG4gIH07XG4gIGNvbnN0IHRvZ2dsZSA9ICgpID0+IChpc09wZW4oKSA/IGNsb3NlKCkgOiBvcGVuKCkpO1xuXG4gIG5hdi5hZGRFdmVudExpc3RlbmVyKFxuICAgIFwicG9pbnRlcnVwXCIsXG4gICAgKGUpID0+IHtcbiAgICAgIGlmIChlLnBvaW50ZXJUeXBlID09PSBcIm1vdXNlXCIpIHJldHVybjtcbiAgICAgIGlmIChtZW51LmNvbnRhaW5zKGUudGFyZ2V0KSkgcmV0dXJuO1xuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgIHRvZ2dsZSgpO1xuICAgIH0sXG4gICAgeyBwYXNzaXZlOiBmYWxzZSB9XG4gICk7XG4gIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJwb2ludGVyZG93blwiLCAoZSkgPT4ge1xuICAgIGlmICghbmF2LnBhcmVudEVsZW1lbnQuY29udGFpbnMoZS50YXJnZXQpKSBjbG9zZSgpO1xuICB9KTtcbiAgbmF2LmFkZEV2ZW50TGlzdGVuZXIoXCJrZXlkb3duXCIsIChlKSA9PiB7XG4gICAgaWYgKGUua2V5ID09PSBcIkVudGVyXCIgfHwgZS5rZXkgPT09IFwiIFwiKSB7XG4gICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICB0b2dnbGUoKTtcbiAgICB9IGVsc2UgaWYgKGUua2V5ID09PSBcIkVzY2FwZVwiKSB7XG4gICAgICBpZiAoaXNPcGVuKCkpIHtcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICBjbG9zZSgpO1xuICAgICAgICBuYXYuZm9jdXMoKTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKChlLmtleSA9PT0gXCJBcnJvd0Rvd25cIiB8fCBlLmtleSA9PT0gXCJEb3duXCIpICYmICFpc09wZW4oKSkge1xuICAgICAgb3BlbigpO1xuICAgICAgZm9jdXNGaXJzdEl0ZW0obWVudSk7XG4gICAgfVxuICB9KTtcblxuICBmdW5jdGlvbiBoYW5kbGVDaG9vc2VMYW5nKGUpIHtcbiAgICBjb25zdCBpdGVtID0gZS50YXJnZXQuY2xvc2VzdChcIi5uYXZpZ2F0aW9uX19pdGVtXCIpO1xuICAgIGlmICghaXRlbSkgcmV0dXJuO1xuICAgIGlmIChlLmNhbmNlbGFibGUpIGUucHJldmVudERlZmF1bHQoKTtcbiAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgIGNvbnN0IGEgPSBpdGVtLmNsb3Nlc3QoXCJhXCIpO1xuICAgIGlmIChhKSB7XG4gICAgICBpZiAoZS5jYW5jZWxhYmxlKSBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICBhLnNldEF0dHJpYnV0ZShcImhyZWZcIiwgXCIjXCIpO1xuICAgIH1cbiAgICBjb25zdCBjb2RlID0gaXRlbS5nZXRBdHRyaWJ1dGUoXCJ2YWx1ZVwiKTtcbiAgICBjb25zdCBmaW5pc2ggPSAoKSA9PlxuICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHtcbiAgICAgICAgY2xvc2UoKTtcbiAgICAgICAgY2xvc2VBbGxOYXZzKCk7XG4gICAgICAgIG5hdi5ibHVyKCk7XG4gICAgICAgIGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQ/LmJsdXI/LigpO1xuICAgICAgfSk7XG4gICAgaWYgKFNVUFBPUlRFRC5pbmNsdWRlcyhjb2RlKSlcbiAgICAgIFByb21pc2UucmVzb2x2ZShzZXRMYW5nKGNvZGUpKS5maW5hbGx5KGZpbmlzaCk7XG4gICAgZWxzZSB7XG4gICAgICBjb25zdCBuZXdJbWcgPSBpdGVtLnF1ZXJ5U2VsZWN0b3IoXCIubmF2aWdhdGlvbl9faXRlbUltZ1wiKTtcbiAgICAgIGNvbnN0IG5ld1RleHQgPSBpdGVtLnF1ZXJ5U2VsZWN0b3IoXCIubmF2aWdhdGlvbl9faXRlbVRleHRcIik7XG4gICAgICBjb25zdCBoZWFkSW1nID0gbmF2LnF1ZXJ5U2VsZWN0b3IoXCIubmF2aWdhdGlvbl9faXRlbUltZ1wiKTtcbiAgICAgIGNvbnN0IGhlYWRUeHQgPSBuYXYucXVlcnlTZWxlY3RvcihcIi5uYXZpZ2F0aW9uX19pdGVtVGV4dFwiKTtcbiAgICAgIGlmIChuZXdJbWcgJiYgaGVhZEltZykge1xuICAgICAgICBoZWFkSW1nLnNyYyA9IG5ld0ltZy5zcmM7XG4gICAgICAgIGhlYWRJbWcuYWx0ID0gbmV3SW1nLmFsdCB8fCBcIlwiO1xuICAgICAgfVxuICAgICAgaWYgKG5ld1RleHQgJiYgaGVhZFR4dCkgaGVhZFR4dC50ZXh0Q29udGVudCA9IG5ld1RleHQudGV4dENvbnRlbnQ7XG4gICAgICBmaW5pc2goKTtcbiAgICB9XG4gIH1cbiAgbWVudS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgaGFuZGxlQ2hvb3NlTGFuZyk7XG4gIG1lbnUuYWRkRXZlbnRMaXN0ZW5lcihcInRvdWNoZW5kXCIsIGhhbmRsZUNob29zZUxhbmcsIHsgcGFzc2l2ZTogZmFsc2UgfSk7XG4gIG1lbnUuYWRkRXZlbnRMaXN0ZW5lcihcInBvaW50ZXJ1cFwiLCBoYW5kbGVDaG9vc2VMYW5nLCB7IHBhc3NpdmU6IGZhbHNlIH0pO1xuXG4gIC8vIGNvbnN0IGNsb3NlID0gKCkgPT4geyBpZiAoaXNPcGVuKCkpIHsgbmF2LmNsYXNzTGlzdC5yZW1vdmUoXCJpcy1vcGVuXCIpOyBuYXYuc2V0QXR0cmlidXRlKFwiYXJpYS1leHBhbmRlZFwiLFwiZmFsc2VcIik7IH0gfTtcbiAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJvcmllbnRhdGlvbmNoYW5nZVwiLCBjbG9zZSk7XG4gIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwicmVzaXplXCIsIGNsb3NlKTtcbiAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcInZpc2liaWxpdHljaGFuZ2VcIiwgKCkgPT4ge1xuICAgIGlmIChkb2N1bWVudC5oaWRkZW4pIGNsb3NlKCk7XG4gIH0pO1xuICBuYXYuc3R5bGUudG91Y2hBY3Rpb24gPSBcIm1hbmlwdWxhdGlvblwiO1xuICBtZW51LnN0eWxlLnRvdWNoQWN0aW9uID0gXCJtYW5pcHVsYXRpb25cIjtcbn1cblxuZnVuY3Rpb24gZm9jdXNGaXJzdEl0ZW0obWVudSkge1xuICBjb25zdCBmaXJzdCA9IFtcbiAgICAuLi5tZW51LnF1ZXJ5U2VsZWN0b3JBbGwoXCIubmF2aWdhdGlvbl9faXRlbTpub3QoW2hpZGRlbl0pXCIpLFxuICBdWzBdO1xuICBpZiAoZmlyc3QpIGZpcnN0LmZvY3VzKCk7XG59XG5cbmZ1bmN0aW9uIGNsb3NlQWxsTmF2cygpIHtcbiAgZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5uYXZpZ2F0aW9uLmlzLW9wZW5cIikuZm9yRWFjaCgobmF2KSA9PiB7XG4gICAgbmF2LmNsYXNzTGlzdC5yZW1vdmUoXCJpcy1vcGVuXCIpO1xuICAgIG5hdi5zZXRBdHRyaWJ1dGUoXCJhcmlhLWV4cGFuZGVkXCIsIFwiZmFsc2VcIik7XG4gICAgY29uc3QgbWVudSA9IG5hdi5xdWVyeVNlbGVjdG9yKFwiLm5hdmlnYXRpb25fX2l0ZW1zXCIpO1xuICAgIGlmIChtZW51KSB7XG4gICAgICBtZW51LnNldEF0dHJpYnV0ZShcImFyaWEtaGlkZGVuXCIsIFwidHJ1ZVwiKTtcbiAgICAgIG1lbnUuc3R5bGUucG9pbnRlckV2ZW50cyA9IFwibm9uZVwiO1xuICAgICAgbWVudS5zdHlsZS52aXNpYmlsaXR5ID0gXCJoaWRkZW5cIjtcbiAgICAgIG1lbnUuc3R5bGUub3BhY2l0eSA9IFwiMFwiO1xuICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHtcbiAgICAgICAgbWVudS5yZW1vdmVBdHRyaWJ1dGUoXCJhcmlhLWhpZGRlblwiKTtcbiAgICAgICAgbWVudS5zdHlsZS5wb2ludGVyRXZlbnRzID0gXCJcIjtcbiAgICAgICAgbWVudS5zdHlsZS52aXNpYmlsaXR5ID0gXCJcIjtcbiAgICAgICAgbWVudS5zdHlsZS5vcGFjaXR5ID0gXCJcIjtcbiAgICAgIH0pO1xuICAgIH1cbiAgfSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBraWxsQWxsSG92ZXJzKCkge1xuICB0cnkge1xuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCI6aG92ZXJcIikuZm9yRWFjaCgoZWwpID0+IGVsLmJsdXI/LigpKTtcbiAgfSBjYXRjaCAoXykge31cbn1cblxuZnVuY3Rpb24gdXBkYXRlTGFuZ0luVXJsKGxhbmcsIG9wdHMgPSBVUkxfTEFOR19PUFRJT05TKSB7XG4gIGNvbnN0IHtcbiAgICBtZXRob2QgPSBcInJlcGxhY2VcIixcbiAgICBjbGVhbkRlZmF1bHQgPSBmYWxzZSxcbiAgICBmYWxsYmFjayA9IEZBTExCQUNLLFxuICAgIHBhcmFtID0gXCJsYW5nXCIsXG4gIH0gPSBvcHRzIHx8IHt9O1xuXG4gIHRyeSB7XG4gICAgY29uc3QgdXJsID0gbmV3IFVSTCh3aW5kb3cubG9jYXRpb24uaHJlZik7XG5cbiAgICBpZiAoY2xlYW5EZWZhdWx0ICYmIGxhbmcgPT09IGZhbGxiYWNrKSB7XG4gICAgICB1cmwuc2VhcmNoUGFyYW1zLmRlbGV0ZShwYXJhbSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHVybC5zZWFyY2hQYXJhbXMuc2V0KHBhcmFtLCBsYW5nKTtcbiAgICB9XG5cbiAgICAvLyBcdTA0MzJcdTA0MzhcdTA0M0FcdTA0M0VcdTA0NDBcdTA0MzhcdTA0NDFcdTA0NDJcdTA0M0VcdTA0MzJcdTA0NDNcdTA0NTRcdTA0M0NcdTA0M0UgXHUwNDMyXHUwNDU2XHUwNDM0XHUwNDNEXHUwNDNFXHUwNDQxXHUwNDNEXHUwNDM4XHUwNDM5IFx1MDQ0OFx1MDQzQlx1MDQ0Rlx1MDQ0NSwgXHUwNDQ5XHUwNDNFXHUwNDMxIFx1MDQ0M1x1MDQzRFx1MDQzOFx1MDQzQVx1MDQzMFx1MDQ0Mlx1MDQzOCBcdTA0MzdcdTA0MzBcdTA0MzlcdTA0MzJcdTA0M0VcdTA0MzNcdTA0M0Ugb3JpZ2luXG4gICAgY29uc3QgbmV4dCA9IHVybC5wYXRobmFtZSArICh1cmwuc2VhcmNoIHx8IFwiXCIpICsgKHVybC5oYXNoIHx8IFwiXCIpO1xuICAgIGNvbnN0IGN1cnJlbnQgPSBsb2NhdGlvbi5wYXRobmFtZSArIGxvY2F0aW9uLnNlYXJjaCArIGxvY2F0aW9uLmhhc2g7XG5cbiAgICBpZiAobmV4dCA9PT0gY3VycmVudCkgcmV0dXJuOyAvLyBcdTA0M0RcdTA0NTZcdTA0NDdcdTA0M0VcdTA0MzNcdTA0M0UgXHUwNDNEXHUwNDM1IFx1MDQzN1x1MDQzQ1x1MDQ1Nlx1MDQzRFx1MDQzOFx1MDQzQlx1MDQzRVx1MDQ0MVx1MDQ0RlxuXG4gICAgaWYgKG1ldGhvZCA9PT0gXCJwdXNoXCIpIHtcbiAgICAgIGhpc3RvcnkucHVzaFN0YXRlKG51bGwsIFwiXCIsIG5leHQpO1xuICAgIH0gZWxzZSB7XG4gICAgICBoaXN0b3J5LnJlcGxhY2VTdGF0ZShudWxsLCBcIlwiLCBuZXh0KTtcbiAgICB9XG4gIH0gY2F0Y2gge1xuICAgIC8vIFx1MDQzNFx1MDQ0M1x1MDQzNlx1MDQzNSBcdTA0NDBcdTA0NTZcdTA0MzRcdTA0M0FcdTA0NTZcdTA0NDFcdTA0M0RcdTA0MzhcdTA0MzkgZmFsbGJhY2sgXHUwNDNEXHUwNDMwIFx1MDQzMlx1MDQzOFx1MDQzRlx1MDQzMFx1MDQzNFx1MDQzRVx1MDQzQSBcdTA0M0ZcdTA0NDBcdTA0M0VcdTA0MzFcdTA0M0JcdTA0MzVcdTA0M0MgXHUwNDU2XHUwNDM3IFVSTCgpXG4gICAgY29uc3QgcGFyYW1zID0gbmV3IFVSTFNlYXJjaFBhcmFtcyhsb2NhdGlvbi5zZWFyY2gpO1xuICAgIGlmIChjbGVhbkRlZmF1bHQgJiYgbGFuZyA9PT0gZmFsbGJhY2spIHtcbiAgICAgIHBhcmFtcy5kZWxldGUocGFyYW0pO1xuICAgIH0gZWxzZSB7XG4gICAgICBwYXJhbXMuc2V0KHBhcmFtLCBsYW5nKTtcbiAgICB9XG4gICAgY29uc3QgcSA9IHBhcmFtcy50b1N0cmluZygpO1xuICAgIGNvbnN0IG5leHQgPSBsb2NhdGlvbi5wYXRobmFtZSArIChxID8gYD8ke3F9YCA6IFwiXCIpICsgbG9jYXRpb24uaGFzaDtcbiAgICBjb25zdCBjdXJyZW50ID0gbG9jYXRpb24ucGF0aG5hbWUgKyBsb2NhdGlvbi5zZWFyY2ggKyBsb2NhdGlvbi5oYXNoO1xuICAgIGlmIChuZXh0ID09PSBjdXJyZW50KSByZXR1cm47XG4gICAgaGlzdG9yeS5yZXBsYWNlU3RhdGUobnVsbCwgXCJcIiwgbmV4dCk7XG4gIH1cbn1cbiIsICIvKipcbiAqIFx1MDQxRlx1MDQ0M1x1MDQzMVx1MDQzQlx1MDQ1Nlx1MDQ0N1x1MDQzRFx1MDQzOFx1MDQzOSBBUEkgXHUwNDMzXHUwNDQwXHUwNDM4LlxuICovXG5leHBvcnQgZnVuY3Rpb24gaW5pdEdhbWUoKSB7XG5jb25zdCBnYW1lID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5nYW1lXCIpO1xuY29uc3QgYnRuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5tYWluQ29udGVudF9fYnRuXCIpO1xuXG5idG4/LmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoZSkgPT4ge1xuICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgLy8gXHUwNDRGXHUwNDNBXHUwNDQ5XHUwNDNFIFx1MDQzMlx1MDQzNlx1MDQzNSBcdTA0M0FcdTA0NDBcdTA0NDNcdTA0NDJcdTA0MzhcdTA0M0JcdTA0MzggXHUyMDE0IFx1MDQ0Mlx1MDQ1Nlx1MDQzQlx1MDQ0Q1x1MDQzQVx1MDQzOCBcdTA0M0ZcdTA0M0VcdTA0M0ZcdTA0MzBcdTA0M0ZcbiAgaWYgKGxvY2FsU3RvcmFnZS5nZXRJdGVtKFwiZ2FtZS1zcHVuXCIpID09PSBcInRydWVcIikge1xuICAgIG9wZW5Qb3B1cCgpO1xuICAgIHJldHVybjtcbiAgfVxuXG4gIC8vIFx1MDQzRVx1MDQzNFx1MDQzRFx1MDQzRVx1MDQ0MFx1MDQzMFx1MDQzN1x1MDQzRVx1MDQzMlx1MDQzOFx1MDQzOSBcdTA0MzdcdTA0MzBcdTA0M0ZcdTA0NDNcdTA0NDFcdTA0M0FcbiAgaWYgKGdhbWUuY2xhc3NMaXN0LmNvbnRhaW5zKFwiaXMtc3B1blwiKSkgcmV0dXJuO1xuXG4gIGdhbWUuY2xhc3NMaXN0LmFkZChcImlzLXNwdW5cIik7XG4gIGJ0bi5zZXRBdHRyaWJ1dGUoXCJhcmlhLWRpc2FibGVkXCIsIFwidHJ1ZVwiKTtcbiAgYnRuLnNldEF0dHJpYnV0ZShcImRpc2FibGVkXCIsIFwiXCIpOyAvLyBcdTA0M0RcdTA0MzBcdTA0MzRcdTA0NTZcdTA0MzlcdTA0M0RcdTA0NTZcdTA0NDhcdTA0MzUgXHUwNDM0XHUwNDNCXHUwNDRGIFx1MDQzQVx1MDQzRFx1MDQzRVx1MDQzRlx1MDQzRVx1MDQzQVxuXG4gIC8vIFx1MDQzRlx1MDQzRVx1MDQzN1x1MDQzRFx1MDQzMFx1MDQ0N1x1MDQzMFx1MDQ1NFx1MDQzQ1x1MDQzRSwgXHUwNDQ5XHUwNDNFIFx1MDQzMlx1MDQzNlx1MDQzNSBcdTA0M0FcdTA0NDBcdTA0NDNcdTA0NDJcdTA0MzhcdTA0M0JcdTA0MzhcbiAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oXCJnYW1lLXNwdW5cIiwgXCJ0cnVlXCIpO1xuXG4gIC8vIFx1MDQ0N1x1MDQzNVx1MDQzQVx1MDQzMFx1MDQ1NFx1MDQzQ1x1MDQzRSBcdTA0M0FcdTA0NTZcdTA0M0RcdTA0MzVcdTA0NDZcdTA0NEMgXHUwNDMwXHUwNDNEXHUwNDU2XHUwNDNDXHUwNDMwXHUwNDQ2XHUwNDU2XHUwNDU3IFx1MDQ1NiBcdTA0M0ZcdTA0M0VcdTA0M0FcdTA0MzBcdTA0MzdcdTA0NDNcdTA0NTRcdTA0M0NcdTA0M0UgXHUwNDNGXHUwNDNFXHUwNDNGXHUwNDMwXHUwNDNGXG4gIGNvbnN0IGxhc3REcm9wID0gZ2FtZS5xdWVyeVNlbGVjdG9yKFxuICAgIFwiLmdhbWVfX2NvbDpudGgtY2hpbGQoNikgLmdhbWVfX2NvbEltZy0tNjZcIlxuICApO1xuXG4gIGxhc3REcm9wPy5hZGRFdmVudExpc3RlbmVyKFxuICAgIFwiYW5pbWF0aW9uZW5kXCIsXG4gICAgKCkgPT4ge1xuICAgICAgY29uc3Qgd2luU2VjdG9yID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5nYW1lX193aW5TZWN0b3JcIik7XG4gICAgICBpZiAod2luU2VjdG9yKSB3aW5TZWN0b3Iuc3R5bGUuZGlzcGxheSA9IFwiYmxvY2tcIjtcblxuICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgIGRvY3VtZW50LmRpc3BhdGNoRXZlbnQobmV3IEN1c3RvbUV2ZW50KFwic2xvdDpiaWd3aW5cIikpXG4gICAgICB9LCAyMDAwKTtcbiAgICB9LFxuICAgIHsgb25jZTogdHJ1ZSB9XG4gICk7XG59KTtcblxuICAvLyA0KSBcdTA0MkZcdTA0M0FcdTA0NDlcdTA0M0UgXHUwNDMyXHUwNDM2XHUwNDM1IFx1MDQzQVx1MDQ0MFx1MDQ0M1x1MDQ0Mlx1MDQzOFx1MDQzQlx1MDQzOCBcdTIwMTQgXHUwNDNFXHUwNDM0XHUwNDQwXHUwNDMwXHUwNDM3XHUwNDQzIFx1MDQ0MVx1MDQzOFx1MDQzM1x1MDQzRFx1MDQzMFx1MDQzQlx1MDQ1Nlx1MDQzN1x1MDQ0M1x1MDQ1NFx1MDQzQ1x1MDQzRSAoXHUwNDMxXHUwNDM1XHUwNDM3IFx1MDQzN1x1MDQzMFx1MDQzQlx1MDQzNVx1MDQzNlx1MDQzRFx1MDQzRVx1MDQ0MVx1MDQ0Mlx1MDQ1NiBcdTA0MzJcdTA0NTZcdTA0MzQgcG9wdXAuanMpXG4gIGlmIChsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcImdhbWUtc3B1blwiKSA9PT0gXCJ0cnVlXCIpIHtcbiAgICBidG4/LnNldEF0dHJpYnV0ZShcImFyaWEtZGlzYWJsZWRcIiwgXCJ0cnVlXCIpO1xuICAgIGJ0bj8uc2V0QXR0cmlidXRlKFwiZGlzYWJsZWRcIiwgXCJcIik7XG4gICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+XG4gICAgICBkb2N1bWVudC5kaXNwYXRjaEV2ZW50KG5ldyBDdXN0b21FdmVudChcInNsb3Q6Ymlnd2luXCIpKVxuICAgICk7XG4gIH1cbn1cblxuIiwgImV4cG9ydCBmdW5jdGlvbiBvcGVuUG9wdXAoKSB7XG4gIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicG9wdXBcIik/LmNsYXNzTGlzdC5hZGQoXCJpcy1vcGVuXCIpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaW5pdFBvcHVwKCkge1xuICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwic2xvdDpiaWd3aW5cIiwgb3BlblBvcHVwKTtcbn1cbiIsICJpbXBvcnQgeyBkZXRlY3RMYW5nIH0gZnJvbSBcIi4vbGFuZy5qc1wiO1xuXG5jb25zdCBQQVlNRU5UX1NFVFMgPSB7XG4gIGVuZzogW1xuICAgIHsgc3JjOiBcImltZy9mb290ZXIvaW50ZXJhYy5zdmdcIiwgYWx0OiBcIkludGVyYWNcIiB9LFxuICAgIHsgc3JjOiBcImltZy9mb290ZXIvdmlzYS5zdmdcIiwgYWx0OiBcIlZpc2FcIiB9LFxuICAgIHsgc3JjOiBcImltZy9mb290ZXIvYXBwbGVwYXkuc3ZnXCIsIGFsdDogXCJBcHBsZSBQYXlcIiB9LFxuICAgIHsgc3JjOiBcImltZy9mb290ZXIvZ29vZ2xlcGF5LnN2Z1wiLCBhbHQ6IFwiR29vZ2xlIFBheVwiIH0sXG4gICAgeyBzcmM6IFwiaW1nL2Zvb3Rlci90ZXRoZXJiLnN2Z1wiLCBhbHQ6IFwiVGV0aGVyIEJpdGNvaW5cIiB9LFxuICAgIHsgc3JjOiBcImltZy9mb290ZXIvYWdlLnN2Z1wiLCBhbHQ6IFwiMTgrXCIgfSxcbiAgXSxcbiAgZGV1OiBbXG4gICAgeyBzcmM6IFwiaW1nL2Zvb3Rlci9rbGFybmEuc3ZnXCIsIGFsdDogXCJLbGFybmFcIiB9LFxuICAgIHsgc3JjOiBcImltZy9mb290ZXIvdmlzYS5zdmdcIiwgYWx0OiBcIlZpc2FcIiB9LFxuICAgIHsgc3JjOiBcImltZy9mb290ZXIvYXBwbGVwYXkuc3ZnXCIsIGFsdDogXCJBcHBsZSBQYXlcIiB9LFxuICAgIHsgc3JjOiBcImltZy9mb290ZXIvZ29vZ2xlcGF5LnN2Z1wiLCBhbHQ6IFwiR29vZ2xlIFBheVwiIH0sXG4gICAgeyBzcmM6IFwiaW1nL2Zvb3Rlci91bmlvbi5zdmdcIiwgYWx0OiBcIlVuaW9uXCIgfSxcbiAgICB7IHNyYzogXCJpbWcvZm9vdGVyL3RldGhlcmIuc3ZnXCIsIGFsdDogXCJUZXRoZXIgQml0Y29pblwiIH0sXG4gICAgeyBzcmM6IFwiaW1nL2Zvb3Rlci9uZXRlbGxlci5zdmdcIiwgYWx0OiBcIk5ldGVsbGVyXCIgfSxcbiAgICB7IHNyYzogXCJpbWcvZm9vdGVyL3NjcmlsbC5zdmdcIiwgYWx0OiBcIlNjcmlsbFwiIH0sXG4gICAgeyBzcmM6IFwiaW1nL2Zvb3Rlci9yYXBpZC5zdmdcIiwgYWx0OiBcIlJhcGlkXCIgfSxcbiAgICB7IHNyYzogXCJpbWcvZm9vdGVyL3ZlY3Rvci5zdmdcIiwgYWx0OiBcIlZlY3RvclwiIH0sXG4gICAgeyBzcmM6IFwiaW1nL2Zvb3Rlci9vcGVuYmFua2luZy5zdmdcIiwgYWx0OiBcIk9wZW4gYmFua2luZ1wiIH0sXG4gICAgeyBzcmM6IFwiaW1nL2Zvb3Rlci9hZ2Uuc3ZnXCIsIGFsdDogXCIxOCtcIiB9LFxuICBdLFxuICBnZW5lcmFsOiBbXG4gICAgeyBzcmM6IFwiaW1nL2Zvb3Rlci92aXNhLnN2Z1wiLCBhbHQ6IFwiVmlzYVwiIH0sXG4gICAgeyBzcmM6IFwiaW1nL2Zvb3Rlci9hcHBsZXBheS5zdmdcIiwgYWx0OiBcIkFwcGxlIFBheVwiIH0sXG4gICAgeyBzcmM6IFwiaW1nL2Zvb3Rlci9nb29nbGVwYXkuc3ZnXCIsIGFsdDogXCJHb29nbGUgUGF5XCIgfSxcbiAgICB7IHNyYzogXCJpbWcvZm9vdGVyL3RldGhlcmIuc3ZnXCIsIGFsdDogXCJUZXRoZXIgQml0Y29pblwiIH0sXG4gICAgeyBzcmM6IFwiaW1nL2Zvb3Rlci9hZ2Uuc3ZnXCIsIGFsdDogXCIxOCtcIiB9LFxuICBdLFxufTtcblxuLyoqXG4gKiBcdTA0MUNcdTA0MzBcdTA0M0ZcdTA0MzAgXCJcdTA0M0NcdTA0M0VcdTA0MzJcdTA0MzAgLT4gXHUwNDNBXHUwNDNCXHUwNDRFXHUwNDQ3IFx1MDQzRFx1MDQzMFx1MDQzMVx1MDQzRVx1MDQ0MFx1MDQ0M1wiLlxuICogXHUwNDEyXHUwNDQxXHUwNDM1IFx1MDQzRFx1MDQzNSBcdTA0M0ZcdTA0MzVcdTA0NDBcdTA0MzVcdTA0M0JcdTA0NTZcdTA0NDdcdTA0MzVcdTA0M0RcdTA0MzUgXHUwNDQyXHUwNDQzXHUwNDQyIFx1MDQzRlx1MDQ1Nlx1MDQzNFx1MDQzNSBcdTA0NDMgJ2dlbmVyYWwnLlxuICovXG5mdW5jdGlvbiBwaWNrU2V0S2V5KGxhbmcpIHtcbiAgaWYgKGxhbmcgPT09IFwiZW5nXCIpIHJldHVybiBcImVuZ1wiO1xuICBpZiAobGFuZyA9PT0gXCJkZXVcIikgcmV0dXJuIFwiZGV1XCI7XG4gIHJldHVybiBcImdlbmVyYWxcIjtcbn1cblxuLyoqXG4gKiBcdTA0MjBcdTA0MzVcdTA0M0RcdTA0MzRcdTA0MzVcdTA0NDBcdTA0MzhcdTA0M0NcdTA0M0UvXHUwNDNFXHUwNDNEXHUwNDNFXHUwNDMyXHUwNDNCXHUwNDRFXHUwNDU0XHUwNDNDXHUwNDNFIFx1MDQzQVx1MDQzMFx1MDQ0MFx1MDQ0Mlx1MDQzOFx1MDQzRFx1MDQzQVx1MDQzOCBcdTA0NDMgXHUwNDQ0XHUwNDQzXHUwNDQyXHUwNDM1XHUwNDQwXHUwNDU2LlxuICogXHUwNDFGXHUwNDQwXHUwNDMwXHUwNDQ2XHUwNDRFXHUwNDU0XHUwNDNDXHUwNDNFIFx1MDQzMlx1MDQ0MVx1MDQzNVx1MDQ0MFx1MDQzNVx1MDQzNFx1MDQzOFx1MDQzRFx1MDQ1NiAuZm9vdGVyX19pdGVtczogXHUwNDMwXHUwNDMxXHUwNDNFIFx1MDQzRVx1MDQzRFx1MDQzRVx1MDQzMlx1MDQzQlx1MDQ0RVx1MDQ1NFx1MDQzQ1x1MDQzRSBcdTA0NTZcdTA0NDFcdTA0M0RcdTA0NDNcdTA0NEVcdTA0NDdcdTA0NTYgPGltZz4sIFx1MDQzMFx1MDQzMVx1MDQzRSBcdTA0NDFcdTA0NDJcdTA0MzJcdTA0M0VcdTA0NDBcdTA0NEVcdTA0NTRcdTA0M0NcdTA0M0UgXHUwNDM3XHUwNDMwXHUwNDNEXHUwNDNFXHUwNDMyXHUwNDNFLlxuICovXG5leHBvcnQgZnVuY3Rpb24gcmVuZGVyRm9vdGVyUGF5bWVudHMobGFuZykge1xuICBjb25zdCBzZXRLZXkgPSBwaWNrU2V0S2V5KGxhbmcpO1xuICBjb25zdCBpdGVtcyA9IFBBWU1FTlRfU0VUU1tzZXRLZXldIHx8IFBBWU1FTlRfU0VUUy5nZW5lcmFsO1xuXG4gIGNvbnN0IGNvbnRhaW5lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuZm9vdGVyIC5mb290ZXJfX2l0ZW1zXCIpO1xuICBpZiAoIWNvbnRhaW5lcikgcmV0dXJuO1xuXG4gIC8vIFx1MDQyMFx1MDQzRVx1MDQzMVx1MDQzOFx1MDQzQ1x1MDQzRSBcdTA0NDFcdTA0NDJcdTA0NDBcdTA0NDNcdTA0M0FcdTA0NDJcdTA0NDNcdTA0NDBcdTA0NDMgXHUwNDNGXHUwNDQwXHUwNDM1XHUwNDM0XHUwNDQxXHUwNDNBXHUwNDMwXHUwNDM3XHUwNDQzXHUwNDMyXHUwNDMwXHUwNDNEXHUwNDNFXHUwNDRFOiBcdTA0M0ZcdTA0M0VcdTA0MzJcdTA0M0RcdTA0NTZcdTA0NDFcdTA0NDJcdTA0NEUgXHUwNDNGXHUwNDM1XHUwNDQwXHUwNDM1XHUwNDMxXHUwNDQzXHUwNDM0XHUwNDQzXHUwNDU0XHUwNDNDXHUwNDNFIFx1MDQ0MVx1MDQzRlx1MDQzOFx1MDQ0MVx1MDQzRVx1MDQzQSAoXHUwNDNGXHUwNDQwXHUwNDNFXHUwNDQxXHUwNDQyXHUwNDU2XHUwNDQ4XHUwNDM1IFx1MDQ1NiBcdTA0M0RcdTA0MzBcdTA0MzRcdTA0NTZcdTA0MzlcdTA0M0RcdTA0NTZcdTA0NDhcdTA0MzUpLlxuICBjb250YWluZXIuaW5uZXJIVE1MID0gXCJcIjsgLy8gXHUwNDRGXHUwNDNBXHUwNDQ5XHUwNDNFIFx1MDQ0NVx1MDQzRVx1MDQ0N1x1MDQzNVx1MDQ0OCBcdTA0MzFcdTA0MzVcdTA0MzcgXHUwNDNGXHUwNDNFXHUwNDMyXHUwNDNEXHUwNDNFXHUwNDMzXHUwNDNFIFx1MDQzRlx1MDQzNVx1MDQ0MFx1MDQzNVx1MDQ0MFx1MDQzNVx1MDQzRFx1MDQzNFx1MDQzNVx1MDQ0MFx1MDQ0MyBcdTIwMTQgXHUwNDNDXHUwNDNFXHUwNDM2XHUwNDNEXHUwNDMwIFx1MDQzRVx1MDQzRFx1MDQzRVx1MDQzMlx1MDQzQlx1MDQ0RVx1MDQzMlx1MDQzMFx1MDQ0Mlx1MDQzOCBcdTA0M0ZcdTA0M0UgXHUwNDNDXHUwNDU2XHUwNDQxXHUwNDQ2XHUwNDRGXHUwNDQ1XG5cbiAgZm9yIChjb25zdCBwIG9mIGl0ZW1zKSB7XG4gICAgY29uc3Qgd3JhcCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgd3JhcC5jbGFzc05hbWUgPSBcImZvb3Rlcl9faXRlbVwiO1xuICAgIGNvbnN0IGltZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpbWdcIik7XG4gICAgaW1nLmRlY29kaW5nID0gXCJhc3luY1wiO1xuICAgIGltZy5zcmMgPSBwLnNyYztcbiAgICBpbWcuYWx0ID0gcC5hbHQgfHwgXCJcIjtcbiAgICB3cmFwLmFwcGVuZENoaWxkKGltZyk7XG4gICAgY29udGFpbmVyLmFwcGVuZENoaWxkKHdyYXApO1xuICB9XG59XG5cbi8vIC0tLSBcdTA0MTBcdTA0MzJcdTA0NDJcdTA0M0VcdTA0NTZcdTA0M0RcdTA0NTZcdTA0NDZcdTA0NTZcdTA0MzBcdTA0M0JcdTA0NTZcdTA0MzdcdTA0MzBcdTA0NDZcdTA0NTZcdTA0NEYgLS0tXG4gZXhwb3J0IGZ1bmN0aW9uIGluaXRQYXltZW50c09uY2UoKSB7XG4gIHJlbmRlckZvb3RlclBheW1lbnRzKGRldGVjdExhbmcoKSk7XG59XG5cbiIsICJpbXBvcnQge1xuICBpbml0TGFuZ3VhZ2VNZW51cyxcbiAgZGV0ZWN0TGFuZyxcbiAgc2V0TGFuZyxcbiAga2lsbEFsbEhvdmVycyxcbn0gZnJvbSBcIi4vbGFuZy5qc1wiO1xuaW1wb3J0IHsgaW5pdEdhbWUgfSBmcm9tIFwiLi9nYW1lLmpzXCI7XG5pbXBvcnQgeyBpbml0UG9wdXAgfSBmcm9tIFwiLi9wb3B1cC5qc1wiO1xuaW1wb3J0IHsgcmVuZGVyRm9vdGVyUGF5bWVudHMsIGluaXRQYXltZW50c09uY2UgfSBmcm9tIFwiLi9wYXltZW50LmpzXCI7XG5cbmZ1bmN0aW9uIHdhaXROZXh0RnJhbWUoKSB7XG4gIHJldHVybiBuZXcgUHJvbWlzZSgocikgPT4gcmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHIoKSkpO1xufVxuXG5hc3luYyBmdW5jdGlvbiB3aGVuQWxsU3R5bGVzTG9hZGVkKCkge1xuICBjb25zdCBsaW5rcyA9IFsuLi5kb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCdsaW5rW3JlbD1cInN0eWxlc2hlZXRcIl0nKV07XG5cbiAgYXdhaXQgUHJvbWlzZS5hbGwoXG4gICAgbGlua3MubWFwKFxuICAgICAgKGxpbmspID0+XG4gICAgICAgIG5ldyBQcm9taXNlKChyZXMpID0+IHtcbiAgICAgICAgICBsaW5rLmFkZEV2ZW50TGlzdGVuZXIoXCJsb2FkXCIsIHJlcywgeyBvbmNlOiB0cnVlIH0pO1xuICAgICAgICAgIGxpbmsuYWRkRXZlbnRMaXN0ZW5lcihcImVycm9yXCIsIHJlcywgeyBvbmNlOiB0cnVlIH0pO1xuICAgICAgICAgIHNldFRpbWVvdXQocmVzLCAwKTtcbiAgICAgICAgfSlcbiAgICApXG4gICk7XG5cbiAgY29uc3Qgc2FtZU9yaWdpblNoZWV0cyA9IFsuLi5kb2N1bWVudC5zdHlsZVNoZWV0c10uZmlsdGVyKChzKSA9PiB7XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IGhyZWYgPSBzLmhyZWYgfHwgXCJcIjtcbiAgICAgIHJldHVybiAoXG4gICAgICAgICFocmVmIHx8IGhyZWYuc3RhcnRzV2l0aChsb2NhdGlvbi5vcmlnaW4pIHx8IGhyZWYuc3RhcnRzV2l0aChcImZpbGU6XCIpXG4gICAgICApO1xuICAgIH0gY2F0Y2gge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfSk7XG5cbiAgY29uc3QgcG9sbE9uY2UgPSAoKSA9PiB7XG4gICAgZm9yIChjb25zdCBzaGVldCBvZiBzYW1lT3JpZ2luU2hlZXRzKSB7XG4gICAgICB0cnkge1xuICAgICAgICBjb25zdCBfID0gc2hlZXQuY3NzUnVsZXM7XG4gICAgICB9IGNhdGNoIChlKSB7fVxuICAgIH1cbiAgfTtcblxuICBmb3IgKGxldCBpID0gMDsgaSA8IDM7IGkrKykge1xuICAgIHBvbGxPbmNlKCk7XG4gICAgYXdhaXQgbmV3IFByb21pc2UoKHIpID0+IHJlcXVlc3RBbmltYXRpb25GcmFtZShyKSk7XG4gIH1cbn1cblxuZnVuY3Rpb24gd2FpdEZvckZvbnRzKCkge1xuICByZXR1cm4gXCJmb250c1wiIGluIGRvY3VtZW50ID8gZG9jdW1lbnQuZm9udHMucmVhZHkgOiBQcm9taXNlLnJlc29sdmUoKTtcbn1cblxuZnVuY3Rpb24gd2FpdEltYWdlc0luKGVsKSB7XG4gIGlmICghZWwpIHJldHVybiBQcm9taXNlLnJlc29sdmUoKTtcbiAgY29uc3QgaW1ncyA9IFsuLi5lbC5xdWVyeVNlbGVjdG9yQWxsKFwiaW1nXCIpXTtcbiAgY29uc3QgcHJvbWlzZXMgPSBpbWdzLm1hcCgoaW1nKSA9PlxuICAgIGltZy5jb21wbGV0ZVxuICAgICAgPyBQcm9taXNlLnJlc29sdmUoKVxuICAgICAgOiBuZXcgUHJvbWlzZSgocmVzKSA9PiB7XG4gICAgICAgICAgY29uc3QgY2IgPSAoKSA9PiByZXMoKTtcbiAgICAgICAgICBpbWcuYWRkRXZlbnRMaXN0ZW5lcihcImxvYWRcIiwgY2IsIHsgb25jZTogdHJ1ZSB9KTtcbiAgICAgICAgICBpbWcuYWRkRXZlbnRMaXN0ZW5lcihcImVycm9yXCIsIGNiLCB7IG9uY2U6IHRydWUgfSk7XG4gICAgICAgIH0pXG4gICk7XG4gIHJldHVybiBQcm9taXNlLmFsbChwcm9taXNlcyk7XG59XG5cbmFzeW5jIGZ1bmN0aW9uIGJvb3RzdHJhcCgpIHtcbiAgYXdhaXQgd2hlbkFsbFN0eWxlc0xvYWRlZCgpO1xuICBhd2FpdCB3YWl0Rm9yRm9udHMoKTtcblxuICBpbml0TGFuZ3VhZ2VNZW51cygpO1xuICBzZXRMYW5nKGRldGVjdExhbmcoKSk7XG4gIGluaXRQb3B1cCgpO1xuXG4gIGNvbnN0IGdhbWVSb290ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5nYW1lXCIpO1xuICBhd2FpdCB3YWl0SW1hZ2VzSW4oZ2FtZVJvb3QpO1xuICBhd2FpdCB3YWl0Q3NzQmFja2dyb3VuZHMoW1wiLmdhbWVcIiwgXCIucG9wdXBfX2RpYWxvZ1wiXSk7XG4gIGF3YWl0IHdhaXROZXh0RnJhbWUoKTtcblxuICAvLyBcdUQ4M0RcdURGRTIgXHUwNDQyXHUwNDM4XHUwNDNDXHUwNDQ3XHUwNDMwXHUwNDQxXHUwNDNFXHUwNDMyXHUwNDM4XHUwNDM5IFwiZGV2IGhhY2tcIiAtIFx1MDQzMlx1MDQzOFx1MDQzNFx1MDQzMFx1MDQzQlx1MDQzOFx1MDQ0Mlx1MDQzOCBcdTA0M0ZcdTA0MzVcdTA0NDBcdTA0MzVcdTA0MzQgXHUwNDMyXHUwNDU2XHUwNDM0XHUwNDM0XHUwNDMwXHUwNDQ3XHUwNDM1XHUwNDRFIFx1MDQzRFx1MDQzMCBcdTA0M0ZcdTA0NDBcdTA0M0VcdTA0MzRcbiAgLy8gbG9jYWxTdG9yYWdlLnNldEl0ZW0oXCJnYW1lLXNwdW5cIiwgXCJmYWxzZVwiKTtcblxuICAvLyBcdTA0MTNcdTA0NDBcdTA0MzA6IFx1MDQzRlx1MDQ0M1x1MDQzMVx1MDQzQlx1MDQ1Nlx1MDQ0N1x1MDQzRFx1MDQzOFx1MDQzOSBcdTA0NTZcdTA0M0RcdTA0NDJcdTA0MzVcdTA0NDBcdTA0NDRcdTA0MzVcdTA0MzlcdTA0NDEgXHUwNDU2XHUwNDNEXHUwNDU2XHUwNDQ2XHUwNDU2XHUwNDMwXHUwNDNCXHUwNDU2XHUwNDM3XHUwNDMwXHUwNDQ2XHUwNDU2XHUwNDU3LlxuICAvLyBcdTA0MTRcdTA0MzVcdTA0NDJcdTA0MzBcdTA0M0JcdTA0NTYgXHUwNDQwXHUwNDM1XHUwNDMwXHUwNDNCXHUwNDU2XHUwNDM3XHUwNDMwXHUwNDQ2XHUwNDU2XHUwNDU3IFx1MDQzRlx1MDQ0MFx1MDQzOFx1MDQ0NVx1MDQzRVx1MDQzMlx1MDQzMFx1MDQzRFx1MDQ1NiBcdTA0MzIgXHUwNDNDXHUwNDNFXHUwNDM0XHUwNDQzXHUwNDNCXHUwNDU2IGBnYW1lLmpzYC5cbiAgLy8gXHUwNDQ0XHUwNDQzXHUwNDNEXHUwNDNBXHUwNDQ2XHUwNDU2XHUwNDRGIFx1MDQ1Nlx1MDQzRFx1MDQ1Nlx1MDQ0Nlx1MDQ1Nlx1MDQzMFx1MDQzQlx1MDQ1Nlx1MDQzN1x1MDQzMFx1MDQ0Nlx1MDQ1Nlx1MDQ1NyBcdTA0MzNcdTA0NDBcdTA0MzggXHUwNDU2IFx1MDQ1N1x1MDQ1NyBcdTA0MzdcdTA0MzBcdTA0M0ZcdTA0NDNcdTA0NDFcdTA0M0FcdTA0NDMsIFx1MDQ1Nlx1MDQzQ1x1MDQzRlx1MDQzRVx1MDQ0MFx1MDQ0Mlx1MDQ0M1x1MDQ1NFx1MDQ0Mlx1MDQ0Q1x1MDQ0MVx1MDQ0RiBcdTA0MzdcdTA0M0VcdTA0MzJcdTA0M0RcdTA0NTYsIFx1MDQ0OVx1MDQzRSBcdTA0MzIgXHUwNDNEXHUwNDM1XHUwNDU3IFx1MDQ0Mlx1MDQzMFx1MDQzQyBcdTA0MzJcdTA0NDFcdTA0MzVcdTA0NDBcdTA0MzVcdTA0MzRcdTA0MzhcdTA0M0RcdTA0NTYgXHUwNDNGXHUwNDNFIFx1MDQzMVx1MDQzMFx1MDQ0MFx1MDQzMFx1MDQzMVx1MDQzMFx1MDQzRFx1MDQ0M1xuICBpbml0R2FtZSgpO1xuXG4gIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKFwiYXBwLXByZXBhcmluZ1wiKTtcbiAga2lsbEFsbEhvdmVycygpO1xufVxuXG5ib290c3RyYXAoKS5jYXRjaChjb25zb2xlLmVycm9yKTtcblxuZnVuY3Rpb24gcGFyc2VDc3NVcmxzKHZhbHVlKSB7XG4gIGNvbnN0IHVybHMgPSBbXTtcbiAgdmFsdWUucmVwbGFjZSgvdXJsXFwoKFteKV0rKVxcKS9nLCAoXywgcmF3KSA9PiB7XG4gICAgY29uc3QgdSA9IHJhdy50cmltKCkucmVwbGFjZSgvXlsnXCJdfFsnXCJdJC9nLCBcIlwiKTtcbiAgICBpZiAodSAmJiB1ICE9PSBcImFib3V0OmJsYW5rXCIpIHVybHMucHVzaCh1KTtcbiAgfSk7XG4gIHJldHVybiB1cmxzO1xufVxuXG5mdW5jdGlvbiB3YWl0Q3NzQmFja2dyb3VuZHMoc2VsZWN0b3JzKSB7XG4gIGNvbnN0IHVybHMgPSBuZXcgU2V0KCk7XG4gIGZvciAoY29uc3Qgc2VsIG9mIHNlbGVjdG9ycykge1xuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoc2VsKS5mb3JFYWNoKChlbCkgPT4ge1xuICAgICAgY29uc3QgYmcgPSBnZXRDb21wdXRlZFN0eWxlKGVsKS5nZXRQcm9wZXJ0eVZhbHVlKFwiYmFja2dyb3VuZC1pbWFnZVwiKTtcbiAgICAgIHBhcnNlQ3NzVXJscyhiZykuZm9yRWFjaCgodSkgPT4gdXJscy5hZGQodSkpO1xuICAgIH0pO1xuICB9XG4gIGlmICh1cmxzLnNpemUgPT09IDApIHJldHVybiBQcm9taXNlLnJlc29sdmUoKTtcbiAgY29uc3QgdGFza3MgPSBbLi4udXJsc10ubWFwKFxuICAgIChzcmMpID0+XG4gICAgICBuZXcgUHJvbWlzZSgocmVzKSA9PiB7XG4gICAgICAgIGNvbnN0IGltZyA9IG5ldyBJbWFnZSgpO1xuICAgICAgICBpbWcub25sb2FkID0gaW1nLm9uZXJyb3IgPSAoKSA9PiByZXMoKTtcbiAgICAgICAgaW1nLnNyYyA9IHNyYztcbiAgICAgIH0pXG4gICk7XG4gIHJldHVybiBQcm9taXNlLmFsbCh0YXNrcyk7XG59XG5cbmlmIChkb2N1bWVudC5yZWFkeVN0YXRlID09PSBcImxvYWRpbmdcIikge1xuICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwiRE9NQ29udGVudExvYWRlZFwiLCBpbml0UGF5bWVudHNPbmNlLCB7XG4gICAgb25jZTogdHJ1ZSxcbiAgfSk7XG59IGVsc2Uge1xuICBpbml0UGF5bWVudHNPbmNlKCk7XG59XG5cbi8vIFx1MDQzRVx1MDQzRFx1MDQzRVx1MDQzMlx1MDQzQlx1MDQ0RVx1MDQ1NFx1MDQzQ1x1MDQzRSBcdTA0M0RcdTA0MzAgXHUwNDNBXHUwNDNFXHUwNDM2XHUwNDNEXHUwNDQzIFx1MDQzN1x1MDQzQ1x1MDQ1Nlx1MDQzRFx1MDQ0MyBcdTA0M0NcdTA0M0VcdTA0MzJcdTA0MzggXHUwNDM3IGxhbmcuanNcbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwibGFuZ2NoYW5nZVwiLCAoZSkgPT4ge1xuICBjb25zdCBsYW5nID0gZT8uZGV0YWlsPy5sYW5nIHx8IGRldGVjdExhbmcoKTtcbiAgcmVuZGVyRm9vdGVyUGF5bWVudHMobGFuZyk7XG59KTtcblxuKGZ1bmN0aW9uICgpIHtcbiAgdmFyIHVybCA9IG5ldyBVUkwod2luZG93LmxvY2F0aW9uLmhyZWYpO1xuICBpZiAodXJsLnNlYXJjaFBhcmFtcy5oYXMoXCJyZWRpcmVjdFVybFwiKSkge1xuICAgIHZhciByZWRpcmVjdFVybCA9IG5ldyBVUkwodXJsLnNlYXJjaFBhcmFtcy5nZXQoXCJyZWRpcmVjdFVybFwiKSk7XG4gICAgaWYgKFxuICAgICAgcmVkaXJlY3RVcmwuaHJlZi5tYXRjaCgvXFwvL2cpLmxlbmd0aCA9PT0gNCAmJlxuICAgICAgcmVkaXJlY3RVcmwuc2VhcmNoUGFyYW1zLmdldChcImxcIilcbiAgICApIHtcbiAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKFwicmVkaXJlY3RVcmxcIiwgcmVkaXJlY3RVcmwuaHJlZik7XG4gICAgfVxuICB9XG4gIHZhciBwYXJhbXMgPSBbXG4gICAgXCJsXCIsXG4gICAgXCJ1dG1fc291cmNlXCIsXG4gICAgXCJ1dG1fbWVkaXVtXCIsXG4gICAgXCJ1dG1fY2FtcGFpZ25cIixcbiAgICBcInV0bV90ZXJtXCIsXG4gICAgXCJ1dG1fY29udGVudFwiLFxuICAgIFwicGFyYW0xXCIsXG4gICAgXCJwYXJhbTJcIixcbiAgXTtcbiAgdmFyIGxpbmtQYXJhbXMgPSBbXCJhZmZpZFwiLCBcImNwYWlkXCJdO1xuICBwYXJhbXMuZm9yRWFjaChmdW5jdGlvbiAocGFyYW0pIHtcbiAgICBpZiAodXJsLnNlYXJjaFBhcmFtcy5oYXMocGFyYW0pKVxuICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0ocGFyYW0sIHVybC5zZWFyY2hQYXJhbXMuZ2V0KHBhcmFtKSk7XG4gIH0pO1xuICBsaW5rUGFyYW1zLmZvckVhY2goZnVuY3Rpb24gKGxpbmtQYXJhbSkge1xuICAgIGlmICh1cmwuc2VhcmNoUGFyYW1zLmhhcyhsaW5rUGFyYW0pKVxuICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0obGlua1BhcmFtLCB1cmwuc2VhcmNoUGFyYW1zLmdldChsaW5rUGFyYW0pKTtcbiAgfSk7XG59KSgpO1xud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbiAoZSkge1xuICB2YXIgdCxcbiAgICBvLFxuICAgIGNwYWlkLFxuICAgIHIgPSBlLnRhcmdldC5jbG9zZXN0KFwiYVwiKTtcbiAgciAmJlxuICAgIFwiaHR0cHM6Ly90ZHMuY2xhcHMuY29tXCIgPT09IHIuZ2V0QXR0cmlidXRlKFwiaHJlZlwiKSAmJlxuICAgIChlLnByZXZlbnREZWZhdWx0KCksXG4gICAgKG8gPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcImFmZmlkXCIpKSxcbiAgICAoY3BhaWQgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcImNwYWlkXCIpKSxcbiAgICBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcInJlZGlyZWN0VXJsXCIpXG4gICAgICA/ICh0ID0gbmV3IFVSTChsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcInJlZGlyZWN0VXJsXCIpKSlcbiAgICAgIDogKCh0ID0gbmV3IFVSTChyLmhyZWYpKSxcbiAgICAgICAgbyAmJiBjcGFpZCAmJiAodC5wYXRobmFtZSA9IFwiL1wiICsgbyArIFwiL1wiICsgY3BhaWQpKSxcbiAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIG4gPSBuZXcgVVJMKHdpbmRvdy5sb2NhdGlvbi5ocmVmKTtcbiAgICAgIHZhciBhID0gW1xuICAgICAgICBcImxcIixcbiAgICAgICAgXCJ1dG1fc291cmNlXCIsXG4gICAgICAgIFwidXRtX21lZGl1bVwiLFxuICAgICAgICBcInV0bV9jYW1wYWlnblwiLFxuICAgICAgICBcInV0bV90ZXJtXCIsXG4gICAgICAgIFwidXRtX2NvbnRlbnRcIixcbiAgICAgICAgXCJwYXJhbTFcIixcbiAgICAgICAgXCJwYXJhbTJcIixcbiAgICAgICAgXCJhZmZpZFwiLFxuICAgICAgICBcImNwYWlkXCIsXG4gICAgICBdO1xuICAgICAgYS5mb3JFYWNoKGZ1bmN0aW9uIChlKSB7XG4gICAgICAgIG4uc2VhcmNoUGFyYW1zLmhhcyhlKSAmJiB0LnNlYXJjaFBhcmFtcy5zZXQoZSwgbG9jYWxTdG9yYWdlLmdldEl0ZW0oZSkpO1xuICAgICAgfSk7XG4gICAgfSkoKSxcbiAgICAoZG9jdW1lbnQubG9jYXRpb24uaHJlZiA9IHQpKTtcbn0pO1xuIl0sCiAgIm1hcHBpbmdzIjogIjs7QUFBQSxNQUFNLFdBQVc7QUFDakIsTUFBTSxZQUFZLENBQUMsT0FBTyxPQUFPLE9BQU8sT0FBTyxPQUFPLE9BQU8sS0FBSztBQUNsRSxNQUFNLG1CQUFtQjtBQUFBLElBQ3ZCLFFBQVE7QUFBQTtBQUFBLElBQ1IsY0FBYztBQUFBO0FBQUEsSUFDZCxVQUFVO0FBQUE7QUFBQSxJQUNWLE9BQU87QUFBQTtBQUFBLEVBQ1Q7QUFFQSxNQUFNLFlBQVk7QUFBQSxJQUNoQixLQUFLO0FBQUEsSUFDTCxLQUFLO0FBQUEsSUFDTCxLQUFLO0FBQUEsSUFDTCxLQUFLO0FBQUEsSUFDTCxLQUFLO0FBQUEsSUFDTCxLQUFLO0FBQUEsSUFDTCxLQUFLO0FBQUEsRUFDUDtBQUVBLE1BQU0sZUFBZTtBQUFBLElBQ25CLEtBQUs7QUFBQSxNQUNILE9BQU87QUFBQSxNQUNQLGlCQUFpQjtBQUFBLE1BQ2pCLGdCQUFnQjtB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QUksY0FBYyxJQUFJLElBQUksSUFBSSxhQUFhLElBQUksYUFBYSxDQUFDO0FBQzdELFVBQ0UsWUFBWSxLQUFLLE1BQU0sS0FBSyxFQUFFLFdBQVcsS0FDekMsWUFBWSxhQUFhLElBQUksR0FBRyxHQUNoQztBQUNBLHFCQUFhLFFBQVEsZUFBZSxZQUFZLElBQUk7QUFBQSxNQUN0RDtBQUFBLElBQ0Y7QUFDQSxRQUFJLFNBQVM7QUFBQSxNQUNYO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLElBQ0Y7QUFDQSxRQUFJLGFBQWEsQ0FBQyxTQUFTLE9BQU87QUFDbEMsV0FBTyxRQUFRLFNBQVUsT0FBTztBQUM5QixVQUFJLElBQUksYUFBYSxJQUFJLEtBQUs7QUFDNUIscUJBQWEsUUFBUSxPQUFPLElBQUksYUFBYSxJQUFJLEtBQUssQ0FBQztBQUFBLElBQzNELENBQUM7QUFDRCxlQUFXLFFBQVEsU0FBVSxXQUFXO0FBQ3RDLFVBQUksSUFBSSxhQUFhLElBQUksU0FBUztBQUNoQyxxQkFBYSxRQUFRLFdBQVcsSUFBSSxhQUFhLElBQUksU0FBUyxDQUFDO0FBQUEsSUFDbkUsQ0FBQztBQUFBLEVBQ0gsR0FBRztBQUNILFNBQU8saUJBQWlCLFNBQVMsU0FBVSxHQUFHO0FBQzVDLFFBQUksR0FDRixHQUNBLE9BQ0EsSUFBSSxFQUFFLE9BQU8sUUFBUSxHQUFHO0FBQzFCLFNBQ0UsNEJBQTRCLEVBQUUsYUFBYSxNQUFNLE1BQ2hELEVBQUUsZUFBZSxHQUNqQixJQUFJLGFBQWEsUUFBUSxPQUFPLEdBQ2hDLFFBQVEsYUFBYSxRQUFRLE9BQU8sR0FDckMsYUFBYSxRQUFRLGFBQWEsSUFDN0IsSUFBSSxJQUFJLElBQUksYUFBYSxRQUFRLGFBQWEsQ0FBQyxLQUM5QyxJQUFJLElBQUksSUFBSSxFQUFFLElBQUksR0FDcEIsS0FBSyxVQUFVLEVBQUUsV0FBVyxNQUFNLElBQUksTUFBTSxVQUMvQyxXQUFZO0FBQ1gsVUFBSSxJQUFJLElBQUksSUFBSSxPQUFPLFNBQVMsSUFBSTtBQUNwQyxVQUFJLElBQUk7QUFBQSxRQUNOO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsTUFDRjtBQUNBLFFBQUUsUUFBUSxTQUFVQyxJQUFHO0FBQ3JCLFVBQUUsYUFBYSxJQUFJQSxFQUFDLEtBQUssRUFBRSxhQUFhLElBQUlBLElBQUcsYUFBYSxRQUFRQSxFQUFDLENBQUM7QUFBQSxNQUN4RSxDQUFDO0FBQUEsSUFDSCxHQUFHLEdBQ0YsU0FBUyxTQUFTLE9BQU87QUFBQSxFQUM5QixDQUFDOyIsCiAgIm5hbWVzIjogWyJfYSIsICJfYiIsICJvcGVuUG9wdXAiLCAiZSJdCn0K
