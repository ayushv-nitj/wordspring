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

// Reading mode styles
let readingModeStyle = document.createElement("style");
readingModeStyle.id = "reading-mode-style";
document.head.appendChild(readingModeStyle);

// Ad blocking styles
const adBlockStyle = document.createElement("style");
adBlockStyle.id = "ad-block-style";
adBlockStyle.textContent = `
/* Common ad selectors */
[class*="ad-container"],
[class*="advertisement"],
[id*="ad-banner"],
[id*="google_ads"],
.ad, .ads, .adsbygoogle,
iframe[src*="doubleclick.net"],
iframe[src*="googlesyndication.com"],
div[data-ad-slot],
aside[class*="sidebar-ad"] {
  display: none !important;
}
`;
document.head.appendChild(adBlockStyle);

// Apply reading modes
function applyReadingMode(mode, fontFamily) {
  const modes = {
    default: {
      background: '',
      color: '',
      filter: ''
    },
    dark: {
      background: '#1a1a1a',
      color: '#e4e4e4',
      filter: 'invert(1) hue-rotate(180deg)'
    },
    sepia: {
      background: '#f4ecd8',
      color: '#5b4636',
      filter: 'sepia(0.3)'
    },
    paper: {
      background: '#fdfcf9',
      color: '#2b2b2b',
      filter: 'contrast(0.95) brightness(1.05)'
    }
  };

  const fonts = {
    'default': '', // Keep original fonts
    'serif': '"Georgia", "Merriweather", "PT Serif", serif',
    'sans-serif': '"Inter", "Helvetica Neue", "Arial", sans-serif',
    'modern': '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", sans-serif'
  };

  const selectedMode = modes[mode] || modes.default;
  const font = fonts[fontFamily] || '';

  let css = '';
  
  if (mode === 'dark') {
    css = `
      html {
        background-color: ${selectedMode.background} !important;
      }
      body {
        background-color: ${selectedMode.background} !important;
        color: ${selectedMode.color} !important;
        ${font ? `font-family: ${font} !important;` : ''}
      }
      img, video, iframe, [style*="background-image"] {
        filter: ${selectedMode.filter} !important;
      }
      * {
        color: ${selectedMode.color} !important;
        background-color: transparent !important;
        border-color: #444 !important;
      }
      a {
        color: #6ea8fe !important;
      }
      ${font ? `* { font-family: ${font} !important; }` : ''}
    `;
  } else if (mode !== 'default') {
    css = `
      html {
        background-color: ${selectedMode.background} !important;
      }
      body {
        background-color: ${selectedMode.background} !important;
        color: ${selectedMode.color} !important;
        ${font ? `font-family: ${font} !important;` : ''}
        filter: ${selectedMode.filter} !important;
      }
      ${font ? `* { font-family: ${font} !important; }` : ''}
    `;
  } else if (font) {
    css = `
      body, body * {
        font-family: ${font} !important;
      }
    `;
  }

  readingModeStyle.textContent = css;
}

// Listen for reading mode changes
chrome.storage.local.get(['readingMode', 'fontFamily', 'hideAds'], (result) => {
  const mode = result.readingMode || 'default';
  const font = result.fontFamily || 'default';
  const hideAds = result.hideAds !== false; // default true
  
  applyReadingMode(mode, font);
  
  if (!hideAds) {
    adBlockStyle.textContent = '';
  }
});

chrome.storage.onChanged.addListener((changes) => {
  if (changes.readingMode || changes.fontFamily) {
    chrome.storage.local.get(['readingMode', 'fontFamily'], (result) => {
      applyReadingMode(result.readingMode || 'default', result.fontFamily || 'default');
    });
  }
  
  if (changes.hideAds) {
    if (changes.hideAds.newValue === false) {
      adBlockStyle.textContent = '';
    } else {
      adBlockStyle.textContent = `
[class*="ad-container"],
[class*="advertisement"],
[id*="ad-banner"],
[id*="google_ads"],
.ad, .ads, .adsbygoogle,
iframe[src*="doubleclick.net"],
iframe[src*="googlesyndication.com"],
div[data-ad-slot],
aside[class*="sidebar-ad"] {
  display: none !important;
}
      `;
    }
  }
});

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

      node = span.nextSibling;
      if (node) {
        text = node.nodeValue || "";
        lower = text.toLowerCase();
      }
    });
  });
}

// Double-click detection and word fetching
document.addEventListener("dblclick", async (e) => {
  const word = window.getSelection().toString().trim();
  if (!word || word.includes(" ")) return;

  const data = await fetchWordData(word);
  showPopup(word, data, e.pageX, e.pageY);
});

// Fetch word data with synonyms, antonyms, and etymology
async function fetchWordData(word) {
  try {
    const res = await fetch(
      `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
    );
    const data = await res.json();

    const meaningBlock = data[0].meanings[0];
    const definitionBlock = meaningBlock.definitions[0];

    const phonetic = data[0].phonetics?.find(p => p.text) || {};
    const audio = data[0].phonetics?.find(p => p.audio) || {};

    // Extract etymology if available
    const etymology = data[0].origin || null;

    // Get synonyms and antonyms from dictionary API first
    const synonyms = [
      ...(definitionBlock.synonyms || []),
      ...(meaningBlock.synonyms || [])
    ].slice(0, 5);
    
    const antonyms = [
      ...(definitionBlock.antonyms || []),
      ...(meaningBlock.antonyms || [])
    ].slice(0, 5);

    // If no synonyms found, try Datamuse API
    let additionalSynonyms = [];
    if (synonyms.length === 0) {
      try {
        const datmuseRes = await fetch(
          `https://api.datamuse.com/words?rel_syn=${word}&max=5`
        );
        const datmuseData = await datmuseRes.json();
        additionalSynonyms = datmuseData.map(w => w.word);
      } catch (e) {
        console.log("Datamuse API error:", e);
      }
    }

    return {
      definition: definitionBlock.definition,
      example: definitionBlock.example || null,
      partOfSpeech: meaningBlock.partOfSpeech,
      pronunciation: phonetic.text || null,
      audio: audio.audio || null,
      synonyms: synonyms.length > 0 ? synonyms : additionalSynonyms,
      antonyms: antonyms,
      etymology: etymology
    };
  } catch (error) {
    console.error("Error fetching word data:", error);
    return {
      definition: "Definition not found",
      example: null,
      partOfSpeech: "",
      pronunciation: null,
      audio: null,
      synonyms: [],
      antonyms: [],
      etymology: null
    };
  }
}

