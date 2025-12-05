/**
 * Публічний API гри.
 */
export function initGame() {
const game = document.querySelector(".game");
const btn = document.querySelector(".mainContent__btn");

btn?.addEventListener("click", (e) => {
  e.preventDefault();

  // якщо вже крутили — тільки попап
  if (localStorage.getItem("game-spun") === "true") {
    openPopup();
    return;
  }

  // одноразовий запуск
  if (game.classList.contains("is-spun")) return;

  game.classList.add("is-spun");
  btn.setAttribute("aria-disabled", "true");
  btn.setAttribute("disabled", ""); // надійніше для кнопок

  // позначаємо, що вже крутили
  localStorage.setItem("game-spun", "true");

  // чекаємо кінець анімації і показуємо попап
  const lastDrop = game.querySelector(
    ".game__col:nth-child(6) .game__colImg--66"
  );

  lastDrop?.addEventListener(
    "animationend",
    () => {
      const winSector = document.querySelector(".game__winSector");
      if (winSector) winSector.style.display = "block";

      setTimeout(() => {
        document.dispatchEvent(new CustomEvent("slot:bigwin"))
      }, 2000);
    },
    { once: true }
  );
});

  // 4) Якщо вже крутили — одразу сигналізуємо (без залежності від popup.js)
  if (localStorage.getItem("game-spun") === "true") {
    btn?.setAttribute("aria-disabled", "true");
    btn?.setAttribute("disabled", "");
    requestAnimationFrame(() =>
      document.dispatchEvent(new CustomEvent("slot:bigwin"))
    );
  }
}

