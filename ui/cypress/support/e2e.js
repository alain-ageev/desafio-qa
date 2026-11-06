import "cypress-real-events";

const cssBanner = `
  #fixedban,
  footer,
  #RightSide_Advertisement,
  [id^="Ad.Plus"],
  .Google-Ad,
  iframe[id^="google_ads"],
  iframe[name^="aswift"] {
    display: none !important;
    height: 0 !important;
    max-height: 0 !important;
    pointer-events: none !important;
  }
`;

function esconderBanner(win) {
  const doc = win.document;
  const aplicar = () => {
    if (doc.head && !doc.getElementById("qa-esconde-banner")) {
      const style = doc.createElement("style");
      style.id = "qa-esconde-banner";
      style.textContent = cssBanner;
      doc.head.appendChild(style);
    }
    doc.getElementById("fixedban")?.remove();
  };

  aplicar();
  if (!win.__qaBannerObserver && doc.documentElement) {
    const observer = new win.MutationObserver(aplicar);
    observer.observe(doc.documentElement, { childList: true, subtree: true });
    win.__qaBannerObserver = observer;
  }
}

Cypress.on("window:before:load", esconderBanner);
Cypress.on("window:load", esconderBanner);

Cypress.on("uncaught:exception", () => false);
