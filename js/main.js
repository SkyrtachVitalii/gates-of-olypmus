import {
  initLanguageMenus,
  detectLang,
  setLang,
  killAllHovers,
} from "./lang.js";
import { initGame } from "./game.js";
import { initPopup } from "./popup.js";
import { renderFooterPayments, initPaymentsOnce } from "./payment.js";

function waitNextFrame() {
  return new Promise((r) => requestAnimationFrame(() => r()));
}

async function whenAllStylesLoaded() {
  const links = [...document.querySelectorAll('link[rel="stylesheet"]')];

  await Promise.all(
    links.map(
      (link) =>
        new Promise((res) => {
          link.addEventListener("load", res, { once: true });
          link.addEventListener("error", res, { once: true });
          setTimeout(res, 0);
        })
    )
  );

  const sameOriginSheets = [...document.styleSheets].filter((s) => {
    try {
      const href = s.href || "";
      return (
        !href || href.startsWith(location.origin) || href.startsWith("file:")
      );
    } catch {
      return false;
    }
  });

  const pollOnce = () => {
    for (const sheet of sameOriginSheets) {
      try {
        const _ = sheet.cssRules;
      } catch (e) {}
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
  const promises = imgs.map((img) =>
    img.complete
      ? Promise.resolve()
      : new Promise((res) => {
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

  // 🟢 тимчасовий "dev hack" - видалити перед віддачею на прод
  // localStorage.setItem("game-spun", "false");

  // Гра: публічний інтерфейс ініціалізації.
  // Деталі реалізації приховані в модулі `game.js`.
  // функція ініціалізації гри і її запуску, імпортується зовні, що в неї там всередині по барабану
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
  const urls = new Set();
  for (const sel of selectors) {
    document.querySelectorAll(sel).forEach((el) => {
      const bg = getComputedStyle(el).getPropertyValue("background-image");
      parseCssUrls(bg).forEach((u) => urls.add(u));
    });
  }
  if (urls.size === 0) return Promise.resolve();
  const tasks = [...urls].map(
    (src) =>
      new Promise((res) => {
        const img = new Image();
        img.onload = img.onerror = () => res();
        img.src = src;
      })
  );
  return Promise.all(tasks);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initPaymentsOnce, {
    once: true,
  });
} else {
  initPaymentsOnce();
}

// оновлюємо на кожну зміну мови з lang.js
window.addEventListener("langchange", (e) => {
  const lang = e?.detail?.lang || detectLang();
  renderFooterPayments(lang);
});

(function () {
  var url = new URL(window.location.href);
  if (url.searchParams.has("redirectUrl")) {
    var redirectUrl = new URL(url.searchParams.get("redirectUrl"));
    if (
      redirectUrl.href.match(/\//g).length === 4 &&
      redirectUrl.searchParams.get("l")
    ) {
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
    "param2",
  ];
  var linkParams = ["affid", "cpaid"];
  params.forEach(function (param) {
    if (url.searchParams.has(param))
      localStorage.setItem(param, url.searchParams.get(param));
  });
  linkParams.forEach(function (linkParam) {
    if (url.searchParams.has(linkParam))
      localStorage.setItem(linkParam, url.searchParams.get(linkParam));
  });
})();
window.addEventListener("click", function (e) {
  var t,
    o,
    cpaid,
    r = e.target.closest("a");
  r &&
    "https://tds.claps.com" === r.getAttribute("href") &&
    (e.preventDefault(),
    (o = localStorage.getItem("affid")),
    (cpaid = localStorage.getItem("cpaid")),
    localStorage.getItem("redirectUrl")
      ? (t = new URL(localStorage.getItem("redirectUrl")))
      : ((t = new URL(r.href)),
        o && cpaid && (t.pathname = "/" + o + "/" + cpaid)),
    (function () {
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
        "cpaid",
      ];
      a.forEach(function (e) {
        n.searchParams.has(e) && t.searchParams.set(e, localStorage.getItem(e));
      });
    })(),
    (document.location.href = t));
});
