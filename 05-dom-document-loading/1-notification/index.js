export default class NotificationMessage {
  duration;
  message;
  element;
  type;

  constructor(message, params = {}) {
    this.message = message;
    this.duration = params.duration;
    this.type = params.type;

    this.render();
  }

  render() {
    const element = document.createElement('div');
    element.innerHTML = this.getTemplate();
    this.element = element.firstElementChild;
  }

  show(parent = document.body) {
    this.render();
    parent.append(this.element);

    setTimeout(() => this.remove(), this.duration);
  }

  getTemplate() {
    const type = (this.type) ? ` ${this.type}` : '';
    const duration = (this.duration) ? ` style="--value:${this.duration / 1000}s"` : '';
    return `
        <div class="notification${type}"${duration}>
        <div class="timer"></div>
        <div class="inner-wrapper">
              <div class="notification-header">${(this.type) ? '' : `${this.type}`}</div>
              <div class="notification-body">
                    ${this.message}
              </div>
            </div>
        </div>
`;
  }

  remove() {
    if (this.element) {
      this.element.remove();
    }
  }

  destroy() {
    this.remove();
    this.element = null;
  }

}
