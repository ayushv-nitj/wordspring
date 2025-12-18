# 📚 Word Spring - Vocabulary Builder Chrome Extension

**Word Spring** is a powerful Chrome extension that helps you learn new words while browsing the web. Double-click any word to see its definition, synonyms, antonyms, etymology, and more. Save words to build your personal vocabulary list and enhance your reading experience with customizable themes and fonts.

---

# 🚀 Quick Start

Download Latest Release - Get word-spring-v1.1.0.zip
Extract the ZIP file to a permanent folder
Open chrome://extensions/ in Chrome
Enable "Developer mode" (top right)
Click "Load unpacked" and select the extracted folder
Done! Double-click any word on any webpage to start learning

---

## ✨ Features

### 📖 Smart Word Lookup
- **Double-click any word** on any webpage to instantly see its definition
- **Comprehensive information** including:
  - Definition and parts of speech
  - Pronunciation (IPA format)
  - Audio pronunciation (🔊)
  - Usage examples
  - Synonyms
  - Antonyms 
  - Etymology (word origin and history)

### 💾 Vocabulary Management
- **Save words** to your personal vocabulary list
- **Search functionality** to quickly find saved words
- **Delete words** you no longer need
- **Automatic highlighting** of saved words on all webpages

### 🎨 Reading Experience Enhancement
- **4 Reading Modes:**
  - ☀️ **Default** - Original webpage appearance
  - 🌙 **Dark** - Easy on the eyes for night reading
  - 📜 **Sepia** - Warm, vintage paper feel
  - 📄 **Paper** - Clean, bright reading interface

- **4 Font Styles:**
  - **Default** - Keep webpage's original fonts
  - **Serif** - Classic, elegant fonts (Georgia, Merriweather)
  - **Sans-serif** - Clean, modern fonts (Inter, Helvetica)
  - **Modern** - System-optimized UI fonts

### 🎯 User-Friendly Interface
- Beautiful, minimalist design
- Smooth animations and transitions
- Auto-dismiss popups with smart timing
- Toast notifications for actions

## Upcoming Features

### 🚫 Ad Blocker coming soon...
- Hide distracting advertisements automatically
- Toggle on/off as needed
- Blocks common ad containers and trackers

---

## 🚀 Installation

### Method 1: Load Unpacked Extension (Development)

1. **Download the extension files**
   ```
   Clone or download this repository to your local machine
   ```

2. **Open Chrome Extensions page**
   - Navigate to `chrome://extensions/`
   - Or click Menu (⋮) → More Tools → Extensions

3. **Enable Developer Mode**
   - Toggle the "Developer mode" switch in the top right corner

4. **Load the extension**
   - Click "Load unpacked"
   - Select the folder containing the extension files
   - The extension should now appear in your extensions list

5. **Pin the extension** (Optional but recommended)
   - Click the puzzle icon in Chrome toolbar
   - Find "Word Spring" and click the pin icon

---

## 📖 Usage Guide

### Looking Up Words
1. **Navigate to any webpage**
2. **Double-click on any word** you want to learn
3. **View the popup** with comprehensive word information
4. **Click "Save to Vocabulary"** to add it to your list
5. **Click 🔊** to hear the pronunciation (if available)

### Managing Your Vocabulary
1. **Click the extension icon** in your Chrome toolbar
2. **View all saved words** in the popup
3. **Use the search bar** to find specific words
4. **Click "Remove"** to delete words from your list

### Customizing Reading Experience
1. **Open the extension popup**
2. **Choose a Reading Mode:**
   - Default, Dark, Sepia, or Paper
3. **Select a Font Style:**
   - Default, Serif, Sans-serif, or Modern
4. **Toggle "Hide distracting ads"** on/off

### Viewing Saved Words on Pages
- Saved words are **automatically highlighted** with a yellow gradient on all webpages
- Hover over highlighted words to see the cursor change

---

## 📁 File Structure

```
word-spring-extension/
├── manifest.json         # Extension configuration
├── content.js            # Main content script (word lookup, highlighting, reading modes)
├── popup.html            # Extension popup interface
├── popup.js              # Popup functionality and settings
├── icons-/icon16.png     # Extension icon (16x16)
|   |_   icon48.png       # Extension icon (48x48)
    |_   icon128.png      # Extension icon (128x128)
└── README.md             # This file
```

### File Descriptions

#### `manifest.json`
- Defines extension metadata, permissions, and configuration
- Specifies content scripts and popup settings

#### `content.js`
- Runs on all webpages
- Handles word double-click detection
- Fetches word data from APIs
- Displays word definition popups
- Manages reading modes and font styles
- Implements ad blocking
- Highlights saved words on pages

#### `popup.html`
- Extension popup user interface
- Reading mode and font controls
- Saved words list display
- Search functionality

#### `popup.js`
- Popup interaction logic
- Settings management
- Word deletion and search
- Chrome storage communication

---

## 🛠️ Technologies Used

### Core Technologies
- **JavaScript (ES6+)** - Main programming language
- **HTML5** - Popup interface structure
- **CSS3** - Styling and animations
- **Chrome Extension API** - Browser integration

### APIs Used

#### 1. **Free Dictionary API**
- **URL:** https://dictionaryapi.dev/
- **Purpose:** Primary source for word definitions, pronunciations, examples, synonyms, antonyms, and etymology
- **Rate Limit:** None
- **Authentication:** Not required

