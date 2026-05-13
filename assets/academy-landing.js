if (!customElements.get('academy-expanding-cards')) {
  class AcademyExpandingCards extends HTMLElement {
    constructor() {
      super();

      this.handlePointer = this.handlePointer.bind(this);
      this.handleClick = this.handleClick.bind(this);
      this.handleBlockSelect = this.handleBlockSelect.bind(this);
    }

    connectedCallback() {
      this.items.forEach((item, index) => {
        item.addEventListener('pointerenter', () => this.handlePointer(index));
        item.addEventListener('focusin', () => this.handlePointer(index));
        item.addEventListener('click', () => this.handleClick(index));
      });

      if (Shopify.designMode) {
        this.addEventListener('shopify:block:select', this.handleBlockSelect);
      }

      this.activate(this.initialIndex);
    }

    disconnectedCallback() {
      this.removeEventListener('shopify:block:select', this.handleBlockSelect);
    }

    get items() {
      return this._items || (this._items = Array.from(this.querySelectorAll('[data-expand-card]')));
    }

    get initialIndex() {
      return Math.min(parseInt(this.dataset.initialIndex || '0', 10), Math.max(this.items.length - 1, 0));
    }

    handlePointer(index) {
      if (window.matchMedia('(min-width: 990px)').matches) {
        this.activate(index);
      }
    }

    handleClick(index) {
      this.activate(index);
    }

    handleBlockSelect(event) {
      const block = event.target.closest('[data-expand-card]');

      if (!block) return;

      const index = this.items.indexOf(block);

      if (index >= 0) {
        this.activate(index);
      }
    }

    activate(index) {
      this.items.forEach((item, itemIndex) => {
        const isActive = itemIndex === index;
        item.dataset.active = isActive ? 'true' : 'false';
        item.setAttribute('aria-pressed', isActive ? 'true' : 'false');
      });
    }
  }

  customElements.define('academy-expanding-cards', AcademyExpandingCards);
}

if (!customElements.get('tabs-element')) {
  class TabsElement extends HTMLElement {
    connectedCallback() {
      this.tabs = Array.from(this.querySelectorAll('[role="tab"]'));
      this.panels = Array.from(this.querySelectorAll('[role="tabpanel"]'));

      if (!this.tabs.length || !this.panels.length) return;

      this.tabs.forEach((tab, index) => {
        tab.addEventListener('click', () => this.select(index));
      });

      if (Shopify.designMode) {
        this.addEventListener('shopify:block:select', (event) => {
          const tab = event.target.closest('[role="tab"]');
          if (!tab) return;

          const index = this.tabs.indexOf(tab);
          if (index >= 0) this.select(index);
        });
      }

      const initialIndex = this.tabs.findIndex((tab) => tab.getAttribute('aria-selected') === 'true');
      this.select(initialIndex >= 0 ? initialIndex : 0, false);
    }

    select(index, focus = true) {
      this.tabs.forEach((tab, tabIndex) => {
        const isActive = tabIndex === index;
        tab.setAttribute('aria-selected', isActive ? 'true' : 'false');
        tab.tabIndex = isActive ? 0 : -1;
        tab.classList.toggle('button--primary', isActive);
        tab.classList.toggle('button--secondary', !isActive);
      });

      this.panels.forEach((panel, panelIndex) => {
        panel.hidden = panelIndex !== index;
      });

      if (focus && this.tabs[index]) {
        this.tabs[index].focus({ preventScroll: true });
      }
    }
  }

  customElements.define('tabs-element', TabsElement);
}

if (!customElements.get('slider-element')) {
  class SliderElement extends HTMLElement {
    connectedCallback() {
      this.selector = this.getAttribute('selector') || '[data-slide]';
      this.scroller = this.querySelector('.academy-carousel__viewport') || this;
      this.track = this.querySelector('.academy-carousel__track') || this.firstElementChild;
      this.slides = Array.from(this.querySelectorAll(this.selector));

      this.addEventListener('prev-next:prev', () => this.scrollBySlide(-1));
      this.addEventListener('prev-next:next', () => this.scrollBySlide(1));

      if (Shopify.designMode) {
        this.addEventListener('shopify:block:select', (event) => {
          const slide = event.target.closest(this.selector);
          if (!slide) return;
          slide.scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' });
        });
      }

      this.updateButtons = this.updateButtons.bind(this);
      this.scroller.addEventListener('scroll', this.updateButtons, { passive: true });
      window.addEventListener('resize', this.updateButtons);
      this.updateButtons();
    }

    disconnectedCallback() {
      if (this.scroller) {
        this.scroller.removeEventListener('scroll', this.updateButtons);
      }

      window.removeEventListener('resize', this.updateButtons);
    }

    scrollBySlide(direction) {
      const slide = this.slides[0];
      if (!slide) return;

      const gap = parseFloat(getComputedStyle(this.track).columnGap || getComputedStyle(this.track).gap || 0);
      const amount = slide.getBoundingClientRect().width + gap;
      this.scroller.scrollBy({ left: amount * direction, behavior: 'smooth' });
    }

    updateButtons() {
      const prevButton = document.querySelector(`button[is="previous-button"][aria-controls="${this.id}"]`);
      const nextButton = document.querySelector(`button[is="next-button"][aria-controls="${this.id}"]`);
      const maxScroll = this.scroller.scrollWidth - this.scroller.clientWidth - 2;

      if (prevButton) prevButton.disabled = this.scroller.scrollLeft <= 2;
      if (nextButton) nextButton.disabled = this.scroller.scrollLeft >= maxScroll;
    }
  }

  customElements.define('slider-element', SliderElement);
}
