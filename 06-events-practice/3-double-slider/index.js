export default class DoubleSlider {
  min;
  max;

  constructor({
                min = 0,
                max = 100,
                selected = {},
                formatValue = value => value
              } = {}) {
    this.min = min;
    this.max = max;
    this.formatValue = formatValue;
    this.selected = {
      from: selected.from ?? this.min,
      to: selected.to ?? this.max
    };

    this.render();
    this.initEventListeners();
  }

  render() {
    const wrapper = document.createElement('div');
    wrapper.className = 'range-slider';

    wrapper.innerHTML = `
      <span data-element="from">${this.formatValue(this.selected.from)}</span>
      <div class="range-slider__inner">
        <span class="range-slider__progress"></span>
        <span class="range-slider__thumb-left"></span>
        <span class="range-slider__thumb-right"></span>
      </div>
      <span data-element="to">${this.formatValue(this.selected.to)}</span>
    `;

    this.element = wrapper;
    this.subElements = {
      from: wrapper.querySelector('[data-element="from"]'),
      to: wrapper.querySelector('[data-element="to"]'),
      inner: wrapper.querySelector('.range-slider__inner'),
      progress: wrapper.querySelector('.range-slider__progress'),
      thumbLeft: wrapper.querySelector('.range-slider__thumb-left'),
      thumbRight: wrapper.querySelector('.range-slider__thumb-right'),
    };

    this.updatePositions();
  }

  updatePositions() {
    const range = this.max - this.min;
    const leftPercent = ((this.selected.from - this.min) / range) * 100;
    const rightPercent = ((this.max - this.selected.to) / range) * 100;

    this.subElements.thumbLeft.style.left = `${leftPercent}%`;
    this.subElements.progress.style.left = `${leftPercent}%`;

    this.subElements.thumbRight.style.right = `${rightPercent}%`;
    this.subElements.progress.style.right = `${rightPercent}%`;

    this.subElements.from.textContent = this.formatValue(this.selected.from);
    this.subElements.to.textContent = this.formatValue(this.selected.to);
  }

  initEventListeners() {
    this.onThumbDown = this.onThumbDown.bind(this);
    this.subElements.thumbLeft.addEventListener('pointerdown', this.onThumbDown);
    this.subElements.thumbRight.addEventListener('pointerdown', this.onThumbDown);
  }

  onThumbDown(event) {
    event.preventDefault();
    const isLeft = event.target === this.subElements.thumbLeft;
    const {left, right, width} = this.element.getBoundingClientRect();

    this.dragging = {isLeft, left, right, width};

    this.onPointerMove = this.onPointerMove.bind(this);
    this.onThumbUp = this.onThumbUp.bind(this);

    document.addEventListener('pointermove', this.onPointerMove);
    document.addEventListener('pointerup', this.onThumbUp);
  }

  onPointerMove(event) {
    const {isLeft, left, right, width} = this.dragging;
    let newX = event.clientX;

    if (newX < left) {
      newX = left;
    }
    if (newX > right) {
      newX = right;
    }

    const percent = ((newX - left) / width) * 100;
    const value = this.min + (percent / 100) * (this.max - this.min);
    const rounded = Math.round(value);

    if (isLeft) {
      if (rounded >= this.selected.to) {
        this.selected.from = this.selected.to;
      } else if (rounded < this.min) {
        this.selected.from = this.min;
      } else {
        this.selected.from = rounded;
      }
    } else {
      if (rounded <= this.selected.from) {
        this.selected.to = this.selected.from;
      } else if (rounded > this.max) {
        this.selected.to = this.max;
      } else {
        this.selected.to = rounded;
      }
    }

    this.updatePositions();
  }

  onThumbUp() {
    document.removeEventListener('pointermove', this.onPointerMove);
    document.removeEventListener('pointerup', this.onThumbUp);
    this.dispatchEvent();
  }

  dispatchEvent() {
    const result = {
      detail: {
        from: this.selected.from,
        to: this.selected.to
      },
      bubbles: true
    };
    const rangeSelectEvent = new CustomEvent('range-select', result);

    this.element.dispatchEvent(rangeSelectEvent);
  }

  destroy() {
    this.subElements.thumbLeft.removeEventListener('pointerdown', this.onThumbDown);
    this.subElements.thumbRight.removeEventListener('pointerdown', this.onThumbDown);
    this.element.remove();
  }
}
