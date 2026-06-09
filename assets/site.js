(function () {
  const pages = [
    ["index.html", "Home"],
    ["manifesto.html", "Dossier"],
    ["locations.html", "Locations"],
    ["recipes.html", "Recipes"],
    ["travel.html", "Travel"],
    ["song.html", "Song"],
    ["sources.html", "Sources"],
  ];

  const current = window.location.pathname.split("/").pop() || "index.html";

  const header = document.querySelector("[data-site-header]");
  if (header) {
    header.innerHTML = `
      <header class="site-header">
        <a class="brand" href="index.html" aria-label="The Beverly Institute home">
          <span class="brand-mark">BI</span>
          <span>
            <strong>Beverly Institute</strong>
            <small>Bitter Refreshment Division</small>
          </span>
        </a>
        <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="site-nav">
          Menu
        </button>
        <nav id="site-nav" class="site-nav" aria-label="Primary navigation">
          ${pages
            .map(
              ([href, label]) =>
                `<a href="${href}" ${href === current ? 'aria-current="page"' : ""}>${label}</a>`
            )
            .join("")}
        </nav>
      </header>
    `;
  }

  const footer = document.querySelector("[data-site-footer]");
  if (footer) {
    footer.innerHTML = `
      <footer class="site-footer">
        <div>
          <strong>Unofficial Beverly Fan Site</strong>
          <p>
            Not affiliated with The Coca-Cola Company, Disney, TSA, Las Vegas,
            Italy, grapefruit, or the feeling immediately after the first sip.
          </p>
        </div>
        <a href="sources.html">Research notes</a>
      </footer>
    `;
  }

  const navToggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".site-nav");
  if (navToggle && nav) {
    navToggle.addEventListener("click", () => {
      const isOpen = nav.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
    });
  }

  const sipButton = document.querySelector("[data-sip-button]");
  if (sipButton) {
    const countEl = document.querySelector("[data-sip-count]");
    const fillEl = document.querySelector("[data-sip-fill]");
    const messageEl = document.querySelector("[data-sip-message]");
    const messages = [
      "The crowd is silent. The cup is very small.",
      "A grapefruit peel somewhere just earned tenure.",
      "Your palate has requested a recess and been denied.",
      "The tiny cup salutes your continued employment.",
      "A supermarket cooler trembles in the distance.",
      "You are now legally allowed to say 'aperitif' once.",
      "The aftertaste has filed paperwork.",
    ];
    let count = 0;

    sipButton.addEventListener("click", () => {
      count += 1;
      const fill = Math.min(100, count * 16);
      countEl.textContent = String(count);
      fillEl.style.width = `${fill}%`;
      messageEl.textContent = messages[count % messages.length];
    });
  }

  const hymnButton = document.querySelector("[data-hymn-button]");
  if (hymnButton) {
    const status = document.querySelector("[data-hymn-status]");
    hymnButton.addEventListener("click", async () => {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) {
        status.textContent = "The browser refused the baton.";
        return;
      }

      const ctx = new AudioContext();
      const notes = [392, 440, 523.25, 493.88, 440, 349.23, 392, 261.63];
      const now = ctx.currentTime;
      notes.forEach((frequency, index) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = index % 2 ? "triangle" : "sine";
        osc.frequency.value = frequency;
        gain.gain.setValueAtTime(0, now + index * 0.18);
        gain.gain.linearRampToValueAtTime(0.12, now + index * 0.18 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + index * 0.18 + 0.16);
        osc.connect(gain).connect(ctx.destination);
        osc.start(now + index * 0.18);
        osc.stop(now + index * 0.18 + 0.17);
      });
      status.textContent = "The room has been lightly carbonated.";
      window.setTimeout(() => ctx.close(), 2200);
    });
  }
})();
