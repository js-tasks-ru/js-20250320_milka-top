class Tooltip {
  static instance;
  element;
  tooltipText = '';

  constructor() {
    if (Tooltip.instance) {
      return Tooltip.instance;
    }
    Tooltip.instance = this;

    this.onPointerOver = this.onPointerOver.bind(this);
    this.onPointerOut = this.onPointerOut.bind(this);
    this.onPointerMove = this.onPointerMove.bind(this);
  }

  initialize() {
    document.addEventListener('pointerover', this.onPointerOver);
    document.addEventListener('pointerout', this.onPointerOut);
  }

  render() {
    if (!this.element) {
      const currentElement = document.createElement('div');
      currentElement.className = 'tooltip';
      document.body.append(currentElement);
      this.element = currentElement;
    }
    this.element.textContent = this.tooltipText;
  }

  onPointerOver(event) {
    const target = event.target.closest('[data-tooltip]');
    if (!target) return;

    this.tooltipText = target.dataset.tooltip;
    this.render();
    this.updatePosition(event);
    document.addEventListener('pointermove', this.onPointerMove);
  }

  onPointerMove(event) {
    this.updatePosition(event);
  }

  updatePosition(event) {
    const shift = 10;
    const tooltipRect = this.element.getBoundingClientRect();
    const width = tooltipRect.width;
    const height = tooltipRect.height;
    let top = event.clientY + shift;
    let left = event.clientX + shift;

    if (left + width > innerWidth) {
      left = event.clientX - shift - width;
    }
    if (top + height > innerHeight) {
      top = event.clientY - shift - height;
    }

    Object.assign(this.element.style, {
      top: `${top}px`,
      left: `${left}px`
    });
  }

  onPointerOut() {
    this.hide();
    document.removeEventListener("pointermove", this.onPointerOut);
  }

  hide() {
    if (this.element) {
      this.element.remove();
      this.element = null;
    }
    document.removeEventListener('pointermove', this.onPointerMove);
  }

  destroy() {
    document.removeEventListener('pointerover', this.onPointerOver);
    document.removeEventListener('pointerout', this.onPointerOut);
    document.removeEventListener('pointermove', this.onPointerMove);
    this.hide();
    Tooltip.instance = null;
  }
}

export default Tooltip;