function getPopupDuration(text) {
  const charsPerSecond = 100;
  const seconds = text.length / charsPerSecond;

  const minTime = 3000;  
  const maxTime = 12000; 

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

function showPopup(word, data, x, y) {
  const popup = document.createElement("div");

  popup.innerHTML = `
    <div style="
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 8px;
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
        ${data.partOfSpeech}
      </span>
    </div>

    ${data.pronunciation ? `
      <div style="
        font-size: 12px;
        color: #777;
        margin-bottom: 8px;
        font-family: system-ui, sans-serif;
      ">
        ${data.pronunciation}
      </div>
    ` : ""}

    <div style="
      font-family: system-ui, sans-serif;
      font-size: 13px;
      line-height: 1.5;
      color: #555;
      margin-bottom: 10px;
    ">
      ${data.definition}
    </div>

    ${data.example ? `
      <div style="
        font-size: 12px;
        font-style: italic;
        color: #777;
        margin-bottom: 10px;
        padding-left: 10px;
        border-left: 2px solid #ddd;
      ">
        "${data.example}"
      </div>
    ` : ""}

    ${data.synonyms && data.synonyms.length > 0 ? `
      <div style="margin-bottom: 8px;">
        <div style="
          font-size: 11px;
          font-weight: 600;
          color: #666;
          margin-bottom: 4px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        ">
          Synonyms
        </div>
        <div style="
          font-size: 12px;
          color: #5a52e0;
          display: flex;
          flex-wrap: wrap;
          gap: 4px;
        ">
          ${data.synonyms.map(syn => `<span style="
            background: #f0eeff;
            padding: 2px 8px;
            border-radius: 4px;
          ">${syn}</span>`).join('')}
        </div>
      </div>
    ` : ""}

    ${data.antonyms && data.antonyms.length > 0 ? `
      <div style="margin-bottom: 8px;">
        <div style="
          font-size: 11px;
          font-weight: 600;
          color: #666;
          margin-bottom: 4px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        ">
          Antonyms
        </div>
        <div style="
          font-size: 12px;
          color: #c25b5b;
          display: flex;
          flex-wrap: wrap;
          gap: 4px;
        ">
          ${data.antonyms.map(ant => `<span style="
            background: #fff0f0;
            padding: 2px 8px;
            border-radius: 4px;
          ">${ant}</span>`).join('')}
        </div>
      </div>
    ` : ""}

    ${data.etymology ? `
      <div style="
        margin-bottom: 10px;
        padding: 8px;
        background: #f9f9f9;
        border-radius: 6px;
      ">
        <div style="
          font-size: 11px;
          font-weight: 600;
          color: #666;
          margin-bottom: 4px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        ">
          Etymology
        </div>
        <div style="
          font-size: 11px;
          color: #666;
          line-height: 1.4;
        ">
          ${data.etymology}
        </div>
      </div>
    ` : ""}

    <div style="display: flex; gap: 6px; align-items: center;">
      ${data.audio ? `
        <button id="playAudioBtn" style="
          background: #eee;
          border: none;
          padding: 6px 10px;
          border-radius: 999px;
          font-size: 12px;
          cursor: pointer;
        ">
          🔊
        </button>
      ` : ""}
      
      <button id="saveWordBtn" style="
        background: #6c63ff;
        color: white;
        border: none;
        padding: 6px 12px;
        border-radius: 999px;
        font-size: 12px;
        cursor: pointer;
        flex: 1;
      ">
        Save to Vocabulary
      </button>
    </div>
  `;

  popup.style.position = "absolute";
  popup.style.top = `${y + 12}px`;
  popup.style.left = `${x + 12}px`;
  popup.style.maxWidth = "340px";
  popup.style.padding = "16px";
  popup.style.background = "#fdfcf9";
  popup.style.borderRadius = "16px";
  popup.style.boxShadow =
    "0 12px 30px rgba(0,0,0,0.15), 0 2px 6px rgba(0,0,0,0.08)";
  popup.style.zIndex = "99999";
  popup.style.animation = "fadeIn 0.18s ease-out";
  popup.style.border = "1px solid #eee8dc";

  document.body.appendChild(popup);

  const audioBtn = popup.querySelector("#playAudioBtn");
  if (audioBtn && data.audio) {
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

  const duration = getPopupDuration(
    data.definition + (data.example || "") + (data.etymology || "")
  );
  let timeoutId = setTimeout(() => popup.remove(), duration);

  popup.addEventListener("mouseenter", () => {
    clearTimeout(timeoutId);
  });

  popup.addEventListener("mouseleave", () => {
    timeoutId = setTimeout(() => popup.remove(), 2000);
  });
}

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
      highlightWords(words);
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