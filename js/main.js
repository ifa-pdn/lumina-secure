"use strict";

// Parallax ornamen: state mengikuti posisi section, styling tetap di CSS.
(() => {
  const sections = Array.from(document.querySelectorAll("[data-parallax-section]"))
    .filter((element) => element.querySelector("[data-parallax-ornament]"))
    .map((element) => ({ element, current: 0 }));

  if (!sections.length) return;

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const smoothingMs = 120;
  const settleThreshold = 0.0005;
  let frameId = null;
  let lastTime = null;

  function stop() {
    if (frameId !== null) cancelAnimationFrame(frameId);
    frameId = null;
    lastTime = null;
  }

  function schedule() {
    if (frameId === null && !reducedMotion.matches && !document.hidden) {
      frameId = requestAnimationFrame(update);
    }
  }

  function update(time) {
    frameId = null;
    const elapsed = lastTime === null ? 1000 / 60 : Math.min(time - lastTime, 64);
    lastTime = time;
    const blend = 1 - Math.exp(-elapsed / smoothingMs);
    const viewportHeight = window.innerHeight;

    // Baca semua geometri sebelum menulis state. Section tidak ikut bergerak.
    const targets = sections.map(({ element }) => {
      const rect = element.getBoundingClientRect();
      // Rentang lebih pendek membuat scroll kecil terasa, tetap dibatasi ±1.
      const progress = (2 * rect.top + rect.height - viewportHeight)
        / Math.max(1, viewportHeight, rect.height);
      return Math.max(-1, Math.min(1, progress));
    });

    let moving = false;
    sections.forEach((section, index) => {
      const target = targets[index];
      const next = section.current + (target - section.current) * blend;
      const settled = Math.abs(target - next) < settleThreshold;
      section.current = settled ? target : next;
      section.element.style.setProperty("--parallax-progress", section.current.toFixed(5));
      moving ||= !settled;
    });

    // Tidak ada loop JS saat scroll sudah tenang; loop mengambang tetap di CSS.
    if (moving) schedule();
    else lastTime = null;
  }

  function syncMotionPreference() {
    stop();
    sections.forEach((section) => {
      section.current = 0;
      section.element.style.removeProperty("--parallax-progress");
    });
    schedule();
  }

  window.addEventListener("scroll", schedule, { passive: true });
  window.addEventListener("resize", schedule);
  window.addEventListener("pageshow", schedule);
  reducedMotion.addEventListener("change", syncMotionPreference);
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) stop();
    else schedule();
  });

  // Ukuran dapat berubah setelah font/foto dimuat atau layout berganti breakpoint.
  if ("ResizeObserver" in window) {
    const observer = new ResizeObserver(schedule);
    sections.forEach(({ element }) => observer.observe(element));
  }

  schedule();
})();

