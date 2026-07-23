(() => {
  const root = document.documentElement;
  const themeButtons = [...document.querySelectorAll("[data-theme-option]")];
  const themes = new Set(["dark", "mid", "light"]);
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const REVEAL_VIEWPORT_OFFSET = 0.12;
  const spotlightSelector = [
    ".token-card",
    ".deviation-card",
    ".comparison",
    ".document-shell",
    ".theme-switcher",
    ".copy-button",
    ".replay-button",
    ".primitive-card",
    ".icon-card",
    ".effect-specimen",
    ".component-contract",
    ".pattern-card",
    ".state-card",
    ".profile-card"
  ].join(",");
  let observer;

  const applyTheme = (theme, persist = true) => {
    const nextTheme = themes.has(theme) ? theme : "light";
    root.dataset.theme = nextTheme;
    themeButtons.forEach((button) => {
      button.setAttribute("aria-pressed", String(button.dataset.themeOption === nextTheme));
    });
    if (persist) {
      try {
        window.localStorage.setItem("refactor-writing-theme", nextTheme);
      } catch {
        // The selected theme still applies when storage is unavailable.
      }
    }
  };

  themeButtons.forEach((button) => {
    button.addEventListener("click", () => applyTheme(button.dataset.themeOption));
  });

  const PARTICLE_WAVE_COLUMNS = 34;
  const PARTICLE_WAVE_ROWS = 14;
  const PARTICLE_WAVE_VIEWBOX = { width: 1200, height: 420 };
  const SVG_NS = "http://www.w3.org/2000/svg";
  let particleFrame;
  let particleLastPaint = 0;
  let particleDuration = 32000;
  let particleInterval = 1000 / 30;

  const createParticleWave = (host) => {
    const svg = document.createElementNS(SVG_NS, "svg");
    svg.classList.add("hero-particle-wave");
    svg.setAttribute("viewBox", `0 0 ${PARTICLE_WAVE_VIEWBOX.width} ${PARTICLE_WAVE_VIEWBOX.height}`);
    svg.setAttribute("preserveAspectRatio", "xMidYMid slice");
    svg.setAttribute("aria-hidden", "true");
    svg.setAttribute("focusable", "false");
    svg.setAttribute("data-particle-wave", "");

    const particles = [];
    const fragment = document.createDocumentFragment();
    for (let row = 0; row < PARTICLE_WAVE_ROWS; row += 1) {
      const depth = row / (PARTICLE_WAVE_ROWS - 1);
      for (let column = 0; column < PARTICLE_WAVE_COLUMNS; column += 1) {
        const circle = document.createElementNS(SVG_NS, "circle");
        const columnRatio = column / (PARTICLE_WAVE_COLUMNS - 1);
        circle.setAttribute("r", (0.65 + (depth ** 1.55) * 3.15).toFixed(2));
        fragment.appendChild(circle);
        particles.push({ circle, columnRatio, depth, row });
      }
    }
    svg.appendChild(fragment);
    host.appendChild(svg);
    return { host, particles, visible: true };
  };

  const particleWaves = [...document.querySelectorAll(".hero, .material-hero-sample")]
    .filter((host) => !host.querySelector(":scope > .hero-particle-wave"))
    .map(createParticleWave);

  const renderParticleWave = (wave, phase) => {
    wave.particles.forEach(({ circle, columnRatio, depth, row }) => {
      const edgeFade = Math.min(1, columnRatio * 5, (1 - columnRatio) * 5);
      const drift = Math.sin(phase + row * 0.21) * 8 * (0.2 + depth);
      const x = -50 + columnRatio * 1300 + drift;
      const ridge = Math.sin(columnRatio * Math.PI * 2.2 - phase + row * 0.16);
      const crossWave = Math.sin(columnRatio * Math.PI * 4.6 + phase * 2 - row * 0.09);
      const baseY = 70 + (depth ** 1.45) * 350;
      const y = baseY + ridge * (10 + depth * 45) + crossWave * (4 + depth * 16);
      const opacity = edgeFade * (0.055 + depth * 0.39 + (ridge + 1) * 0.025);
      circle.setAttribute("cx", x.toFixed(2));
      circle.setAttribute("cy", y.toFixed(2));
      circle.setAttribute("opacity", Math.min(0.56, opacity).toFixed(3));
    });
  };

  const particleLoopDuration = () => {
    const value = Number.parseFloat(getComputedStyle(root).getPropertyValue("--motion-particle-loop"));
    return Number.isFinite(value) && value > 0 ? value : 32000;
  };

  const particleFrameInterval = () => {
    const fps = Number.parseFloat(getComputedStyle(root).getPropertyValue("--motion-particle-fps"));
    return 1000 / (Number.isFinite(fps) && fps > 0 ? fps : 30);
  };

  const paintParticleWaves = (phase) => {
    particleWaves.forEach((wave) => {
      if (wave.visible) renderParticleWave(wave, phase);
    });
  };

  const tickParticleWaves = (timestamp) => {
    if (!document.hidden && timestamp - particleLastPaint >= particleInterval) {
      const phase = ((timestamp % particleDuration) / particleDuration) * Math.PI * 2;
      paintParticleWaves(phase);
      particleLastPaint = timestamp;
    }
    particleFrame = requestAnimationFrame(tickParticleWaves);
  };

  const startParticleMotion = () => {
    if (particleFrame) cancelAnimationFrame(particleFrame);
    particleFrame = undefined;
    particleLastPaint = 0;
    particleDuration = particleLoopDuration();
    particleInterval = particleFrameInterval();
    if (reduceMotion.matches) {
      paintParticleWaves(Math.PI * 0.36);
      return;
    }
    particleFrame = requestAnimationFrame(tickParticleWaves);
  };

  if ("IntersectionObserver" in window) {
    const particleObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const wave = particleWaves.find((candidate) => candidate.host === entry.target);
        if (wave) wave.visible = entry.isIntersecting;
      });
    });
    particleWaves.forEach((wave) => particleObserver.observe(wave.host));
  }

  reduceMotion.addEventListener?.("change", startParticleMotion);

  const revealAll = () => {
    document.querySelectorAll(".reveal").forEach((element) => element.classList.add("is-visible"));
  };

  const stopMotion = () => {
    observer?.disconnect();
    observer = undefined;
    root.classList.remove("motion-enabled");
    revealAll();
  };

  const startMotion = () => {
    observer?.disconnect();
    if (reduceMotion.matches || !("IntersectionObserver" in window)) {
      stopMotion();
      return;
    }
    root.classList.add("motion-enabled");
    observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer?.unobserve(entry.target);
      });
    }, {
      threshold: 0,
      rootMargin: `0px 0px -${REVEAL_VIEWPORT_OFFSET * 100}% 0px`
    });
    document.querySelectorAll(".reveal").forEach((element) => observer.observe(element));
  };

  reduceMotion.addEventListener?.("change", startMotion);

  const copyText = async (text) => {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return;
    }
    const field = document.createElement("textarea");
    field.value = text;
    field.setAttribute("readonly", "");
    field.style.position = "fixed";
    field.style.opacity = "0";
    document.body.appendChild(field);
    field.select();
    const copied = document.execCommand("copy");
    field.remove();
    if (!copied) throw new Error("Copy command was rejected");
  };

  document.querySelectorAll("[data-copy-target]").forEach((button) => {
    button.addEventListener("click", async () => {
      const target = document.querySelector(button.dataset.copyTarget);
      const status = button.closest(".copy-group")?.querySelector(".copy-status");
      const copyIcon = button.querySelector("[data-copy-icon]");
      const checkIcon = button.querySelector("[data-check-icon]");
      if (!target) return;
      try {
        await copyText(target.textContent);
        if (status) status.textContent = "Copied";
        button.dataset.copyState = "success";
        copyIcon?.setAttribute("hidden", "");
        checkIcon?.removeAttribute("hidden");
      } catch (error) {
        if (status) status.textContent = "Select text";
        button.dataset.copyState = "fallback";
        copyIcon?.removeAttribute("hidden");
        checkIcon?.setAttribute("hidden", "");
      }
    });
  });

  const spotlightTargets = [...document.querySelectorAll(spotlightSelector)];

  const setSpotlightPosition = (target, x, y) => {
    target.style.setProperty("--spotlight-x", `${x.toFixed(2)}px`);
    target.style.setProperty("--spotlight-y", `${y.toFixed(2)}px`);
  };

  const centerSpotlight = (target) => {
    const rect = target.getBoundingClientRect();
    setSpotlightPosition(target, rect.width / 2, rect.height / 2);
  };

  const clearSpotlight = (target) => {
    target.removeAttribute("data-spotlight-active");
  };

  const activateOnly = (target) => {
    spotlightTargets.forEach((candidate) => {
      if (candidate !== target && candidate.contains(target)) clearSpotlight(candidate);
    });
    target.setAttribute("data-spotlight-active", "");
  };

  spotlightTargets.forEach((target) => {
    target.setAttribute("data-spotlight", "");

    const activateSpotlight = (event) => {
      if (event.target.closest?.(spotlightSelector) !== target) return;
      if (event.pointerType === "touch") {
        if (!target.matches(":focus-within")) clearSpotlight(target);
        return;
      }

      if (reduceMotion.matches) {
        centerSpotlight(target);
      } else {
        const rect = target.getBoundingClientRect();
        setSpotlightPosition(target, event.clientX - rect.left, event.clientY - rect.top);
      }
      activateOnly(target);
    };

    target.addEventListener("pointerenter", activateSpotlight);
    target.addEventListener("pointermove", (event) => {
      if (!reduceMotion.matches) activateSpotlight(event);
    });
    target.addEventListener("pointerleave", () => {
      if (!target.matches(":focus-within")) clearSpotlight(target);
    });
    target.addEventListener("pointercancel", () => {
      if (!target.matches(":focus-within")) clearSpotlight(target);
    });
    target.addEventListener("focusin", (event) => {
      if (event.target.closest?.(spotlightSelector) !== target) return;
      centerSpotlight(target);
      activateOnly(target);
    });
    target.addEventListener("focusout", () => {
      requestAnimationFrame(() => {
        if (!target.matches(":focus-within")) clearSpotlight(target);
      });
    });
  });

  reduceMotion.addEventListener?.("change", (event) => {
    if (!event.matches) return;
    spotlightTargets.forEach((target) => {
      if (target.hasAttribute("data-spotlight-active")) centerSpotlight(target);
    });
  });

  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") {
      spotlightTargets.forEach(clearSpotlight);
    }
  });

  const replayCleanups = new WeakMap();
  const replayRuns = new WeakMap();

  document.querySelectorAll("[data-replay-reveal]").forEach((button) => {
    button.addEventListener("click", () => {
      const targetId = button.getAttribute("aria-controls");
      const target = targetId ? document.getElementById(targetId) : null;
      if (!target) return;

      const run = (replayRuns.get(target) ?? 0) + 1;
      replayRuns.set(target, run);
      replayCleanups.get(target)?.();
      target.classList.remove("is-replaying");
      if (reduceMotion.matches) {
        replayRuns.delete(target);
        return;
      }

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          if (replayRuns.get(target) !== run) return;

          let timeoutId;
          const finishReplay = (event) => {
            if (event && event.target !== target) return;
            target.removeEventListener("animationend", finishReplay);
            target.removeEventListener("transitionend", finishReplay);
            window.clearTimeout(timeoutId);
            target.classList.remove("is-replaying");
            replayCleanups.delete(target);
            if (replayRuns.get(target) === run) replayRuns.delete(target);
          };

          target.addEventListener("animationend", finishReplay);
          target.addEventListener("transitionend", finishReplay);
          timeoutId = window.setTimeout(finishReplay, 1500);
          replayCleanups.set(target, finishReplay);
          target.classList.add("is-replaying");
        });
      });
    });
  });

  document.querySelectorAll("[data-replay-motion-tokens]").forEach((button) => {
    button.addEventListener("click", () => {
      const targetId = button.getAttribute("aria-controls");
      const target = targetId ? document.getElementById(targetId) : null;
      if (!target) return;

      replayCleanups.get(target)?.();
      target.classList.remove("is-token-replaying");
      if (reduceMotion.matches) return;

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          let timeoutId;
          const finishReplay = () => {
            window.clearTimeout(timeoutId);
            target.classList.remove("is-token-replaying");
            replayCleanups.delete(target);
          };

          timeoutId = window.setTimeout(finishReplay, 720);
          replayCleanups.set(target, finishReplay);
          target.classList.add("is-token-replaying");
        });
      });
    });
  });

  let initialTheme = root.dataset.theme;
  try {
    const storedTheme = window.localStorage.getItem("refactor-writing-theme");
    if (themes.has(storedTheme)) initialTheme = storedTheme;
  } catch {
    // The pre-rendered theme remains valid when storage is unavailable.
  }
  applyTheme(initialTheme, false);
  startParticleMotion();
  startMotion();
})();
