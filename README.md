## Project Structure

```
DrillDown/
├── src/                 # TypeScript source code
├── styles/              # CSS stylesheets
│   ├── custom-styles.css    # Table component styles
│   └── examples.css         # Page layout styles
├── data/                # JSON data files
│   ├── sample-data.json     # Default sample data
│   └── alternate-data.json  # Alternative data for demos
├── examples/            # (Empty - examples moved to index.html)
├── index.html           # Main demo page with all examples
├── package.json
└── README.md
```

## Features

- **Builder Pattern**: Fluent API for easy configuration
- **Web Component**: Use with HTML attributes or JavaScript
- **Custom Styling**: Apply your own CSS styles
- **Event Handling**: Listen for row toggle events
- **TypeScript Support**: Full type definitions included
- **Shadow DOM**: Encapsulated styling and behavior

## Quick Start

### Installation

```bash
npm install
npm start
```

### Usage

#### JavaScript Builder Pattern (Recommended)

```javascript
import { DrillDownTable } from './src/index.js';

const table = DrillDownTable.builder()
    .withData([
        { name: 'Parent 1', expanded: false, children: [{ name: 'Child 1' }] }
    ])
    .withColumns(['Name'])
    .withStyles('styles/custom-styles.css')
    .onRowToggled((item) => console.log('Toggled:', item))
    .build();

document.body.appendChild(table);
```

#### HTML Web Component

```html
<!-- Using JSON and CSS file paths -->
<drill-down-table
    data="data/sample-data.json"
    styles="styles/custom-styles.css"
    columns='["Name"]'>
</drill-down-table>

<!-- Or using inline JSON and CSS strings -->
<drill-down-table
    data='[{"name": "Parent 1", "expanded": false, "children": [{"name": "Child 1"}]}]'
    styles="table { border: 1px solid #ccc; } th { background: blue; }"
    columns='["Name"]'>
</drill-down-table>
```

## Examples

All examples are now combined in the main `index.html` file, showcasing:

- **[JavaScript Builder Pattern](index.html)** - Complete example using the fluent builder API
- **[Web Component Attributes](index.html)** - Example using HTML attributes and dynamic updates
- **[Data & Styles Testing](index.html)** - Demonstrates both file path and string data/styles loading

## API Reference

### DrillDownTable.builder()

Returns a new DrillDownTable instance configured for the builder pattern.

### Builder Methods

- `withData(data: any[])` - Set the table data
- `withColumns(columns: string[])` - Set column headers
- `withStyles(styles: string)` - Apply custom CSS
- `onRowToggled(callback: (item: any) => void)` - Handle row toggle events
- `build()` - Create and render the table

### Properties

- `data: any[]` - Table data (array of objects with name, expanded, children)
- `columns: string[]` - Column headers
- `customStyles: string` - Custom CSS styles

### Methods

- `setData(data: any[])` - Update data and re-render
- `setColumns(columns: string[])` - Update columns and re-render
- `render()` - Manually trigger a re-render

### Events

- `row-toggled` - Fired when a row is expanded/collapsed

## Data Attribute

The `data` attribute accepts either:

1. **File Path**: A string ending in `.json` or starting with `http://`, `https://`, `./`, or `../`
   - The component will automatically fetch and load the JSON data from the file
   - Example: `data="data/sample-data.json"`

2. **JSON String**: A valid JSON string containing the data array
   - The component will parse the JSON directly
   - Example: `data='[{"name": "Item", "expanded": false, "children": []}]'`

## Styles Attribute

The `styles` attribute accepts either:

1. **CSS File Path**: A string ending in `.css` or starting with `http://`, `https://`, `./`, or `../`
   - The component will automatically fetch and load the CSS from the file
   - Example: `styles="styles/custom-styles.css"`

2. **CSS String**: A valid CSS string
   - The component will apply the CSS directly
   - Example: `styles="table { border: 1px solid #ccc; } th { background: blue; }"`

## Data Format

The component expects data in JSON format:

```json
[
  {
    "name": "Parent Item",
    "expanded": false,
    "children": [
      { "name": "Child Item 1" },
      { "name": "Child Item 2" }
    ]
  }
]
```

You can load data from JSON files using `fetch()` and set it via the `data` attribute.

## Styling

The component uses Shadow DOM, so styles must be applied via the `withStyles()` method or by targeting the host element.

## Development

```bash
# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build

# Preview production build
npm run preview
```

## Browser Support

Modern browsers that support:
- Custom Elements v1
- Shadow DOM v1
- ES6 Modules

# Testing Libraries
Unit Testing
- Jest

End to End
- Playwright