interface DrillDownTableConfig {
  data?: any[];
  columns?: string[];
  styles?: string;
  onRowToggled?: (item: any) => void;
}

class DrillDownTableBuilder {
  private config: DrillDownTableConfig = {
    data: [],
    columns: ['Name'],
    styles: '',
    onRowToggled: undefined
  };

  withData(data: any[]): this {
    this.config.data = data;
    return this;
  }

  withColumns(columns: string[]): this {
    this.config.columns = columns;
    return this;
  }

  withStyles(styles: string): this {
    this.config.styles = styles;
    return this;
  }

  onRowToggled(callback: (item: any) => void): this {
    this.config.onRowToggled = callback;
    return this;
  }

  build(): DrillDownTable {
    const table = document.createElement('drill-down-table') as DrillDownTable;

    // Apply configuration
    if (this.config.data) table.data = this.config.data;
    if (this.config.columns) table.columns = this.config.columns;
    if (this.config.styles) table.setAttribute('styles', this.config.styles);
    if (this.config.onRowToggled) {
      table.addEventListener('row-toggled', (e: Event) => {
        const customEvent = e as CustomEvent;
        this.config.onRowToggled!(customEvent.detail);
      });
    }

    // Initial render
    table.render();

    return table;
  }
}

class DrillDownTable extends HTMLElement {
  private shadow: ShadowRoot;
  private table: HTMLTableElement;

  // Public properties
  data: any[] = [];
  columns: string[] = ['Name'];
  customStyles: string = '';

  static get observedAttributes() {
    return ['data', 'columns', 'styles'];
  }

  // Static builder method - returns a new builder instance
  static builder(): DrillDownTableBuilder {
    return new DrillDownTableBuilder();
  }

  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: 'open' });
    this.table = document.createElement('table');
    this.shadow.appendChild(this.table);
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    if (name === 'data') {
      this.handleDataAttribute(newValue);
    } else if (name === 'columns') {
      this.columns = newValue.split(',').map(col => col.trim());
      this.render();
    } else if (name === 'styles') {
      this.handleStylesAttribute(newValue);
    }
  }

  private async handleDataAttribute(value: string) {
    // Check if value looks like a file path or URL
    const isFilePath = value.endsWith('.json') || value.startsWith('http://') || value.startsWith('https://') || value.startsWith('./') || value.startsWith('../');

    if (isFilePath) {
      // Load data from file/URL
      try {
        const response = await fetch(value);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const jsonData = await response.json();
        this.data = jsonData;
        this.render();
        console.log('Data loaded from file:', value);
      } catch (error) {
        console.error('Error loading data from file:', value, error);
      }
    } else {
      // Parse as JSON string
      try {
        this.data = JSON.parse(value);
        this.render();
      } catch (e) {
        console.error('Invalid JSON for data attribute:', e);
      }
    }
  }

  private async handleStylesAttribute(value: string) {
    // Check if value looks like a CSS file path or URL
    const isFilePath = value.endsWith('.css') || value.startsWith('http://') || value.startsWith('https://') || value.startsWith('./') || value.startsWith('../');

    if (isFilePath) {
      // Load styles from file/URL using link element
      try {
        // Remove any existing style elements or links
        const existingStyle = this.shadow.querySelector('style');
        const existingLink = this.shadow.querySelector('link[rel="stylesheet"]');
        if (existingStyle) existingStyle.remove();
        if (existingLink) existingLink.remove();

        // Create a link element for external CSS
        const linkElement = document.createElement('link');
        linkElement.rel = 'stylesheet';
        linkElement.href = value;
        this.shadow.appendChild(linkElement);

        console.log('Styles loaded from file:', value);
      } catch (error) {
        console.error('Error loading styles from file:', value, error);
      }
    } else {
      // Use as CSS string directly
      // Remove any existing link elements
      const existingLink = this.shadow.querySelector('link[rel="stylesheet"]');
      if (existingLink) existingLink.remove();

      // Apply CSS string
      let styleElement = this.shadow.querySelector('style');
      if (!styleElement) {
        styleElement = document.createElement('style');
        this.shadow.appendChild(styleElement);
      }
      styleElement.textContent = value;
    }
  }

  // Explicit method to set data and render
  setData(data: any[]): void {
    this.data = data;
    this.render();
  }

  // Explicit method to set columns and render
  setColumns(columns: string[]): void {
    this.columns = columns;
    this.render();
  }

  render(): void {
    this.table.innerHTML = '';
    
    // Apply custom styles only for CSS strings (file-based styles are handled via link elements)
    if (this.customStyles && !this.customStyles.includes('http') && !this.customStyles.includes('.css')) {
      let styleElement = this.shadow.querySelector('style');
      if (!styleElement) {
        styleElement = document.createElement('style');
        this.shadow.appendChild(styleElement);
      }
      styleElement.textContent = this.customStyles;
    }
    
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    this.columns.forEach(col => {
      const th = document.createElement('th');
      th.textContent = col;
      headerRow.appendChild(th);
    });
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
          childRow.classList.add('child-row');
          const childCell = document.createElement('td');
          childCell.textContent = '  ' + child.name; // Indent
          childRow.appendChild(childCell);
          tbody.appendChild(childRow);
        });
      }
    });
    this.table.appendChild(tbody);
  }

  private toggleChildren(item: any): void {
    item.expanded = !item.expanded;
    this.render();
    this.dispatchEvent(new CustomEvent('row-toggled', { detail: item }));
  }
}

customElements.define('drill-down-table', DrillDownTable);

export { DrillDownTable, DrillDownTableBuilder };
