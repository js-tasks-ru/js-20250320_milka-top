import {sortStrings} from "../../02-javascript-data-types/1-sort-strings";

export default class SortableTable {
  element;
  headerConfig;
  data;
  subElements = {};

  constructor(headerConfig = [], data = []) {
    this.headerConfig = headerConfig;
    this.data = data;
    this.render();
  }

  render() {
    const element = document.createElement('div');
    element.innerHTML = this.getTemplate();
    this.element = element.firstElementChild;
    this.subElements = this.getSubElements(this.element);
  }

  getTemplate() {
    return `
        <div data-element="productsContainer" class="products-list__container">
          <div class="sortable-table">
                ${this.getHeaders()}
          </div>
        </div>
        `;
  }

  getHeaders() {
    const headersDivs = this.headerConfig.map((item) => this.getColumnData(item));
    const bodiesDivs = this.data.map((item) => this.getBodyData(item));
    return `
        <div class="sortable-table">
            <div data-element="header" class="sortable-table__header sortable-table__row">
               ${headersDivs.join('')}
            </div>

            <div data-element="body" class="sortable-table__body">
                ${bodiesDivs.join('')}
            </div>

            <div data-element="loading" class="loading-line sortable-table__loading-line"></div>
            <div data-element="emptyPlaceholder" class="sortable-table__empty-placeholder">
              <div>
                <p>No products satisfies your filter criteria</p>
                <button type="button" class="button-primary-outline">Reset all filters</button>
              </div>
            </div>
        </div>
        `;
  }

  getColumnData(config) {
    return `
          <div class="sortable-table__cell" data-id="${config['id']}" data-sortable="${config['sortable']}">
            <span>${config['title']}</span>
        </div>
    `;
  }

  getBodyData(item) {
    const rows = this.headerConfig.map(({id, template}) => {
      return template ? template([item]) : `<div class="sortable-table__cell">${item[id]}</div>`;
    });

    return `
    <a href="/products/${item.id}" class="sortable-table__row">
      ${rows.join('')}
    </a>`;
  }

  sort(field, order = 'asc') {
    const column = this.headerConfig.find(item => item.id === field);

    const sortedStrings = this.sortStrings(
      this.data.map(item => item[field]),
      column.sortType,
      order
    );

    this.data = sortedStrings.map(value =>
      this.data.find(item => item[field] === value)
    );

    const oldElement = this.element;
    this.render();
    this.subElements = this.getSubElements(this.element);
    oldElement.replaceWith(this.element);
  }

  getSubElements(element) {
    const elements = element.querySelectorAll('[data-element]');
    return Array.from(elements).reduce((accum, subElement) => {
      accum[subElement.dataset.element] = subElement;
      return accum;
    });
  }

  sortStrings(arr, sortType, param = 'asc') {
    switch (sortType) {
      case 'number':
        return arr.sort((a, b) => {
          return param === 'asc' ? a - b : b - a;
        });
      case 'string':
        return sortStrings(arr, param);
    }
  }


  remove() {
    if (this.element) {
      this.element.remove();
    }
  }

  destroy() {
    this.remove();
    this.subElements = null;
    this.headerConfig = null;
    this.data = null;
  }


}

