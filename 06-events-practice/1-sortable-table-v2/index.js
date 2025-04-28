import SortableTableV1 from '../../05-dom-document-loading/2-sortable-table-v1/index.js';

export default class SortableTable extends SortableTableV1 {
  constructor(headersConfig, {data = [], sorted = {}} = {}) {
    super(headersConfig, data);

    this.sorted = sorted;
    this.sort(this.sorted.id, this.sorted.order);

    this.element.addEventListener('pointerdown', this.onSortClick);
  }

  onSortClick = event => {
    const column = event.target.closest('[data-sortable="true"]');
    if (!column) return;

    const id = column.dataset.id;
    const currentOrder = column.dataset.order || 'asc';
    const newOrder = currentOrder === 'asc' ? 'desc' : 'asc';

    this.sorted = {id, order: newOrder};
    this.sort(id, newOrder);
  }

  sort(field, order = 'asc') {
    super.sort(field, order);

    this.subElements.header.querySelectorAll('[data-id]').forEach(cell => {
      cell.dataset.order = '';
    });

    const currentColumn = this.subElements.header.querySelector(`[data-id="${field}"]`);
    if (currentColumn) {
      currentColumn.dataset.order = order;

      let arrow = currentColumn.querySelector('.sortable-table__sort-arrow');
      if (!arrow) {
        arrow = document.createElement('span');
        arrow.className = 'sortable-table__sort-arrow';
        arrow.dataset.element = 'arrow';

        const sortArrow = document.createElement('span');
        sortArrow.className = 'sort-arrow';
        arrow.appendChild(sortArrow);
        currentColumn.append(arrow);
      }
    }
    this.element.addEventListener('pointerdown', this.onSortClick);
  }

  destroy() {
    super.destroy();
    this.element.removeEventListener('pointerdown', this.onSortClick);
  }
}
