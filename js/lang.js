const FALLBACK = "eng";
const SUPPORTED = ["eng", "por", "esp", "fra", "nor", "suo", "deu"];
const URL_LANG_OPTIONS = {
  method: "replace",   // або "push"
  cleanDefault: true,  // якщо lang === fallback -> прибираємо ?lang
  fallback: FALLBACK,  // що вважається дефолтною мовою
  param: "lang",       // ім'я query-параметра
};

const HTML_LANG = {
  eng: "en",
  por: "pt",
  esp: "es",
  fra: "fr",
  nor: "no",
  suo: "fi",
  deu: "de",
};

const TRANSLATIONS = {
  eng: {
    title: "Try your luck in Olympus",
    "langing-title": "Try your luck in",
    "landing-name": "Olympus",
    "landing-btn": "Spin the slot",
    "landing-popup-title": "Big win",
    "landing-popup-subtitle": "you have got up to",
    "landing-popup-btn": "Claim bonus",
  },
  esp: {
    title: "Prueba tu suerte en Olympus",
    "langing-title": "Prueba tu suerte en",
    "landing-name": "Olympus",
    "landing-btn": "Girar",
    "landing-popup-title": "Gran victoria",
    "landing-popup-subtitle": "has conseguido hasta",
    "landing-popup-btn": "Reclama el bono",
  },
  por: {
    title: "Tente a sorte em Olympus",
    "langing-title": "Tente a sorte em",
    "landing-name": "Olympus",
    "landing-btn": "Gire a slot",
    "landing-popup-title": "Grande vitória",
    "landing-popup-subtitle": "você ganhou até",
    "landing-popup-btn": "Resgatar bônus",
  },
  suo: {
    title: "Kokeile onneasi Olympus",
    "langing-title": "Kokeile onneasi",
    "landing-name": "Olympus",
    "landing-btn": "Pyöritä slottia",
    "landing-popup-title": "Iso voitto",
    "landing-popup-subtitle": "sait jopa",
    "landing-popup-btn": "Lunasta bonus",
  },
  fra: {
    title: "Essayez votre chance dans Olympus",
    "langing-title": "Essayez votre chance dans",
    "landing-name": "Olympus",
    "landing-btn": "Tourner",
    "landing-popup-title": "Gros gain",
    "landing-popup-subtitle": "vous avez obtenu jusqu’à",
    "landing-popup-btn": "Réclamez le bonus",
  },
  nor: {
    title: "Prøv lykken i Olympus",
    "langing-title": "Prøv lykken i",
    "landing-name": "Olympus",
    "landing-btn": "Spinn slotten",
    "landing-popup-title": "Stor gevinst",
    "landing-popup-subtitle": "du har fått opptil",
    "landing-popup-btn": "Hent bonus",
  },
  deu: {
    title: "Versuche dein Glück in Olympus",
    "langing-title": "Versuche dein Glück in",
    "landing-name": "Olympus",
    "landing-btn": "Drehe den Slot",
    "landing-popup-title": "Großer Gewinn",
    "landing-popup-subtitle": "du hast bis zu",
    "landing-popup-btn": "Bonus einlösen",
  },
};

export function detectLang() {
  const urlLang = new URLSearchParams(location.search).get("lang");
  if (urlLang && SUPPORTED.includes(urlLang)) return urlLang;
  const saved = localStorage.getItem("lang");
  if (saved && SUPPORTED.includes(saved)) return saved;
  return FALLBACK;
}

let SETTING_LANG = false;
export async function setLang(lang) {
  if (SETTING_LANG) return;
  SETTING_LANG = true;

  try {
    const effective = SUPPORTED.includes(lang) ? lang : FALLBACK;

    const dict = TRANSLATIONS?.[effective];
    if (!dict) throw new Error("No translations embedded");
    applyTranslations(dict);

    document.documentElement.lang = HTML_LANG[effective] || "en";

    localStorage.setItem("lang", effective);

    updateLangInUrl(effective, URL_LANG_OPTIONS);

    document
      .querySelectorAll(".navigationWrapper .navigation")
      .forEach((nav) => syncOneMenuUI(nav, effective));

    window.dispatchEvent(
      new CustomEvent("langchange", { detail: { lang: effective } })
    );
  } catch (e) {
    console.error(e);
    const dictFB = TRANSLATIONS?.[FALLBACK];
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

export function initLanguageMenus() {
  document
    .querySelectorAll(".navigationWrapper .navigation")
    .forEach(setupOneMenu);
}

function applyTranslations(dict) {
  document.querySelectorAll("[data-translate]").forEach((el) => {
    const key = el.dataset.translate;
    if (dict[key] != null) el.textContent = dict[key];
  });
  document.querySelectorAll("[data-translate-attr]").forEach((el) => {
    const pairs =
      el
        .getAttribute("data-translate-attr")
        ?.split(";")
        .map((s) => s.trim())
        .filter(Boolean) || [];
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
  const activeItem =
    [...menu.querySelectorAll(".navigation__item")].find(
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
    const srcImg = activeItem?.querySelector(".navigation__itemImg");
    const srcTxt = activeItem?.querySelector(".navigation__itemText");
    if (headImg && srcImg) {
      headImg.src = srcImg.src;
      headImg.alt = srcImg.alt || "";
    }
    if (headText && srcTxt) headText.textContent = srcTxt.textContent;
  }
}

function setupOneMenu(nav) {
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

  const currentText = nav
    .querySelector(".navigation__mainBlock .navigation__itemText")
    ?.textContent?.trim();
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
  const toggle = () => (isOpen() ? close() : open());

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
    const finish = () =>
      requestAnimationFrame(() => {
        close();
        closeAllNavs();
        nav.blur();
        document.activeElement?.blur?.();
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

  // const close = () => { if (isOpen()) { nav.classList.remove("is-open"); nav.setAttribute("aria-expanded","false"); } };
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
    ...menu.querySelectorAll(".navigation__item:not([hidden])"),
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

export function killAllHovers() {
  try {
    document.querySelectorAll(":hover").forEach((el) => el.blur?.());
  } catch (_) {}
}

function updateLangInUrl(lang, opts = URL_LANG_OPTIONS) {
  const {
    method = "replace",
    cleanDefault = false,
    fallback = FALLBACK,
    param = "lang",
  } = opts || {};

  try {
    const url = new URL(window.location.href);

    if (cleanDefault && lang === fallback) {
      url.searchParams.delete(param);
    } else {
      url.searchParams.set(param, lang);
    }

    // використовуємо відносний шлях, щоб уникати зайвого origin
    const next = url.pathname + (url.search || "") + (url.hash || "");
    const current = location.pathname + location.search + location.hash;

    if (next === current) return; // нічого не змінилося

    if (method === "push") {
      history.pushState(null, "", next);
    } else {
      history.replaceState(null, "", next);
    }
  } catch {
    // дуже рідкісний fallback на випадок проблем із URL()
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
