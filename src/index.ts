class DrillDownTable extends HTMLElement {
  private shadow: ShadowRoot;
  private table: HTMLTableElement;
  private data: any[] = [
    { id: 1, name: 'Item 1', children: [{ id: 11, name: 'Subitem 1.1' }, { id: 12, name: 'Subitem 1.2' }] },
    { id: 2, name: 'Item 2', children: [{ id: 21, name: 'Subitem 2.1' }] },
    { id: 3, name: 'Item 3', children: [] }
  ];

  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: 'open' });
    this.table = document.createElement('table');
    this.shadow.appendChild(this.table);
    this.render();
  }

  private render() {
    this.table.innerHTML = '';
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    const th = document.createElement('th');
    th.textContent = 'Name';
    headerRow.appendChild(th);
    thead.appendChild(headerRow);
    this.table.appendChild(thead);

    const tbody = document.createElement('tbody');
    this.data.forEach(item => {
      const row = document.createElement('tr');
      const cell = document.createElement('td');
      cell.textContent = item.name;
      cell.style.cursor = 'pointer';
      cell.addEventListener('click', () => this.toggleChildren(item));
      row.appendChild(cell);
      tbody.appendChild(row);

      if (item.expanded) {
        item.children.forEach((child: any) => {
          const childRow = document.createElement('tr');
          const childCell = document.createElement('td');
          childCell.textContent = '  ' + child.name; // Indent
          childRow.appendChild(childCell);
          tbody.appendChild(childRow);
        });
      }
    });
    this.table.appendChild(tbody);
  }

  private toggleChildren(item: any) {
    item.expanded = !item.expanded;
    this.render();
  }
}

customElements.define('drill-down-table', DrillDownTable);
