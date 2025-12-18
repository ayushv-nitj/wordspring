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
  toast.style.color = "#efb5e4ff";
  toast.style.padding = "6px 12px";
  toast.style.borderRadius = "5px";
  toast.style.fontSize = "12px";
  toast.style.zIndex = "9999";

  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 1200);
}

//Render words in popup
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

//Delete word handler
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

// Load once 
chrome.storage.local.get(["words"], (result) => {
  allWords = result.words || [];
  renderWords(allWords);
});

// Search 
document.getElementById("searchInput")
  .addEventListener("input", (e) => {
    const query = e.target.value.toLowerCase();

    const filtered = allWords.filter(w =>
      w.word.toLowerCase().includes(query)
    );

    renderWords(filtered);
  });


  