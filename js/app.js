const API_BASE = window.location.href.includes('http://localhost') ? 'http://localhost:8000/api' : (window.location.protocol + '//' + window.location.host + '/persivapps/service/');;
let allForms = [];
let selectedFormId = null;
const persivApps = {};
persivApps.currentlyWorkingOnForm = [];

// Service Worker disabled during development
// if ('serviceWorker' in navigator) {
//   navigator.serviceWorker.register('/sw.js')
//     .then(reg => console.log('Service Worker registered', reg))
//     .catch(err => console.error('Service Worker registration failed', err));
// }

window.loggedInUser_ID = () => {
    let user = sessionStorage.getItem('user') || '{}';
    user = user === 'undefined' ? '{}' : user;
    user = JSON.parse(user);
    return user.id;
}

window.loggedInUser_accessToken = () => {
    let user = sessionStorage.getItem('user') || '{}';
    user = user === 'undefined' ? '{}' : user;
    user = JSON.parse(user);
    return user.accessToken;
}

window.onload = (e) => {
    window.accessToken = loggedInUser_accessToken();
    if (loggedInUser_ID()) {
        persivApps.initApp();
    } else {
        persivApps.showLoginScreen();
    }
}

persivApps.initApp = () => {
    $('main').html(`
      <div id="sidebar"></div>
      <div id="mainContent">${ window.innerWidth <= 1000 ? `<i class="bi bi-list me-2" onclick="$('#sidebar').toggleClass('show-nav')" ></i>` : '' }<center class="mt-3 d-flex align-items-center justify-content-center"><h4 class="d-flex align-items-baseline">Welcome to <img src="resources/images/app/persivApp.png" class="ms-3" style="max-height: 20px;" alt="PersivX logo"></h4></center></div>
    `);
    persivApps.loadForms();
}

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

        let headers = {
            Authorization: `Bearer ${window.accessToken}`, // <-- add this
        }

        if (url.includes('users/login/')) {
          headers = undefined;
        }

        // window.accessToken;
        const startAjax = () => {
            jqXHR = $.ajax({
                url,
                method,
                data,
                headers,
                success: (res) => {
                    subscriber.next(res);
                    releaseOnce();
                    subscriber.complete?.();
                },
                error: (err) => {
                    if (err.status === 0) {
                        persivApps.hideLoader();
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

persivApps.authenticateUser = () => {
    const url = new URL(window.location.href);
    const params = new URLSearchParams(url.search);

    let organization = params.get('org') || undefined;
    if ($('#loginToAnOrg') && !$('#loginToAnOrg').hasClass('d-none')) {
        organization = $('#organization').val();
    }
    const username = $('#username').val().trim();
    const password = $('#password').val();
    
    if (!username) {
        u.toast.showError({ msg: 'Username cannot be left empty', direction: 'topRight' });
        return;
    } else if (!$('#password').val().trim() && !$('.password-reset-mode').length) {
        u.toast.showError({ msg: 'Password cannot be left empty', direction: 'topRight' });
        return;
    }
    $('#password').val('......................................................................................');

    window.callAPI('POST', `${API_BASE}/users/login/`, { username, password, organization })
        .subscribe(
            (result) => {
              window.accessToken = result.access_token;
              sessionStorage.setItem('user', JSON.stringify({
                id: result.user_id,
                accessToken: window.accessToken
              }));
              $('#userDetails').removeClass('d-none').html(`<i class="bi bi-person me-2" />${username}`)
              persivApps.initApp();
            },
            () => {
                u.toast.showError({msg: 'Could not verify credentials. Please try again after sometime.', direction: 'topRight'});
                $('#password').val('');
            }
        );
}

persivApps.showLoginScreen = (showSecuredDashboardMsg = true) => {
    const url = new URL(window.location.href);
    const params = new URLSearchParams(url.search);
    const loadingDashboard = showSecuredDashboardMsg && (window.location.href.includes('test-embed') || window.location.href.includes('dashboard') || window.location.href.includes('visualization'));
    const organization = ['null', null, undefined, 'undefined'].includes(params.get('org')) ? false : params.get('org');

    $('main').css('height', '100%').html(`
        <div class="d-flex h-100" id="loginScreen">
            <div id="loginContainer">
                <div>
                    <img class="logo" src="resources/images/app/persivApp.png"></img>
                </div>
                ${ !loadingDashboard 
                    ? '' 
                    : `
                        <div style="margin-top: 65px; display: flex; align-items: center; ">
                            <div style="margin-right: 15px; color: #094979; padding: 10px; border-radius: 50%; background: #e8f2f9;">
                                <i class="bi bi-lock"></i>
                            </div>
                            <div>
                                <div style="color: #094979; font-size: 18px;">This is a secured dashboard.</div>
                                <div style="margin-top: 5px; font-size: 12px;">To continue, please verify your identity.</div>
                            </div>
                        </div>
                    `}
                <div ${ !loadingDashboard ? `style="margin-top: 75px;"` : 'class="mt-4"'}>
                    ${ !loadingDashboard ? `<div id="loginToAnOrg" class="${organization ? '' : 'd-none' }">
                        <label for="organization">Organization</label>
                        <div><input type="text" id="organization" class="w-100" value="${organization || ''}" placeholder="Personal Login" ${organization ? 'disabled' : ''} /></div>
                    </div>` : '' }
                    <div id="emailId" ${ organization ? `class="mt-3"` : `` }>
                        <label for="username">Email / Username</label>
                        <div><input type="text" id="username" class="w-100" placeholder="" autocomplete="off" /></div>
                    </div>
                    <div class="mt-3">
                        <label for="password">Password</label>
                        <div><input type="password" id="password" class="w-100" placeholder="" /></div>
                    </div>
                    <div class="mt-4">
                        <button id="loginButton" onclick="persivApps.authenticateUser()">LOGIN</button>
                    ${ !loadingDashboard ? `
                            <a style="color: #888; font-size: 12px;" class="w-100 d-block text-center cursor-pointer mt-3 ${organization ? '' : 'd-none'}" onclick="persivApps.personalLogin()" id="loginToPpersonalAccount">Back to personal login</a>
                            <a style="color: #888; font-size: 12px;" class="w-100 d-block text-center cursor-pointer mt-3 ${organization ? 'd-none' : ''}" onclick="persivApps.loginToAnOrg()" id="loginToAnOrganization">Login to an organization</a>
                        `: '' }
                    </div>
                </div>
            </div>
        </div>
    `);
}


persivApps.loginToAnOrg = () => {
    $('#emailId').css('margin-top', '0').addClass('mt-3');
    $('#loginToAnOrg').removeClass('d-none');
    $('#loginToAnOrganization').addClass('d-none');
    $('#loginToPpersonalAccount').removeClass('d-none');
}

persivApps.personalLogin = () => {
    // $('#emailId').css('margin-top', '75px').removeClass('mt-3');
    $('#loginToAnOrg').addClass('d-none');
    $('#loginToAnOrganization').removeClass('d-none');
    $('#loginToPpersonalAccount').addClass('d-none');
}


persivApps.showAddForm = () => {
  $('#sidebar').toggleClass('show-nav');
  document.getElementById('addFormModal').style.display = 'block';
}

function showUpdateForm() {
  document.getElementById('updateFormModal').style.display = 'block';
}

persivApps.hideModal = (modalId) => {
  document.getElementById(modalId).style.display = 'none';
  persivApps.clearForm();
}

persivApps.clearForm = () => {
  document.getElementById('formName').value = '';
  document.getElementById('newFormUrl').value = '';
  document.getElementById('updateFormUrl').value = '';
  document.getElementById('searchForm').value = '';
  document.getElementById('formDropdown').style.display = 'none';
  selectedFormId = null;
  document.getElementById('updateBtn').disabled = true;
}

persivApps.loadForms = async () => {
  try {
    window.callAPI('GET', API_BASE + '/forms')
      .subscribe((response) => {
        const data = response.forms;

        allForms = Array.isArray(data) ? data : (data.results || data.forms || []);        
        persivApps.displayForms(allForms);
      });
  } catch (error) {
    console.error('Error loading forms:', error);
    document.getElementById('formsList').innerHTML = '<div class="loading">Error loading forms</div>';
  }
}

persivApps.displayForms = (forms) => {
  $('main #sidebar').html(`
      <button class="btn btn-primary w-100" onclick="persivApps.showAddForm()">+ Add New Form</button>
      <div class="mt-3"><small>Forms</small></div>
      <div id="formsList"></div>
  `);
  const container = $('#formsList');
  if (!forms.length) {
    container.html('<div class="loading">No forms found</div>');
    return;
  }

  container.html(`
    ${
        forms.map(form => 
          `<div class="form-card" onclick="persivApps.displayFormEntries(${form.id}, '${form.form_name}')">
            <span>${form.form_name || 'Form ' + form.id}</span>
          </div>`
        ).join('')
    }
  `);
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

persivApps.createForm = async () => {
  const name = document.getElementById('formName').value;
  const url = document.getElementById('newFormUrl').value;
  
  if (!name || !url) return alert('Please enter both name and URL');
  
  try {
    window.callAPI('POST', `${API_BASE}/forms/create/`, { sharepoint_url: url, form_name: name })
      .subscribe((response) => {
        if (response.form_id) {
          persivApps.hideModal('addFormModal');
          persivApps.loadForms();
        } else {
          alert('Error creating form');
        }
      });
  } catch (error) {
    alert('Error creating form');
  }
}

async function updateForm() {
  const url = document.getElementById('updateFormUrl').value;
  
  if (!selectedFormId || !url) return alert('Please select a form and enter URL');
  
  try {
    const response = await fetch(`${API_BASE}/forms/update/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url, form_id: selectedFormId })
    });
    
    if (response.ok) {
      persivApps.hideModal('updateFormModal');
      persivApps.loadForms();
    } else {
      alert('Error updating form');
    }
  } catch (error) {
    alert('Error updating form');
  }
}

persivApps.getMetadata = async (formId, formName) => {
  const modal = document.getElementById('metadataModal');
  const container = document.getElementById('metadata');
  
  modal.style.display = 'block';
  container.innerHTML = '<p class="loading">Loading metadata...</p>';
  
  try {
    window.callAPI('GET', `${API_BASE}/forms/${formId}/metadata/entry`)
      .subscribe((response) => {
          const metadata = response;
          const loadJSFiles = response.form.custom_scripts;
          persivApps.dynamicallyLoadJSFiles(loadJSFiles);

          persivApps.buildForm(formId, formName, metadata.entry_data.filter(a => a.name && a.ui_form_element));  
      });
  } catch (error) {
    container.innerHTML = '<p class="loading">Error loading metadata</p>';
  }
}

persivApps.displayData = async (formDataId, print) => {
  try {
    window.callAPI('GET', `${API_BASE}/forms/data/${formDataId}/filled/`).subscribe((response) => {
      const metadata = response;
      if (metadata.display_data.cells) {
        persivApps.openDataInNewTab(metadata.display_data, print);
      } else {
        alert('No display data available');
      }
    });
  } catch (error) {
    alert('Error loading display data');
  }
}

persivApps.openDataInNewTab = (displayData, print) => {
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
  const html = `
    <html>
      <head>
        <title>Form Display</title>
        <style>
          body { margin: 20px; font-family: Arial, sans-serif; }
          table { border-collapse: collapse; width: 100%; }
        </style>
      </head>
      <body>
        ${tableHTML}
      </body>
      <script>${print && 'window.print()'}</script>
    </html>
  `

  if (print) {
    // Open HTML in new tab
    const newWindow = window.open('', '_blank');
    newWindow.document.write(html);
    newWindow.document.close();
  } else {
    u.modal.openModal({
        id: "displayModal",
        height: '90vh',
        width: '90vw',
        header: '',
        headerHeight: '0px',
        body: html,
        closeOnBackgroundClick: false,
        headerBackgroundColor: 'white',
        footerBackgroundColor: 'white',
        additionalClass: 'no-animation'
    });
  }
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
  
  // Keep cells empty if value contains &lt;pa_ pattern
  if (value.includes('&lt;pa_')) {
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
    if (event.target === modal) persivApps.hideModal(modalId);
  });
}

persivApps.dispatchAction = (action, data) => {
    state.dispatchAction(action, data);
}

persivApps.formElementsHTML = {
  label: (config, formElementIdx) => {
    return `<label for="form_element_${formElementIdx}" class="form-label d-flex justify-content-between">
              <div class="d-flex">${config.name}${!config.optional ? '<span style="color: red;" class="persivapp-mandatory-field">*</span>' : ''}${config.acceptance_criteria ? `<div class="ms-2" style="color: #aaa;"><small>(${config.acceptance_criteria})</small></div>` : ''}</div>
              ${config.min_value_allowed || config.max_value_allowed ? `<div style="color: #aaa"> (${config.min_value_allowed ? `Min: ${config.min_value_allowed}` : ''}${config.min_value_allowed && config.max_value_allowed ? ', ' : ''}${config.max_value_allowed ? `Max: ${config.max_value_allowed}` : ''})</div>` : ''}
            </label>`
  },
  date: (config, formElementIdx) => {
    const eventData = JSON.stringify({ formId: persivApps.currentlyWorkingOnForm.at(-1), formFieldIdx: formElementIdx, config }).replace(/"/g, '&quot;');
    return `
      <div class="mb-3">
       ${persivApps.formElementsHTML.label(config, formElementIdx)}
        <input data-form-element="${formElementIdx}" type="date" class="form-control" id="form_element_${formElementIdx}" ${config.isDisabled && 'disabled'} onblur="persivApps.dispatchAction('FORM_FIELD_BLUR', '${eventData}')" onkeyup="persivApps.dispatchAction('FORM_FIELD_KEYUP', '${eventData}')" onfocus="persivApps.dispatchAction('FORM_FIELD_FOCUS', '${eventData}')">
      </div>`;
  },
  number: (config, formElementIdx) => {
    const eventData = JSON.stringify({ formId: persivApps.currentlyWorkingOnForm.at(-1), formFieldIdx: formElementIdx, config }).replace(/"/g, '&quot;');
    return `
      <div class="mb-3">
       ${persivApps.formElementsHTML.label(config, formElementIdx)}
        <input data-form-element="${formElementIdx}" type="number" class="form-control" id="form_element_${formElementIdx}" ${config.min_value_allowed ? `min="${config.min_value_allowed}"` : ''} ${config.max_value_allowed ? `max="${config.max_value_allowed}"` : ''} ${config.isDisabled && 'disabled'} onblur="persivApps.dispatchAction('FORM_FIELD_BLUR', '${eventData}')" onkeyup="persivApps.dispatchAction('FORM_FIELD_KEYUP', '${eventData}')" onfocus="persivApps.dispatchAction('FORM_FIELD_FOCUS', '${eventData}')" />
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
                <input data-form-element="${formElementIdx}" class="form-check-input mb-0" type="radio" name="radioDefault_${formElementIdx}" id="ele_${formElementIdx}_${_allowed_data_idx}" value="${_allowed_data}" ${config.isDisabled && 'disabled'}>
                <label class="form-check-label ms-2" for="ele_${formElementIdx}_${_allowed_data_idx}">
                  ${_allowed_data}
                </label>
              </div>`).join('')
          }
        </div>
      </div>`;
  },
  text: (config, formElementIdx) => {
    const eventData = JSON.stringify({ formId: persivApps.currentlyWorkingOnForm.at(-1), formFieldIdx: formElementIdx, config }).replace(/"/g, '&quot;');
    return `
      <div class="mb-3">
       ${persivApps.formElementsHTML.label(config, formElementIdx)}
        <input data-form-element="${formElementIdx}" type="text" class="form-control" id="form_element_${formElementIdx}" ${config.isDisabled && 'disabled'} onblur="persivApps.dispatchAction('FORM_FIELD_BLUR', '${eventData}')" onkeyup="persivApps.dispatchAction('FORM_FIELD_KEYUP', '${eventData}')" onfocus="persivApps.dispatchAction('FORM_FIELD_FOCUS', '${eventData}')">
      </div>`;
  },
  time: (config, formElementIdx) => {
    const eventData = JSON.stringify({ formId: persivApps.currentlyWorkingOnForm.at(-1), formFieldIdx: formElementIdx, config }).replace(/"/g, '&quot;');
    return `
      <div class="mb-3">
       ${persivApps.formElementsHTML.label(config, formElementIdx)}
        <input data-form-element="${formElementIdx}" type="time" class="form-control" id="form_element_${formElementIdx}" ${config.isDisabled && 'disabled'} onblur="persivApps.dispatchAction('FORM_FIELD_BLUR', '${eventData}')" onkeyup="persivApps.dispatchAction('FORM_FIELD_KEYUP', '${eventData}')" onfocus="persivApps.dispatchAction('FORM_FIELD_FOCUS', '${eventData}')">
      </div>`;
  }
};

persivApps.buildForm = (formId, formName, formConfig) => {
  let numAccordions = 0;
  persivApps.currentlyWorkingOnForm.push({ formId, formName });
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
  let lastFormSection = '';
  const formHTML = formConfig.filter((config) => !config.hide).map((formElement) => {
    const formElementIdx = formElement.id;
    let html = '';

    if (formElement.form_section !== lastFormSection) {
      lastFormSection = formElement.form_section;
      html += `<hr /><div class="fw-bold mt-3"><small>${formElement.form_section}</small></div>`
    }

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
  document.getElementById('saveFormValues').setAttribute('onclick', `persivApps.saveFormData(${formId}, '${formName}')`);

  const firstFormFieldIndex = formConfig.filter((config) => !config.hide)[0].id;
  $(`[data-form-element="${firstFormFieldIndex}"]`).focus();
}

persivApps.saveFormData = (form_id, formName) => {
  const formElements = document.querySelectorAll('#metadata [data-form-element]');
  const form_values = {};
  
  let continueSavingForm = true;
  Array.from(formElements).map((ele) => {
    if (ele.type === 'radio') {
      form_values[ele.dataset.formElement] = document.querySelector(`input[name="${ele.name}"]:checked`)?.value;
    } else {
      form_values[ele.dataset.formElement] = ele.value;
    }

    if ($(ele).closest('label').find('.persivapp-mandatory-field').length > 0) {
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
  window.callAPI('POST', API_BASE + '/forms/data/save/', { form_id, form_values: JSON.stringify(form_values) })
    .subscribe((res) => {
      persivApps.hideLoader();
      u.toast.showSuccess({ msg: res.message, direction: 'topRight' });
      persivApps.hideModal('metadataModal');

      // Reload saved data
      persivApps.displayFormEntries(form_id, formName)

      persivApps.currentlyWorkingOnForm.pop();
    });  
}

persivApps.refreshFormAndDisplays = (form_id) => {
  persivApps.showLoader('Updating form');
  window.callAPI('POST', API_BASE + '/forms/update/', { form_id })
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

persivApps.renderTable = (columnMap, rawRows, container) => {
  const _columns = Object.entries(columnMap)
    .map(([i, l]) => ({ i: Number(i), l }))
    .sort((a, b) => a.i - b.i);
  const columns = [{name: '.Action'}, ..._columns.map(({ l }) => ({name: `.${l}`}))]

  const rows = rawRows.map(r => {
      const rowValues = JSON.parse(r.values);
      const row = [`<div><i onclick='persivApps.displayData(${r.id})' class='bi bi-eye me-2'></i><i onclick='persivApps.displayData(${r.id}, true)' class='bi bi-printer me-2'></i></div>`, ..._columns.map(({ i }) => rowValues[i])];
      return row;
  });

  // Clean up soon.. these steps will be added directly to PersivX.js
  const config = persivx.getNewChartConfigurations(true);
  const vizId = config.viz.id;
  const allDashboardHTML = `
      <div class="h-100">
          <div class="chart-container harbour-ui-visualization" id="${vizId}">
              <div class="chart">
              <div class="chartContainer">
                  <div class="chart"></div>
              </div>
              </div>
          </div>
      </div>`;

  $('#formEntries').html(allDashboardHTML);
  const currentViz = persivx.harbourUIVisualizations[vizId];
  currentViz.queryResult = {
    headers_viz: columns
  };
  const _result = {
      columnDetails: columns,
      vizConfig: {
        drill: {
          toIndex: 0
        },
        config: {
          yAxis: columns.map((cd) => ({ 'attribute': cd['name'].slice(1), 'object': '', chartConfig: { valueConfig: { minColWidth: 100, searchBar: true } } }))
        }
      },
      visualization: {}
  };
  const series = rows;

  setTimeout(() => {
      persivx.buildTableViz(vizId, `.chart-container#${vizId} .chart`, series, _result);
      $(`#${vizId} .table.table-viz`).css('height', 'calc(100%)');
      $(`#${vizId} .table.table-viz .body-container`).css('height', 'calc(100% - 30px)');
  }, 400);
}

persivApps.displayFormEntries = (formId, form_name) => {
  $('#sidebar').toggleClass('show-nav');
  persivApps.showLoader('Fetching entries...');
  window.callAPI('GET', API_BASE + `/forms/${formId}/entries/`)
    .subscribe((res) => {
      persivApps.hideLoader();
      $('#mainContent').html(`
          <div id="formControls">
            <div class="title">
              ${ window.innerWidth <= 1000 ? `<i class="bi bi-list me-2" onclick="$('#sidebar').toggleClass('show-nav')" ></i>` : '' } Entries: ${form_name}
            </div>
            <div>
              <button style="padding: 4px 20px" class="btn btn-primary me-2" onclick="persivApps.getMetadata(${formId}, '${formName}')"><span class="me-2">+</span><span class="hide-on-small-device">New Entry</span></button>
              <button style="padding: 4px 20px" class="btn btn-secondary" onclick="persivApps.refreshFormAndDisplays(${formId})">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-clockwise me-2" viewBox="0 0 16 16">
                  <path fill-rule="evenodd" d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2z"/>
                  <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466"/>
                </svg> <span class="hide-on-small-device">Refresh Form<span>
              </button>
            </div>
          </div>
          <div id="formEntries"></div>
      `);
      persivApps.renderTable(res.columns, res.entries, '#mainContent #formEntries');
    });
}

persivApps.dynamicallyLoadJSFiles = (files) => {
  if (!files.length) {
    return new Promise((resolve) => {
      resolve();
    });
  }
  return Promise.all(
    files.map(src => {
      return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = src + '?v=' + $('#persivApps_current_version').html();

        script.onload = () => resolve(src);
        script.onerror = () => reject(new Error(`Failed to load ${src}`));

        document.head.appendChild(script);
      });
    })
  );
};
