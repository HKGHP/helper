// Main Application Controller
const App = {
    currentPage: 'home',

    init() {
        // Hide loading screen
        setTimeout(() => {
            document.getElementById('loading-screen').classList.add('hidden');
        }, 1000);

        // Initialize navigation
        Navigation.init();

        // Check if first visit
        if (Storage.isFirstVisit()) {
            this.showWelcome();
        } else {
            this.navigate('home');
        }
    },

    showWelcome() {
        const mainContent = document.getElementById('main-content');
        mainContent.innerHTML = Welcome.render();
        document.getElementById('bottom-nav').style.display = 'none';
    },

    navigate(page) {
        this.currentPage = page;
        const mainContent = document.getElementById('main-content');
        document.getElementById('bottom-nav').style.display = 'flex';

        // Update navigation active state
        Navigation.setActive(page);

        // Render appropriate page
        switch (page) {
            case 'home':
                mainContent.innerHTML = this.renderHome();
                break;
            case 'flashcards':
                mainContent.innerHTML = Flashcards.render();
                break;
            case 'scripts':
                mainContent.innerHTML = Scripts.render();
                break;
            case 'quiz':
                mainContent.innerHTML = Quiz.render();
                break;
            case 'progress':
                mainContent.innerHTML = Progress.render();
                break;
            case 'reference':
                mainContent.innerHTML = Reference.render();
                break;
            default:
                mainContent.innerHTML = this.renderHome();
        }

        // Scroll to top
        window.scrollTo(0, 0);
    },

    renderHome() {
        const progress = Storage.getProgress();
        const materials = Content.studyMaterials;
        const decks = Content.flashcardDecks;
        const scripts = Content.practiceScripts;
        const quizzes = Content.quizzes;

        return `
            <div class="home-page fade-in">
                <div class="welcome-banner card-gradient card">
                    <h1 class="gradient-text">Welcome to HypnoStudy</h1>
                    <p class="text-secondary"><a href="https://hypnotherapyandpsychotherapy.teachable.com" target="_blank">You can go straight to the full course here</a></p>
                </div>

                <div class="quick-stats">
                    <div class="stat-card-small card glass-card">
                        <div class="stat-icon-small">📚</div>
                        <div>
                            <div class="stat-value-small">${Math.floor(progress.totalStudyTime / 60)}h ${progress.totalStudyTime % 60}m</div>
                            <div class="stat-label-small">Study Time</div>
                        </div>
                    </div>
                    <div class="stat-card-small card glass-card">
                        <div class="stat-icon-small">🎯</div>
                        <div>
                            <div class="stat-value-small">${progress.quizzesCompleted}</div>
                            <div class="stat-label-small">Quizzes Done</div>
                        </div>
                    </div>
                    <div class="stat-card-small card glass-card">
                        <div class="stat-icon-small">⭐</div>
                        <div>
                            <div class="stat-value-small">${progress.averageQuizScore}%</div>
                            <div class="stat-label-small">Avg Score</div>
                        </div>
                    </div>
                </div>

                <div class="home-sections">
                    <section class="home-section">
                        <div class="section-header">
                            <h2>Study Materials</h2>
                            <button class="btn btn-ghost btn-sm" onclick="App.navigate('home')">View All</button>
                        </div>
                        <div class="home-grid">
                            ${materials.slice(0, 3).map(material => `
                                <div class="card card-gradient home-card" onclick="StudyMaterials.viewMaterial('${material.id}')">
                                    <span class="badge badge-primary">${material.category}</span>
                                    <h3>${material.title}</h3>
                                </div>
                            `).join('')}
                        </div>
                    </section>

                    <section class="home-section">
                        <div class="section-header">
                            <h2>Flashcard Decks</h2>
                            <button class="btn btn-ghost btn-sm" onclick="App.navigate('flashcards')">View All</button>
                        </div>
                        <div class="home-grid">
                            ${decks.map(deck => `
                                <div class="card card-gradient home-card" onclick="Flashcards.startDeck('${deck.id}')">
                                    <div class="flex justify-between items-center mb-sm">
                                        <span class="badge badge-primary">${deck.cards.length} cards</span>
                                        <span>🎴</span>
                                    </div>
                                    <h3>${deck.title}</h3>
                                </div>
                            `).join('')}
                        </div>
                    </section>

                    <section class="home-section">
                        <div class="section-header">
                            <h2>Practice Scripts</h2>
                            <button class="btn btn-ghost btn-sm" onclick="App.navigate('scripts')">View All</button>
                        </div>
                        <div class="home-grid">
                            ${scripts.slice(0, 3).map(script => `
                                <div class="card card-gradient home-card" onclick="Scripts.viewScript('${script.id}')">
                                    <div class="flex justify-between items-center mb-sm">
                                        <span class="badge badge-primary">${script.difficulty}</span>
                                        <span>📝</span>
                                    </div>
                                    <h3>${script.title}</h3>
                                    <p class="text-tertiary" style="font-size: 0.875rem;">${script.duration}</p>
                                </div>
                            `).join('')}
                        </div>
                    </section>

                    <section class="home-section">
                        <div class="section-header">
                            <h2>Test Your Knowledge</h2>
                            <button class="btn btn-ghost btn-sm" onclick="App.navigate('quiz')">View All</button>
                        </div>
                        <div class="home-grid">
                            ${quizzes.map(quiz => `
                                <div class="card card-gradient home-card" onclick="Quiz.startQuiz('${quiz.id}')">
                                    <div class="flex justify-between items-center mb-sm">
                                        <span class="badge badge-primary">${quiz.questions.length} questions</span>
                                        <span>❓</span>
                                    </div>
                                    <h3>${quiz.title}</h3>
                                </div>
                            `).join('')}
                        </div>
                    </section>

                    <section class="home-section">
                        <div class="section-header">
                            <h2>Quick Actions</h2>
                        </div>
                        <div class="quick-actions">
                            <button class="btn btn-primary" onclick="App.navigate('progress')">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <line x1="18" y1="20" x2="18" y2="10"></line>
                                    <line x1="12" y1="20" x2="12" y2="4"></line>
                                    <line x1="6" y1="20" x2="6" y2="14"></line>
                                </svg>
                                View Progress
                            </button>
                            <button class="btn btn-secondary" onclick="App.navigate('reference')">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <circle cx="11" cy="11" r="8"></circle>
                                    <path d="m21 21-4.35-4.35"></path>
                                </svg>
                                Search Reference
                            </button>
                        </div>
                    </section>
                </div>
            </div>

            <style>
                .home-page {
                    max-width: 1200px;
                    margin: 0 auto;
                }

                .welcome-banner {
                    text-align: center;
                    padding: var(--spacing-xl);
                    margin-bottom: var(--spacing-lg);
                }

                .welcome-banner h1 {
                    font-size: 2rem;
                    margin-bottom: var(--spacing-sm);
                }

                .quick-stats {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
                    gap: var(--spacing-md);
                    margin-bottom: var(--spacing-xl);
                }

                .stat-card-small {
                    display: flex;
                    align-items: center;
                    gap: var(--spacing-sm);
                    padding: var(--spacing-md);
                }

                .stat-icon-small {
                    font-size: 2rem;
                }

                .stat-value-small {
                    font-size: 1.5rem;
                    font-weight: 700;
                    color: var(--primary-light);
                }

                .stat-label-small {
                    font-size: 0.75rem;
                    color: var(--text-tertiary);
                }

                .home-sections {
                    display: flex;
                    flex-direction: column;
                    gap: var(--spacing-xl);
                }

                .home-section {
                    animation: fadeIn 0.3s ease-in;
                }

                .section-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: var(--spacing-md);
                }

                .section-header h2 {
                    font-size: 1.5rem;
                    color: var(--primary-light);
                }

                .btn-sm {
                    padding: 0.5rem 1rem;
                    font-size: 0.875rem;
                }

                .home-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
                    gap: var(--spacing-md);
                }

                .home-card {
                    cursor: pointer;
                    padding: var(--spacing-md);
                }

                .home-card h3 {
                    font-size: 1.125rem;
                    margin-bottom: 0;
                }

                .quick-actions {
                    display: flex;
                    gap: var(--spacing-md);
                    flex-wrap: wrap;
                }

                .quick-actions .btn {
                    flex: 1;
                    min-width: 200px;
                }

                @media (max-width: 768px) {
                    .welcome-banner h1 {
                        font-size: 1.5rem;
                    }

                    .home-grid {
                        grid-template-columns: 1fr;
                    }

                    .quick-actions {
                        flex-direction: column;
                    }

                    .quick-actions .btn {
                        width: 100%;
                    }
                }
            </style>
        `;
    }
};

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});
