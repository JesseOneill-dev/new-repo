const MAX = 100;
const form = document.getElementById('form');
const input = document.getElementById('item');
const error = document.getElementById('error');
const list = document.getElementById('list');
const count = document.getElementById('count');
let items = [];
try { items = JSON.parse(localStorage.getItem('items')) || []; } catch (e) { items = []; }

function validate(text) {
  if (!text) return 'Item cannot be empty.';
  if (text.length > MAX) return 'Item must be at most ' + MAX + ' characters.';
  if (items.some(i => i.text.toLowerCase() === text.toLowerCase())) return 'Item already exists.';
  return '';
}

function save() { localStorage.setItem('items', JSON.stringify(items)); }

function render() {
  list.textContent = '';
  items.forEach((item, idx) => {
    const li = document.createElement('li');
    if (item.done) li.className = 'done';
    const cb = document.createElement('input');
    cb.type = 'checkbox';
    cb.checked = item.done;
    cb.addEventListener('change', () => { item.done = cb.checked; save(); render(); });
    const span = document.createElement('span');
    span.textContent = item.text;
    const del = document.createElement('button');
    del.textContent = 'Delete';
    del.addEventListener('click', () => { items.splice(idx, 1); save(); render(); });
    li.append(cb, span, del);
    list.appendChild(li);
  });
  const done = items.filter(i => i.done).length;
  count.textContent = done + ' of ' + items.length + ' completed';
}

form.addEventListener('submit', e => {
  e.preventDefault();
  const text = input.value.trim();
  const msg = validate(text);
  error.textContent = msg;
  input.classList.toggle('invalid', !!msg);
  if (msg) return;
  items.push({ text, done: false });
  save();
  input.value = '';
  render();
});

input.addEventListener('input', () => { error.textContent = ''; input.classList.remove('invalid'); });
render();
