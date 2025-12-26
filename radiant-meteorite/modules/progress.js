// Progress Tracking Module
const Progress = {
    render() {
        const progress = Storage.getProgress();
        const sessions = Storage.getStudySessions();
        const quizHistory = Storage.getQuizHistory();

        return `
            <div class="progress-page">
                <div class="page-header">
                    <h1 class="gradient-text">Your Progress</h1>
                        </div>

                <div class="stats-overview">
                    ${this.renderStatCard('Study Time', `${Math.floor(progress.totalStudyTime / 60)}h ${progress.totalStudyTime % 60}m`, '📚')}
                    ${this.renderStatCard('Sessions', progress.sessionsCompleted, '✅')}
                    ${this.renderStatCard('Quizzes', progress.quizzesCompleted, '🎯')}
                    ${this.renderStatCard('Avg Score', `${progress.averageQuizScore}%`, '⭐')}
                    ${this.renderStatCard('Flashcards', progress.flashcardsReviewed, '🎴')}
                    ${this.renderStatCard('Scripts Read', progress.scriptsRead, '📝')}
                </div>

                <div class="progress-charts">
                    <div class="card glass-card">
                        <h2>Recent Study Sessions</h2>
                        ${this.renderSessionsChart(sessions)}
                    </div>

                    <div class="card glass-card">
                        <h2>Quiz Performance</h2>
                        ${this.renderQuizChart(quizHistory)}
                    </div>
                </div>

                <div class="achievements-section card glass-card">
                    <h2>Achievements</h2>
                    ${this.renderAchievements(progress)}
                </div>
            </div>

            <style>
                .progress-page {
                    animation: fadeIn 0.3s ease-in;
                }

                .stats-overview {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
                    gap: var(--spacing-md);
                    margin-bottom: var(--spacing-xl);
                }

                .stat-card {
                    text-align: center;
                    padding: var(--spacing-md);
                }

                .stat-icon {
                    font-size: 2.5rem;
                    margin-bottom: var(--spacing-sm);
                }

                .stat-value {
                    font-size: 2rem;
                    font-weight: 700;
                    background: var(--gradient-primary);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                    margin-bottom: var(--spacing-xs);
                }

                .stat-label {
                    color: var(--text-secondary);
                    font-size: 0.875rem;
                }

                .progress-charts {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                    gap: var(--spacing-md);
                    margin-bottom: var(--spacing-lg);
                }

                .progress-charts .card {
                    padding: var(--spacing-lg);
                }

                .progress-charts h2 {
                    margin-bottom: var(--spacing-md);
                    font-size: 1.25rem;
                }

                .sessions-list {
                    display: flex;
                    flex-direction: column;
                    gap: var(--spacing-sm);
                }

                .session-item {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: var(--spacing-sm);
                    background: var(--bg-tertiary);
                    border-radius: var(--radius-sm);
                }

                .session-type {
                    font-weight: 500;
                    text-transform: capitalize;
                }

                .session-duration {
                    color: var(--primary-light);
                    font-weight: 600;
                }

                .quiz-chart {
                    display: flex;
                    flex-direction: column;
                    gap: var(--spacing-sm);
                }

                .quiz-bar {
                    display: flex;
                    align-items: center;
                    gap: var(--spacing-sm);
                }

                .quiz-label {
                    min-width: 100px;
                    font-size: 0.875rem;
                }

                .quiz-bar-fill {
                    flex: 1;
                    height: 24px;
                    background: var(--bg-tertiary);
                    border-radius: var(--radius-sm);
                    overflow: hidden;
                    position: relative;
                }

                .quiz-bar-inner {
                    height: 100%;
                    background: var(--gradient-primary);
                    transition: width var(--transition-slow);
                }

                .quiz-score {
                    position: absolute;
                    right: var(--spacing-xs);
                    top: 50%;
                    transform: translateY(-50%);
                    font-weight: 600;
                    font-size: 0.875rem;
                }

                .achievements-section {
                    padding: var(--spacing-lg);
                }

                .achievements-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
                    gap: var(--spacing-md);
                    margin-top: var(--spacing-md);
                }

                .achievement-item {
                    text-align: center;
                    padding: var(--spacing-md);
                    background: var(--bg-tertiary);
                    border-radius: var(--radius-md);
                    border: 2px solid transparent;
                    transition: all var(--transition-base);
                }

                .achievement-item.unlocked {
                    border-color: var(--primary);
                    background: var(--gradient-card), var(--bg-tertiary);
                }

                .achievement-item.locked {
                    opacity: 0.5;
                }

                .achievement-icon {
                    font-size: 2.5rem;
                    margin-bottom: var(--spacing-xs);
                    filter: grayscale(100%);
                }

                .achievement-item.unlocked .achievement-icon {
                    filter: grayscale(0%);
                }

                .achievement-title {
                    font-weight: 600;
                    margin-bottom: var(--spacing-xs);
                }

                .achievement-desc {
                    font-size: 0.875rem;
                    color: var(--text-tertiary);
                }

                .empty-state {
                    text-align: center;
                    padding: var(--spacing-xl);
                    color: var(--text-tertiary);
                }

                @media (max-width: 768px) {
                    .stats-overview {
                        grid-template-columns: repeat(2, 1fr);
                    }

                    .progress-charts {
                        grid-template-columns: 1fr;
                    }
                }
            </style>
        `;
    },

    renderStatCard(label, value, icon) {
        return `
            <div class="card stat-card card-gradient">
                <div class="stat-icon">${icon}</div>
                <div class="stat-value">${value}</div>
                <div class="stat-label">${label}</div>
            </div>
        `;
    },

    renderSessionsChart(sessions) {
        const recentSessions = sessions.slice(-5).reverse();

        if (recentSessions.length === 0) {
            return '<div class="empty-state">No study sessions yet. Start learning to see your progress! </div>';
        }

        return `
            <div class="sessions-list">
                ${recentSessions.map(session => {
            const date = new Date(session.date);
            const timeAgo = this.getTimeAgo(date);
            const type = session.type.replace(/-/g, ' ');

            return `
                        <div class="session-item">
                            <div>
                                <div class="session-type">${type}</div>
                                <div class="text-tertiary" style="font-size: 0.75rem;">${timeAgo}</div>
                            </div>
                            <div class="session-duration">${session.duration}m</div>
                        </div>
                    `;
        }).join('')}
            </div>
        `;
    },

    renderQuizChart(quizHistory) {
        const recentQuizzes = quizHistory.slice(-5).reverse();

        if (recentQuizzes.length === 0) {
            return '<div class="empty-state">No quizzes completed yet. Take a quiz to test your knowledge!</div>';
        }

        return `
            <div class="quiz-chart">
                ${recentQuizzes.map(quiz => {
            const quizData = Content.quizzes.find(q => q.id === quiz.quizId);
            const quizName = quizData ? quizData.title.substring(0, 20) : 'Quiz';

            return `
                        <div class="quiz-bar">
                            <div class="quiz-label">${quizName}</div>
                            <div class="quiz-bar-fill">
                                <div class="quiz-bar-inner" style="width: ${quiz.percentage}%"></div>
                                <div class="quiz-score">${quiz.percentage}%</div>
                            </div>
                        </div>
                    `;
        }).join('')}
            </div>
        `;
    },

    renderAchievements(progress) {
        const achievements = [
            {
                id: 'first-session',
                icon: '🎯',
                title: 'First Steps',
                description: 'Complete your first study session',
                unlocked: progress.sessionsCompleted >= 1
            },
            {
                id: 'quiz-master',
                icon: '🏆',
                title: 'Quiz Master',
                description: 'Complete 5 quizzes',
                unlocked: progress.quizzesCompleted >= 5
            },
            {
                id: 'perfect-score',
                icon: '💯',
                title: 'Perfect Score',
                description: 'Score 100% on a quiz',
                unlocked: progress.averageQuizScore === 100
            },
            {
                id: 'flashcard-fan',
                icon: '🎴',
                title: 'Flashcard Fan',
                description: 'Review 50 flashcards',
                unlocked: progress.flashcardsReviewed >= 50
            },
            {
                id: 'dedicated-learner',
                icon: '📚',
                title: 'Dedicated Learner',
                description: 'Study for 5 hours total',
                unlocked: progress.totalStudyTime >= 300
            },
            {
                id: 'script-reader',
                icon: '📝',
                title: 'Script Reader',
                description: 'Read 10 practice scripts',
                unlocked: progress.scriptsRead >= 10
            }
        ];

        return `
            <div class="achievements-grid">
                ${achievements.map(achievement => `
                    <div class="achievement-item ${achievement.unlocked ? 'unlocked' : 'locked'}">
                        <div class="achievement-icon">${achievement.icon}</div>
                        <div class="achievement-title">${achievement.title}</div>
                        <div class="achievement-desc">${achievement.description}</div>
                    </div>
                `).join('')}
            </div>
        `;
    },

    getTimeAgo(date) {
        const seconds = Math.floor((new Date() - date) / 1000);

        if (seconds < 60) return 'Just now';
        if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
        if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
        if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;

        return date.toLocaleDateString();
    }
};