// CULTURE: scroll natif, drag mouse, tombol, dot, dan navigasi keyboard.
(() => {
  const slider = document.querySelector("[data-culture-slider]");
  if (!slider) return;
  const viewport = slider.querySelector("[data-culture-viewport]");
  const cards = Array.from(slider.querySelectorAll("[data-culture-card]"));
  const dots = Array.from(slider.querySelectorAll("[data-culture-dot]"));
  const next = slider.querySelector("[data-culture-next]");
  const status = slider.querySelector("[data-culture-status]");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let active = 0;
  let current = cards.length;
  let scrollTimer;
  let drag = null;
  let suppressClick = false;
  let viewportWidth = viewport.clientWidth;
  let resetting = false;
  let resetFrame;
  let motionFrame = null;
  let paintFrame = null;
  const duration = 450;
  const easeOut = (progress) => 1 - (1 - progress) ** 3;
  const outgoingRange = easeOut(180 / duration);
  const descriptionStart = easeOut(60 / duration);

  // Tiga set menyediakan sambungan visual dua arah; hanya satu kartu aksesibel.
  const track = cards[0].parentElement;
  function clone(card, side) {
    const copy = card.cloneNode(true);
    const ids = new Map();
    [copy, ...copy.querySelectorAll("[id]")].forEach((element) => {
      if (element.id) {
        const original = element.id;
        element.id = `${original}-${side}`;
        ids.set(original, element.id);
      }
    });
    [copy, ...copy.querySelectorAll("[aria-labelledby]")].forEach((element) => {
      if (element.hasAttribute("aria-labelledby")) {
        element.setAttribute("aria-labelledby", element.getAttribute("aria-labelledby")
          .split(" ").map((id) => ids.get(id) || id).join(" "));
      }
    });
    copy.querySelectorAll("img").forEach((img) => { img.loading = "eager"; });
    return copy;
  }
  track.prepend(...cards.map((card) => clone(card, "before")));
  track.append(...cards.map((card) => clone(card, "after")));
  const slots = Array.from(track.children);
  const logical = (index) => (index % cards.length + cards.length) % cards.length;
  const reveals = slots.map(() => ({
    value: 0, entering: true, photo: 0, text: 0,
    originValue: 0, originPhoto: 0, originText: 0,
  }));
  const clamp = (value) => Math.max(0, Math.min(1, value));

  const position = (index) => slots[index].offsetLeft - slots[0].offsetLeft;
  function nearest() {
    return slots.reduce((best, _, index) =>
      Math.abs(position(index) - viewport.scrollLeft)
        < Math.abs(position(best) - viewport.scrollLeft) ? index : best, 0);
  }

  // State visual berasal dari jarak aktual, termasuk ketika drag dibalik.
  function render(instant = false) {
    const step = Math.max(1, position(1) - position(0));
    const left = viewport.scrollLeft;
    const reducedIndex = reducedMotion.matches ? nearest() : -1;
    const weights = slots.map((_, i) => reducedMotion.matches
      ? Number(i === reducedIndex) : clamp(1 - Math.abs(position(i) - left) / step));
    slots.forEach((card, i) => {
      const state = reveals[i];
      const value = weights[i];
      if (Math.abs(value - state.value) > 0.0001) {
        const entering = value > state.value;
        if (entering !== state.entering) {
          // Mulai dari opacity saat ini ketika arah drag berbalik, tanpa loncatan.
          state.originValue = state.value;
          state.originPhoto = state.photo;
          state.originText = state.text;
        }
        state.entering = entering;
      }
      state.value = value;
      const progress = state.entering
        ? clamp((value - state.originValue) / Math.max(0.0001, 1 - state.originValue))
        : clamp((state.originValue - value) / Math.max(0.0001, state.originValue));
      const exit = 1 - clamp(progress / outgoingRange);
      const photo = instant || reducedMotion.matches ? value : state.entering
        ? state.originPhoto + (1 - state.originPhoto) * progress : state.originPhoto * exit;
      const text = instant || reducedMotion.matches ? value : state.entering
        ? state.originText + (1 - state.originText)
          * clamp((progress - descriptionStart) / (1 - descriptionStart)) : state.originText * exit;
      state.photo = photo;
      state.text = text;
      if (instant || reducedMotion.matches) {
        state.entering = value === 0;
        state.originValue = value;
        state.originPhoto = photo;
        state.originText = text;
      }
      card.style.setProperty("--culture-reveal", value.toFixed(5));
      card.style.setProperty("--culture-photo", photo.toFixed(5));
      card.style.setProperty("--culture-text", text.toFixed(5));
    });
  }

  function stopMotion() {
    cancelAnimationFrame(motionFrame);
    motionFrame = null;
    viewport.classList.remove("culture__viewport--animating");
  }

  function update(index) {
    current = index;
    active = logical(index);
    dots.forEach((dot, i) => dot.setAttribute("aria-pressed", String(i === active)));
    slots.forEach((card, i) => {
      card.inert = i !== index;
      card.setAttribute("aria-hidden", String(i !== index));
      card.classList.toggle("culture__card--preview", i !== index);
    });
    const text = `${active + 1} / ${cards.length}：${cards[active].querySelector("h3").textContent}`;
    if (status.textContent !== text) status.textContent = text;
  }

  function normalize() {
    stopMotion();
    const focusedLink = slots[current].querySelector("a") === document.activeElement;
    resetting = true;
    clearTimeout(scrollTimer);
    cancelAnimationFrame(resetFrame);
    update(cards.length + active);
    viewport.scrollTo({ left: position(current), behavior: "instant" });
    render(true);
    if (focusedLink) slots[current].querySelector("a").focus({ preventScroll: true });
    resetFrame = requestAnimationFrame(() => {
      resetFrame = requestAnimationFrame(() => {
        resetting = false;
      });
    });
  }

  function goTo(index, smooth = true) {
    stopMotion();
    if (index < 0 || index >= slots.length) {
      const distance = index - current;
      normalize();
      index = current + distance;
    }
    update(index);
    const from = viewport.scrollLeft;
    const to = position(index);
    if (!smooth || reducedMotion.matches || Math.abs(to - from) < 1) {
      viewport.scrollTo({ left: to, behavior: "instant" });
      render(true);
      if (index < cards.length || index >= cards.length * 2) normalize();
      return;
    }
    viewport.classList.add("culture__viewport--animating");
    let started;
    function move(time) {
      started ??= time;
      const progress = clamp((time - started) / duration);
      viewport.scrollTo({ left: from + (to - from) * easeOut(progress), behavior: "instant" });
      render();
      if (progress < 1) motionFrame = requestAnimationFrame(move);
      else {
        stopMotion();
        settled();
      }
    }
    motionFrame = requestAnimationFrame(move);
  }

  function choose(index) {
    const candidates = [index, index + cards.length, index + cards.length * 2];
    const closest = candidates.reduce((best, slot) =>
      Math.abs(slot - current) < Math.abs(best - current) ? slot : best);
    goTo(closest);
  }

  next.hidden = false;
  slider.querySelector("[data-culture-dots]").hidden = false;
  next.addEventListener("click", () => goTo(current + 1));
  dots.forEach((dot, index) => dot.addEventListener("click", () => choose(index)));
  viewport.addEventListener("keydown", (event) => {
    if (event.target !== viewport) return;
    const keys = { ArrowRight: current + 1, ArrowLeft: current - 1, Home: 0, End: cards.length - 1 };
    if (!(event.key in keys)) return;
    event.preventDefault();
    if (event.key === "Home" || event.key === "End") choose(keys[event.key]);
    else goTo(keys[event.key]);
  });

  function settled() {
    // Snap bawaan saat breakpoint berubah tidak boleh mengganti kartu pilihan.
    if (drag || resetting || motionFrame !== null || viewport.clientWidth !== viewportWidth) return;
    update(nearest());
    render();
    if (current < cards.length || current >= cards.length * 2) normalize();
  }
  viewport.addEventListener("scroll", () => {
    if (paintFrame === null) paintFrame = requestAnimationFrame(() => {
      paintFrame = null;
      render();
    });
    clearTimeout(scrollTimer);
    scrollTimer = setTimeout(settled, 150);
  }, { passive: true });
  viewport.addEventListener("scrollend", settled);

  // Touch memakai swipe/scroll bawaan browser; handler ini menambah drag mouse.
  viewport.addEventListener("pointerdown", (event) => {
    stopMotion();
    if (event.pointerType !== "mouse" || event.button !== 0) return;
    if (!event.target.closest("a")) event.preventDefault();
    suppressClick = false;
    drag = { id: event.pointerId, x: event.clientX, left: viewport.scrollLeft, moved: false };
  });
  window.addEventListener("pointermove", (event) => {
    if (!drag || event.pointerId !== drag.id) return;
    const distance = event.clientX - drag.x;
    if (!drag.moved && Math.abs(distance) < 6) return;
    if (!drag.moved) {
      drag.moved = true;
      viewport.classList.add("culture__viewport--dragging");
      viewport.setPointerCapture(event.pointerId);
    }
    event.preventDefault();
    viewport.scrollLeft = drag.left - distance;
    render();
  });

  function endDrag(event) {
    if (!drag || (event && event.pointerId !== drag.id)) return;
    const { id, moved } = drag;
    drag = null;
    viewport.classList.remove("culture__viewport--dragging");
    if (viewport.hasPointerCapture(id)) viewport.releasePointerCapture(id);
    if (moved) {
      suppressClick = true;
      goTo(nearest());
      // Click hasil drag diblokir; aktivasi keyboard tetap dapat berjalan.
      setTimeout(() => { suppressClick = false; }, 0);
    }
  }
  viewport.addEventListener("pointerup", endDrag);
  viewport.addEventListener("pointercancel", endDrag);
  viewport.addEventListener("lostpointercapture", endDrag);
  window.addEventListener("pointerup", endDrag);
  viewport.addEventListener("click", (event) => {
    if (suppressClick && event.detail !== 0) {
      event.preventDefault();
      event.stopPropagation();
    }
  }, true);
  viewport.addEventListener("dragstart", (event) => event.preventDefault());
  viewport.addEventListener("wheel", (event) => {
    if (Math.abs(event.deltaX) > Math.abs(event.deltaY)) stopMotion();
  }, { passive: true });

  function resize() {
    viewportWidth = viewport.clientWidth;
    clearTimeout(scrollTimer);
    normalize();
  }
  if ("ResizeObserver" in window) {
    const observer = new ResizeObserver(resize);
    observer.observe(viewport);
  } else {
    window.addEventListener("resize", resize);
  }
  reducedMotion.addEventListener("change", normalize);
  normalize();
})();