#### 2. **Datamuse API**
- **URL:** https://www.datamuse.com/api/
- **Purpose:** Fallback for synonyms when Dictionary API doesn't provide them
- **Rate Limit:** 100,000 requests per day
- **Authentication:** Not required

### Chrome APIs
- `chrome.storage.local` - Persistent storage for saved words and settings
- `chrome.storage.onChanged` - Real-time settings synchronization

---

## ⚙️ Configuration

### Default Settings
```javascript
{
  readingMode: "default",      // Default, Dark, Sepia, or Paper
  fontFamily: "default",        // Default, Serif, Sans-serif, or Modern
  hideAds: true,                // Ad blocker enabled
  words: []                     // Saved vocabulary list
}
```

### Customizable Features
- All settings are stored in `chrome.storage.local`
- Settings persist across browser sessions
- Changes apply instantly to all open tabs

---

## 🔒 Privacy & Permissions

### Required Permissions

#### `storage`
- **Why:** Save vocabulary words and user settings locally
- **Data:** Only stored on your device, never transmitted

#### `alarms`
- **Why:** Future feature for spaced repetition reminders
- **Current:** Not actively used in v1.0.0

### Data Collection
- **None** - This extension does NOT collect, store, or transmit any personal data
- All data stays on your local machine
- No analytics, tracking, or telemetry

### Third-Party APIs
- Dictionary API and Datamuse API are called directly from your browser
- No data is sent to our servers (we don't have any!)

---

## 🐛 Known Issues & Limitations

### Current Limitations
1. **Language Support:** Currently only supports English words
2. **Complex Selections:** Only works with single-word double-clicks
3. **PDF Support:** Limited functionality in PDF viewers
4. **Dynamic Content:** Highlighting may not catch dynamically loaded content

### Planned Improvements
- [ ] Multi-language support
- [ ] Phrase lookup (2-3 words)
- [ ] Export vocabulary list (CSV, PDF)
- [ ] Spaced repetition flashcards
- [ ] Offline mode with cached definitions
- [ ] Context menu integration
- [ ] Word statistics and learning progress

---

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

### Reporting Bugs
1. Check if the issue already exists
2. Create a new issue with:
   - Clear description
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots (if applicable)

### Suggesting Features
1. Open an issue with the "feature request" label
2. Describe the feature and its benefits
3. Provide examples or mockups if possible

### Submitting Pull Requests
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Setup
```bash
# Clone the repository
git clone https://github.com/ayushv-nitj/wordspring.git

# Open in your code editor
cd wordspring

# Load in Chrome for testing
# Navigate to chrome://extensions/
# Enable Developer mode
# Click "Load unpacked" and select the folder
```

---

## 📝 Changelog

### Version 1.1.0 (Current)
**Release Date:** December 2025

#### Features
- ✅ Double-click word lookup with comprehensive definitions
- ✅ Synonyms, antonyms, and etymology display
- ✅ Audio pronunciation support
- ✅ Save words to personal vocabulary
- ✅ Search saved words
- ✅ Automatic word highlighting on pages
- ✅ 4 reading modes (Default, Dark, Sepia, Paper)
- ✅ 4 font styles (Default, Serif, Sans-serif, Modern)
- ✅ Ad blocker functionality
- ✅ Beautiful, responsive UI
- ✅ Toast notifications

---

## 📄 License

This project is licensed under the **MIT License**.

```
MIT License

Copyright (c) 2025 Word Spring

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## 🙏 Acknowledgments

### APIs & Services
- **[Free Dictionary API](https://dictionaryapi.dev/)** - Comprehensive word definitions
- **[Datamuse API](https://www.datamuse.com/api/)** - Word associations and synonyms

### Fonts
- **[Google Fonts](https://fonts.google.com/)** - Inter and Playfair Display fonts

### Inspiration
- Built for language learners and avid readers
- Inspired by the need for seamless vocabulary building while browsing

---

## 📞 Support & Contact

### Get Help
- **Issues:** [GitHub Issues](https://github.com/ayushv-nitj/wordspring/issues)
- **Documentation:** This README file
- **FAQs:** Check closed issues for common questions

### Connect
- **GitHub:** [@yourusername](https://github.com/ayushv-nitj)
- **Email:** ayushverma9d12@gmail.com

---

## ⭐ Show Your Support

If you find this extension helpful, please consider:
- ⭐ Starring the repository
- 🐛 Reporting bugs you encounter
- 💡 Suggesting new features
- 🔄 Sharing with friends and colleagues
- 📝 Writing a review (once on Chrome Web Store)

---

## 🚀 Future Roadmap

### Short Term (v1.1.0)
- [ ] Add word categories/tags
- [ ] Implement word review mode
- [ ] Add keyboard shortcuts
- [ ] Improve popup positioning logic

### Medium Term (v1.5.0)
- [ ] Spaced repetition system
- [ ] Export/import vocabulary
- [ ] Multi-language support
- [ ] Usage statistics

### Long Term (v2.0.0)
- [ ] Mobile app companion
- [ ] Cloud sync across devices
- [ ] AI-powered word recommendations
- [ ] Gamification elements

---

<div align="center">

**Made with ❤️ by Ayush**

[⬆ Back to Top](#-wordspring---vocabulary-builder-chrome-extension)

</div>
