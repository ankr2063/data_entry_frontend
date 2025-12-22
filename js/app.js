const API_BASE = 'http://localhost:8000/api/forms';
let allForms = [];
let selectedFormId = null;
const persivApps = {};

// Service Worker disabled during development
// if ('serviceWorker' in navigator) {
//   navigator.serviceWorker.register('/sw.js')
//     .then(reg => console.log('Service Worker registered', reg))
//     .catch(err => console.error('Service Worker registration failed', err));
// }

window.callAPI = (method, url, data, xhrFields = {}) => {
    return new Observable((subscriber) => {
        const isViz = /visualization\/$/i.test(url) || /loadSavedVisualization\/$/i.test(url) || /queryDB/i.test(url);
        let jqXHR;
        let released = false;

        const releaseOnce = () => {
            if (isViz && !released) {
                released = true;
                vizLimiter.release();
            }
        };
        
        const startAjax = () => {
            jqXHR = $.ajax({
                url,
                method,
                data,
                success: (res) => {
                    subscriber.next(res);
                    releaseOnce();
                    subscriber.complete?.();
                },
                error: (err) => {
                    if (err.status === 0) {
                        window.harbour.hideLoader();
                        u.toast.showError({ msg: 'Could not communicate with the servers. Please try again after sometime.', direction: 'topRight' })
                        return;
                    }
                    subscriber.error(err);
                    releaseOnce();
                    subscriber.complete?.();
                },
                xhrFields: {
                    withCredentials: true,
                    ...xhrFields
                }
            });
        }

        if (isViz && vizLimiter.getLimit() !== Infinity) {
            vizLimiter.acquire().then(startAjax);
        } else {
            startAjax();
        }

        return () => {
            if (jqXHR && jqXHR.readyState !== 4) {
                try { jqXHR.abort(); } finally { releaseOnce(); }
            } else {
                releaseOnce();
            }
        };
    });
};

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
        <button class="btn-primary" onclick="getMetadata(${form.id})">+ New Entry</button>
        <button class="btn-secondary" onclick="displayData(${form.id})">Display Data</button>
        <button class="btn-secondary p-3" onclick="persivApps.refreshFormAndDisplays(${form.id})">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-clockwise" viewBox="0 0 16 16">
            <path fill-rule="evenodd" d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2z"/>
            <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466"/>
          </svg>
        </button>
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
    const response = await fetch(`${API_BASE}/${formId}/metadata/entry`);
    const metadata = await response.json();
    persivApps.buildForm(formId, metadata.entry_data.filter(a => a.name && a.ui_form_element));
  } catch (error) {
    container.innerHTML = '<p class="loading">Error loading metadata</p>';
  }
}

async function displayData(formId) {
  try {
    const response = await fetch(`${API_BASE}/${formId}/metadata/display/`);
    const metadata = await response.json();
    
    if (metadata.display_data.cells) {
      openDataInNewTab(metadata.display_data, formId);
    } else {
      alert('No display data available');
    }
  } catch (error) {
    alert('Error loading display data');
  }
}

function openDataInNewTab(displayData, formId) {
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
  
  // Open HTML in new tab
  const newWindow = window.open('', '_blank');
  newWindow.document.write(`
    <html>
      <head>
        <title>Form ${formId} - Display Data</title>
        <style>
          body { margin: 20px; font-family: Arial, sans-serif; }
          table { border-collapse: collapse; width: 100%; }
        </style>
      </head>
      <body>
        <h1>Form ${formId} - Display Data</h1>
        ${tableHTML}
      </body>
    </html>
  `);
  newWindow.document.close();
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
  let value = cell.display_value || cell.value || '';
  
  // Keep cells empty if value contains &lt;pf_ pattern
  if (value.includes('&lt;pf_')) {
    value = '';
  }
  
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
    styles.push('border: 1px solid #ccc');
  }
  
  const styleAttr = styles.length > 0 ? ` style="${styles.join('; ')}"` : '';
  const rowspanAttr = mergeInfo.rowspan > 1 ? ` rowspan="${mergeInfo.rowspan}"` : '';
  const colspanAttr = mergeInfo.colspan > 1 ? ` colspan="${mergeInfo.colspan}"` : '';
  
  return `<td${rowspanAttr}${colspanAttr}${styleAttr}>${value}</td>`;
}

// Close modals when clicking outside
window.onclick = function(event) {
  const modals = ['addFormModal', 'updateFormModal', 'metadataModal'];
  modals.forEach(modalId => {
    const modal = document.getElementById(modalId);
    if (event.target === modal) hideModal(modalId);
  });
}

