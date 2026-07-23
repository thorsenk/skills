(() => {
  const root = document.documentElement;
  const motionButton = document.querySelector("[data-motion-toggle]");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let observer;
  let motionEnabled = !reduceMotion.matches;

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
    if (!("IntersectionObserver" in window)) {
      stopMotion();
      return;
    }
    root.classList.add("motion-enabled");
    observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => entry.target.classList.toggle("is-visible", entry.isIntersecting));
    }, { threshold: 0.12 });
    document.querySelectorAll(".reveal").forEach((element) => observer.observe(element));
  };

  const renderMotionState = () => {
    if (motionEnabled) startMotion(); else stopMotion();
    if (motionButton) {
      motionButton.setAttribute("aria-pressed", String(motionEnabled));
      motionButton.textContent = motionEnabled ? "Motion on" : "Motion off";
    }
  };

  motionButton?.addEventListener("click", () => {
    motionEnabled = !motionEnabled;
    renderMotionState();
  });

  reduceMotion.addEventListener?.("change", (event) => {
    motionEnabled = !event.matches;
    renderMotionState();
  });

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
      if (!target) return;
      try {
        await copyText(target.textContent);
        if (status) status.textContent = "Copied";
      } catch (error) {
        if (status) status.textContent = "Select text";
      }
    });
  });

  renderMotionState();
})();
