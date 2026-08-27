let messages = [];
const showLimit = 3;
let searchKeyword = "";

function loadMessages() {
  const savedData = localStorage.getItem('thoughtMessages');
  if (savedData) {
    messages = JSON.parse(savedData);
  } else {
    messages = [];
  }
}

function saveMessages() {
  localStorage.setItem('thoughtMessages', JSON.stringify(messages));
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(0, 200, 200);
  fill(255);
  rect(0, 0, width * 0.9, height);
  noLoop();
}

window.addEventListener('load', () => {
  loadMessages();
  renderMessages();
  document.getElementById('sendBtn').addEventListener('click', sendMessage);
  document.getElementById('searchBtn').addEventListener('click', doSearch);
  document.getElementById('searchInput').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') doSearch();
  });
});

function doSearch() {
  searchKeyword = document.getElementById('searchInput').value.trim().toLowerCase();
  renderMessages();
}

function draw() {}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  background(0, 200, 200);
  rect(0, 0, width * 0.9, height);
}

function sendMessage() {
  const input = document.getElementById('msgInput');
  const text = input.value.trim();
  if (!text) {
    alert('Please enter your thought');
    return;
  }
  messages.push({
    content: text,
    time: new Date().toLocaleString('en-US')
  });
  saveMessages();
  input.value = '';
  searchKeyword = "";
  document.getElementById('searchInput').value = "";
  renderMessages();
}

function renderMessages() {
  const list = document.getElementById('messageList');
  list.innerHTML = '';

  let filteredMsgs = messages;
  if (searchKeyword) {
    filteredMsgs = messages.filter(msg =>
      msg.content.toLowerCase().includes(searchKeyword)
    );
  }

  const isOverflow = filteredMsgs.length > showLimit;
  const displayMsgs = isOverflow ? filteredMsgs.slice(0, showLimit) : filteredMsgs;

  displayMsgs.forEach((msg, idx) => {
    const realIndex = messages.indexOf(msg);
    const div = document.createElement('div');
    div.className = 'msg-card';
    div.innerHTML = `
      <div class="msg-content">${msg.content}</div>
      <div class="msg-footer">
        <small class="text-muted">${msg.time}</small>
        <button class="delete-btn btn btn-sm btn-danger ms-2">Delete</button>
      </div>
    `;
    div.querySelector('.delete-btn').addEventListener('click', () => deleteMsg(realIndex));
    list.appendChild(div);
  });

  if (isOverflow) {
    const expandBtn = document.createElement('button');
    expandBtn.className = 'btn btn-outline-secondary mt-2';
    expandBtn.textContent = `Show more (${filteredMsgs.length - showLimit})`;
    expandBtn.addEventListener('click', () => showAllMessages(filteredMsgs));
    list.appendChild(expandBtn);
  }
}

function showAllMessages(filteredMsgs) {
  const list = document.getElementById('messageList');
  list.innerHTML = '';
  filteredMsgs.forEach(msg => {
    const realIndex = messages.indexOf(msg);
    const div = document.createElement('div');
    div.className = 'msg-card';
    div.innerHTML = `
      <div class="msg-content">${msg.content}</div>
      <div class="msg-footer">
        <small class="text-muted">${msg.time}</small>
        <button class="delete-btn btn btn-sm btn-danger ms-2">Delete</button>
      </div>
    `;
    div.querySelector('.delete-btn').addEventListener('click', () => deleteMsg(realIndex));
    list.appendChild(div);
  });
}

function deleteMsg(index) {
  messages.splice(index, 1);
  saveMessages();
  renderMessages();
}