const API_BASE = 'http://localhost:8000/api/forms';
let allForms = [];
let selectedFormId = null;

// Service Worker disabled during development
// if ('serviceWorker' in navigator) {
//   navigator.serviceWorker.register('/sw.js')
//     .then(reg => console.log('Service Worker registered', reg))
//     .catch(err => console.error('Service Worker registration failed', err));
// }

loadForms();

function showAddForm() {
  document.getElementById('addFormModal').style.display = 'block';
}

function showUpdateForm() {
  document.getElementById('updateFormModal').style.display = 'block';
}

function hideModal(modalId) {
  document.getElementById(modalId).style.display = 'none';
  clearForm();
}

function clearForm() {
  document.getElementById('formName').value = '';
  document.getElementById('newFormUrl').value = '';
  document.getElementById('updateFormUrl').value = '';
  document.getElementById('searchForm').value = '';
  document.getElementById('formDropdown').style.display = 'none';
  selectedFormId = null;
  document.getElementById('updateBtn').disabled = true;
}

async function loadForms() {
  try {
    const response = await fetch(API_BASE);
    const data = await response.json();
    console.log('API Response:', data);
    
    // Handle different response formats
    allForms = Array.isArray(data) ? data : (data.results || data.forms || []);
    console.log('Forms array:', allForms);
    
    displayForms(allForms);
  } catch (error) {
    console.error('Error loading forms:', error);
    document.getElementById('formsList').innerHTML = '<div class="loading">Error loading forms</div>';
  }
}

function displayForms(forms) {
  const container = document.getElementById('formsList');
  if (!forms.length) {
    container.innerHTML = '<div class="loading">No forms found</div>';
    return;
  }
  
  container.innerHTML = forms.map(form => 
    `<div class="form-card">
      <h3>${form.name || 'Form ' + form.id}</h3>
      <div class="form-actions">
        <button class="btn-primary" onclick="getMetadata(${form.id})">View Details</button>
        <button class="btn-secondary" onclick="generatePDF(${form.id})">Generate PDF</button>
      </div>
    </div>`
  ).join('');
}

function filterForms() {
  const search = document.getElementById('searchForm').value.toLowerCase();
  const dropdown = document.getElementById('formDropdown');
  
  if (!search) {
    dropdown.style.display = 'none';
    return;
  }
  
  const filtered = allForms.filter(form => 
    (form.name || 'Form ' + form.id).toLowerCase().includes(search)
  );
  
  if (filtered.length) {
    dropdown.innerHTML = filtered.map(form => 
      `<div class="dropdown-item" onclick="selectForm(${form.id}, '${form.name || 'Form ' + form.id}')">
        ${form.name || 'Form ' + form.id}
      </div>`
    ).join('');
    dropdown.style.display = 'block';
  } else {
    dropdown.style.display = 'none';
  }
}

function selectForm(id, name) {
  selectedFormId = id;
  document.getElementById('searchForm').value = name;
  document.getElementById('formDropdown').style.display = 'none';
  document.getElementById('updateBtn').disabled = false;
}

async function createForm() {
  const name = document.getElementById('formName').value;
  const url = document.getElementById('newFormUrl').value;
  
  if (!name || !url) return alert('Please enter both name and URL');
  
  try {
    const response = await fetch(`${API_BASE}/create/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url })
    });
    
    if (response.ok) {
      hideModal('addFormModal');
      loadForms();
    } else {
      alert('Error creating form');
    }
  } catch (error) {
    alert('Error creating form');
  }
}

async function updateForm() {
  const url = document.getElementById('updateFormUrl').value;
  
  if (!selectedFormId || !url) return alert('Please select a form and enter URL');
  
  try {
    const response = await fetch(`${API_BASE}/update/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url, form_id: selectedFormId })
    });
    
    if (response.ok) {
      hideModal('updateFormModal');
      loadForms();
    } else {
      alert('Error updating form');
    }
  } catch (error) {
    alert('Error updating form');
  }
}

