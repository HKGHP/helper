# HypnoStudy - Progressive Web App

A comprehensive offline-first study application for hypnosis students, featuring study materials, flashcards with spaced repetition, practice scripts, quizzes, progress tracking, and a searchable reference glossary.

## Features

### 📚 Study Materials
- Comprehensive guides on hypnosis theory and practice
- Personal note-taking for each material
- Markdown-formatted content for easy reading
- Offline access to all materials

### 🎴 Smart Flashcards
- Multiple decks covering different topics
- Spaced repetition algorithm (SM-2) for optimal learning
- Progress tracking per card
- Beautiful flip animations

### 📝 Practice Scripts
- Professional induction and deepening scripts
- Built-in practice timer
- Bookmark your favorite scripts
- Elegant typography for easy reading

### ✅ Knowledge Quizzes
- Multiple quiz topics
- Immediate feedback with explanations
- Score tracking and history
- Progress analytics

### 📊 Progress Tracking
- Study time tracking
- Session history
- Quiz performance charts
- Achievement system

### 📖 Quick Reference
- Searchable glossary of hypnosis terms
- Categorized by topic
- Instant search with highlighting

## Installation & Deployment

### Option 1: Share via Email (Recommended)

1. **Create a ZIP file** of the entire project folder
2. **Send the ZIP** to your users via email
3. **Users extract** the ZIP file to any location on their computer
4. **Users open** `index.html` in their web browser (Chrome, Firefox, Edge, Safari)
5. **Done!** The app works completely offline

### Option 2: Host on a Web Server

1. Upload all files to any web hosting service (GitHub Pages, Netlify, Vercel, etc.)
2. Share the URL with your users
3. Users can visit the URL and use "Add to Home Screen" on mobile devices

### Option 3: Deploy to App Stores (Advanced)

To deploy to Google Play Store or Apple App Store, you'll need to wrap the PWA:

**For Android (Google Play Store):**
1. Use [PWA Builder](https://www.pwabuilder.com/) or [Bubblewrap](https://github.com/GoogleChromeLabs/bubblewrap)
2. Generate an Android APK/AAB
3. Sign the app with your keystore
4. Upload to Google Play Console (requires $25 one-time fee)

**For iOS (Apple App Store):**
1. Use [PWA Builder](https://www.pwabuilder.com/) or wrap with Capacitor/Cordova
2. Generate an iOS app in Xcode
3. Sign with Apple Developer certificate
4. Upload to App Store Connect (requires $99/year developer account)

## File Structure

```
hypnostudy/
├── index.html              # Main HTML file
├── styles.css              # Design system and styles
├── app.js                  # Main application controller
├── manifest.json           # PWA manifest
├── service-worker.js       # Offline support
├── icons/                  # App icons
│   ├── icon-192.png
│   └── icon-512.png
├── components/             # UI components
│   ├── welcome.js
│   └── navigation.js
├── modules/                # Feature modules
│   ├── study-materials.js
│   ├── flashcards.js
│   ├── scripts.js
│   ├── quiz.js
│   ├── progress.js
│   └── reference.js
└── data/                   # Data layer
    ├── content.js          # Sample content
    └── storage.js          # localStorage wrapper
```

## Customizing Content

All sample content can be easily replaced with your own:

### Study Materials
Edit `data/content.js` → `studyMaterials` array

### Flashcards
Edit `data/content.js` → `flashcardDecks` array

### Practice Scripts
Edit `data/content.js` → `practiceScripts` array

### Quiz Questions
Edit `data/content.js` → `quizzes` array

### Reference Glossary
Edit `data/content.js` → `glossary` array

## Browser Compatibility

- ✅ Chrome/Edge (Recommended)
- ✅ Firefox
- ✅ Safari
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## Offline Functionality

The app uses a Service Worker to cache all resources for offline use. After the first visit, the app works completely offline with full functionality including:

- All study materials
- Flashcard practice
- Quiz taking
- Progress tracking
- Reference lookup
- Personal notes (saved to localStorage)

## Data Storage

All user data is stored locally in the browser's localStorage:
- Personal notes
- Flashcard progress
- Quiz history
- Study sessions
- Bookmarks

**Note:** Data is tied to the browser. If users clear browser data, their progress will be lost. Consider implementing export/import functionality for backup.

## Technical Details

- **Framework:** Vanilla JavaScript (no dependencies)
- **Storage:** localStorage API
- **Offline:** Service Worker with cache-first strategy
- **PWA:** Fully installable Progressive Web App
- **Responsive:** Mobile-first design
- **Animations:** CSS transitions and transforms

## Support

For issues or questions:
1. Check that JavaScript is enabled in the browser
2. Ensure the app is accessed via `file://` or `http://localhost`
3. Clear browser cache if experiencing issues
4. Try a different browser

## License

This app is provided as-is for educational purposes. Customize and distribute as needed.

## Credits

Built with modern web technologies and best practices for Progressive Web Apps.