// FAQ: native details fallback, with interruptible height and answer fades.
(() => {
  if (!("animate" in Element.prototype)) return;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const accordions = [];

  document.querySelectorAll("[data-faq-item]").forEach((item) => {
    const question = item.querySelector("[data-faq-question]");
    const answer = item.querySelector("[data-faq-answer]");
    if (!question || !answer) return;
    const state = { expanded: item.open, height: null, fade: null };

    function finish() {
      state.height?.cancel();
      state.fade?.cancel();
      state.height = state.fade = null;
      item.open = state.expanded;
      item.classList.remove("faq__item--animating");
    }

    question.addEventListener("click", (event) => {
      event.preventDefault();
      // Sample the in-flight frame before cancellation so reversal never jumps.
      const startHeight = item.getBoundingClientRect().height;
      const startOpacity = item.open ? getComputedStyle(answer).opacity : "0";
      state.expanded = state.height ? !state.expanded : !item.open;
      state.height?.cancel();
      state.fade?.cancel();
      if (reducedMotion.matches) {
        finish();
        return;
      }

      // Measure the target state, including its open/closed question padding.
      item.open = state.expanded;
      const endHeight = item.getBoundingClientRect().height;
      // Keep the answer rendered until the closing fade finishes.
      item.open = true;
      const style = getComputedStyle(item);
      const timing = {
        duration: parseFloat(style.getPropertyValue("--faq-duration")),
        easing: style.getPropertyValue("--faq-easing").trim(),
        fill: "both",
      };
      item.classList.add("faq__item--animating");
      state.height = item.animate([
        { height: `${startHeight}px` }, { height: `${endHeight}px` },
      ], timing);
      state.fade = answer.animate([
        { opacity: startOpacity }, { opacity: state.expanded ? 1 : 0 },
      ], timing);
      state.height.onfinish = finish;
    });
    accordions.push(finish);
  });

  // Settle to the requested state when dimensions or motion preferences change.
  window.addEventListener("resize", () => accordions.forEach((finish) => finish()));
  reducedMotion.addEventListener("change", () => accordions.forEach((finish) => finish()));
})();

