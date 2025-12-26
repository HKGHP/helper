// Flashcards Module with Spaced Repetition
const Flashcards = {
    currentDeck: null,
    currentCardIndex: 0,
    isFlipped: false,
    sessionCards: [],

    render() {
        const decks = Content.flashcardDecks;

        return `
            <div class="flashcards-page">
                <div class="page-header">
                    <h1 class="gradient-text">Flashcards</h1>
                        </div>

                <div class="decks-grid">
                    ${decks.map(deck => this.renderDeckCard(deck)).join('')}
                </div>

                <div class="flashcard-stats card glass-card mt-md">
                    <h3>Your Progress</h3>
                    <div class="stats-grid">
                        ${this.renderStats()}
                    </div>
                </div>
            </div>

            <style>
                .flashcards-page {
                    animation: fadeIn 0.3s ease-in;
                }

                .decks-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
                    gap: var(--spacing-md);
                    margin-bottom: var(--spacing-lg);
                }

                .deck-card {
                    cursor: pointer;
                    position: relative;
                    overflow: hidden;
                }

                .deck-card::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    height: 4px;
                    background: var(--gradient-primary);
                }

                .deck-card h3 {
                    margin-bottom: var(--spacing-xs);
                }

                .deck-info {
                    display: flex;
                    justify-content: space-between;
                    margin-top: var(--spacing-sm);
                    padding-top: var(--spacing-sm);
                    border-top: 1px solid hsla(0, 0%, 100%, 0.1);
                }

                .deck-info-item {
                    text-align: center;
                }

                .deck-info-value {
                    font-size: 1.5rem;
                    font-weight: 700;
                    color: var(--primary-light);
                }

                .deck-info-label {
                    font-size: 0.75rem;
                    color: var(--text-tertiary);
                }

                .stats-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
                    gap: var(--spacing-md);
                    margin-top: var(--spacing-md);
                }

                .stat-item {
                    text-align: center;
                }

                .stat-value {
                    font-size: 2rem;
                    font-weight: 700;
                    background: var(--gradient-primary);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                }

                .stat-label {
                    color: var(--text-secondary);
                    font-size: 0.875rem;
                }
            </style>
        `;
    },

    renderDeckCard(deck) {
        const progress = this.getDeckProgress(deck);
        return `
            <div class="card deck-card card-gradient" onclick="Flashcards.startDeck('${deck.id}')">
                <h3>${deck.title}</h3>
                <p class="text-secondary">${deck.description}</p>
                <div class="deck-info">
                    <div class="deck-info-item">
                        <div class="deck-info-value">${deck.cards.length}</div>
                        <div class="deck-info-label">Cards</div>
                    </div>
                    <div class="deck-info-item">
                        <div class="deck-info-value">${progress.mastered}</div>
                        <div class="deck-info-label">Mastered</div>
                    </div>
                    <div class="deck-info-item">
                        <div class="deck-info-value">${progress.dueToday}</div>
                        <div class="deck-info-label">Due Today</div>
                    </div>
                </div>
            </div>
        `;
    },

    getDeckProgress(deck) {
        const cardProgress = Storage.getFlashcardProgress();
        let mastered = 0;
        let dueToday = 0;

        deck.cards.forEach(card => {
            const progress = cardProgress[card.id];
            if (progress) {
                const accuracy = progress.correct / progress.reviews;
                if (accuracy >= 0.8 && progress.reviews >= 3) {
                    mastered++;
                }

                if (progress.nextReview) {
                    const nextReview = new Date(progress.nextReview);
                    const today = new Date();
                    if (nextReview <= today) {
                        dueToday++;
                    }
                }
            } else {
                dueToday++; // New cards are due
            }
        });

        return { mastered, dueToday };
    },

    renderStats() {
        const progress = Storage.getProgress();
        const cardProgress = Storage.getFlashcardProgress();
        const totalReviews = Object.values(cardProgress).reduce((sum, card) => sum + card.reviews, 0);
        const totalCorrect = Object.values(cardProgress).reduce((sum, card) => sum + card.correct, 0);
        const accuracy = totalReviews > 0 ? Math.round((totalCorrect / totalReviews) * 100) : 0;

        return `
            <div class="stat-item">
                <div class="stat-value">${progress.flashcardsReviewed}</div>
                <div class="stat-label">Cards Reviewed</div>
            </div>
            <div class="stat-item">
                <div class="stat-value">${accuracy}%</div>
                <div class="stat-label">Accuracy</div>
            </div>
            <div class="stat-item">
                <div class="stat-value">${Object.keys(cardProgress).length}</div>
                <div class="stat-label">Cards Studied</div>
            </div>
        `;
    },

    startDeck(deckId) {
        this.currentDeck = Content.flashcardDecks.find(d => d.id === deckId);
        this.currentCardIndex = 0;
        this.isFlipped = false;
        this.sessionCards = [...this.currentDeck.cards];
        this.renderCard();
    },

    renderCard() {
        if (this.currentCardIndex >= this.sessionCards.length) {
            this.renderComplete();
            return;
        }

        const card = this.sessionCards[this.currentCardIndex];
        const cardProgress = Storage.getFlashcardProgress()[card.id];
        const reviewCount = cardProgress?.reviews || 0;
        const accuracy = cardProgress ? Math.round((cardProgress.correct / cardProgress.reviews) * 100) : 0;

        const content = `
            <div class="flashcard-view fade-in">
                <div class="flashcard-header">
                    <button class="btn btn-ghost" onclick="Flashcards.exitDeck()">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                        Exit
                    </button>
                    <div class="flashcard-progress">
                        <span>${this.currentCardIndex + 1} / ${this.sessionCards.length}</span>
                    </div>
                </div>

                <h2 class="text-center mb-md">${this.currentDeck.title}</h2>

                <div class="flashcard-container">
                    <div class="flashcard" onclick="Flashcards.flipCard()">
                        ${!this.isFlipped ? `
                            <div class="flashcard-side flashcard-front">
                                <div class="card-label">Question</div>
                                <div class="card-text">${card.front}</div>
                                <div class="card-hint">Tap to reveal answer</div>
                            </div>
                        ` : `
                            <div class="flashcard-side flashcard-back">
                                <div class="card-label">Answer</div>
                                <div class="card-text">${card.back}</div>
                            </div>
                        `}
                    </div>
                </div>

                ${this.isFlipped ? `
                    <div class="flashcard-actions slide-up">
                        <p class="text-center text-secondary mb-sm">How well did you know this?</p>
                        <div class="action-buttons">
                            <button class="btn btn-secondary" onclick="Flashcards.answerCard(false)">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <line x1="18" y1="6" x2="6" y2="18"></line>
                                    <line x1="6" y1="6" x2="18" y2="18"></line>
                                </svg>
                                Didn't Know
                            </button>
                            <button class="btn btn-primary" onclick="Flashcards.answerCard(true)">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <polyline points="20 6 9 17 4 12"></polyline>
                                </svg>
                                Knew It
                            </button>
                        </div>
                    </div>
                ` : ''}

                <div class="card-stats glass-card mt-md">
                    <div class="stat-row">
                        <span>Reviews:</span>
                        <strong>${reviewCount}</strong>
                    </div>
                    <div class="stat-row">
                        <span>Accuracy:</span>
                        <strong>${accuracy}%</strong>
                    </div>
                </div>
            </div>

            <style>
                .flashcard-view {
                    max-width: 600px;
                    margin: 0 auto;
                }

                .flashcard-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: var(--spacing-lg);
                }

                .flashcard-progress {
                    font-weight: 600;
                    color: var(--primary-light);
                }

                .flashcard-container {
                    margin-bottom: var(--spacing-lg);
                }

                .flashcard {
                    width: 100%;
                    min-height: 400px;
                    cursor: pointer;
                    transition: transform 0.3s ease;
                }

                .flashcard:hover {
                    transform: translateY(-4px);
                }

                .flashcard-side {
                    width: 100%;
                    min-height: 400px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    padding: var(--spacing-xl);
                    background: var(--gradient-card), var(--bg-card);
                    border: 1px solid hsla(0, 0%, 100%, 0.1);
                    border-radius: var(--radius-lg);
                    box-shadow: var(--shadow-lg);
                    animation: fadeIn 0.3s ease-in;
                }

                .flashcard-front {
                    background: linear-gradient(135deg, hsla(260, 60%, 25%, 0.3), hsla(220, 70%, 30%, 0.3)), var(--bg-card);
                }

                .flashcard-back {
                    background: linear-gradient(135deg, hsla(142, 60%, 25%, 0.3), hsla(180, 70%, 30%, 0.3)), var(--bg-card);
                }

                .card-label {
                    font-size: 0.875rem;
                    font-weight: 600;
                    color: var(--primary-light);
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    margin-bottom: var(--spacing-md);
                }

                .card-text {
                    font-size: 1.25rem;
                    line-height: 1.6;
                    text-align: center;
                    white-space: pre-line;
                }

                .card-hint {
                    margin-top: auto;
                    font-size: 0.875rem;
                    color: var(--text-tertiary);
                    font-style: italic;
                }

                .flashcard-actions {
                    text-align: center;
                }

                .action-buttons {
                    display: flex;
                    gap: var(--spacing-md);
                    justify-content: center;
                }

                .action-buttons .btn {
                    flex: 1;
                    max-width: 200px;
                }

                .card-stats {
                    padding: var(--spacing-md);
                }

                .stat-row {
                    display: flex;
                    justify-content: space-between;
                    padding: var(--spacing-xs) 0;
                }

                @media (max-width: 768px) {
                    .flashcard {
                        height: 350px;
                    }

                    .card-text {
                        font-size: 1.125rem;
                    }

                    .action-buttons {
                        flex-direction: column;
                    }

                    .action-buttons .btn {
                        max-width: none;
                    }
                }
            </style>
        `;

        document.getElementById('main-content').innerHTML = content;
    },

    flipCard() {
        this.isFlipped = !this.isFlipped;
        this.renderCard();
    },

    answerCard(correct) {
        const card = this.sessionCards[this.currentCardIndex];
        Storage.updateFlashcardProgress(card.id, correct);

        this.currentCardIndex++;
        this.isFlipped = false;
        this.renderCard();
    },

    renderComplete() {
        const content = `
            <div class="completion-screen fade-in">
                <div class="completion-content text-center">
                    <div class="completion-icon">🎉</div>
                    <h1 class="gradient-text">Deck Complete!</h1>
                    <p class="text-secondary">Great work! You've reviewed all cards in this deck. </p><p class="text-secondary"><a href="https://hypnotherapyandpsychotherapy.teachable.com/p/home" target="_blank">You can go straight to the full course here</a></p>
                    
                    <div class="completion-actions">
                        <button class="btn btn-primary" onclick="Flashcards.startDeck('${this.currentDeck.id}')">
                            Review Again
                        </button>
                        <button class="btn btn-secondary" onclick="App.navigate('flashcards')">
                            Back to Decks
                        </button>
                    </div>
                </div>
            </div>

            <style>
                .completion-screen {
                    min-height: 60vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .completion-content {
                    max-width: 500px;
                }

                .completion-icon {
                    font-size: 5rem;
                    margin-bottom: var(--spacing-md);
                }

                .completion-actions {
                    display: flex;
                    gap: var(--spacing-md);
                    justify-content: center;
                    margin-top: var(--spacing-xl);
                }

                @media (max-width: 768px) {
                    .completion-actions {
                        flex-direction: column;
                    }
                }
            </style>
        `;

        document.getElementById('main-content').innerHTML = content;
    },

    exitDeck() {
        this.currentDeck = null;
        App.navigate('flashcards');
    }
};