persivApps.formElementsHTML = {
  label: (config, formElementIdx) => {
    return `<label for="form_element_${formElementIdx}" class="form-label d-flex justify-content-between">
              <div>${config.name}${config.optional === 'no' ? '<span style="color: red;" class="persivapp-mandatory-field">*</span>' : ''}</div>
              ${config.min_value_allowed || config.max_value_allowed ? `<div style="color: #aaa">(${config.min_value_allowed ? `Min: ${config.min_value_allowed}` : ''}${config.min_value_allowed && config.max_value_allowed ? ', ' : ''}${config.max_value_allowed ? `Max: ${config.max_value_allowed}` : ''})</div>` : ''}
            </label>`
  },
  date: (config, formElementIdx) => {
    return `
      <div class="mb-3">
       ${persivApps.formElementsHTML.label(config, formElementIdx)}
        <input data-form-element="${formElementIdx}" type="date" class="form-control" id="form_element_${formElementIdx}">
      </div>`;
  },
  number: (config, formElementIdx) => {
    return `
      <div class="mb-3">
       ${persivApps.formElementsHTML.label(config, formElementIdx)}
        <input data-form-element="${formElementIdx}" type="number" class="form-control" id="form_element_${formElementIdx}" ${config.min_value_allowed ? `min="${config.min_value_allowed}"` : ''} ${config.max_value_allowed ? `max="${config.max_value_allowed}"` : ''} />
      </div>`;
  },
  radio_button: (config, formElementIdx) => {
    const allowed_data = config.allowed_data.split(',').map((d) => d.trim()).filter(a => a);
    return `
      <div class="mb-3">
       ${persivApps.formElementsHTML.label(config, formElementIdx)}
        <div class="mb-3 d-flex">
          ${
            allowed_data.map((_allowed_data, _allowed_data_idx) => `
              <div class="form-check me-4 d-flex align-items-center justify-content-center">
                <input data-form-element="${formElementIdx}" class="form-check-input mb-0" type="radio" name="radioDefault_${formElementIdx}" id="ele_${formElementIdx}_${_allowed_data_idx}" value="${_allowed_data}">
                <label class="form-check-label ms-2" for="ele_${formElementIdx}_${_allowed_data_idx}">
                  ${_allowed_data}
                </label>
              </div>`).join('')
          }
        </div>
      </div>`;
  },
  text: (config, formElementIdx) => {
    return `
      <div class="mb-3">
       ${persivApps.formElementsHTML.label(config, formElementIdx)}
        <input data-form-element="${formElementIdx}" type="text" class="form-control" id="form_element_${formElementIdx}">
      </div>`;
  },
  time: (config, formElementIdx) => {
    return `
      <div class="mb-3">
       ${persivApps.formElementsHTML.label(config, formElementIdx)}
        <input data-form-element="${formElementIdx}" type="time" class="form-control" id="form_element_${formElementIdx}">
      </div>`;
  }
};

persivApps.buildForm = (formId, formConfig) => {
  let numAccordions = 0;
  const openAccordion = (accordionTitle) => {
    numAccordions += 1;
    return `
        <div class="accordion mt-2">
          <div class="accordion-item">
            <h2 class="accordion-header">
              <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#acc_${numAccordions}" aria-expanded="true" aria-controls="acc_${numAccordions}">
                ${accordionTitle}
              </button>
            </h2>
            <div id="acc_${numAccordions}" class="accordion-collapse collapse" data-bs-parent="#accordionExample">
              <div class="accordion-body">
    `;
  }
  const closeAccordion = () => {
    return `
              </div>
            </div>
          </div>
        </div>
    `;
  }
  let lastFormAccordion = '';
  const formHTML = formConfig.map((formElement) => {
    const formElementIdx = formElement.id;
    let html = '';

    // Open accordion?
    if (lastFormAccordion !== formElement.accordion && formElement.accordion) {
      html += openAccordion(formElement.accordion);
    }

    if (!persivApps.formElementsHTML[formElement.ui_form_element]) {
      html += `
        <div class="mb-3">
          <label for="form_element_${formElementIdx}" class="form-label">${formElement.name}</label>
          <div>-- PENDING implementation for ${formElement.ui_form_element} --</div>
        </div>`;
    }
    html += persivApps.formElementsHTML[formElement.ui_form_element](formElement, formElementIdx);

    // Close accordion?
    if (formElementIdx === formConfig.length || formConfig[formElementIdx].accordion !== formElement.accordion && formElement.accordion) {
      html += closeAccordion();
    }

    lastFormAccordion = formElement.accordion;
    return html;
  }).join('');

  document.getElementById('metadata').innerHTML = formHTML;
  document.getElementById('saveFormValues').setAttribute('onclick', `persivApps.saveFormData(${formId})`);
}

persivApps.saveFormData = (form_id) => {
  const formElements = document.querySelectorAll('#metadata [data-form-element]');
  const form_values = {};
  
  let continueSavingForm = true;
  Array.from(formElements).map((ele) => {
    if (ele.type === 'radio') {
      form_values[ele.dataset.formElement] = document.querySelector(`input[name="${ele.name}"]:checked`)?.value;
    } else {
      form_values[ele.dataset.formElement] = ele.value;
    }

    if ($(ele).parent('label .persivapp-mandatory-field')) {
      if (!form_values[ele.dataset.formElement]) {
        continueSavingForm = false;
      }
    }
  });

  if (!continueSavingForm) {
    u.toast.showWarning({ msg: 'Add all mandatory fields.', direction: 'topRight' });
    return;
  }

  persivApps.showLoader('Saving form');
  window.callAPI('POST', API_BASE + '/data/save/', { form_id, form_values: JSON.stringify(form_values) })
    .subscribe((res) => {
      persivApps.hideLoader();
      u.toast.showSuccess({ msg: res.message, direction: 'topRight' });
    });  
}

persivApps.refreshFormAndDisplays = (form_id) => {
  persivApps.showLoader('Updating form');
  window.callAPI('POST', API_BASE + '/update/', { form_id })
    .subscribe((res) => {
      persivApps.hideLoader();
      u.toast.showSuccess({ msg: res.message, direction: 'topRight' });
    });
}

persivApps.showLoader = (title = '', msg = '') => {
    if ([...$('.harbour-loader-container')].length) {
        $('.harbour-loader-container .title').html(title);
        $('.harbour-loader-container .msg').html(msg);
        return;
    }
    const alertBody = `
        <div class="harbour-loader-container">
            <div class="harbour-loader">
                <span class="spinner-border" role="status"></span>
                <div class="title mt-2">${title}</div>
                <div class="msg">${msg}</div>
            </div>
        </div>
    `;
    $('body').append(alertBody);
}

persivApps.hideLoader = () => {
    $('.harbour-loader-container').remove();
}