// Hover gabungan: gradasi CSS dan blok kecil yang keluar dari tepi tombol.
// Inisialisasi setelah slider membuat klon; partikel tidak ikut digandakan.
(() => {
  const triggers = Array.from(document.querySelectorAll('[data-button-effect]'));
  if (!triggers.length || document.querySelector('[data-button-effects-layer]')) return;

  const hover = window.matchMedia('(hover: hover) and (pointer: fine)');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const layer = document.createElement('div');
  layer.className = 'button-effects';
  layer.setAttribute('data-button-effects-layer', '');
  layer.setAttribute('aria-hidden', 'true');
  document.body.append(layer);

  const states = [];
  const moving = new Set();
  let frame = null;
  const random = (min, max) => min + Math.random() * (max - min);
  const unavailable = (state) => !state.trigger.isConnected
    || state.trigger.closest('[inert], [aria-hidden="true"]');

  function place(state) {
    const rect = state.paint.getBoundingClientRect();
    const visible = rect.width > 0 && rect.height > 0 && rect.bottom > 0
      && rect.top < window.innerHeight && rect.right > 0 && rect.left < window.innerWidth;
    state.emitter.classList.toggle('button-particles--active', visible);
    // Perluas emitter hanya bila pseudo-element melampaui kotak link.
    const padding = state.textLink
      ? Math.max(0, -parseFloat(getComputedStyle(state.paint, '::before').left) || 0) : 0;
    const geometry = [rect.left - padding, rect.top, rect.width + padding * 2, rect.height];
    if (!state.geometry || geometry.some((value, i) => value !== state.geometry[i])) {
      ['x', 'y', 'width', 'height'].forEach((name, i) => {
        state.emitter.style.setProperty(`--emitter-${name}`, `${geometry[i]}px`);
      });
      state.geometry = geometry;
    }
  }

  function schedule() {
    if (frame === null && moving.size) frame = requestAnimationFrame(update);
  }

  function update() {
    frame = null;
    moving.forEach((state) => {
      if (unavailable(state)) {
        state.hovered = state.focused = false;
        sync(state);
      } else place(state);
    });
    schedule();
  }

  function sync(state) {
    const active = !unavailable(state) && (state.hovered || state.focused);
    if (!state.textLink) state.paint.classList.toggle('button-effect--active', active);
    if (active && !reducedMotion.matches && !document.hidden) {
      moving.add(state);
      place(state);
      schedule();
    } else {
      moving.delete(state);
      state.emitter.classList.remove('button-particles--active');
      if (!moving.size && frame !== null) {
        cancelAnimationFrame(frame);
        frame = null;
      }
    }
  }

  triggers.forEach((trigger) => {
    const textLink = trigger.getAttribute('data-button-effect') === 'text';
    const paint = trigger.getAttribute('data-button-particle-origin') === 'label'
      ? trigger.querySelector('.text-link__label')
      : trigger.querySelector('.culture__link-arrow') || trigger;
    // Link teks mempertahankan sapuan solid; tidak diberi pseudo-element gradasi.
    if (!textLink) paint.classList.add('button-effect');
    const emitter = document.createElement('div');
    emitter.className = 'button-particles';
    const color = trigger.getAttribute('data-button-particle-color');
    const colors = color ? [color] : trigger.matches('.button--light:not(.footer__button)')
      ? ['#065fcd', '#287cb8', '#043967'] : ['#065fcd', '#32b5d9', '#8edaf2'];

    for (let i = 0; i < 16; i += 1) {
      const block = document.createElement('span');
      block.className = 'button-particles__block';
      const side = i % 4;
      const horizontal = side < 2;
      const outward = random(16, 40) * (side % 2 === 0 ? -1 : 1);
      const spread = random(-16, 16);
      const values = {
        x: `${horizontal ? random(4, 96) : side === 2 ? 0 : 100}%`,
        y: `${horizontal ? side === 0 ? 0 : 100 : random(8, 92)}%`,
        dx: `${horizontal ? spread : outward}px`,
        dy: `${horizontal ? outward : spread}px`,
        size: `${random(5, 9).toFixed(2)}px`,
        duration: `${random(650, 1000).toFixed(0)}ms`,
        delay: `${random(0, 650).toFixed(0)}ms`,
        color: colors[i % colors.length],
      };
      Object.entries(values).forEach(([name, value]) => {
        block.style.setProperty(`--particle-${name}`, value);
      });
      emitter.append(block);
    }
    layer.append(emitter);
    const state = { trigger, paint, emitter, textLink, hovered: false, focused: false, geometry: null };
    states.push(state);

    trigger.addEventListener('pointerenter', (event) => {
      state.hovered = hover.matches && event.pointerType !== 'touch';
      sync(state);
    });
    trigger.addEventListener('pointerleave', () => {
      state.hovered = false;
      sync(state);
    });
    trigger.addEventListener('pointercancel', () => {
      state.hovered = false;
      sync(state);
    });
    trigger.addEventListener('focus', () => {
      state.focused = trigger.matches(':focus-visible');
      sync(state);
    });
    trigger.addEventListener('blur', () => {
      state.focused = false;
      sync(state);
    });
  });

  hover.addEventListener('change', () => {
    states.forEach((state) => {
      if (!hover.matches) state.hovered = false;
      sync(state);
    });
  });
  reducedMotion.addEventListener('change', () => states.forEach(sync));
  document.addEventListener('visibilitychange', () => states.forEach(sync));
  window.addEventListener('pagehide', () => {
    states.forEach((state) => {
      state.hovered = state.focused = false;
      sync(state);
    });
  });
})();

