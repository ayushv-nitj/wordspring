let allWords = [];

// Toast function
function showPopupToast(message, color = "#333") {
  const toast = document.createElement("div");
  toast.textContent = message;

  toast.style.position = "fixed";
  toast.style.bottom = "10px";
  toast.style.left = "50%";
  toast.style.transform = "translateX(-50%)";
  toast.style.background = color;
  toast.style.color = "#fff";
  toast.style.padding = "6px 12px";
  toast.style.borderRadius = "5px";
  toast.style.fontSize = "12px";
  toast.style.zIndex = "9999";

  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 1200);
}

// Render words in popup
function renderWords(words) {
  const list = document.getElementById("wordList");
  list.innerHTML = "";

  if (words.length === 0) {
    list.innerHTML = "<li>No words saved yet</li>";
    return;
  }

  words.forEach(w => {
    const li = document.createElement("li");

    li.innerHTML = `
      <div class="card">
        <div>
          <div class="word">${w.word}</div>
          <div class="meaning">${w.meaning}</div>
        </div>
        <button data-id="${w.id}" class="deleteBtn">Remove</button>
      </div>
    `;

    list.appendChild(li);
  });

  attachDeleteHandlers();
}

// Delete word handler
function attachDeleteHandlers() {
  document.querySelectorAll(".deleteBtn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const idToDelete = e.target.dataset.id;

      allWords = allWords.filter(w => w.id !== idToDelete);

      chrome.storage.local.set({ words: allWords }, () => {
        renderWords(allWords);
        showPopupToast("Deleted", "#e74c3c");
      });
    });
  });
}

// Load initial data
chrome.storage.local.get(["words", "readingMode", "fontFamily", "hideAds"], (result) => {
  allWords = result.words || [];
  renderWords(allWords);

  // Set initial mode button states
  const currentMode = result.readingMode || "default";
  const currentFont = result.fontFamily || "default";
  const hideAds = result.hideAds !== false; // default true

  document.querySelectorAll(".mode-btn").forEach(btn => {
    if (btn.dataset.mode === currentMode) {
      btn.classList.add("active");
    } else {
      btn.classList.remove("active");
    }
  });

  document.querySelectorAll(".font-btn").forEach(btn => {
    if (btn.dataset.font === currentFont) {
      btn.classList.add("active");
    } else {
      btn.classList.remove("active");
    }
  });

//   document.getElementById("hideAdsCheckbox").checked = hideAds;
});

// Search functionality
document.getElementById("searchInput").addEventListener("input", (e) => {
  const query = e.target.value.toLowerCase();

  const filtered = allWords.filter(w =>
    w.word.toLowerCase().includes(query)
  );

  renderWords(filtered);
});

// Reading mode buttons
document.querySelectorAll(".mode-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    const mode = btn.dataset.mode;

    // Update active state
    document.querySelectorAll(".mode-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    // Save to storage
    chrome.storage.local.set({ readingMode: mode }, () => {
      showPopupToast(`${mode.charAt(0).toUpperCase() + mode.slice(1)} mode activated`, "#6c63ff");
    });
  });
});

// Font buttons
document.querySelectorAll(".font-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    const font = btn.dataset.font;

    // Update active state
    document.querySelectorAll(".font-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    // Save to storage
    chrome.storage.local.set({ fontFamily: font }, () => {
      const fontNames = {
        'default': 'Default',
        'serif': 'Serif',
        'sans-serif': 'Sans-serif',
        'modern': 'Modern'
      };
      showPopupToast(`${fontNames[font]} font applied`, "#6c63ff");
    });
  });
});

// Hide ads checkbox
// document.getElementById("hideAdsCheckbox").addEventListener("change", (e) => {
//   const hideAds = e.target.checked;

//   chrome.storage.local.set({ hideAds }, () => {
//     showPopupToast(hideAds ? "Ads hidden" : "Ads visible", "#6c63ff");
//   });
// });