async function getMetadata(formId) {
  const modal = document.getElementById('metadataModal');
  const container = document.getElementById('metadata');
  
  modal.style.display = 'block';
  container.innerHTML = '<p class="loading">Loading metadata...</p>';
  
  try {
    const response = await fetch(`${API_BASE}/${formId}/metadata/`);
    const metadata = await response.json();
    
    container.innerHTML = `<pre>${JSON.stringify(metadata, null, 2)}</pre>`;
  } catch (error) {
    container.innerHTML = '<p class="loading">Error loading metadata</p>';
  }
}

async function generatePDF(formId) {
  try {
    const response = await fetch(`${API_BASE}/${formId}/metadata/display/`);
    const metadata = await response.json();
    
    if (metadata.display_data.cells) {
      createPDFFromMetadata(metadata.display_data, formId);
    } else {
      alert('No display data available for PDF generation');
    }
  } catch (error) {
    alert('Error generating PDF');
  }
}

function createPDFFromMetadata(displayData, formId) {
  const { cells, merged_cells = [], dimensions } = displayData;
  const { rows: maxRows, columns: maxCols } = dimensions;
  
  // Create grid to track which cells to skip (merged cells that aren't top-left)
  const skipGrid = Array(maxRows).fill().map(() => Array(maxCols).fill(false));
  
  // Mark cells to skip based on merged_cells list
  merged_cells.forEach(merge => {
    for (let r = 0; r < merge.row_span; r++) {
      for (let c = 0; c < merge.col_span; c++) {
        if (r !== 0 || c !== 0) { // Skip all except top-left
          const skipRow = merge.start_row + r;
          const skipCol = merge.start_col + c;
          if (skipRow < maxRows && skipCol < maxCols) {
            skipGrid[skipRow][skipCol] = true;
          }
        }
      }
    }
  });
  
  // Group cells by row
  const rows = {};
  cells.forEach(cell => {
    if (!rows[cell.row]) rows[cell.row] = [];
    rows[cell.row][cell.column] = cell;
  });
  
  let tableHTML = '<table style="border-collapse: collapse; width: 100%; font-family: Arial, sans-serif;">';
  
  // Generate table rows
  for (let rowIndex = 0; rowIndex < maxRows; rowIndex++) {
    const row = rows[rowIndex] || [];
    tableHTML += '<tr>';
    
    for (let colIndex = 0; colIndex < maxCols; colIndex++) {
      // Skip if this cell is part of a merged range (but not the top-left)
      if (skipGrid[rowIndex][colIndex]) continue;
      
      const cell = row[colIndex] || {};
      const mergeInfo = getMergeInfo(rowIndex, colIndex, merged_cells);
      tableHTML += createCellHTML(cell, mergeInfo);
    }
    tableHTML += '</tr>';
  }
  
  tableHTML += '</table>';
  
  // Create print window
  const printWindow = window.open('', '_blank');
  printWindow.document.write(`
    <html>
      <head>
        <title>Form ${formId} - Display Data</title>
        <style>
          @page { size: landscape; margin: 0.5in; }
          @media print {
            body { margin: 0; }
            table { page-break-inside: avoid; }
          }
          table { border-collapse: collapse; }
        </style>
      </head>
      <body>
        ${tableHTML}
        <script>
          window.onload = function() {
            setTimeout(() => {
              window.print();
              window.close();
            }, 500);
          }
        </script>
      </body>
    </html>
  `);
  printWindow.document.close();
}

function getMergeInfo(row, col, merged_cells) {
  for (const merge of merged_cells) {
    if (row === merge.start_row && col === merge.start_col) {
      return {
        rowspan: merge.row_span,
        colspan: merge.col_span
      };
    }
  }
  return { rowspan: 1, colspan: 1 };
}