// Animate only arrow glyphs, leaving their button and particle containers fixed.
(() => {
  const hover = window.matchMedia('(hover: hover) and (pointer: fine)');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const states = [];

  const reset = (state) => {
    cancelAnimationFrame(state.returnFrame);
    state.running = false;
    state.active = false;
    state.trigger.classList.remove('arrow-motion--active');
    state.glyph.classList.add('arrow-motion__glyph--reset');
    state.glyph.style.setProperty('--arrow-rest-x', '0px');
    state.glyph.getBoundingClientRect();
    state.glyph.classList.remove('arrow-motion__glyph--reset');
  };

  const enabled = (state) => !reducedMotion.matches && !document.hidden &&
    !state.trigger.closest('[inert], [aria-hidden="true"]') &&
    state.glyph.getClientRects().length > 0;

  const sync = (state) => {
    if (!enabled(state)) {
      reset(state);
      return;
    }
    const wanted = (hover.matches && state.hovered) || state.focused;
    if (wanted && !state.active) {
      cancelAnimationFrame(state.returnFrame);
      state.glyph.classList.remove('arrow-motion__glyph--reset');
      state.glyph.style.setProperty('--arrow-rest-x', '0px');
      state.active = true;
      state.running = state.cycle;
      state.trigger.classList.add('arrow-motion--active');
    } else if (!wanted && state.active) {
      // Let the one-shot finish at its center even after an early pointer exit.
      if (state.cycle && state.running) return;
      const transform = getComputedStyle(state.glyph).transform;
      const x = transform === 'none' ? 0 : new DOMMatrixReadOnly(transform).m41;
      state.active = false;
      state.glyph.classList.add('arrow-motion__glyph--reset');
      state.glyph.style.setProperty('--arrow-rest-x', `${x}px`);
      state.trigger.classList.remove('arrow-motion--active');
      state.glyph.getBoundingClientRect();
      state.returnFrame = requestAnimationFrame(() => {
        state.glyph.classList.remove('arrow-motion__glyph--reset');
        state.glyph.style.setProperty('--arrow-rest-x', '0px');
      });
    }
  };

  document.querySelectorAll('[data-arrow-motion]').forEach((trigger) => {
    const glyph = trigger.querySelector('.arrow-motion__glyph');
    if (!glyph) return;
    const state = {
      trigger, glyph, cycle: trigger.dataset.arrowMotion === 'cycle',
      hovered: false, focused: false, active: false, running: false, returnFrame: 0,
    };
    states.push(state);
    trigger.classList.add('arrow-motion');
    trigger.classList.toggle('arrow-motion--cycle', state.cycle);
    trigger.addEventListener('pointerenter', (event) => {
      if (event.pointerType === 'touch') return;
      state.hovered = true;
      sync(state);
    });
    ['pointerleave', 'pointercancel'].forEach((type) => {
      trigger.addEventListener(type, () => {
        state.hovered = false;
        sync(state);
      });
    });
    trigger.addEventListener('focus', () => {
      state.focused = trigger.matches(':focus-visible');
      sync(state);
    });
    trigger.addEventListener('blur', () => {
      state.focused = false;
      sync(state);
    });
    glyph.addEventListener('animationend', (event) => {
      if (event.animationName !== 'arrow-pass') return;
      state.running = false;
      sync(state);
    });
  });

  hover.addEventListener('change', () => {
    states.forEach((state) => {
      if (!hover.matches) state.hovered = false;
      sync(state);
    });
  });
  reducedMotion.addEventListener('change', () => states.forEach(sync));
  document.addEventListener('visibilitychange', () => states.forEach(sync));
  window.addEventListener('resize', () => states.forEach(sync));
  window.addEventListener('pagehide', () => states.forEach((state) => {
    state.hovered = state.focused = false;
    reset(state);
  }));
})();
