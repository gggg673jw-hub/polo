const messages = document.getElementById('messages');
const form = document.getElementById('chatForm');
const input = document.getElementById('messageInput');
const clearBtn = document.getElementById('clearBtn');
const storageKey = 'nova-demo-chat-v1';
const welcome = { role: 'bot', text: 'Hello! 👋 I am polo, your demo study assistant. Ask me about HTML, CSS, JavaScript, AI, or study tips!' };
let history;
try {
  const saved = JSON.parse(localStorage.getItem(storageKey));
  history = Array.isArray(saved) && saved.every(m => ['bot','user'].includes(m.role) && typeof m.text === 'string') ? saved.slice(-100) : [welcome];
} catch { history = [welcome]; }
if (!history.length) history = [welcome];
function save() { try { localStorage.setItem(storageKey, JSON.stringify(history)); } catch {} }
function renderMessage(message) {
  const bubble = document.createElement('div');
  bubble.className = 'message ' + message.role;
  bubble.textContent = message.text; // textContent prevents HTML injection
  messages.appendChild(bubble);
  messages.scrollTop = messages.scrollHeight;
  return bubble;
}
history.forEach(renderMessage);
function replyTo(text) {
  const q = text.toLowerCase();
  if (/\b(hello|hi|hey)\b/.test(q)) return 'Hello! How can I help you today?';
  if (q.includes('your name') || q.includes('who are you')) return 'I am Nova, a browser-based demo chatbot!';
  if (q.includes('html')) return 'HTML stands for HyperText Markup Language. It structures a web page.';
  if (q.includes('css')) return 'CSS stands for Cascading Style Sheets. It controls colors, fonts, and layout.';
  if (q.includes('javascript') || q.includes(' js ')) return 'JavaScript adds interactivity, such as responding to clicks and updating page content.';
  if (q.includes('artificial intelligence') || /\bai\b/.test(q)) return 'AI means Artificial Intelligence: computer systems designed to perform tasks associated with human intelligence.';
  if (q.includes('study')) return 'Try studying in focused sessions, taking short breaks, and testing yourself with practice questions.';
  if (q.includes('thank')) return 'You are welcome! 😊';
  if (q.includes('bye')) return 'Goodbye! Happy learning!';
  return 'I am a simple demo chatbot, so I do not know that answer yet. Try asking about HTML, CSS, JavaScript, AI, or study tips.';
}
form.addEventListener('submit', event => {
  event.preventDefault();
  const text = input.value.trim();
  if (!text) return;
  history.push({role:'user',text});
  renderMessage(history[history.length-1]);
  input.value = '';
  const typing = renderMessage({role:'bot',text:'Nova is typing...'});
  input.disabled = true;
  setTimeout(() => {
    const response = {role:'bot',text:replyTo(text)};
    typing.textContent = response.text;
    history.push(response);
    history = history.slice(-100);
    save();
    input.disabled = false;
    input.focus();
    messages.scrollTop = messages.scrollHeight;
  }, 650);
});
clearBtn.addEventListener('click', () => {
  history = [{...welcome}];
  messages.replaceChildren();
  history.forEach(renderMessage);
  save();
  input.focus();
});
save();