function createCellHTML(cell, mergeInfo) {
  const value = cell.display_value || cell.value || '';
  const styles = [];
  const isMerged = mergeInfo.rowspan > 1 || mergeInfo.colspan > 1;
  
  // Cell dimensions first
  if (cell.column_width && cell.column_width > 0) {
    styles.push(`width: ${cell.column_width * 0.75}px`);
  }
  if (cell.row_height && cell.row_height > 0) {
    styles.push(`height: ${cell.row_height * 0.75}px`);
  }
  
  // Background color - handle different color formats
  if (cell.fill?.color) {
    let bgColor = cell.fill.color;
    if (bgColor && bgColor !== '#ffffff' && bgColor !== '#FFFFFF' && bgColor !== 'white') {
      // Handle hex colors without #
      if (bgColor.length === 6 && !bgColor.startsWith('#')) {
        bgColor = '#' + bgColor;
      }
      styles.push(`background-color: ${bgColor}`);
    }
  }
  
  // Font styling - use exact font from metadata
  if (cell.font) {
    if (cell.font.name) {
      styles.push(`font-family: '${cell.font.name}', Arial, sans-serif`);
    }
    if (cell.font.size && cell.font.size > 0) {
      styles.push(`font-size: ${cell.font.size * 0.75}px`);
    }
    if (cell.font.color) {
      let fontColor = cell.font.color;
      if (fontColor.length === 6 && !fontColor.startsWith('#')) {
        fontColor = '#' + fontColor;
      }
      styles.push(`color: ${fontColor}`);
    }
    if (cell.font.bold) styles.push('font-weight: bold');
    if (cell.font.italic) styles.push('font-style: italic');
    if (cell.font.underline) styles.push('text-decoration: underline');
    if (cell.font.strikethrough) styles.push('text-decoration: line-through');
  }
  
  //   // Alignment
  if (cell.alignment) {
    if (cell.alignment.horizontal) {
      const align = cell.alignment.horizontal.toLowerCase();
      if (align === 'center') styles.push('text-align: center');
      else if (align === 'right') styles.push('text-align: right');
      else if (align === 'left') styles.push('text-align: left');
    }
    if (cell.alignment.vertical) {
      const valign = cell.alignment.vertical.toLowerCase();
      if (valign === 'middle') styles.push('vertical-align: middle');
      else if (valign === 'top') styles.push('vertical-align: top');
      else if (valign === 'bottom') styles.push('vertical-align: bottom');
    }
    if (cell.alignment.wrap_text) styles.push('white-space: pre-wrap');
  }
  
  // Borders - apply normal borders for all cells
  const borderSides = ['top', 'right', 'bottom', 'left'];
  let hasBorders = false;
  
  if (cell.borders && Object.keys(cell.borders).length > 0) {
    borderSides.forEach(side => {
      const borderKey = Object.keys(cell.borders).find(key => 
        key.toLowerCase().includes(side) || 
        (side === 'top' && key.includes('EdgeTop')) ||
        (side === 'right' && key.includes('EdgeRight')) ||
        (side === 'bottom' && key.includes('EdgeBottom')) ||
        (side === 'left' && key.includes('EdgeLeft'))
      );
      
      if (borderKey && cell.borders[borderKey]) {
        const border = cell.borders[borderKey];
        if (border.style && border.style !== 'none') {
          const borderWidth = border.weight === 'thick' ? '2px' : (border.weight === 'medium' ? '1.5px' : '1px');
          const borderStyle = border.style === 'double' ? 'double' : (border.style === 'dashed' ? 'dashed' : 'solid');
          const borderColor = border.color || '#000000';
          styles.push(`border-${side}: ${borderWidth} ${borderStyle} ${borderColor}`);
          hasBorders = true;
        }
      }
    });
  }
  
  if (!hasBorders) {
    styles.push('border: 1px solid #d0d0d0');
  }
  
  // Cell padding
  styles.push('padding: 4px 8px');
  
  const rowspanAttr = mergeInfo.rowspan > 1 ? ` rowspan="${mergeInfo.rowspan}"` : '';
  const colspanAttr = mergeInfo.colspan > 1 ? ` colspan="${mergeInfo.colspan}"` : '';
  const classAttr = isMerged ? ' class="merged-cell"' : '';
  const styleAttr = styles.length > 0 ? ` style="${styles.join('; ')}"` : '';
  
  return `<td${rowspanAttr}${colspanAttr}${classAttr}${styleAttr}>${value}</td>`;
}

// Close modals when clicking outside
window.onclick = function(event) {
  const modals = ['addFormModal', 'updateFormModal', 'metadataModal'];
  modals.forEach(modalId => {
    const modal = document.getElementById(modalId);
    if (event.target === modal) hideModal(modalId);
  });
}
