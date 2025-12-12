// Quiz Module
const Quiz = {
    currentQuiz: null,
    currentQuestionIndex: 0,
    answers: [],
    score: 0,

    render() {
        const quizzes = Content.quizzes;

        return `
            <div class="quiz-page">
                <div class="page-header">
                    <h1 class="gradient-text">Knowledge Quizzes</h1>
                    <p class="text-secondary">Test your understanding of hypnosis</p>
                </div>

                <div class="quizzes-grid">
                    ${quizzes.map(quiz => this.renderQuizCard(quiz)).join('')}
                </div>

                ${this.renderHistory()}
            </div>

            <style>
                .quiz-page {
                    animation: fadeIn 0.3s ease-in;
                }

                .quizzes-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
                    gap: var(--spacing-md);
                    margin-bottom: var(--spacing-xl);
                }

                .quiz-card {
                    cursor: pointer;
                }

                .quiz-card h3 {
                    margin-bottom: var(--spacing-xs);
                }

                .quiz-info {
                    display: flex;
                    align-items: center;
                    gap: var(--spacing-sm);
                    margin-top: var(--spacing-sm);
                    color: var(--text-secondary);
                    font-size: 0.875rem;
                }

                .quiz-history {
                    margin-top: var(--spacing-lg);
                }

                .history-item {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: var(--spacing-sm);
                    border-bottom: 1px solid hsla(0, 0%, 100%, 0.05);
                }

                .history-item:last-child {
                    border-bottom: none;
                }

                .history-score {
                    font-size: 1.5rem;
                    font-weight: 700;
                }

                .score-excellent { color: hsl(142, 71%, 65%); }
                .score-good { color: hsl(38, 92%, 70%); }
                .score-needs-work { color: hsl(0, 71%, 65%); }
            </style>
        `;
    },

    renderQuizCard(quiz) {
        const history = Storage.getQuizHistory().filter(h => h.quizId === quiz.id);
        const bestScore = history.length > 0
            ? Math.max(...history.map(h => h.percentage))
            : null;

        return `
            <div class="card quiz-card card-gradient" onclick="Quiz.startQuiz('${quiz.id}')">
                <h3>${quiz.title}</h3>
                <p class="text-secondary">${quiz.description}</p>
                <div class="quiz-info">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="10"></circle>
                        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                        <line x1="12" y1="17" x2="12.01" y2="17"></line>
                    </svg>
                    ${quiz.questions.length} questions
                    ${bestScore !== null ? `<span class="badge badge-success">Best: ${bestScore}%</span>` : ''}
                </div>
            </div>
        `;
    },

    renderHistory() {
        const history = Storage.getQuizHistory().slice(-5).reverse();

        if (history.length === 0) {
            return '';
        }

        return `
            <div class="quiz-history card glass-card">
                <h2>Recent Quiz Results</h2>
                <div class="history-list">
                    ${history.map(item => {
            const quiz = Content.quizzes.find(q => q.quizId === item.quizId);
            const quizTitle = quiz ? quiz.title : 'Unknown Quiz';
            const scoreClass = item.percentage >= 80 ? 'score-excellent'
                : item.percentage >= 60 ? 'score-good'
                    : 'score-needs-work';
            const date = new Date(item.date).toLocaleDateString();

            return `
                            <div class="history-item">
                                <div>
                                    <div><strong>${quizTitle}</strong></div>
                                    <div class="text-tertiary" style="font-size: 0.875rem;">${date}</div>
                                </div>
                                <div class="history-score ${scoreClass}">${item.percentage}%</div>
                            </div>
                        `;
        }).join('')}
                </div>
            </div>
        `;
    },

    startQuiz(quizId) {
        this.currentQuiz = Content.quizzes.find(q => q.id === quizId);
        this.currentQuestionIndex = 0;
        this.answers = [];
        this.score = 0;
        this.renderQuestion();
    },

    renderQuestion() {
        if (this.currentQuestionIndex >= this.currentQuiz.questions.length) {
            this.renderResults();
            return;
        }

        const question = this.currentQuiz.questions[this.currentQuestionIndex];
        const answered = this.answers[this.currentQuestionIndex] !== undefined;
        const selectedAnswer = this.answers[this.currentQuestionIndex];

        const content = `
            <div class="quiz-view fade-in">
                <div class="quiz-header">
                    <button class="btn btn-ghost" onclick="Quiz.exitQuiz()">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                        Exit Quiz
                    </button>
                    <div class="quiz-progress">
                        Question ${this.currentQuestionIndex + 1} / ${this.currentQuiz.questions.length}
                    </div>
                </div>

                <h2 class="text-center mb-md">${this.currentQuiz.title}</h2>

                <div class="progress-bar mb-md">
                    <div class="progress-fill" style="width: ${((this.currentQuestionIndex + 1) / this.currentQuiz.questions.length) * 100}%"></div>
                </div>

                <div class="question-card card">
                    <h3 class="question-text">${question.question}</h3>
                    
                    <div class="options-list">
                        ${question.options.map((option, index) => {
            const isSelected = selectedAnswer === index;
            const isCorrect = index === question.correctAnswer;
            let optionClass = 'option-item';

            if (answered) {
                if (isCorrect) {
                    optionClass += ' option-correct';
                } else if (isSelected && !isCorrect) {
                    optionClass += ' option-incorrect';
                }
            } else if (isSelected) {
                optionClass += ' option-selected';
            }

            return `
                                <button 
                                    class="${optionClass}"
                                    onclick="Quiz.selectAnswer(${index})"
                                    ${answered ? 'disabled' : ''}
                                >
                                    <span class="option-letter">${String.fromCharCode(65 + index)}</span>
                                    <span class="option-text">${option}</span>
                                    ${answered && isCorrect ? '<span class="option-icon">✓</span>' : ''}
                                    ${answered && isSelected && !isCorrect ? '<span class="option-icon">✗</span>' : ''}
                                </button>
                            `;
        }).join('')}
                    </div>

                    ${answered ? `
                        <div class="explanation-box slide-up">
                            <h4>Explanation</h4>
                            <p>${question.explanation}</p>
                        </div>
                    ` : ''}
                </div>

                ${answered ? `
                    <div class="quiz-navigation">
                        <button 
                            class="btn btn-primary btn-large" 
                            onclick="Quiz.nextQuestion()"
                        >
                            ${this.currentQuestionIndex < this.currentQuiz.questions.length - 1 ? 'Next Question' : 'See Results'}
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <line x1="5" y1="12" x2="19" y2="12"></line>
                                <polyline points="12 5 19 12 12 19"></polyline>
                            </svg>
                        </button>
                    </div>
                ` : ''}
            </div>

            <style>
                .quiz-view {
                    max-width: 700px;
                    margin: 0 auto;
                }

                .quiz-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: var(--spacing-lg);
                }

                .quiz-progress {
                    font-weight: 600;
                    color: var(--primary-light);
                }

                .question-card {
                    padding: var(--spacing-xl);
                    margin-bottom: var(--spacing-lg);
                }

                .question-text {
                    font-size: 1.25rem;
                    margin-bottom: var(--spacing-lg);
                    line-height: 1.6;
                }

                .options-list {
                    display: flex;
                    flex-direction: column;
                    gap: var(--spacing-sm);
                }

                .option-item {
                    display: flex;
                    align-items: center;
                    gap: var(--spacing-md);
                    padding: var(--spacing-md);
                    background: var(--bg-tertiary);
                    border: 2px solid hsla(0, 0%, 100%, 0.1);
                    border-radius: var(--radius-md);
                    cursor: pointer;
                    transition: all var(--transition-base);
                    text-align: left;
                    width: 100%;
                }

                .option-item:hover:not(:disabled) {
                    border-color: var(--primary);
                    background: var(--bg-card);
                }

                .option-item:disabled {
                    cursor: not-allowed;
                }

                .option-selected {
                    border-color: var(--primary);
                    background: hsla(260, 60%, 55%, 0.2);
                }

                .option-correct {
                    border-color: hsl(142, 71%, 45%);
                    background: hsla(142, 71%, 45%, 0.2);
                }

                .option-incorrect {
                    border-color: hsl(0, 71%, 45%);
                    background: hsla(0, 71%, 45%, 0.2);
                }

                .option-letter {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 32px;
                    height: 32px;
                    background: var(--primary);
                    border-radius: 50%;
                    font-weight: 700;
                    flex-shrink: 0;
                }

                .option-text {
                    flex: 1;
                }

                .option-icon {
                    font-size: 1.5rem;
                    flex-shrink: 0;
                }

                .explanation-box {
                    margin-top: var(--spacing-lg);
                    padding: var(--spacing-md);
                    background: var(--bg-glass);
                    border-left: 4px solid var(--primary);
                    border-radius: var(--radius-sm);
                }

                .explanation-box h4 {
                    color: var(--primary-light);
                    margin-bottom: var(--spacing-xs);
                }

                .explanation-box p {
                    color: var(--text-secondary);
                    line-height: 1.6;
                }

                .quiz-navigation {
                    text-align: center;
                }

                @media (max-width: 768px) {
                    .question-card {
                        padding: var(--spacing-md);
                    }

                    .question-text {
                        font-size: 1.125rem;
                    }
                }
            </style>
        `;

        document.getElementById('main-content').innerHTML = content;
    },

    selectAnswer(answerIndex) {
        if (this.answers[this.currentQuestionIndex] !== undefined) {
            return; // Already answered
        }

        this.answers[this.currentQuestionIndex] = answerIndex;
        const question = this.currentQuiz.questions[this.currentQuestionIndex];

        if (answerIndex === question.correctAnswer) {
            this.score++;
        }

        this.renderQuestion();
    },

    nextQuestion() {
        this.currentQuestionIndex++;
        this.renderQuestion();
    },

    renderResults() {
        const totalQuestions = this.currentQuiz.questions.length;
        const percentage = Math.round((this.score / totalQuestions) * 100);

        // Save quiz result
        Storage.saveQuizResult(
            this.currentQuiz.id,
            this.score,
            totalQuestions,
            this.answers
        );

        const scoreClass = percentage >= 80 ? 'score-excellent'
            : percentage >= 60 ? 'score-good'
                : 'score-needs-work';

        const message = percentage >= 80
            ? 'Excellent work! You have a strong understanding of this topic.'
            : percentage >= 60
                ? 'Good job! Review the explanations to strengthen your knowledge.'
                : 'Keep studying! Review the material and try again.';

        const content = `
            <div class="quiz-results fade-in">
                <div class="results-content text-center">
                    <div class="results-icon">${percentage >= 80 ? '🎉' : percentage >= 60 ? '👍' : '📚'}</div>
                    <h1 class="gradient-text">Quiz Complete!</h1>
                    
                    <div class="score-display ${scoreClass}">
                        ${percentage}%
                    </div>
                    
                    <p class="score-breakdown">
                        ${this.score} out of ${totalQuestions} correct
                    </p>
                    
                    <p class="text-secondary">${message}</p>

                    <div class="results-actions">
                        <button class="btn btn-primary" onclick="Quiz.startQuiz('${this.currentQuiz.id}')">
                            Retake Quiz
                        </button>
                        <button class="btn btn-secondary" onclick="Quiz.reviewAnswers()">
                            Review Answers
                        </button>
                        <button class="btn btn-ghost" onclick="App.navigate('quiz')">
                            Back to Quizzes
                        </button>
                    </div>
                </div>
            </div>

            <style>
                .quiz-results {
                    min-height: 60vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .results-content {
                    max-width: 500px;
                }

                .results-icon {
                    font-size: 5rem;
                    margin-bottom: var(--spacing-md);
                }

                .score-display {
                    font-size: 4rem;
                    font-weight: 700;
                    margin: var(--spacing-lg) 0;
                }

                .score-breakdown {
                    font-size: 1.25rem;
                    color: var(--text-secondary);
                    margin-bottom: var(--spacing-md);
                }

                .results-actions {
                    display: flex;
                    flex-direction: column;
                    gap: var(--spacing-sm);
                    margin-top: var(--spacing-xl);
                }
            </style>
        `;

        document.getElementById('main-content').innerHTML = content;
    },

    reviewAnswers() {
        this.currentQuestionIndex = 0;
        this.renderQuestion();
    },

    exitQuiz() {
        if (confirm('Are you sure you want to exit? Your progress will be lost.')) {
            this.currentQuiz = null;
            App.navigate('quiz');
        }
    }
};
