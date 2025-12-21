let updateMode = false;

const API_BASE = 'http://localhost:8000/api/forms';

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js')
    .then(reg => console.log('Service Worker registered', reg))
    .catch(err => console.error('Service Worker registration failed', err));
}

loadForms();

async function loadForms() {
  try {
    const response = await fetch(API_BASE);
    const forms = await response.json();
    displayForms(forms);
    populateFormSelect(forms);
  } catch (error) {
    document.getElementById('formsList').innerHTML = '<p class="loading">Error loading forms</p>';
  }
}

function displayForms(forms) {
  const container = document.getElementById('formsList');
  if (!forms.length) {
    container.innerHTML = '<p class="loading">No forms found</p>';
    return;
  }
  
  container.innerHTML = forms.map(form => 
    `<div class="form-item" onclick="getMetadata(${form.id})">
      <strong>${form.name || 'Form ' + form.id}</strong>
      <p>${form.description || 'No description'}</p>
    </div>`
  ).join('');
}

function populateFormSelect(forms) {
  const select = document.getElementById('formSelect');
  select.innerHTML = '<option value="">Select form to update</option>' +
    forms.map(form => `<option value="${form.id}">${form.name || 'Form ' + form.id}</option>`).join('');
}

function toggleUpdateMode() {
  updateMode = !updateMode;
  const btn = document.getElementById('updateBtn');
  const select = document.getElementById('formSelect');
  
  if (updateMode) {
    btn.textContent = 'Cancel Update';
    btn.onclick = cancelUpdate;
    select.style.display = 'block';
  } else {
    btn.textContent = 'Update Form';
    btn.onclick = toggleUpdateMode;
    select.style.display = 'none';
  }
}

function cancelUpdate() {
  updateMode = false;
  document.getElementById('updateBtn').textContent = 'Update Form';
  document.getElementById('updateBtn').onclick = toggleUpdateMode;
  document.getElementById('formSelect').style.display = 'none';
  document.getElementById('formUrl').value = '';
}

async function createForm() {
  const url = document.getElementById('formUrl').value;
  if (!url) return alert('Please enter a URL');
  
  try {
    const response = await fetch(`${API_BASE}/create/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url })
    });
    
    if (response.ok) {
      document.getElementById('formUrl').value = '';
      loadForms();
    } else {
      alert('Error creating form');
    }
  } catch (error) {
    alert('Error creating form');
  }
}

async function updateForm() {
  const url = document.getElementById('formUrl').value;
  const formId = document.getElementById('formSelect').value;
  
  if (!url) return alert('Please enter a URL');
  if (!formId) return alert('Please select a form to update');
  
  try {
    const response = await fetch(`${API_BASE}/update/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url, form_id: formId })
    });
    
    if (response.ok) {
      cancelUpdate();
      loadForms();
    } else {
      alert('Error updating form');
    }
  } catch (error) {
    alert('Error updating form');
  }
}

async function getMetadata(formId) {
  const container = document.getElementById('metadata');
  container.style.display = 'block';
  container.innerHTML = '<p class="loading">Loading metadata...</p>';
  
  try {
    const response = await fetch(`${API_BASE}/${formId}/metadata/`);
    const metadata = await response.json();
    
    container.innerHTML = `
      <h3>Form Metadata</h3>
      <pre>${JSON.stringify(metadata, null, 2)}</pre>
    `;
  } catch (error) {
    container.innerHTML = '<p class="loading">Error loading metadata</p>';
  }
}
