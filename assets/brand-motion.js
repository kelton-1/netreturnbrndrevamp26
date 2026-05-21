/*
 * Brand motion language — sitewide coordinator.
 *
 * Contains:
 *   1. Tactile-button ripple — Glow-Green wave radiates from click point on .brand-btn--primary
 *      and .brand-btn--outline. CSS handles press feedback + hover transitions; this only
 *      adds the ripple span.
 *   2. Reveal cascade — sections marked [data-brand-reveal] get staggered entrance for their
 *      eyebrow / headline / body / CTA when scrolled into view. Headline gets word-by-word
 *      split. Pure CSS transitions drive the actual animation; JS just injects per-word
 *      transition-delay values and toggles the .is-revealed class via IntersectionObserver.
 *   3. Premium-lift card motion — cards marked .brand-lift get cursor-tracked tilt + parallax
 *      + an inside-card Glow-Green light that follows the cursor. Touch/reduced-motion safe.
 *
 * Defensive: every effect is gated by feature detection and prefers-reduced-motion. If JS
 * fails to load, sections remain visible (the CSS hidden-state requires a JS-added
 * .brand-motion-ready class to apply), buttons keep their CSS-only press + hover, and cards
 * keep their static lift / shadow. No flash-of-invisible-content possible.
 */
(function () {
  if (window.__brandMotionBound) return;
  window.__brandMotionBound = true;

  var REDUCED_MOTION = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var IS_TOUCH = 'ontouchstart' in window || (window.matchMedia && window.matchMedia('(hover: none)').matches);

  /* ------------------------------------------------------------
   * 1. RIPPLE — click handler delegated at document level.
   *    A short-lived span is appended to the button, positioned at
   *    the click point, and animated outward via CSS keyframes.
   *    The span removes itself on animationend. Stacking rapid clicks
   *    is fine — each gets its own span.
   * ---------------------------------------------------------- */
  document.addEventListener('click', function (event) {
    if (REDUCED_MOTION) return;
    var btn = event.target.closest('.brand-btn');
    if (!btn) return;
    // Only ripple on the buttons where it reads as intentional —
    // primary and outline. Ghost-dark gets its own neon flash via CSS.
    if (!btn.classList.contains('brand-btn--primary') && !btn.classList.contains('brand-btn--outline')) return;

    var rect = btn.getBoundingClientRect();
    var diameter = Math.max(rect.width, rect.height) * 2.6;
    var ripple = document.createElement('span');
    ripple.className = 'brand-btn__ripple';
    ripple.style.width = ripple.style.height = diameter + 'px';
    ripple.style.left = (event.clientX - rect.left - diameter / 2) + 'px';
    ripple.style.top = (event.clientY - rect.top - diameter / 2) + 'px';
    btn.appendChild(ripple);
    ripple.addEventListener('animationend', function () { ripple.remove(); });
  }, { passive: true });

  /* ------------------------------------------------------------
   * 2. REVEAL CASCADE — finds [data-brand-reveal] sections, splits
   *    any headline child into words, sets per-word transition-delay,
   *    and adds .is-revealed when the section crosses into the viewport.
   *    Sections opt in via data-brand-reveal on the section root.
   *    Children get classed automatically:
   *      - .brand-eyebrow (also any [data-reveal-eyebrow])
   *      - .brand-headline / .brand-headline--display / h1/h2 with class brand-reveal__headline
   *      - .brand-body / [data-reveal-body]
   *      - .brand-btn within the reveal scope (acts as the CTA layer)
   * ---------------------------------------------------------- */
  var REVEAL_EYEBROW_SEL = '.brand-eyebrow, [data-reveal-eyebrow]';
  var REVEAL_HEADLINE_SEL = '[data-reveal-headline], .brand-reveal__headline';
  var REVEAL_BODY_SEL = '[data-reveal-body], .brand-reveal__body';
  var REVEAL_CTA_SEL = '[data-reveal-cta], .brand-reveal__cta';

  // Words are wrapped in <span class="brand-reveal__word-wrap"><span class="brand-reveal__word">…</span></span>.
  // The wrapper is overflow:hidden so the 24px slide clips cleanly.
  //
  // Walks the DOM so headlines with internal markup — e.g. the hero's
  // <h1>The Net That <span class="brand-headline__em">Returns.</span></h1> —
  // keep their span wrappers intact while each word still gets its own
  // animated wrapper. Returns the running word index so siblings stay in
  // sequence across element boundaries.
  function splitNodeWords(node, startIndex) {
    var index = startIndex || 0;
    var children = Array.prototype.slice.call(node.childNodes);
    children.forEach(function (child) {
      if (child.nodeType === 3 /* TEXT_NODE */) {
        var text = child.textContent;
        if (!text.trim()) return; // pure whitespace — leave alone
        var frag = document.createDocumentFragment();
        var tokens = text.split(/(\s+)/);
        tokens.forEach(function (token) {
          if (/^\s+$/.test(token)) {
            frag.appendChild(document.createTextNode(token));
            return;
          }
          if (!token) return;
          var wrap = document.createElement('span');
          wrap.className = 'brand-reveal__word-wrap';
          var word = document.createElement('span');
          word.className = 'brand-reveal__word';
          word.style.transitionDelay = (160 + index * 40) + 'ms';
          word.textContent = token;
          wrap.appendChild(word);
          frag.appendChild(wrap);
          index += 1;
        });
        child.parentNode.replaceChild(frag, child);
      } else if (child.nodeType === 1 /* ELEMENT_NODE */) {
        // Recurse so inner spans (e.g. .brand-headline__em) keep their styling
        // wrappers while their text content gets word-split.
        index = splitNodeWords(child, index);
      }
    });
    return index;
  }

  function splitHeadlineWords(node) {
    if (node.__brandReveal) return;
    node.__brandReveal = true;
    var totalWords = splitNodeWords(node, 0);
    // Store the headline's last-word delay so body/CTA timing can chain off it.
    node.__brandRevealLastDelay = totalWords > 0 ? 160 + (totalWords - 1) * 40 + 480 : 240;
  }

  function prepReveal(section) {
    if (section.__brandRevealPrepped) return;
    section.__brandRevealPrepped = true;
    section.classList.add('brand-motion-ready');

    // Eyebrow — first, slight delay so the section settles before things move.
    section.querySelectorAll(REVEAL_EYEBROW_SEL).forEach(function (el) {
      el.classList.add('brand-reveal__eyebrow');
      el.style.transitionDelay = '60ms';
    });

    // Headline — split words.
    var lastHeadlineDelay = 0;
    section.querySelectorAll(REVEAL_HEADLINE_SEL).forEach(function (el) {
      splitHeadlineWords(el);
      if (el.__brandRevealLastDelay && el.__brandRevealLastDelay > lastHeadlineDelay) {
        lastHeadlineDelay = el.__brandRevealLastDelay;
      }
    });

    // Body — fades in after headline lands.
    section.querySelectorAll(REVEAL_BODY_SEL).forEach(function (el) {
      el.classList.add('brand-reveal__body-line');
      el.style.transitionDelay = (lastHeadlineDelay + 80) + 'ms';
    });

    // CTA layer — fades in slightly after body.
    section.querySelectorAll(REVEAL_CTA_SEL).forEach(function (el) {
      el.classList.add('brand-reveal__cta-layer');
      el.style.transitionDelay = (lastHeadlineDelay + 160) + 'ms';
    });
  }

  function initReveal() {
    var sections = document.querySelectorAll('[data-brand-reveal]:not([data-brand-reveal-bound])');
    if (!sections.length) return;

    if (REDUCED_MOTION || !('IntersectionObserver' in window)) {
      // Mark sections as already revealed so they show without animation.
      sections.forEach(function (section) {
        section.setAttribute('data-brand-reveal-bound', '1');
        prepReveal(section);
        section.classList.add('is-revealed');
      });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-revealed');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.2, rootMargin: '0px 0px -8% 0px' });

    sections.forEach(function (section) {
      section.setAttribute('data-brand-reveal-bound', '1');
      prepReveal(section);
      observer.observe(section);
    });
  }

  /* ------------------------------------------------------------
   * 3. PREMIUM LIFT — cursor-tracked tilt + parallax + glow light
   *    inside the card. Opt in via class .brand-lift on the card root.
   *    The card root sets --mx / --my CSS custom properties as the
   *    cursor moves across it. CSS does the transform and the radial-
   *    gradient overlay.
   * ---------------------------------------------------------- */
  function initPremiumLift() {
    if (REDUCED_MOTION || IS_TOUCH) return;
    var cards = document.querySelectorAll('.brand-lift:not([data-brand-lift-bound])');
    if (!cards.length) return;

    cards.forEach(function (card) {
      card.setAttribute('data-brand-lift-bound', '1');
      var rafPending = false;
      var lastEvent = null;

      // Clamp helper so weird DOMRect values (e.g. mid-transition) can never
      // produce extreme transform values. Bounds the cursor-position normalize
      // to [-0.5, 0.5] regardless of what the math returns.
      function clamp(v) {
        return v < -0.5 ? -0.5 : (v > 0.5 ? 0.5 : v);
      }

      function update() {
        rafPending = false;
        if (!lastEvent) return;
        var rect = card.getBoundingClientRect();
        if (!rect.width || !rect.height) return; // card not laid out — bail
        // Normalize cursor position within the card: range -0.5 to 0.5
        var mx = clamp((lastEvent.clientX - rect.left) / rect.width - 0.5);
        var my = clamp((lastEvent.clientY - rect.top) / rect.height - 0.5);
        // Cursor-light position: percentage within the card for the radial gradient
        var lx = ((lastEvent.clientX - rect.left) / rect.width) * 100;
        var ly = ((lastEvent.clientY - rect.top) / rect.height) * 100;
        card.style.setProperty('--mx', mx.toFixed(3));
        card.style.setProperty('--my', my.toFixed(3));
        card.style.setProperty('--lx', lx.toFixed(1) + '%');
        card.style.setProperty('--ly', ly.toFixed(1) + '%');
      }

      card.addEventListener('mousemove', function (event) {
        lastEvent = event;
        if (rafPending) return;
        rafPending = true;
        requestAnimationFrame(update);
      });

      function resetLift() {
        lastEvent = null;
        card.style.setProperty('--mx', '0');
        card.style.setProperty('--my', '0');
        card.style.setProperty('--lx', '50%');
        card.style.setProperty('--ly', '50%');
      }

      card.addEventListener('mouseleave', resetLift);

      // Click-bulge guard. When the user clicks anywhere inside the card the
      // browser begins navigating to whatever <a href> they hit. Rendering can
      // pause mid-transition — sometimes precisely on the overshoot peak of
      // the spring curve — which presents as a brief "bulged" card before the
      // next page loads. Snapping the tilt and cursor-light back to neutral on
      // mousedown means the navigation-captured frame shows a calm card.
      // Pointerdown fires earlier than click on every modern browser so the
      // reset lands before the browser starts unloading.
      card.addEventListener('pointerdown', function () {
        card.classList.add('brand-lift--snap');
        resetLift();
        // Drop the snap class after navigation likely completed so future
        // hovers animate normally again on bfcache restore.
        setTimeout(function () { card.classList.remove('brand-lift--snap'); }, 320);
      });
    });
  }

  /* ------------------------------------------------------------
   * 4. MARQUEE GLYPH SCROLL ROTATION — every Precision+ glyph in the
   *    sticky announcement marquee rotates as the page scrolls. One
   *    full turn per viewport-height of scroll. Drives a single CSS
   *    custom property on :root, which is read by .brand-marquee
   *    .brand-plus via CSS. One JS write per rAF tick drives every
   *    glyph simultaneously with zero per-element overhead.
   * ---------------------------------------------------------- */
  /* ------------------------------------------------------------
   * Measure the marquee's rendered height so the sticky header can
   * offset by the right amount. The marquee section is sticky to top:0
   * and the header is sticky to top: var(--brand-marquee-height). If we
   * leave the variable unset, the header sticks to top:0 too and the two
   * bars overlap. We measure on init and again on resize / mutation.
   * ---------------------------------------------------------- */
  var marqueeHeightBound = false;
  function initMarqueeHeight() {
    if (marqueeHeightBound) return;
    var section = document.querySelector('.brand-marquee-section');
    if (!section) return;
    marqueeHeightBound = true;

    var docEl = document.documentElement;
    function measure() {
      // Use getBoundingClientRect().height (fractional) instead of offsetHeight
      // (integer-rounded). If the marquee actually renders at e.g. 37.6px,
      // offsetHeight returns 37 or 38 depending on the browser — leaving a
      // sub-pixel overlap or gap between the marquee and the header below it.
      // Ceiling the fractional value guarantees the header offset is never
      // smaller than the marquee, so the header can't slide up under it.
      var rect = section.getBoundingClientRect();
      docEl.style.setProperty('--brand-marquee-height', Math.ceil(rect.height) + 'px');
    }
    measure();
    if ('ResizeObserver' in window) {
      new ResizeObserver(measure).observe(section);
    } else {
      window.addEventListener('resize', measure, { passive: true });
    }
    // Also re-measure once the brand web fonts have finished loading. Crystal
    // and Miracle Mono replace the system-font fallback after first paint, and
    // the swap can grow the marquee's line-height by a fractional pixel.
    // Without this, the header's offset can land just under the marquee's
    // final rendered height and "slide upwards into" it.
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(measure);
    }
  }

  var marqueeScrollBound = false;
  function initMarqueeScroll() {
    if (REDUCED_MOTION) return;
    if (marqueeScrollBound) return; // guard against double-binding on section reload
    // Only run if a marquee actually exists on this page — avoids
    // attaching a scroll listener to pages that don't need it.
    if (!document.querySelector('.brand-marquee .brand-plus')) return;
    marqueeScrollBound = true;

    var docEl = document.documentElement;
    var rafPending = false;

    function update() {
      rafPending = false;
      var vh = window.innerHeight || 1;
      var rotation = (window.scrollY / vh) * 360;
      docEl.style.setProperty('--brand-scroll-rotation', rotation.toFixed(2) + 'deg');
    }

    function onScroll() {
      if (rafPending) return;
      rafPending = true;
      requestAnimationFrame(update);
    }

    // Prime the value so a deep-linked page with scroll already restored
    // doesn't pop the glyph from 0deg to wherever it should be on first scroll.
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
  }

  /* ------------------------------------------------------------
   * Bootstrap. Run on DOM ready, then re-run after Shopify theme
   * editor section reloads so newly-inserted cards / sections also
   * get bound.
   * ---------------------------------------------------------- */
  function bootstrap() {
    initReveal();
    initPremiumLift();
    initMarqueeHeight();
    initMarqueeScroll();
  }

  if (document.readyState !== 'loading') {
    bootstrap();
  } else {
    document.addEventListener('DOMContentLoaded', bootstrap);
  }

  document.addEventListener('shopify:section:load', bootstrap);
})();
