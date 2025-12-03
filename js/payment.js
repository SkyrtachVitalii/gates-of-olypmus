import { detectLang } from "./lang.js";

const PAYMENT_SETS = {
  eng: [
    { src: "img/footer/interac.svg", alt: "Interac" },
    { src: "img/footer/visa.svg", alt: "Visa" },
    { src: "img/footer/applepay.svg", alt: "Apple Pay" },
    { src: "img/footer/googlepay.svg", alt: "Google Pay" },
    { src: "img/footer/tetherb.svg", alt: "Tether Bitcoin" },
    { src: "img/footer/age.svg", alt: "18+" },
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
    { src: "img/footer/age.svg", alt: "18+" },
  ],
  general: [
    { src: "img/footer/visa.svg", alt: "Visa" },
    { src: "img/footer/applepay.svg", alt: "Apple Pay" },
    { src: "img/footer/googlepay.svg", alt: "Google Pay" },
    { src: "img/footer/tetherb.svg", alt: "Tether Bitcoin" },
    { src: "img/footer/age.svg", alt: "18+" },
  ],
};

/**
 * Мапа "мова -> ключ набору".
 * Все не перелічене тут піде у 'general'.
 */
function pickSetKey(lang) {
  if (lang === "eng") return "eng";
  if (lang === "deu") return "deu";
  return "general";
}

/**
 * Рендеримо/оновлюємо картинки у футері.
 * Працюємо всередині .footer__items: або оновлюємо існуючі <img>, або створюємо заново.
 */
export function renderFooterPayments(lang) {
  const setKey = pickSetKey(lang);
  const items = PAYMENT_SETS[setKey] || PAYMENT_SETS.general;

  const container = document.querySelector(".footer .footer__items");
  if (!container) return;

  // Робимо структуру предсказуваною: повністю перебудуємо список (простіше і надійніше).
  container.innerHTML = ""; // якщо хочеш без повного перерендеру — можна оновлювати по місцях

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

// --- Автоініціалізація ---
 export function initPaymentsOnce() {
  renderFooterPayments(detectLang());
}

