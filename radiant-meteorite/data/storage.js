// LocalStorage wrapper for data persistence
const Storage = {
    // Keys
    KEYS: {
        USER_NOTES: 'hypnostudy_user_notes',
        PROGRESS: 'hypnostudy_progress',
        FLASHCARD_PROGRESS: 'hypnostudy_flashcard_progress',
        QUIZ_HISTORY: 'hypnostudy_quiz_history',
        BOOKMARKS: 'hypnostudy_bookmarks',
        FIRST_VISIT: 'hypnostudy_first_visit',
        STUDY_SESSIONS: 'hypnostudy_study_sessions'
    },

    // Get data from localStorage
    get(key, defaultValue = null) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
        } catch (error) {
            console.error('Error reading from localStorage:', error);
            return defaultValue;
        }
    },

    // Set data to localStorage
    set(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (error) {
            console.error('Error writing to localStorage:', error);
            return false;
        }
    },

    // Remove data from localStorage
    remove(key) {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (error) {
            console.error('Error removing from localStorage:', error);
            return false;
        }
    },

    // Clear all app data
    clearAll() {
        try {
            Object.values(this.KEYS).forEach(key => {
                localStorage.removeItem(key);
            });
            return true;
        } catch (error) {
            console.error('Error clearing localStorage:', error);
            return false;
        }
    },

    // User Notes
    getUserNotes() {
        return this.get(this.KEYS.USER_NOTES, {});
    },

    saveUserNote(materialId, note) {
        const notes = this.getUserNotes();
        notes[materialId] = {
            content: note,
            lastModified: new Date().toISOString()
        };
        return this.set(this.KEYS.USER_NOTES, notes);
    },

    // Progress Tracking
    getProgress() {
        return this.get(this.KEYS.PROGRESS, {
            totalStudyTime: 0,
            sessionsCompleted: 0,
            quizzesCompleted: 0,
            averageQuizScore: 0,
            flashcardsReviewed: 0,
            scriptsRead: 0,
            currentStreak: 0,
            lastStudyDate: null,
            achievements: []
        });
    },

    updateProgress(updates) {
        const progress = this.getProgress();
        const updated = { ...progress, ...updates };
        return this.set(this.KEYS.PROGRESS, updated);
    },

    logStudySession(duration, type) {
        const sessions = this.get(this.KEYS.STUDY_SESSIONS, []);
        sessions.push({
            date: new Date().toISOString(),
            duration,
            type
        });
        this.set(this.KEYS.STUDY_SESSIONS, sessions);

        // Update overall progress
        const progress = this.getProgress();
        this.updateProgress({
            totalStudyTime: progress.totalStudyTime + duration,
            sessionsCompleted: progress.sessionsCompleted + 1,
            lastStudyDate: new Date().toISOString()
        });
    },

    getStudySessions() {
        return this.get(this.KEYS.STUDY_SESSIONS, []);
    },

    // Flashcard Progress
    getFlashcardProgress() {
        return this.get(this.KEYS.FLASHCARD_PROGRESS, {});
    },

    updateFlashcardProgress(cardId, correct) {
        const progress = this.getFlashcardProgress();
        if (!progress[cardId]) {
            progress[cardId] = {
                reviews: 0,
                correct: 0,
                lastReview: null,
                nextReview: null,
                interval: 1,
                easeFactor: 2.5
            };
        }

        const card = progress[cardId];
        card.reviews++;
        if (correct) card.correct++;
        card.lastReview = new Date().toISOString();

        // Simple spaced repetition (SM-2 algorithm)
        if (correct) {
            card.interval = Math.ceil(card.interval * card.easeFactor);
            card.easeFactor = Math.max(1.3, card.easeFactor + 0.1);
        } else {
            card.interval = 1;
            card.easeFactor = Math.max(1.3, card.easeFactor - 0.2);
        }

        const nextReview = new Date();
        nextReview.setDate(nextReview.getDate() + card.interval);
        card.nextReview = nextReview.toISOString();

        this.set(this.KEYS.FLASHCARD_PROGRESS, progress);

        // Update overall progress
        const overallProgress = this.getProgress();
        this.updateProgress({
            flashcardsReviewed: overallProgress.flashcardsReviewed + 1
        });

        return card;
    },

    // Quiz History
    getQuizHistory() {
        return this.get(this.KEYS.QUIZ_HISTORY, []);
    },

    saveQuizResult(quizId, score, totalQuestions, answers) {
        const history = this.getQuizHistory();
        history.push({
            quizId,
            score,
            totalQuestions,
            percentage: Math.round((score / totalQuestions) * 100),
            answers,
            date: new Date().toISOString()
        });
        this.set(this.KEYS.QUIZ_HISTORY, history);

        // Update overall progress
        const progress = this.getProgress();
        const allScores = history.map(h => h.percentage);
        const avgScore = allScores.reduce((a, b) => a + b, 0) / allScores.length;

        this.updateProgress({
            quizzesCompleted: progress.quizzesCompleted + 1,
            averageQuizScore: Math.round(avgScore)
        });
    },

    // Bookmarks
    getBookmarks() {
        return this.get(this.KEYS.BOOKMARKS, {
            scripts: [],
            materials: []
        });
    },

    toggleBookmark(type, id) {
        const bookmarks = this.getBookmarks();
        const list = bookmarks[type] || [];
        const index = list.indexOf(id);

        if (index > -1) {
            list.splice(index, 1);
        } else {
            list.push(id);
        }

        bookmarks[type] = list;
        this.set(this.KEYS.BOOKMARKS, bookmarks);
        return index === -1; // Return true if bookmarked, false if unbookmarked
    },

    isBookmarked(type, id) {
        const bookmarks = this.getBookmarks();
        const list = bookmarks[type] || [];
        return list.includes(id);
    },

    // First Visit
    isFirstVisit() {
        return this.get(this.KEYS.FIRST_VISIT, true);
    },

    setFirstVisitComplete() {
        this.set(this.KEYS.FIRST_VISIT, false);
    },

    // Export all data
    exportData() {
        const data = {};
        Object.entries(this.KEYS).forEach(([name, key]) => {
            data[name] = this.get(key);
        });
        return data;
    },

    // Import data
    importData(data) {
        try {
            Object.entries(data).forEach(([name, value]) => {
                const key = this.KEYS[name];
                if (key) {
                    this.set(key, value);
                }
            });
            return true;
        } catch (error) {
            console.error('Error importing data:', error);
            return false;
        }
    }
};
