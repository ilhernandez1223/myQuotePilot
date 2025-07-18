// assets/scripts/main.js

/* ===========================================
   Utility Functions: SessionStorage Wrapper
   =========================================== */
function saveData(key, value) {
  sessionStorage.setItem(key, JSON.stringify(value));
}
function loadData(key) {
  const str = sessionStorage.getItem(key);
  return str ? JSON.parse(str) : {};
}

/* ===========================================
   Populate State Dropdown for Address
   =========================================== */
function populateStates() {
  const states = [
    {name:'Alabama',abbreviation:'AL'},{name:'Alaska',abbreviation:'AK'},
    {name:'Arizona',abbreviation:'AZ'},{name:'Arkansas',abbreviation:'AR'},
    {name:'California',abbreviation:'CA'},{name:'Colorado',abbreviation:'CO'},
    {name:'Connecticut',abbreviation:'CT'},{name:'Delaware',abbreviation:'DE'},
    {name:'Florida',abbreviation:'FL'},{name:'Georgia',abbreviation:'GA'},
    {name:'Hawaii',abbreviation:'HI'},{name:'Idaho',abbreviation:'ID'},
    {name:'Illinois',abbreviation:'IL'},{name:'Indiana',abbreviation:'IN'},
    {name:'Iowa',abbreviation:'IA'},{name:'Kansas',abbreviation:'KS'},
    {name:'Kentucky',abbreviation:'KY'},{name:'Louisiana',abbreviation:'LA'},
    {name:'Maine',abbreviation:'ME'},{name:'Maryland',abbreviation:'MD'},
    {name:'Massachusetts',abbreviation:'MA'},{name:'Michigan',abbreviation:'MI'},
    {name:'Minnesota',abbreviation:'MN'},{name:'Mississippi',abbreviation:'MS'},
    {name:'Missouri',abbreviation:'MO'},{name:'Montana',abbreviation:'MT'},
    {name:'Nebraska',abbreviation:'NE'},{name:'Nevada',abbreviation:'NV'},
    {name:'New Hampshire',abbreviation:'NH'},{name:'New Jersey',abbreviation:'NJ'},
    {name:'New Mexico',abbreviation:'NM'},{name:'New York',abbreviation:'NY'},
    {name:'North Carolina',abbreviation:'NC'},{name:'North Dakota',abbreviation:'ND'},
    {name:'Ohio',abbreviation:'OH'},{name:'Oklahoma',abbreviation:'OK'},
    {name:'Oregon',abbreviation:'OR'},{name:'Pennsylvania',abbreviation:'PA'},
    {name:'Rhode Island',abbreviation:'RI'},{name:'South Carolina',abbreviation:'SC'},
    {name:'South Dakota',abbreviation:'SD'},{name:'Tennessee',abbreviation:'TN'},
    {name:'Texas',abbreviation:'TX'},{name:'Utah',abbreviation:'UT'},
    {name:'Vermont',abbreviation:'VT'},{name:'Virginia',abbreviation:'VA'},
    {name:'Washington',abbreviation:'WA'},{name:'West Virginia',abbreviation:'WV'},
    {name:'Wisconsin',abbreviation:'WI'},{name:'Wyoming',abbreviation:'WY'}
  ];
  const select = document.querySelector('select[name="state"]');
  if (!select) return;
  states.forEach(s => {
    const opt = document.createElement('option');
    opt.value = s.abbreviation;
    opt.textContent = s.name;
    select.append(opt);
  });
}

/* ===========================================
   INDEX (index.html)
   =========================================== */
function initIndex() {
  const form = document.getElementById('heroQuoteForm');
  if (!form) return;
  form.addEventListener('submit', e => {
    e.preventDefault();
    const payload = {
      zip:   form.zip.value,
      email: form.email.value,
      phone: form.phone.value
    };
    saveData('basicInfo', payload);
    window.location.href = 'basic-info.html';
  });
}

/* ===========================================
   BASIC INFO (basic-info.html)
   =========================================== */
function initBasicInfo() {
  const form = document.getElementById('basicForm');
  if (!form) return;

  // Populate state dropdown
  populateStates();

  // Highlight selected card
  document.querySelectorAll('.radio-card').forEach(card => {
    const input = card.querySelector('input[type=radio]');
    input.addEventListener('change', () => {
      document.querySelectorAll('.radio-card.selected').forEach(c => c.classList.remove('selected'));
      if (input.checked) card.classList.add('selected');
    });
  });

  // Pre-fill hidden fields
  const basic = loadData('basicInfo');
  ['zip','email','phone'].forEach(key => {
    const el = form.querySelector(`[name="${key}"]`);
    if (basic[key] && el) el.value = basic[key];
  });

  form.addEventListener('submit', e => {
    e.preventDefault();
    const data = {};
    new FormData(form).forEach((v,k) => data[k] = v);
    saveData('basicInfo', data);
    window.location.href = `${data.coverageType}-form.html`;
  });
}

/* ===========================================
   COVERAGE FORMS (auto/home/life/commercial)
   =========================================== */
['autoQuoteForm','homeQuoteForm','lifeQuoteForm','commercialQuoteForm'].forEach(formId => {
  const initFn = () => {
    const form = document.getElementById(formId);
    if (!form) return;
    const data = loadData('basicInfo');
    Object.keys(data).forEach(k => {
      const el = form.querySelector(`[name="${k}"]`);
      if (el) el.value = data[k];
    });
  };
  document.addEventListener('DOMContentLoaded', initFn);
});

// Initialize index and basic
document.addEventListener('DOMContentLoaded', () => {
  initIndex();
  initBasicInfo();
});
