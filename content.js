
const highlightStyle = document.createElement("style");
highlightStyle.textContent = `
.saved-word-highlight {
  background: linear-gradient(
    180deg,
    transparent 60%,
    rgba(255, 215, 0, 0.35) 60%
  );
  padding: 1px 2px;
  border-radius: 4px;
  cursor: help;
}
`;
document.head.appendChild(highlightStyle);


function highlightWords(words) {
  if (!words.length) return;

  const savedWords = words.map(w => w.word.toLowerCase());

  const walker = document.createTreeWalker(
    document.body,
    NodeFilter.SHOW_TEXT,
    {
      acceptNode(node) {
        if (
          !node.nodeValue.trim() ||
          node.parentElement.closest(
            "script, style, textarea, input, button, nav, footer, header"
          ) ||
          node.parentElement.classList.contains("saved-word-highlight")
        ) {
          return NodeFilter.FILTER_REJECT;
        }
        return NodeFilter.FILTER_ACCEPT;
      }
    }
  );

  const nodes = [];
  while (walker.nextNode()) nodes.push(walker.currentNode);

  nodes.forEach(node => {
    let text = node.nodeValue;
    let lower = text.toLowerCase();

    savedWords.forEach(word => {
      const index = lower.indexOf(word);
      if (index === -1) return;

      const range = document.createRange();
      range.setStart(node, index);
      range.setEnd(node, index + word.length);

      const span = document.createElement("span");
      span.className = "saved-word-highlight";
      span.textContent = text.substr(index, word.length);

      range.deleteContents();
      range.insertNode(span);

      // split remaining text safely
      node = span.nextSibling;
      if (node) {
        text = node.nodeValue || "";
        lower = text.toLowerCase();
      }
    });
  });
}


// double-click detection and word fetching
document.addEventListener("dblclick", async (e) => {
  const word = window.getSelection().toString().trim();
  if (!word || word.includes(" ")) return;

 const data = await fetchWordData(word);
showPopup(word, data, e.pageX, e.pageY);

  console.log(word, data);
});

