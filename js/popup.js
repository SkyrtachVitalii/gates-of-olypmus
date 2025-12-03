export function openPopup() {
  document.getElementById("popup")?.classList.add("is-open");
}

export function initPopup() {
  document.addEventListener("slot:bigwin", openPopup);
}
