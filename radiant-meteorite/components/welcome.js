// Welcome/Onboarding Component
const Welcome = {
    render() {
        return `
            <div class="welcome-screen fade-in">
                <div class="welcome-content">
                    <div class="welcome-header">
                        <div class="welcome-icon">
                            <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="50" cy="50" r="45" stroke="url(#gradient)" stroke-width="3"/>
                                <path d="M50 20 Q30 50 50 80 Q70 50 50 20" fill="url(#gradient)" opacity="0.3"/>
                                <circle cx="50" cy="50" r="8" fill="url(#gradient)"/>
                                <defs>
                                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                        <stop offset="0%" style="stop-color:hsl(260, 60%, 55%);stop-opacity:1" />
                                        <stop offset="100%" style="stop-color:hsl(220, 70%, 55%);stop-opacity:1" />
                                    </linearGradient>
                                </defs>
                            </svg>
                        </div>
                        <h1 class="gradient-text">Welcome to HypnoStudy</h1>
                        <p class="text-secondary">Your comprehensive companion for mastering hypnosis</p><p class="text-secondary"><a href="https://hypnotherapyandpsychotherapy.teachable.com/p/home" target="_blank">You can go straight to the full course here</a></p>
                    </div>

                    <div class="welcome-features">
                        <div class="feature-card card-gradient">
                            <div class="feature-icon">📚</div>
                            <h3>Study Materials</h3>
                            <p>Comprehensive guides on hypnosis theory and practice with personal note-taking</p>
                        </div>

                        <div class="feature-card card-gradient">
                            <div class="feature-icon">🎴</div>
                            <h3>Smart Flashcards</h3>
                            <p>Spaced repetition system to help you memorize techniques and terminology</p>
                        </div>

                        <div class="feature-card card-gradient">
                            <div class="feature-icon">📝</div>
                            <h3>Practice Scripts</h3>
                            <p>Professional induction and deepening scripts to practice and perfect your delivery</p>
                        </div>

                        <div class="feature-card card-gradient">
                            <div class="feature-icon">📊</div>
                            <h3>Progress Tracking</h3>
                            <p>Monitor your study time, quiz scores, and learning achievements</p>
                        </div>

                        <div class="feature-card card-gradient">
                            <div class="feature-icon">✅</div>
                            <h3>Knowledge Quizzes</h3>
                            <p>Test your understanding with comprehensive quizzes on all topics</p>
                        </div>

                        <div class="feature-card card-gradient">
                            <div class="feature-icon">📖</div>
                            <h3>Quick Reference</h3>
                            <p>Searchable glossary of hypnosis terms and techniques</p>
                        </div>
                    </div>

                    <div class="welcome-footer">
                        <div class="offline-badge">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                <circle cx="12" cy="12" r="3"></circle>
                            </svg>
                            <span>Works 100% offline</span>
                        </div>
                        <button class="btn btn-primary btn-large" onclick="Welcome.start()">
                            Start Learning
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <line x1="5" y1="12" x2="19" y2="12"></line>
                                <polyline points="12 5 19 12 12 19"></polyline>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            <style>
                .welcome-screen {
                    min-height: calc(100vh - var(--nav-height));
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: var(--spacing-md);
                }

                .welcome-content {
                    max-width: 900px;
                    width: 100%;
                }

                .welcome-header {
                    text-align: center;
                    margin-bottom: var(--spacing-xl);
                }

                .welcome-icon {
                    width: 100px;
                    height: 100px;
                    margin: 0 auto var(--spacing-md);
                }

                .welcome-icon svg {
                    width: 100%;
                    height: 100%;
                    filter: drop-shadow(0 0 20px rgba(124, 58, 237, 0.5));
                }

                .welcome-header h1 {
                    font-size: 2.5rem;
                    margin-bottom: var(--spacing-sm);
                }

                .welcome-header p {
                    font-size: 1.125rem;
                }

                .welcome-features {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                    gap: var(--spacing-md);
                    margin-bottom: var(--spacing-xl);
                }

                .feature-card {
                    text-align: center;
                    padding: var(--spacing-md);
                }

                .feature-icon {
                    font-size: 2.5rem;
                    margin-bottom: var(--spacing-sm);
                }

                .feature-card h3 {
                    font-size: 1.125rem;
                    margin-bottom: var(--spacing-xs);
                }

                .feature-card p {
                    font-size: 0.875rem;
                    color: var(--text-secondary);
                    line-height: 1.5;
                }

                .welcome-footer {
                    text-align: center;
                }

                .offline-badge {
                    display: inline-flex;
                    align-items: center;
                    gap: var(--spacing-xs);
                    padding: var(--spacing-xs) var(--spacing-md);
                    background: var(--bg-tertiary);
                    border-radius: 999px;
                    margin-bottom: var(--spacing-md);
                    color: var(--primary-light);
                }

                .btn-large {
                    padding: 1rem 2rem;
                    font-size: 1.125rem;
                }

                @media (max-width: 768px) {
                    .welcome-header h1 {
                        font-size: 2rem;
                    }

                    .welcome-features {
                        grid-template-columns: 1fr;
                    }
                }
            </style>
        `;
    },

    start() {
        Storage.setFirstVisitComplete();
        App.navigate('home');
    }
};