// Calling dictionary API to fetch meaning
async function fetchWordData(word) {
  const res = await fetch(
    `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
  );
  const data = await res.json();

  const meaningBlock = data[0].meanings[0];
  const definitionBlock = meaningBlock.definitions[0];

  const phonetic = data[0].phonetics?.find(p => p.text) || {};
  const audio = data[0].phonetics?.find(p => p.audio) || {};

  return {
    definition: definitionBlock.definition,
    example: definitionBlock.example || null,
    partOfSpeech: meaningBlock.partOfSpeech,
    pronunciation: phonetic.text || null,
    audio: audio.audio || null
  };
}



// Calculating popup display duration based on text length
function getPopupDuration(text) {
  const charsPerSecond = 100;
  const seconds = text.length / charsPerSecond;

  const minTime = 2500;  
  const maxTime = 10000; 

  const duration = seconds * 1000;

  return Math.min(Math.max(duration, minTime), maxTime);
}



function showToast(message, bg = "#333") {
  const toast = document.createElement("div");
  toast.textContent = message;

  toast.style.position = "fixed";
  toast.style.bottom = "20px";
  toast.style.right = "20px";
  toast.style.background = bg;
  toast.style.color = "#fff";
  toast.style.padding = "8px 14px";
  toast.style.borderRadius = "6px";
  toast.style.fontSize = "13px";
  toast.style.zIndex = "999999";
  toast.style.boxShadow = "0 4px 10px rgba(0,0,0,0.2)";

  document.body.appendChild(toast);

  setTimeout(() => toast.remove(), 1500);
}



// Displaying popup with word and meaning
function showPopup(word, data, x, y) {
  const popup = document.createElement("div");

 popup.innerHTML = `
  <div style="
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 6px;
  ">
    <div style="
      font-family: 'Playfair Display', serif;
      font-size: 18px;
      font-weight: 600;
      color: #2b2b2b;
    ">
      ${word}
    </div>

    <span style="
      font-size: 11px;
      padding: 2px 8px;
      border-radius: 999px;
      background: #ebe9ff;
      color: #5a52e0;
      font-family: system-ui, sans-serif;
    ">

    ${data.pronunciation ? `
  <div style="
    font-size: 12px;
    color: #777;
    margin-bottom: 6px;
    font-family: system-ui, sans-serif;
  ">
    ${data.pronunciation}
  </div>
` : ""}

      ${data.partOfSpeech}
    </span>
  </div>

  <div style="
    font-family: system-ui, sans-serif;
    font-size: 13px;
    line-height: 1.5;
    color: #555;
    margin-bottom: 8px;
  ">
    ${data.definition}
  </div>

  ${
    data.example
      ? `<div style="
          font-size: 12px;
          font-style: italic;
          color: #777;
          margin-bottom: 10px;
        ">
          “${data.example}”
        </div>`
      : ""
  }

  <button id="saveWordBtn" style="
    background: #6c63ff;
    color: white;
    border: none;
    padding: 6px 12px;
    border-radius: 999px;
    font-size: 12px;
    cursor: pointer;
  ">
    Save to Vocabulary
  </button>
  ${data.audio ? `
  <button id="playAudioBtn" style="
    background: #eee;
    border: none;
    padding: 6px 10px;
    border-radius: 999px;
    font-size: 12px;
    cursor: pointer;
    margin-right: 6px;
  ">
    🔊
  </button>
` : ""}

`;




  popup.style.position = "absolute";
  popup.style.top = `${y + 12}px`;
  popup.style.left = `${x + 12}px`;
  popup.style.maxWidth = "300px";
  popup.style.padding = "14px 16px";
  popup.style.background = "#fdfcf9";
  popup.style.borderRadius = "16px";
  popup.style.boxShadow =
    "0 12px 30px rgba(0,0,0,0.12), 0 2px 6px rgba(0,0,0,0.08)";
  popup.style.zIndex = "99999";
  popup.style.animation = "fadeIn 0.18s ease-out";

  // subtle border
  popup.style.border = "1px solid #eee8dc";

  document.body.appendChild(popup);
  const audioBtn = popup.querySelector("#playAudioBtn");
if (audioBtn) {
  const audio = new Audio(data.audio);
  audioBtn.addEventListener("click", () => audio.play());
}


  const btn = popup.querySelector("#saveWordBtn");

  btn.addEventListener("mouseenter", () => {
    btn.style.background = "#5a52e0";
  });

  btn.addEventListener("mouseleave", () => {
    btn.style.background = "#6c63ff";
  });

  btn.addEventListener("click", () => {
  saveWord(word, data);
  showToast("Saved ✨", "#6c63ff");
  popup.remove();
});


  // duration logic
const duration = getPopupDuration(
  data.definition + (data.example || "")
);
  let timeoutId = setTimeout(() => popup.remove(), duration);

  popup.addEventListener("mouseenter", () => {
    clearTimeout(timeoutId);
  });

  popup.addEventListener("mouseleave", () => {
    timeoutId = setTimeout(() => popup.remove(), 1500);
  });
}



// Saving word and meaning to chrome storage
function saveWord(word, data) {
  chrome.storage.local.get(["words"], (result) => {
    const words = result.words || [];

   
    if (words.find(w => w.word === word)) {
      console.log("Already saved:", word);
      return;
    }

    words.push({
      id: crypto.randomUUID(),
      word,
      meaning: data.definition,
      savedAt: Date.now()
    });

    chrome.storage.local.set({ words }, () => {
      console.log("Saved successfully:", word);
    });
  });
}



const style = document.createElement("style");
style.textContent = `
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
`;
document.head.appendChild(style);



chrome.storage.local.get(["words"], (res) => {
  const savedWords = res.words || [];
  highlightWords(savedWords);
});
