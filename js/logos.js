/* UC Sustainability Rivalry campus logos.
   Files are supplied in the local `uc logos` folder. */

const LOGOS = {
  UCSD: "assets/logos/ucsd.png",
  UCLA: "assets/logos/ucla.png",
  UCB: "assets/logos/ucb.png",
  UCM: "assets/logos/ucm.png",
  UCD: "assets/logos/ucd.png",
  UCSB: "assets/logos/ucsb.png",
  UCSC: "assets/logos/ucsc.png",
  UCI: "assets/logos/uci.png",
  UCR: "assets/logos/ucr.png",
};

function badgeHTML(key, size) {
  const cls = size ? `logo-badge logo-${size}` : "logo-badge";
  const source = LOGOS[key];
  if (!source) return "";
  const name = typeof CAMPUSES !== "undefined" && CAMPUSES[key] ? CAMPUSES[key].name : key;
  return `<span class="${cls}" aria-hidden="true"><img src="${source}" alt="" loading="lazy"><span class="sr-only">${name}</span></span>`;
}

function campusMentionHTML(key, label) {
  const text = label || (typeof CAMPUSES !== "undefined" && CAMPUSES[key] ? CAMPUSES[key].name : key);
  return `<span class="campus-mention">${badgeHTML(key, "sm")}<span>${text}</span></span>`;
}

function hydrateCampusMentions(root) {
  (root || document).querySelectorAll("[data-campus-logo]").forEach((el) => {
    if (el.dataset.logoReady) return;
    const key = el.dataset.campusLogo;
    el.innerHTML = campusMentionHTML(key, el.textContent.trim());
    el.dataset.logoReady = "true";
  });
}
