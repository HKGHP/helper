// Practice Scripts Module
const Scripts = {
    currentScript: null,
    timerInterval: null,
    timerSeconds: 0,

    render() {
        const scripts = Content.practiceScripts;
        const categories = [...new Set(scripts.map(s => s.category))];

        return `
            <div class="scripts-page">
                <div class="page-header">
                    <h1 class="gradient-text">Practice Scripts</h1>
                    <p class="text-secondary">Professional scripts to perfect your delivery</p><p class="text-secondary"><a href="https://hypnotherapyandpsychotherapy.teachable.com" target="_blank">You can go straight to the full course here</a></p>
                </div>

                ${categories.map(category => `
                    <div class="script-category mb-md">
                        <h2>${category}</h2>
                        <div class="scripts-grid">
                            ${scripts.filter(s => s.category === category).map(script => this.renderScriptCard(script)).join('')}
                        </div>
                    </div>
                `).join('')}
            </div>

            <style>
                .scripts-page {
                    animation: fadeIn 0.3s ease-in;
                }

                .script-category h2 {
                    color: var(--primary-light);
                    font-size: 1.25rem;
                    margin-bottom: var(--spacing-md);
                }

                .scripts-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
                    gap: var(--spacing-md);
                }

                .script-card {
                    cursor: pointer;
                }

                .script-meta {
                    display: flex;
                    gap: var(--spacing-md);
                    margin-top: var(--spacing-sm);
                    flex-wrap: wrap;
                }

                .script-meta-item {
                    display: flex;
                    align-items: center;
                    gap: var(--spacing-xs);
                    font-size: 0.875rem;
                    color: var(--text-secondary);
                }

                .difficulty-beginner { color: hsl(142, 71%, 65%); }
                .difficulty-intermediate { color: hsl(38, 92%, 70%); }
                .difficulty-advanced { color: hsl(0, 71%, 65%); }
            </style>
        `;
    },

    renderScriptCard(script) {
        const isBookmarked = Storage.isBookmarked('scripts', script.id);
        const difficultyClass = `difficulty-${script.difficulty.toLowerCase()}`;

        return `
            <div class="card script-card card-gradient" onclick="Scripts.viewScript('${script.id}')">
                <div class="flex justify-between items-center mb-sm">
                    <h3>${script.title}</h3>
                    <button class="btn btn-icon btn-ghost" onclick="event.stopPropagation(); Scripts.toggleBookmark('${script.id}')">
                        ${isBookmarked ? '⭐' : '☆'}
                    </button>
                </div>
                <div class="script-meta">
                    <div class="script-meta-item">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <circle cx="12" cy="12" r="10"></circle>
                            <polyline points="12 6 12 12 16 14"></polyline>
                        </svg>
                        ${script.duration}
                    </div>
                    <div class="script-meta-item ${difficultyClass}">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
                            <path d="M2 17l10 5 10-5"></path>
                            <path d="M2 12l10 5 10-5"></path>
                        </svg>
                        ${script.difficulty}
                    </div>
                </div>
            </div>
        `;
    },

    viewScript(id) {
        this.currentScript = Content.practiceScripts.find(s => s.id === id);
        if (this.currentScript) {
            this.renderScriptView();
        }
    },

    renderScriptView() {
        const script = this.currentScript;
        const isBookmarked = Storage.isBookmarked('scripts', script.id);

        const content = `
            <div class="script-view fade-in">
                <div class="script-header">
                    <button class="btn btn-ghost" onclick="Scripts.backToList()">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <line x1="19" y1="12" x2="5" y2="12"></line>
                            <polyline points="12 19 5 12 12 5"></polyline>
                        </svg>
                        Back
                    </button>
                    <button class="btn btn-ghost" onclick="Scripts.toggleBookmark('${script.id}')">
                        ${isBookmarked ? '⭐ Bookmarked' : '☆ Bookmark'}
                    </button>
                </div>

                <div class="script-title-section">
                    <h1 class="gradient-text">${script.title}</h1>
                    <div class="script-meta">
                        <span class="badge badge-primary">${script.category}</span>
                        <span class="badge badge-primary">${script.duration}</span>
                        <span class="badge badge-primary">${script.difficulty}</span>
                    </div>
                </div>

                <div class="practice-timer card glass-card">
                    <div class="timer-display">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <circle cx="12" cy="12" r="10"></circle>
                            <polyline points="12 6 12 12 16 14"></polyline>
                        </svg>
                        <span id="timer-display">00:00</span>
                    </div>
                    <div class="timer-controls">
                        <button class="btn btn-primary" id="timer-btn" onclick="Scripts.toggleTimer()">
                            Start Practice
                        </button>
                        <button class="btn btn-secondary" onclick="Scripts.resetTimer()">Reset</button>
                    </div>
                </div>

                <div class="script-content card">
                    ${this.parseScriptMarkdown(script.script)}
                </div>
            </div>

            <style>
                .script-view {
                    max-width: 800px;
                    margin: 0 auto;
                }

                .script-header {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: var(--spacing-md);
                }

                .script-title-section {
                    margin-bottom: var(--spacing-lg);
                }

                .script-title-section h1 {
                    margin-bottom: var(--spacing-sm);
                }

                .practice-timer {
                    padding: var(--spacing-md);
                    margin-bottom: var(--spacing-lg);
                    text-align: center;
                }

                .timer-display {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: var(--spacing-sm);
                    font-size: 2rem;
                    font-weight: 700;
                    color: var(--primary-light);
                    margin-bottom: var(--spacing-md);
                }

                .timer-controls {
                    display: flex;
                    gap: var(--spacing-sm);
                    justify-content: center;
                }

                .script-content {
                    padding: var(--spacing-xl);
                    font-family: var(--font-script);
                    font-size: 1.125rem;
                    line-height: 2;
                    background: var(--bg-secondary);
                }

                .script-content h1 {
                    font-family: var(--font-primary);
                    color: var(--primary-light);
                    font-size: 1.75rem;
                    margin: var(--spacing-lg) 0 var(--spacing-md);
                    text-align: center;
                }

                .script-content h2 {
                    font-family: var(--font-primary);
                    color: var(--primary-light);
                    font-size: 1.25rem;
                    margin: var(--spacing-md) 0 var(--spacing-sm);
                }

                .script-content h3 {
                    font-family: var(--font-primary);
                    color: var(--text-primary);
                    font-size: 1.125rem;
                    margin: var(--spacing-sm) 0;
                }

                .script-content p {
                    margin-bottom: var(--spacing-md);
                }

                .script-content em {
                    color: var(--text-tertiary);
                    font-style: italic;
                }

                .script-content strong {
                    color: var(--primary-light);
                    font-weight: 700;
                }

                .script-content hr {
                    border: none;
                    border-top: 1px solid hsla(0, 0%, 100%, 0.1);
                    margin: var(--spacing-lg) 0;
                }

                .script-content ul {
                    margin-left: var(--spacing-lg);
                    margin-bottom: var(--spacing-md);
                }

                @media (max-width: 768px) {
                    .script-content {
                        padding: var(--spacing-md);
                        font-size: 1rem;
                    }

                    .timer-controls {
                        flex-direction: column;
                    }
                }
            </style>
        `;

        document.getElementById('main-content').innerHTML = content;
    },

    parseScriptMarkdown(text) {
        return text
            .replace(/^# (.*$)/gim, '<h1>$1</h1>')
            .replace(/^## (.*$)/gim, '<h2>$1</h2>')
            .replace(/^### (.*$)/gim, '<h3>$1</h3>')
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/^---$/gim, '<hr>')
            .replace(/^- (.*$)/gim, '<li>$1</li>')
            .replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>')
            .replace(/\n\n/g, '</p><p>')
            .replace(/^(?!<[hul])(.*$)/gim, '<p>$1</p>')
            .replace(/<p><\/p>/g, '')
            .replace(/<p>(<[hul])/g, '$1')
            .replace(/(<\/[hul][^>]*>)<\/p>/g, '$1');
    },

    toggleTimer() {
        if (this.timerInterval) {
            this.stopTimer();
        } else {
            this.startTimer();
        }
    },

    startTimer() {
        const btn = document.getElementById('timer-btn');
        btn.textContent = 'Pause';

        this.timerInterval = setInterval(() => {
            this.timerSeconds++;
            this.updateTimerDisplay();
        }, 1000);
    },

    stopTimer() {
        const btn = document.getElementById('timer-btn');
        btn.textContent = 'Resume';

        clearInterval(this.timerInterval);
        this.timerInterval = null;

        // Log study session
        if (this.timerSeconds > 0) {
            Storage.logStudySession(Math.floor(this.timerSeconds / 60), 'scripts');
            const progress = Storage.getProgress();
            Storage.updateProgress({
                scriptsRead: progress.scriptsRead + 1
            });
        }
    },

    resetTimer() {
        clearInterval(this.timerInterval);
        this.timerInterval = null;
        this.timerSeconds = 0;
        this.updateTimerDisplay();

        const btn = document.getElementById('timer-btn');
        if (btn) btn.textContent = 'Start Practice';
    },

    updateTimerDisplay() {
        const minutes = Math.floor(this.timerSeconds / 60);
        const seconds = this.timerSeconds % 60;
        const display = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

        const timerDisplay = document.getElementById('timer-display');
        if (timerDisplay) {
            timerDisplay.textContent = display;
        }
    },

    toggleBookmark(id) {
        Storage.toggleBookmark('scripts', id);
        if (this.currentScript && this.currentScript.id === id) {
            this.renderScriptView();
        } else {
            App.navigate('scripts');
        }
    },

    backToList() {
        this.resetTimer();
        this.currentScript = null;
        App.navigate('scripts');
    }
};
