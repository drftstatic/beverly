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
        <nav id="site-nav" class="site-nav" aria-label="Primary navigation">
          ${pages
            .map(
              ([href, label]) =>
                `<a href="${href}" ${href === current ? 'aria-current="page"' : ""}>${label}</a>`
            )
            .join("")}
        </nav>
        <div class="header-controls">
          <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="site-nav">
            Menu
          </button>
          <button class="share-button" type="button" aria-label="Share this Beverly page" title="Share this Beverly page" data-share-button>
            <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
              <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7a3.2 3.2 0 0 0 0-1.39l7.05-4.11A2.98 2.98 0 1 0 15 5c0 .24.03.47.08.69L8.03 9.8a3 3 0 1 0 0 4.4l7.12 4.16c-.04.18-.06.38-.06.58a2.91 2.91 0 1 0 2.91-2.86Z"/>
            </svg>
          </button>
          <span class="share-feedback" data-share-feedback role="status" aria-live="polite"></span>
        </div>
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

  const shareButton = document.querySelector("[data-share-button]");
  if (shareButton) {
    const shareFeedback = document.querySelector("[data-share-feedback]");
    const setFeedback = (message) => {
      if (!shareFeedback) return;
      shareFeedback.textContent = message;
      shareFeedback.classList.add("is-visible");
      window.setTimeout(() => shareFeedback.classList.remove("is-visible"), 2200);
    };
    const copyLink = async (url) => {
      if (navigator.clipboard?.writeText) {
        try {
          await navigator.clipboard.writeText(url);
          return true;
        } catch (error) {
          // Fall through to the older selection-based copy path.
        }
      }

      const field = document.createElement("textarea");
      field.value = url;
      field.setAttribute("readonly", "");
      field.style.position = "fixed";
      field.style.opacity = "0";
      document.body.appendChild(field);
      field.select();
      let copied = false;
      try {
        copied = document.execCommand("copy");
      } catch (error) {
        copied = false;
      }
      field.remove();
      return copied;
    };

    shareButton.addEventListener("click", async () => {
      const canonical = document.querySelector('link[rel="canonical"]')?.href || window.location.href;
      const title = document.querySelector('meta[property="og:title"]')?.content || document.title;
      const text = document.querySelector('meta[property="og:description"]')?.content || "The tiny cup has the floor.";

      try {
        if (navigator.share) {
          await navigator.share({ title, text, url: canonical });
          setFeedback("Shared with ceremony");
        } else if (await copyLink(canonical)) {
          setFeedback("Link copied");
        } else {
          setFeedback("Copy from address bar");
        }
      } catch (error) {
        if (error?.name === "AbortError") return;
        if (await copyLink(canonical)) {
          setFeedback("Link copied");
        } else {
          setFeedback("Copy from address bar");
        }
      }
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
